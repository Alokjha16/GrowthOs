import { groq, GROQ_MODEL } from "@/lib/ai/groq";
import { type BusinessContext, type AgentResult, buildBusinessPrompt } from "@/agents/shared";
import { computeDerivedMetrics, buildMetricsPromptBlock } from "@/lib/ai/metrics";
import { buildBenchmarkPromptBlock } from "@/lib/ai/benchmarks";

export interface SynthesisResult {
  crossAgentInsights: string[];
  rootCause: string;
  conflictResolution?: string;
}

export interface DiagnosisResult {
  agents: AgentResult[];
  healthScore: number;
  synthesis: SynthesisResult;
  summary: {
    topRisk: string;
    biggestOpportunity: string;
    primaryAction: string;
  };
}

// ── Health score computation ──────────────────────────────────────────────────

function computeHealthScore(agents: AgentResult[]): number {
  if (!agents.length) return 50;
  const priorityWeights = { critical: 0, high: 35, medium: 60, low: 85 };
  const totalWeight = agents.reduce((sum, a) => {
    const base = priorityWeights[a.priority.level] ?? 60;
    const bandAdjustment = (5 - (a.priority.score ?? 5)) * 3;
    return sum + Math.max(0, base + bandAdjustment);
  }, 0);
  return Math.min(100, Math.max(0, Math.round(totalWeight / agents.length)));
}

function extractSummary(agents: AgentResult[]) {
  const sorted = [...agents].sort((a, b) => b.priority.score - a.priority.score);
  const topAgent    = sorted[0];
  const lowestAgent = sorted[sorted.length - 1];
  return {
    topRisk:            topAgent?.problems?.[0]             ?? "No critical risks identified",
    biggestOpportunity: lowestAgent?.insights?.[0]          ?? agents[0]?.insights?.[0] ?? "Run analysis to find opportunities",
    primaryAction:      topAgent?.actions?.[0]?.title       ?? "Review agent recommendations",
  };
}

// ── Historical trend block builder ────────────────────────────────────────────

type Snapshot = {
  revenue?: unknown;
  expenses?: unknown;
  customers?: unknown;
  repeatRate?: unknown;
  customerAcquisitionCost?: unknown;
  returnOnAdSpend?: unknown;
  cartAbandonmentRate?: unknown;
  codRate?: unknown;
  rtoRate?: unknown;
  createdAt?: Date;
};

function buildTrendBlock(snapshots: Snapshot[]): string {
  if (!snapshots || snapshots.length < 2) return "";

  const format = (v: unknown) => v != null ? Number(v) : null;
  const pct = (cur: number | null, prev: number | null): string => {
    if (cur == null || prev == null || prev === 0) return "N/A";
    const delta = ((cur - prev) / Math.abs(prev)) * 100;
    return (delta >= 0 ? "+" : "") + delta.toFixed(1) + "%";
  };
  const inrL = (v: number | null) => v != null ? `₹${(v / 100000).toFixed(1)}L` : "—";
  const flag = (delta: string, higherIsBetter: boolean) => {
    const num = parseFloat(delta);
    if (isNaN(num)) return "";
    if (higherIsBetter) return num > 5 ? " ✅" : num < -5 ? " 🔴" : " ⚠️";
    return num > 5 ? " 🔴" : num < -5 ? " ✅" : " ⚠️";
  };

  // snapshots are newest-first from DB query
  const newest = snapshots[0];
  const oldest = snapshots[snapshots.length - 1];

  const rev  = [format(oldest.revenue),   format(newest.revenue)];
  const exp  = [format(oldest.expenses),  format(newest.expenses)];
  const cac  = [format(oldest.customerAcquisitionCost), format(newest.customerAcquisitionCost)];
  const rto  = [format(oldest.rtoRate),   format(newest.rtoRate)];

  const revDelta = pct(rev[1], rev[0]);
  const expDelta = pct(exp[1], exp[0]);
  const cacDelta = pct(cac[1], cac[0]);
  const rtoDelta = pct(rto[1], rto[0]);

  return `
HISTORICAL TRENDS (last ${snapshots.length} snapshots):
- Revenue:   ${inrL(rev[0])} → ${inrL(rev[1])} (${revDelta})${flag(revDelta, true)}
- Expenses:  ${inrL(exp[0])} → ${inrL(exp[1])} (${expDelta})${flag(expDelta, false)}
- CAC:       ${cac[0] != null ? `₹${cac[0]}` : "—"} → ${cac[1] != null ? `₹${cac[1]}` : "—"} (${cacDelta})${flag(cacDelta, false)}
- RTO Rate:  ${rto[0] != null ? `${rto[0]}%` : "—"} → ${rto[1] != null ? `${rto[1]}%` : "—"} (${rtoDelta})${flag(rtoDelta, false)}
Use these trends to identify worsening patterns and make forward-looking projections.`.trim();
}

// ── Synthesis pass ────────────────────────────────────────────────────────────

async function runSynthesisPass(
  ctx: BusinessContext,
  agents: AgentResult[],
  healthScore: number
): Promise<SynthesisResult> {
  const agentSummary = agents
    .map(a => `${a.agent} (priority: ${a.priority.level}, score: ${a.priority.score}/10):\n  Problems: ${a.problems.slice(0,2).join("; ")}\n  Top Action: ${a.actions[0]?.title ?? "—"}`)
    .join("\n\n");

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are the GrowthOS Synthesis Engine. You read all 7 agent diagnoses simultaneously and find cross-cutting patterns no single agent sees alone.

Your job:
1. Find compounding problems (e.g., "High COD + High RTO + Low Prepaid = cash flow crisis")
2. Find root causes that explain multiple agent flags
3. Resolve conflicts between agent recommendations
4. Produce 3 synthesis insights — each must reference at least 2 agents

Respond ONLY with valid JSON:
{
  "crossAgentInsights": [
    "Insight 1 (references Finance + Operations)",
    "Insight 2 (references Marketing + Unit Economics)",
    "Insight 3 (references Retention + Finance)"
  ],
  "rootCause": "Single sentence: the one underlying problem driving most issues",
  "conflictResolution": "If agents conflict, how to resolve it (or null if no conflict)"
}

Rules:
- Every insight must cite specific ₹ figures from the data
- rootCause must be actionable, not generic
- Be direct — write like a senior consultant briefing a founder`,
        },
        {
          role: "user",
          content: `Store: ${ctx.name} | Health Score: ${healthScore}/100\nIndustry: ${ctx.industry ?? "D2C"}\n\nAgent Diagnoses:\n${agentSummary}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON");
    const parsed = JSON.parse(match[0]);
    return {
      crossAgentInsights: Array.isArray(parsed.crossAgentInsights) ? parsed.crossAgentInsights : [],
      rootCause:          typeof parsed.rootCause === "string"       ? parsed.rootCause          : "See individual agent findings",
      conflictResolution: typeof parsed.conflictResolution === "string" ? parsed.conflictResolution : undefined,
    };
  } catch {
    return {
      crossAgentInsights: [],
      rootCause: "See individual agent findings",
    };
  }
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export async function runFullDiagnosis(
  ctx: BusinessContext,
  snapshots: Snapshot[] = []
): Promise<DiagnosisResult> {
  const { runFinanceAgent }             = await import("@/agents/finance-agent");
  const { runMarketingAgent }           = await import("@/agents/marketing-agent");
  const { runOperationsAgent }          = await import("@/agents/operations-agent");
  const { runTechnologyAgent }          = await import("@/agents/technology-agent");
  const { runUnitEconomicsAgent }       = await import("@/agents/unit-economics-agent");
  const { runInventoryAgent }           = await import("@/agents/inventory-agent");
  const { runRetentionAgent }           = await import("@/agents/retention-agent");
  const { buildRAGPromptBlock }         = await import("@/lib/ai/rag");
  const { evaluateIndianD2CHeuristics, buildHeuristicsPromptBlock } = await import("@/lib/ai/heuristics");

  // Build shared context enrichments
  const metrics         = computeDerivedMetrics(ctx);
  const metricsBlock    = buildMetricsPromptBlock(ctx, metrics);
  const benchmarkBlock  = buildBenchmarkPromptBlock(ctx);
  const trendBlock      = buildTrendBlock(snapshots);

  // Evaluate deterministic heuristics playbooks
  const playbooks       = evaluateIndianD2CHeuristics(ctx, metrics);
  const heuristicsBlock = buildHeuristicsPromptBlock(playbooks);

  // Retrieve category-specific RAG knowledge chunks concurrently
  const [financeRAG, marketingRAG, opsRAG, techRAG, unitEconRAG, inventoryRAG, retentionRAG] =
    await Promise.all([
      buildRAGPromptBlock("finance", ctx.industry),
      buildRAGPromptBlock("marketing", ctx.industry),
      buildRAGPromptBlock("operations", ctx.industry),
      buildRAGPromptBlock("technology", ctx.industry),
      buildRAGPromptBlock("unit_economics", ctx.industry),
      buildRAGPromptBlock("inventory", ctx.industry),
      buildRAGPromptBlock("retention", ctx.industry),
    ]);

  const enrich = (rag: string) => ({
    ...ctx,
    _metricsBlock: metricsBlock,
    _benchmarkBlock: benchmarkBlock,
    _trendBlock: trendBlock,
    _heuristicsBlock: heuristicsBlock,
    _ragBlock: rag,
  });

  // Run agents in 2 staggered batches to stay under Groq TPM rate limits
  // Batch 1: Finance, Marketing, Ops, Tech
  const [finance, marketing, ops, tech] = await Promise.all([
    runFinanceAgent(enrich(financeRAG) as unknown as BusinessContext),
    runMarketingAgent(enrich(marketingRAG) as unknown as BusinessContext),
    runOperationsAgent(enrich(opsRAG) as unknown as BusinessContext),
    runTechnologyAgent(enrich(techRAG) as unknown as BusinessContext),
  ]);

  // Small gap to let token bucket recover
  await new Promise(r => setTimeout(r, 2000));

  // Batch 2: Unit Economics, Inventory, Retention
  const [unitEcon, inventory, retention] = await Promise.all([
    runUnitEconomicsAgent(enrich(unitEconRAG) as unknown as BusinessContext),
    runInventoryAgent(enrich(inventoryRAG) as unknown as BusinessContext),
    runRetentionAgent(enrich(retentionRAG) as unknown as BusinessContext),
  ]);

  // Enrich agent action items with deterministic playbooks (copy scripts, click paths & SOP steps)
  const agents = [finance, marketing, ops, tech, unitEcon, inventory, retention].map((agentRes) => {
    const matchingPlaybook = playbooks.find(
      (p) => p.targetAgent.toLowerCase() === agentRes.agent.toLowerCase()
    );
    if (matchingPlaybook && agentRes.actions.length > 0) {
      // Attach copy script, click path and SOP steps to primary action
      agentRes.actions[0] = {
        ...agentRes.actions[0],
        clickPath:    agentRes.actions[0].clickPath    ?? matchingPlaybook.clickPath,
        copyTemplate: agentRes.actions[0].copyTemplate ?? matchingPlaybook.copyTemplate,
        sopSteps:     agentRes.actions[0].sopSteps     ?? matchingPlaybook.stepByStepSOP,
      };
    }
    return agentRes;
  });

  const healthScore = computeHealthScore(agents);
  const summary     = extractSummary(agents);

  // Run synthesis pass after all agents complete
  const synthesis   = await runSynthesisPass(ctx, agents, healthScore);

  return { agents, healthScore, synthesis, summary };
}
