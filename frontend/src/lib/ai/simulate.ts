import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, buildBusinessPrompt } from "@/agents/shared";

export interface SimulationResult {
  decision: string;
  shortTermOutcome: { revenueChange: string; description: string };
  longTermOutcome: { revenueChange: string; description: string };
  risks: string[];
  opportunities: string[];
  confidenceScore: number;
}

function safeParseSimulation(raw: string, strategy: string): SimulationResult {
  const fallback: SimulationResult = {
    decision: strategy,
    shortTermOutcome: { revenueChange: "±0%", description: "Analysis unavailable" },
    longTermOutcome: { revenueChange: "±0%", description: "Please retry" },
    risks: ["Could not generate risks"],
    opportunities: ["Could not generate opportunities"],
    confidenceScore: 50,
  };

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    const parsed = JSON.parse(match[0]);
    return {
      decision: parsed.decision ?? strategy,
      shortTermOutcome: parsed.shortTermOutcome ?? fallback.shortTermOutcome,
      longTermOutcome: parsed.longTermOutcome ?? fallback.longTermOutcome,
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
      confidenceScore: typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : 70,
    };
  } catch {
    return fallback;
  }
}

export async function runSimulation(
  ctx: BusinessContext,
  strategy: string
): Promise<SimulationResult> {
  const businessContext = buildBusinessPrompt(ctx);

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are the GrowthOS Strategy Simulator — a senior e-commerce growth consultant who stress-tests strategic decisions before a founder commits budget.
Given a store's current metrics and a proposed strategic move, simulate its short-term (30-90 days) and long-term (6-18 months) impact.

Respond ONLY with valid JSON in this exact schema:
{
  "decision": "one-line summary of the strategic move",
  "shortTermOutcome": {
    "revenueChange": "+X% or -X%",
    "description": "2-3 sentence explanation of 30-90 day impact"
  },
  "longTermOutcome": {
    "revenueChange": "+X% or -X%",
    "description": "2-3 sentence explanation of 6-18 month impact"
  },
  "risks": ["risk 1", "risk 2", "risk 3"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "confidenceScore": 0-100
}

Rules:
- Be realistic. If the strategy has upfront costs, show short-term dip then recovery.
- confidenceScore: 80-90 for proven tactics, 50-70 for uncertain ones
- Reference the store's actual metrics in your analysis
- risks and opportunities: 2-4 items each, specific to this business`,
      },
      {
        role: "user",
        content: `Store Context:\n${businessContext}\n\nProposed Strategy: ${strategy}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return safeParseSimulation(raw, strategy);
}
