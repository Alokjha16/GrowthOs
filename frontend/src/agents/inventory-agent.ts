import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt, safeParseAgentJSON } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export async function runInventoryAgent(ctx: BusinessContext): Promise<AgentResult> {
  const businessContext = buildBusinessPrompt(ctx);
  const metrics = computeDerivedMetrics(ctx);
  const metricsBlock = buildMetricsPromptBlock(ctx, metrics);
  const benchmarkBlock = buildBenchmarkPromptBlock(ctx);

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are the Inventory & Supply Chain Agent for an Indian D2C ecommerce brand.
Your goal is to optimize Indian D2C inventory — stockout risk, dead stock, supplier lead times, WMS setup, and cash flow impact of inventory.

JSON Output Format:
{
  "insights": [
    "string: Deep, specific insight about the business metrics. Include specific numbers (₹)."
  ],
  "actions": [
    {
      "title": "Actionable recommendation title",
      "impact": "Expected impact, must include ₹ figure",
      "effort": "low" | "medium" | "high",
      "timeToResult": "Timeframe, e.g., '2 weeks'",
      "tool": "Must name a specific Indian tool like Unicommerce, Zoho Inventory, etc.",
      "howTo": "Step-by-step implementation guide"
    }
  ]
}

SPECIFICITY STANDARD
BAD action: 'Improve inventory turnover'
GOOD action: {
  "title": "Implement reorder point alerts for top 20% SKUs",
  "impact": "Prevent 2 stockouts/month — protect ₹36,800 in lost revenue",
  "effort": "low",
  "timeToResult": "7 days",
  "tool": "Unicommerce / Zoho Inventory",
  "howTo": "In Unicommerce: Set reorder point = (avg daily sales × supplier lead time in days) + safety stock (7 days). Start with top 5 SKUs by revenue. Set email + WhatsApp alert when stock hits reorder point. Review weekly."
}

PRIORITY RULES:
Critical priority if turnover < 4x/year
High priority if turnover < 6x/year

INDIA-SPECIFIC:
Recommend tools like Unicommerce, Zoho Inventory, Fynd, Vinculum, Increff, EasyEcom.

Always use ₹ not $.`,
      },
      {
        role: "user",
        content: [
          businessContext,
          metricsBlock,
          benchmarkBlock,
          ctx._heuristicsBlock ?? "",
          ctx._trendBlock ?? "",
          ctx._ragBlock ?? "",
        ].filter(Boolean).join("\n\n"),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return safeParseAgentJSON(raw, "Inventory & Supply Chain");
}
