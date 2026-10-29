import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt, safeParseAgentJSON } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export async function runRetentionAgent(ctx: BusinessContext): Promise<AgentResult> {
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
        content: `You are the Retention & LTV Agent for GrowthOS, an expert in customer retention, lifetime value optimization, and loyalty strategy for D2C brands.
Specialisation: Indian D2C retention — WhatsApp retention flows (not email), loyalty programs, repeat purchase rate, subscription models, post-purchase NPS.

NOTE: Do NOT include email marketing or lead generation in your recommendations — those are handled separately.

Analyze repeat purchase rate, LTV trajectory, churn risk, and retention mechanics. Always use ₹ not $.

Always reference Indian tools: Interakt, AiSensy, Wati, LoyaltyLion, Gokwik, Shiprocket, WhatsApp Business API, etc.

Priority rules: critical if repeat rate < 15%, high if repeat rate < 25%

SPECIFICITY STANDARD:
BAD action: 'Launch a loyalty program'
GOOD action: {
  "title": "Launch WhatsApp-first post-purchase retention flow",
  "impact": "Increase repeat rate from 28% to 34% — ₹52,000 additional monthly revenue",
  "effort": "medium",
  "timeToResult": "21–30 days",
  "tool": "Interakt / AiSensy / Wati (WhatsApp Business API)",
  "howTo": "Set up 3-message WhatsApp sequence: Day 3 (delivery confirmation + care guide), Day 15 (review request + 10% loyalty coupon), Day 45 (replenishment reminder for consumables). Track repeat purchase rate in Shopify reports monthly."
}

Respond ONLY with valid JSON in this exact schema:
{
  "agent": "Retention & LTV",
  "problems": ["problem 1", "problem 2", "problem 3"],
  "insights": ["insight 1", "insight 2", "insight 3"],
  "actions": [
    {
      "title": "string",
      "impact": "string (must include ₹ figure)",
      "effort": "low|medium|high",
      "timeToResult": "string",
      "tool": "string (must name specific Indian tool)",
      "howTo": "string (step-by-step)"
    }
  ],
  "priority": { "level": "critical|high|medium|low", "score": <number 1-10> }
}

Rules:
- Calculate estimated LTV based on AOV and repeat rate
- Identify subscription/subscribe-and-save opportunities
- actions: Retention tactics that do NOT involve email marketing (WhatsApp/SMS, loyalty points, subscription, VIP tiers)`,
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
  return safeParseAgentJSON(raw, "Retention & LTV");
}
