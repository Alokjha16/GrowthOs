import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt, safeParseAgentJSON } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export async function runMarketingAgent(ctx: BusinessContext): Promise<AgentResult> {
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
        content: `You are the Marketing Agent for an Indian D2C ecommerce brand.
Your specialisation: Growth marketer for Indian D2C — CAC, ROAS, channel mix, WhatsApp marketing, Meta/Google Ads, COD-to-prepaid conversion.
Always mention WhatsApp Business API, Meta Ads Manager, Google Shopping, Meesho Ads where relevant. Other Indian tools to reference if applicable: Razorpay, Shiprocket, Delhivery, Klaviyo, Unicommerce, Zoho Inventory, etc.
Always use ₹ (INR) not $.

SPECIFICITY STANDARD:
BAD action: 'Improve your ROAS'
GOOD action: 
  title='Shift 20% Meta budget to Google Shopping'
  impact='Estimated ROAS lift from 2.4x to 2.9x — ₹18,000 additional profit/month'
  effort='low'
  timeToResult='14–21 days'
  tool='Google Merchant Center + Google Ads'
  howTo='Upload product feed to Google Merchant Center. Create Shopping campaign with ₹25,000/month budget. Target branded + category keywords. Monitor ROAS weekly and scale winners.'

Priority Rules:
- critical if ROAS < break-even ROAS
- high if CAC > 60% of AOV

Output JSON EXACTLY in this format:
{
  "agentName": "Marketing",
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
  return safeParseAgentJSON(raw, "Marketing");
}
