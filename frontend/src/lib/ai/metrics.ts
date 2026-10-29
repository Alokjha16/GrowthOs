// src/lib/ai/metrics.ts
// Pre-computes all derived metrics in TypeScript before any LLM call.
// The LLM receives calculated facts to interpret — not raw numbers to calculate.
// This eliminates arithmetic errors and ensures consistent, auditable outputs.

import { type BusinessContext } from "@/agents/shared";

export interface DerivedMetrics {
  // ── Financial ──────────────────────────────────────────────────────────────
  grossProfitMargin: number;        // % — (revenue - expenses) / revenue × 100
  netProfitPerOrder: number;        // ₹ — profit / customers
  expenseRatio: number;             // % — expenses / revenue × 100
  revenuePerCustomer: number;       // ₹ — revenue / customers
  monthlyProfit: number;            // ₹ — revenue - expenses

  // ── Unit Economics ─────────────────────────────────────────────────────────
  ltvEstimate: number;              // ₹ — AOV × (1 / (1 - repeatRate))
  ltvCacRatio: number;              // x — ltv / cac
  cacPaybackMonths: number;         // months — cac / revenuePerCustomer
  breakEvenROAS: number;            // x — 1 / (grossMargin / 100)
  contributionMarginPerOrder: number; // ₹ — AOV × (1 - expenseRatio/100)

  // ── India-Specific ─────────────────────────────────────────────────────────
  codRevenueAtRisk: number;         // ₹/mo — revenue × codRate × rtoRate
  estimatedRTOShippingLoss: number; // ₹/mo — orders × codRate × rtoRate × ₹120
  prepaidConversionOpportunity: number; // ₹/mo — savings if 10% COD → prepaid

  // ── Health Flags ───────────────────────────────────────────────────────────
  isMarginCritical: boolean;        // grossMargin < 30%
  isMarginWeak: boolean;            // grossMargin < 45%
  isLTVCACHealthy: boolean;         // ltvCacRatio > 3
  isROASProfitable: boolean;        // roas > breakEvenROAS
  isCACOverAOV30: boolean;          // cac > aov × 0.3
  isRTOCritical: boolean;           // rtoRate > 25%
  isRTOWarning: boolean;            // rtoRate > 15%
  isCODRisky: boolean;              // codRate > 60%
}

function inr(val: number): string {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${val.toLocaleString("en-IN")}`;
  return `₹${Math.round(val)}`;
}

export function computeDerivedMetrics(ctx: BusinessContext): DerivedMetrics {
  const revenue   = ctx.monthlyRevenue   ?? 0;
  const expenses  = ctx.monthlyExpenses  ?? 0;
  const customers = ctx.customersPerMonth ?? 0;
  const repeat    = (ctx.repeatCustomerPercentage ?? 0) / 100;
  const aov       = ctx.averageOrderValue ?? 0;
  const cac       = ctx.customerAcquisitionCost ?? 0;
  const roas      = ctx.returnOnAdSpend ?? 0;
  const codRate   = (ctx.codRate ?? 0) / 100;
  const rtoRate   = (ctx.rtoRate ?? 0) / 100;

  const profit            = revenue - expenses;
  const grossProfitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const expenseRatio      = revenue > 0 ? (expenses / revenue) * 100 : 0;
  const revenuePerCustomer = customers > 0 ? revenue / customers : 0;
  const netProfitPerOrder  = customers > 0 ? profit / customers : 0;

  // LTV: AOV × (1 / (1 - repeatRate)) — simple repeat purchase model
  const repeatMultiplier = repeat < 1 ? 1 / (1 - repeat) : 1;
  const ltvEstimate = aov * repeatMultiplier;
  const ltvCacRatio = cac > 0 ? ltvEstimate / cac : 0;
  const cacPaybackMonths = revenuePerCustomer > 0 ? cac / revenuePerCustomer : 0;
  const breakEvenROAS = grossProfitMargin > 0 ? 100 / grossProfitMargin : 0;
  const contributionMarginPerOrder = aov > 0 ? aov * (1 - expenseRatio / 100) : 0;

  // India: COD revenue at risk = revenue that may not be collected due to RTO
  const codRevenueAtRisk = revenue * codRate * rtoRate;
  // Avg shipping cost ₹120/order each way (forward + reverse = ₹240 for RTO)
  const codOrders = customers * codRate;
  const estimatedRTOShippingLoss = codOrders * rtoRate * 240;
  // If 10% of COD orders convert to prepaid: reduces RTO by ~8pp proportionally
  const prepaidConversionOpportunity = codOrders * 0.10 * rtoRate * 240;

  return {
    grossProfitMargin:            Math.round(grossProfitMargin * 10) / 10,
    netProfitPerOrder:            Math.round(netProfitPerOrder),
    expenseRatio:                 Math.round(expenseRatio * 10) / 10,
    revenuePerCustomer:           Math.round(revenuePerCustomer),
    monthlyProfit:                Math.round(profit),
    ltvEstimate:                  Math.round(ltvEstimate),
    ltvCacRatio:                  Math.round(ltvCacRatio * 100) / 100,
    cacPaybackMonths:             Math.round(cacPaybackMonths * 100) / 100,
    breakEvenROAS:                Math.round(breakEvenROAS * 100) / 100,
    contributionMarginPerOrder:   Math.round(contributionMarginPerOrder),
    codRevenueAtRisk:             Math.round(codRevenueAtRisk),
    estimatedRTOShippingLoss:     Math.round(estimatedRTOShippingLoss),
    prepaidConversionOpportunity: Math.round(prepaidConversionOpportunity),
    isMarginCritical:  grossProfitMargin < 30,
    isMarginWeak:      grossProfitMargin < 45,
    isLTVCACHealthy:   ltvCacRatio > 3,
    isROASProfitable:  roas > 0 && roas > breakEvenROAS,
    isCACOverAOV30:    aov > 0 && cac > aov * 0.3,
    isRTOCritical:     (ctx.rtoRate ?? 0) > 25,
    isRTOWarning:      (ctx.rtoRate ?? 0) > 15,
    isCODRisky:        (ctx.codRate ?? 0) > 60,
  };
}

export function buildMetricsPromptBlock(ctx: BusinessContext, m: DerivedMetrics): string {
  const roas = ctx.returnOnAdSpend;
  const roasStatus = roas
    ? roas > m.breakEvenROAS
      ? `${roas}x ✅ above break-even`
      : `${roas}x 🔴 BELOW break-even of ${m.breakEvenROAS}x`
    : "Not provided";

  return `
PRE-COMPUTED METRICS — use these exactly, do not recalculate:
- Monthly Profit:            ${inr(m.monthlyProfit)} (Revenue ${inr(ctx.monthlyRevenue ?? 0)} − Expenses ${inr(ctx.monthlyExpenses ?? 0)})
- Gross Profit Margin:       ${m.grossProfitMargin}%${m.isMarginCritical ? " 🔴 CRITICAL" : m.isMarginWeak ? " ⚠️ WEAK" : " ✅"}
- Expense Ratio:             ${m.expenseRatio}%
- Revenue per Customer:      ${inr(m.revenuePerCustomer)}
- Net Profit per Order:      ${inr(m.netProfitPerOrder)}
- LTV Estimate:              ${inr(m.ltvEstimate)} (AOV ${inr(ctx.averageOrderValue ?? 0)} × ${(1 / (1 - (ctx.repeatCustomerPercentage ?? 0) / 100)).toFixed(2)} repeat multiplier)
- LTV:CAC Ratio:             ${m.ltvCacRatio}x${m.isLTVCACHealthy ? " ✅ healthy (benchmark >3x)" : " ⚠️ weak (benchmark >3x)"}
- CAC Payback Period:        ${m.cacPaybackMonths} months${m.cacPaybackMonths < 1 ? " ✅" : " ⚠️ long"}
- Break-even ROAS:           ${m.breakEvenROAS}x
- ROAS vs Break-even:        ${roasStatus}
- Contribution Margin/Order: ${inr(m.contributionMarginPerOrder)}
- COD Revenue at Risk:       ${inr(m.codRevenueAtRisk)}/mo (${ctx.codRate ?? 0}% COD × ${ctx.rtoRate ?? 0}% RTO)
- RTO Shipping Loss:         ${inr(m.estimatedRTOShippingLoss)}/mo (₹240/RTO order)
- Prepaid Conversion Upside: ${inr(m.prepaidConversionOpportunity)}/mo (if 10% COD → prepaid)
`.trim();
}
