// src/lib/ai/benchmarks.ts
// Indian D2C benchmark registry keyed by industry.
// Injected into every agent prompt so outputs reference real market standards.

export interface IndustryBenchmark {
  grossMargin:  { critical: number; warning: number; good: number; excellent: number };
  cac:          { good: number; warning: number; critical: number }; // ₹
  roas:         { critical: number; warning: number; good: number; excellent: number };
  aov:          { low: number; mid: number; high: number }; // ₹
  repeatRate:   { critical: number; warning: number; good: number; excellent: number }; // %
  codRate:      { good: number; warning: number; critical: number }; // %
  rtoRate:      { good: number; warning: number; critical: number }; // %
  cartAbandonment: { good: number; warning: number; critical: number }; // %
}

export const INDIA_BENCHMARKS: Record<string, IndustryBenchmark> = {
  APPAREL: {
    grossMargin:     { critical: 30, warning: 45, good: 55, excellent: 65 },
    cac:             { good: 400, warning: 650, critical: 900 },
    roas:            { critical: 1.5, warning: 2.0, good: 2.5, excellent: 4.0 },
    aov:             { low: 600, mid: 1200, high: 3000 },
    repeatRate:      { critical: 15, warning: 25, good: 35, excellent: 50 },
    codRate:         { good: 40, warning: 60, critical: 75 },
    rtoRate:         { good: 10, warning: 20, critical: 30 },
    cartAbandonment: { good: 60, warning: 72, critical: 82 },
  },
  BEAUTY: {
    grossMargin:     { critical: 35, warning: 50, good: 65, excellent: 75 },
    cac:             { good: 300, warning: 500, critical: 800 },
    roas:            { critical: 1.8, warning: 2.2, good: 3.0, excellent: 5.0 },
    aov:             { low: 400, mid: 800, high: 2000 },
    repeatRate:      { critical: 20, warning: 30, good: 40, excellent: 55 },
    codRate:         { good: 35, warning: 55, critical: 70 },
    rtoRate:         { good: 8,  warning: 16, critical: 25 },
    cartAbandonment: { good: 58, warning: 70, critical: 80 },
  },
  ELECTRONICS_ACCESSORIES: {
    grossMargin:     { critical: 20, warning: 35, good: 45, excellent: 60 },
    cac:             { good: 500, warning: 800, critical: 1200 },
    roas:            { critical: 1.5, warning: 1.8, good: 2.5, excellent: 3.5 },
    aov:             { low: 500, mid: 1500, high: 4000 },
    repeatRate:      { critical: 10, warning: 18, good: 28, excellent: 40 },
    codRate:         { good: 30, warning: 50, critical: 65 },
    rtoRate:         { good: 5,  warning: 12, critical: 20 },
    cartAbandonment: { good: 62, warning: 74, critical: 84 },
  },
  HOME_DECOR: {
    grossMargin:     { critical: 30, warning: 45, good: 58, excellent: 70 },
    cac:             { good: 350, warning: 600, critical: 900 },
    roas:            { critical: 1.5, warning: 2.0, good: 2.8, excellent: 4.2 },
    aov:             { low: 800, mid: 2000, high: 5000 },
    repeatRate:      { critical: 12, warning: 20, good: 30, excellent: 42 },
    codRate:         { good: 35, warning: 58, critical: 72 },
    rtoRate:         { good: 8,  warning: 18, critical: 28 },
    cartAbandonment: { good: 62, warning: 73, critical: 83 },
  },
  FOOD_BEVERAGE: {
    grossMargin:     { critical: 25, warning: 40, good: 55, excellent: 68 },
    cac:             { good: 200, warning: 400, critical: 650 },
    roas:            { critical: 2.0, warning: 2.8, good: 3.5, excellent: 5.0 },
    aov:             { low: 300, mid: 700, high: 1500 },
    repeatRate:      { critical: 25, warning: 38, good: 50, excellent: 65 },
    codRate:         { good: 25, warning: 45, critical: 60 },
    rtoRate:         { good: 5,  warning: 12, critical: 20 },
    cartAbandonment: { good: 55, warning: 67, critical: 78 },
  },
  JEWELLERY: {
    grossMargin:     { critical: 25, warning: 40, good: 55, excellent: 70 },
    cac:             { good: 600, warning: 1000, critical: 1500 },
    roas:            { critical: 1.5, warning: 2.0, good: 2.8, excellent: 4.0 },
    aov:             { low: 1500, mid: 4000, high: 12000 },
    repeatRate:      { critical: 8,  warning: 15, good: 25, excellent: 35 },
    codRate:         { good: 20, warning: 40, critical: 58 },
    rtoRate:         { good: 4,  warning: 10, critical: 18 },
    cartAbandonment: { good: 68, warning: 78, critical: 86 },
  },
  DEFAULT: {
    grossMargin:     { critical: 25, warning: 40, good: 55, excellent: 68 },
    cac:             { good: 450, warning: 700, critical: 1000 },
    roas:            { critical: 1.5, warning: 2.0, good: 2.8, excellent: 4.0 },
    aov:             { low: 500, mid: 1200, high: 3000 },
    repeatRate:      { critical: 15, warning: 25, good: 38, excellent: 52 },
    codRate:         { good: 40, warning: 60, critical: 75 },
    rtoRate:         { good: 10, warning: 20, critical: 30 },
    cartAbandonment: { good: 62, warning: 73, critical: 83 },
  },
};

export function getBenchmark(industry?: string | null): IndustryBenchmark {
  if (!industry) return INDIA_BENCHMARKS.DEFAULT;
  const key = industry.toUpperCase().replace(/[^A-Z_]/g, "_");
  // Fuzzy match
  if (key.includes("APPAREL") || key.includes("FASHION") || key.includes("CLOTH") || key.includes("ETHNIC"))
    return INDIA_BENCHMARKS.APPAREL;
  if (key.includes("BEAUTY") || key.includes("SKINCARE") || key.includes("COSMETIC") || key.includes("PERSONAL_CARE"))
    return INDIA_BENCHMARKS.BEAUTY;
  if (key.includes("ELECTRONIC") || key.includes("GADGET") || key.includes("TECH"))
    return INDIA_BENCHMARKS.ELECTRONICS_ACCESSORIES;
  if (key.includes("HOME") || key.includes("DECOR") || key.includes("FURNITURE") || key.includes("LIVING"))
    return INDIA_BENCHMARKS.HOME_DECOR;
  if (key.includes("FOOD") || key.includes("BEVERAGE") || key.includes("SNACK") || key.includes("HEALTH_FOOD"))
    return INDIA_BENCHMARKS.FOOD_BEVERAGE;
  if (key.includes("JEWEL") || key.includes("JEWELLERY") || key.includes("JEWELRY") || key.includes("ACCESSORI"))
    return INDIA_BENCHMARKS.JEWELLERY;
  return INDIA_BENCHMARKS.DEFAULT;
}

function flag(val: number, good: number, warning: number, critical: number, lowerIsBetter = false): string {
  if (lowerIsBetter) {
    if (val <= good) return "✅";
    if (val <= warning) return "⚠️";
    return "🔴";
  }
  if (val >= good) return "✅";
  if (val >= warning) return "⚠️";
  return "🔴 CRITICAL";
}

export function buildBenchmarkPromptBlock(ctx: {
  monthlyRevenue?: number | null;
  monthlyExpenses?: number | null;
  averageOrderValue?: number | null;
  customerAcquisitionCost?: number | null;
  returnOnAdSpend?: number | null;
  repeatCustomerPercentage?: number | null;
  codRate?: number | null;
  rtoRate?: number | null;
  cartAbandonmentRate?: number | null;
  industry?: string | null;
}): string {
  const b = getBenchmark(ctx.industry);
  const industryLabel = ctx.industry ?? "Indian D2C";

  const revenue  = ctx.monthlyRevenue ?? 0;
  const expenses = ctx.monthlyExpenses ?? 0;
  const margin   = revenue > 0 ? ((revenue - expenses) / revenue * 100).toFixed(1) : null;

  const lines: string[] = [
    `INDUSTRY BENCHMARKS — ${industryLabel} (Indian D2C):`,
  ];

  if (margin) {
    lines.push(`- Gross Margin:       ${b.grossMargin.good}–${b.grossMargin.excellent}% ideal | Yours: ${margin}% ${flag(parseFloat(margin), b.grossMargin.good, b.grossMargin.warning, b.grossMargin.critical)}`);
  }
  if (ctx.customerAcquisitionCost) {
    lines.push(`- CAC:                <₹${b.cac.good} good | Yours: ₹${ctx.customerAcquisitionCost} ${flag(ctx.customerAcquisitionCost, b.cac.good, b.cac.warning, b.cac.critical, true)}`);
  }
  if (ctx.returnOnAdSpend) {
    lines.push(`- ROAS:               >${b.roas.good}x good | Yours: ${ctx.returnOnAdSpend}x ${flag(ctx.returnOnAdSpend, b.roas.good, b.roas.warning, b.roas.critical)}`);
  }
  if (ctx.repeatCustomerPercentage) {
    lines.push(`- Repeat Rate:        >${b.repeatRate.good}% good | Yours: ${ctx.repeatCustomerPercentage}% ${flag(ctx.repeatCustomerPercentage, b.repeatRate.good, b.repeatRate.warning, b.repeatRate.critical)}`);
  }
  if (ctx.codRate != null) {
    lines.push(`- COD Rate:           <${b.codRate.good}% ideal | Yours: ${ctx.codRate}% ${flag(ctx.codRate, b.codRate.good, b.codRate.warning, b.codRate.critical, true)}`);
  }
  if (ctx.rtoRate != null) {
    lines.push(`- RTO Rate:           <${b.rtoRate.good}% ideal | Yours: ${ctx.rtoRate}% ${flag(ctx.rtoRate, b.rtoRate.good, b.rtoRate.warning, b.rtoRate.critical, true)}`);
  }
  if (ctx.cartAbandonmentRate) {
    lines.push(`- Cart Abandonment:   <${b.cartAbandonment.good}% ideal | Yours: ${ctx.cartAbandonmentRate}% ${flag(ctx.cartAbandonmentRate, b.cartAbandonment.good, b.cartAbandonment.warning, b.cartAbandonment.critical, true)}`);
  }

  return lines.join("\n");
}
