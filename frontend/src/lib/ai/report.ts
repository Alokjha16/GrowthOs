import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, buildBusinessPrompt } from "@/agents/shared";
import { type AgentResult } from "@/agents/shared";

export interface ReportResult {
  title: string;
  executiveSummary: string;
  chiefRisk: string;
  topOpportunity: string;
  immediateAction: string;
  actionPlan: Array<{ day: string; action: string; owner: string }>;
  healthScore: number;
}

function safeParseReport(raw: string, businessName: string, healthScore: number): ReportResult {
  const fallback: ReportResult = {
    title: `GrowthOS Executive Report — ${businessName}`,
    executiveSummary: "Report generation encountered an error. Please retry.",
    chiefRisk: "Unable to determine",
    topOpportunity: "Unable to determine",
    immediateAction: "Please retry report generation",
    actionPlan: [],
    healthScore,
  };

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    const parsed = JSON.parse(match[0]);
    return {
      title: `GrowthOS Executive Report — ${businessName}`,
      executiveSummary: parsed.executiveSummary ?? fallback.executiveSummary,
      chiefRisk: parsed.chiefRisk ?? fallback.chiefRisk,
      topOpportunity: parsed.topOpportunity ?? fallback.topOpportunity,
      immediateAction: parsed.immediateAction ?? fallback.immediateAction,
      actionPlan: Array.isArray(parsed.actionPlan) ? parsed.actionPlan : [],
      healthScore,
    };
  } catch {
    return fallback;
  }
}

export async function generateReport(
  ctx: BusinessContext,
  agents: AgentResult[],
  healthScore: number
): Promise<ReportResult> {
  const businessContext = buildBusinessPrompt(ctx);
  const agentSummary = agents
    .map(
      (a) =>
        `${a.agent} (${a.priority.level}): Problems: ${a.problems.join("; ")} | Top Action: ${a.actions[0]}`
    )
    .join("\n");

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are the GrowthOS Executive Report Generator — you synthesize 7 agent analyses into a CEO-level strategic brief.
Write with the clarity and authority of a top-tier management consultant. Be direct, specific, and actionable.

Respond ONLY with valid JSON in this exact schema:
{
  "executiveSummary": "3-4 sentence executive summary of overall business health",
  "chiefRisk": "The single most important risk this business faces right now",
  "topOpportunity": "The single biggest untapped growth opportunity",
  "immediateAction": "The one action the founder should take this week",
  "actionPlan": [
    { "day": "Day 1-3", "action": "specific action", "owner": "Founder/Growth/Ops" },
    { "day": "Day 4-7", "action": "specific action", "owner": "Founder/Growth/Ops" },
    { "day": "Week 2", "action": "specific action", "owner": "Founder/Growth/Ops" },
    { "day": "Week 3", "action": "specific action", "owner": "Founder/Growth/Ops" },
    { "day": "Week 4", "action": "specific action", "owner": "Founder/Growth/Ops" }
  ]
}

Rules:
- Be specific — reference actual metrics from the store
- actionPlan: exactly 5 items covering 30 days
- chiefRisk and topOpportunity: single clear sentences
- immediateAction: something executable this week`,
      },
      {
        role: "user",
        content: `Store Context:\n${businessContext}\n\nHealth Score: ${healthScore}/100\n\nAgent Diagnoses:\n${agentSummary}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return safeParseReport(raw, ctx.name, healthScore);
}
