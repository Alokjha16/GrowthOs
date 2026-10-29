// src/agents/shared.ts

export interface BusinessContext {
  name: string;
  industry?: string | null;
  description?: string | null;
  businessType: string;
  monthlyRevenue?: number | null;
  monthlyExpenses?: number | null;
  customersPerMonth?: number | null;
  repeatCustomerPercentage?: number | null;
  marketingChannels: string[];
  pricingLevel: string;
  averageOrderValue?: number | null;
  customerAcquisitionCost?: number | null;
  returnOnAdSpend?: number | null;
  cartAbandonmentRate?: number | null;
  fulfillmentMethod?: string | null;
  inventoryTurnover?: number | null;
  returnRatePercentage?: number | null;
  // India-specific
  codRate?: number | null;            // Cash on Delivery %
  rtoRate?: number | null;            // Return to Origin %
  prepaidPercentage?: number | null;  // % of orders prepaid
  // Context enrichments
  _trendBlock?: string;
  _heuristicsBlock?: string;
  _ragBlock?: string;
}

// ── Structured action item (replaces plain string actions) ─────────────────

export interface ActionItem {
  title: string;                         // Short action title
  impact: string;                        // "Save ₹8,700/month in RTO costs"
  effort: "low" | "medium" | "high";
  timeToResult: string;                  // "7–14 days"
  tool: string;                          // "Razorpay Magic Checkout"
  howTo?: string;                        // Specific step-by-step instruction
  clickPath?: string;                    // "Shopify App Store → Razorpay Magic Checkout → Settings"
  copyTemplate?: {
    label: string;
    text: string;
  };
  sopSteps?: string[];
}

export interface AgentResult {
  agent: string;
  problems: string[];
  insights: string[];
  actions: ActionItem[];
  priority: {
    level: "critical" | "high" | "medium" | "low";
    score: number;
  };
}

// ── INR formatter ──────────────────────────────────────────────────────────

export function formatINR(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000)   return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000)     return `₹${val.toLocaleString("en-IN")}`;
  return `₹${Math.round(val)}`;
}

// ── Business context prompt block ──────────────────────────────────────────

export function buildBusinessPrompt(ctx: BusinessContext): string {
  const revenue  = ctx.monthlyRevenue  ?? 0;
  const expenses = ctx.monthlyExpenses ?? 0;
  const profit   = revenue - expenses;
  const margin   = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "N/A";

  return `
STORE PROFILE: ${ctx.name}
Business Type: ${ctx.businessType}
Industry: ${ctx.industry ?? "E-Commerce D2C"}
Description: ${ctx.description ?? "Not provided"}

FINANCIALS (Monthly):
- Revenue:             ${formatINR(revenue)}/mo
- Expenses:            ${formatINR(expenses)}/mo
- Net Profit:          ${formatINR(profit)}/mo (${margin}% margin)
- Customers/Month:     ${ctx.customersPerMonth != null ? ctx.customersPerMonth.toLocaleString("en-IN") : "Not provided"}
- Repeat Customer Rate:${ctx.repeatCustomerPercentage != null ? ` ${ctx.repeatCustomerPercentage}%` : " Not provided"}

E-COMMERCE UNIT METRICS:
- AOV (Avg Order Value):     ${ctx.averageOrderValue ? formatINR(ctx.averageOrderValue) : "Not provided"}
- CAC (Customer Acq. Cost):  ${ctx.customerAcquisitionCost ? formatINR(ctx.customerAcquisitionCost) : "Not provided"}
- ROAS (Return on Ad Spend): ${ctx.returnOnAdSpend ? `${ctx.returnOnAdSpend}x` : "Not provided"}
- Cart Abandonment Rate:     ${ctx.cartAbandonmentRate ? `${ctx.cartAbandonmentRate}%` : "Not provided"}
- Fulfillment Method:        ${ctx.fulfillmentMethod ?? "Not provided"}
- Inventory Turnover:        ${ctx.inventoryTurnover ? `${ctx.inventoryTurnover}x/year` : "Not provided"}
- Return Rate:               ${ctx.returnRatePercentage ? `${ctx.returnRatePercentage}%` : "Not provided"}

INDIA-SPECIFIC METRICS:
- COD Rate:            ${ctx.codRate != null ? `${ctx.codRate}%` : "Not provided"}
- RTO Rate:            ${ctx.rtoRate != null ? `${ctx.rtoRate}%` : "Not provided"}
- Prepaid %:           ${ctx.prepaidPercentage != null ? `${ctx.prepaidPercentage}%` : ctx.codRate != null ? `${100 - ctx.codRate}%` : "Not provided"}

MARKETING:
- Channels:            ${ctx.marketingChannels.join(", ") || "Not provided"}
- Pricing Level:       ${ctx.pricingLevel}
`.trim();
}

// ── Safe JSON parsers ──────────────────────────────────────────────────────

export function safeParseAgentJSON(raw: string, agentName: string): AgentResult {
  const fallbackAction: ActionItem = {
    title: "Retry analysis",
    impact: "Restore full diagnosis capability",
    effort: "low",
    timeToResult: "Immediate",
    tool: "GrowthOS",
    howTo: "Click 'Run Diagnosis' again. Contact support if the issue persists.",
  };

  const fallback: AgentResult = {
    agent: agentName,
    problems: ["Analysis temporarily unavailable"],
    insights: ["Please retry the diagnosis"],
    actions: [fallbackAction],
    priority: { level: "low", score: 1 },
  };

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    const parsed = JSON.parse(match[0]);

    // Parse actions — handle both old string[] and new ActionItem[] format
    let actions: ActionItem[] = [];
    if (Array.isArray(parsed.actions)) {
      actions = parsed.actions.map((a: unknown) => {
        if (typeof a === "string") {
          return {
            title: a,
            impact: "See description",
            effort: "medium" as const,
            timeToResult: "1–4 weeks",
            tool: "Manual",
            howTo: a,
          };
        }
        const item = a as Record<string, unknown>;
        const copyTempObj = typeof item.copyTemplate === "object" && item.copyTemplate !== null
          ? item.copyTemplate as { label?: string; text?: string }
          : undefined;

        return {
          title:        typeof item.title === "string"        ? item.title        : "Action",
          impact:       typeof item.impact === "string"       ? item.impact       : "See description",
          effort:       ["low","medium","high"].includes(item.effort as string) ? item.effort as "low"|"medium"|"high" : "medium",
          timeToResult: typeof item.timeToResult === "string" ? item.timeToResult : "1–4 weeks",
          tool:         typeof item.tool === "string"         ? item.tool         : "Manual",
          howTo:        typeof item.howTo === "string"        ? item.howTo        : String(item.title ?? ""),
          clickPath:    typeof item.clickPath === "string"    ? item.clickPath    : undefined,
          copyTemplate: copyTempObj && typeof copyTempObj.text === "string" ? { label: copyTempObj.label ?? "Template", text: copyTempObj.text } : undefined,
          sopSteps:     Array.isArray(item.sopSteps) ? item.sopSteps.map(String) : undefined,
        };
      });
    }

    return {
      agent:    parsed.agent ?? agentName,
      problems: Array.isArray(parsed.problems) ? parsed.problems : [],
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      actions:  actions.length > 0 ? actions : [fallbackAction],
      priority: {
        level: ["critical", "high", "medium", "low"].includes(parsed.priority?.level)
          ? parsed.priority.level
          : "medium",
        score: typeof parsed.priority?.score === "number" ? parsed.priority.score : 5,
      },
    };
  } catch {
    return fallback;
  }
}
