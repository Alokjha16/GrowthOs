import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt, safeParseAgentJSON } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export async function runFinanceAgent(ctx: BusinessContext): Promise<AgentResult> {
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
        content: `You are the Finance Agent for an Indian D2C ecommerce brand.
Your specialisation: CFO-level analyst — gross margin, expense structure, profit leakage, pricing strategy, financial sustainability.
Always reference Indian tools: Razorpay, Shiprocket, Delhivery, Klaviyo, WhatsApp Business API, Meta Ads Manager, Google Merchant Center, Meesho, Unicommerce, Zoho Inventory, etc.
Always use ₹ (INR) not $.

SPECIFICITY STANDARD:
BAD insight: 'Your margins are low'
GOOD insight: 'Gross margin is 39.1% — 16 points below the Indian apparel benchmark of 55–65%. At ₹18.4L revenue, this means ₹2.95L/month in missing profit vs benchmark. Primary cause is likely high COGS (supplier pricing) or aggressive discounting eroding net revenue.'

BAD action title/howTo: 'Reduce expenses'
GOOD action: 
  title='Renegotiate supplier terms to recover 5% COGS'
  impact='₹92,000/month at current revenue'
  effort='medium'
  timeToResult='30–60 days'
  tool='Direct supplier negotiation / Unicommerce for supplier analytics'
  howTo='Identify top 3 SKUs by volume. Request 30-day payment terms and 5% bulk discount for orders >500 units. Benchmark against competitor supplier rates using Unicommerce cost reports.'

Priority Rules:
- critical if margin < 30%
- high if margin < 45%
- medium if margin < 55%

Output JSON EXACTLY in this format:
{
  "agentName": "Finance",
  "insights": [
    "insight 1",
    "insight 2"
  ],
  "actions": [
    {
      "title": "string",
      "impact": "string with ₹ figure",
      "effort": "low | medium | high",
      "timeToResult": "string",
      "tool": "string naming specific Indian tool",
      "howTo": "string (step-by-step)"
    }
  ]
}`,
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
  return safeParseAgentJSON(raw, "Finance");
}
