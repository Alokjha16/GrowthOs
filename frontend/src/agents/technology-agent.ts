import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt, safeParseAgentJSON } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export async function runTechnologyAgent(ctx: BusinessContext): Promise<AgentResult> {
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
        content: `You are the Technology & CRO Agent for an Indian D2C ecommerce brand.
Your goal is to optimize Shopify/WooCommerce CRO, cart abandonment recovery, site speed, and checkout experience for the Indian market (COD checkout, Razorpay Magic Checkout, prepaid incentives).

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
      "tool": "Must name a specific Indian tool like Razorpay Magic Checkout, Gokwik, etc.",
      "howTo": "Step-by-step implementation guide"
    }
  ]
}

SPECIFICITY STANDARD
BAD action: 'Improve checkout experience'
GOOD action: {
  "title": "Enable Razorpay Magic Checkout to boost prepaid conversion",
  "impact": "Convert 8% of COD to prepaid — save ₹6,960/month in RTO costs",
  "effort": "low",
  "timeToResult": "3–5 days",
  "tool": "Razorpay Magic Checkout (Shopify plugin)",
  "howTo": "Install Razorpay Magic Checkout plugin from Shopify App Store. Enable one-click checkout for returning customers. Offer ₹50 discount for prepaid orders. Razorpay reports 20–35% prepaid uplift for brands using Magic Checkout."
}

PRIORITY RULES:
Critical priority if cart abandonment > 80%
High priority if cart abandonment > 72%

INDIA-SPECIFIC:
Recommend tools like Razorpay Magic Checkout, Gokwik, Shiprocket Engage, Shopify India, WooCommerce, Hotjar, Google PageSpeed.

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
  return safeParseAgentJSON(raw, "Technology & CRO");
}
