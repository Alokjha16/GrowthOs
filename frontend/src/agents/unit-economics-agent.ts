import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt, safeParseAgentJSON } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export async function runUnitEconomicsAgent(ctx: BusinessContext): Promise<AgentResult> {
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
        content: `You are the Unit Economics Agent for an Indian D2C ecommerce brand.
Your goal is to analyze per-order profitability, LTV:CAC ratio, contribution margin, break-even ROAS, and the impact of COD on unit economics.

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
      "tool": "Must name a specific Indian tool like Razorpay, Shiprocket, etc.",
      "howTo": "Step-by-step implementation guide"
    }
  ]
}

SPECIFICITY STANDARD
BAD insight: 'Your LTV:CAC ratio needs improvement'
GOOD insight: 'LTV:CAC ratio is 4.57x (LTV ₹1,736 / CAC ₹380) — healthy by Indian D2C standards (benchmark >3x). However, with 62% COD and 22% RTO, true CAC is effectively ₹380 + ₹52 RTO cost allocation = ₹432 adjusted CAC, bringing real LTV:CAC to 4.02x — still healthy but thinning.'

PRIORITY RULES:
Critical priority if LTV:CAC < 1.5
High priority if LTV:CAC < 2.5
Medium priority if LTV:CAC < 3.5

INDIA-SPECIFIC:
Factor COD rate into true CAC calculation. Mention Razorpay/Cashfree for prepaid uplift.

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
  return safeParseAgentJSON(raw, "Unit Economics");
}
