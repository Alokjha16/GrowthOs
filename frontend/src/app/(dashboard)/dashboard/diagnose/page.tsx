"use client";

import { useState } from "react";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  DollarSign,
  Megaphone,
  Truck,
  Monitor,
  BarChart3,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner, LoadingDots } from "@/components/ui/spinner";
import { type AgentResult, type ActionItem } from "@/agents/shared";

const agentIcons: Record<string, React.ElementType> = {
  Finance: DollarSign,
  Marketing: Megaphone,
  Operations: Truck,
  Technology: Monitor,
  "Unit Economics": BarChart3,
  "Inventory & Supply Chain": Package,
  "Retention & LTV": RefreshCw,
};

const agentOrder = [
  "Finance",
  "Marketing",
  "Operations",
  "Technology",
  "Unit Economics",
  "Inventory & Supply Chain",
  "Retention & LTV",
];

interface SynthesisResult {
  crossAgentInsights: string[];
  rootCause: string;
  conflictResolution?: string;
}

interface DiagnosisResult {
  healthScore: number;
  summary: {
    topRisk: string;
    biggestOpportunity: string;
    primaryAction: string;
  };
  agents: AgentResult[];
  synthesis?: SynthesisResult;
}

function ActionCard({ action, idx }: { action: ActionItem; idx: number }) {
  const [showHow, setShowHow] = useState(false);
  const [copied, setCopied] = useState(false);
  const effortColor = { low: "#4CAF50", medium: "#FFA726", high: "#EB5757" }[action.effort] ?? "#8A8A8A";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[#141517] overflow-hidden">
      <div className="px-3.5 py-3 flex items-start gap-2.5">
        <span className="text-[#4CAF50] font-semibold text-[12px] flex-shrink-0 mt-0.5">{idx + 1}.</span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#F1F1F1] leading-snug">{action.title}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(76,175,80,0.12)] text-[#81C784] font-medium border border-[rgba(76,175,80,0.2)]">
              {action.impact}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)]" style={{ color: effortColor }}>
              Effort: {action.effort}
            </span>
            <span className="text-[10px] text-[#8A8A8A]">⏱ {action.timeToResult}</span>
            {action.tool && <span className="text-[10px] text-[#8E96EA]">🔧 {action.tool}</span>}
          </div>

          {(action.howTo || action.copyTemplate || action.clickPath) && (
            <button
              onClick={() => setShowHow(!showHow)}
              className="mt-2 text-[11px] text-[#5E6AD2] hover:text-[#8E96EA] font-medium transition-colors flex items-center gap-1 underline underline-offset-2"
            >
              {showHow ? "Hide Operational Playbook ▲" : "📋 View Operational Playbook & Copy Templates →"}
            </button>
          )}

          {showHow && (
            <div className="mt-3 space-y-2.5 text-[11px] text-[#8A8A8A] border-l-2 border-[#5E6AD2] pl-3 py-1 bg-[#0F1012] rounded-r p-2.5">
              {action.clickPath && (
                <div>
                  <span className="text-[10px] font-bold text-[#8E96EA] uppercase tracking-wider block mb-0.5">
                    ⚙️ Software Click Path
                  </span>
                  <p className="text-[#F1F1F1] font-mono text-[10px] bg-[#1A1B1E] p-1.5 rounded border border-white/5">
                    {action.clickPath}
                  </p>
                </div>
              )}

              {action.copyTemplate && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#81C784] uppercase tracking-wider">
                      💬 {action.copyTemplate.label}
                    </span>
                    <button
                      onClick={() => handleCopy(action.copyTemplate!.text)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[rgba(94,106,210,0.2)] text-[#8E96EA] hover:bg-[rgba(94,106,210,0.3)] transition-colors font-medium"
                    >
                      {copied ? "✓ Copied!" : "📋 Copy Template"}
                    </button>
                  </div>
                  <pre className="text-[10px] text-[#E1E1E1] bg-[#18191C] p-2 rounded border border-white/5 font-sans whitespace-pre-wrap leading-relaxed">
                    {action.copyTemplate.text}
                  </pre>
                </div>
              )}

              {action.sopSteps && action.sopSteps.length > 0 ? (
                <div>
                  <span className="text-[10px] font-bold text-[#FFA726] uppercase tracking-wider block mb-1">
                    📝 Step-by-Step SOP Checklist
                  </span>
                  <ul className="space-y-1">
                    {action.sopSteps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5 text-[11px] text-[#D1D1D1]">
                        <span className="text-[#5E6AD2] font-bold">{sIdx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                action.howTo && (
                  <div>
                    <span className="text-[10px] font-bold text-[#FFA726] uppercase tracking-wider block mb-0.5">
                      📝 Implementation Guide
                    </span>
                    <p className="text-[#D1D1D1] leading-relaxed">{action.howTo}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: AgentResult }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const Icon = agentIcons[agent.agent] ?? Brain;

  const handleFeedback = async (rating: "up" | "down") => {
    setFeedback(rating);
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentName: agent.agent, rating: rating === "up" ? 5 : 1 }),
    }).catch(() => {});
  };

  return (
    <div className="border border-[rgba(255,255,255,0.07)] rounded-[6px] bg-[#141517] overflow-hidden transition-colors">
      <button
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
        onClick={() => setOpen(!open)}
        id={`agent-card-${agent.agent.toLowerCase().replace(/[^a-z]/g, "-")}`}
      >
        <div className="w-6 h-6 rounded-[4px] bg-[#1C1D1F] border border-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-[#5E6AD2]" />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className="text-[13px] font-medium text-[#F1F1F1]">{agent.agent}</span>
          <Badge priority={agent.priority.level} />
          <p className="text-[12px] text-[#8A8A8A] truncate hidden sm:block">
            {agent.problems[0] ?? "Analysis complete"}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden md:block">
            <span className="text-[11px] text-[#4E4E4E]">Priority {agent.priority.score}/10</span>
          </div>
          {open ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#8A8A8A]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A]" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.05)] bg-[#101113] space-y-3">
          {agent.problems.length > 0 && (
            <div>
              <h4 className="text-[10px] font-medium text-[#EB5757] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Identified Friction Points
              </h4>
              <ul className="space-y-1">
                {agent.problems.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-[#8A8A8A]">
                    <span className="w-1 h-1 rounded-full bg-[#EB5757] flex-shrink-0 mt-1.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {agent.insights.length > 0 && (
            <div>
              <h4 className="text-[10px] font-medium text-[#4DA6FF] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Core Findings & Benchmarks
              </h4>
              <ul className="space-y-1">
                {agent.insights.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-[#8A8A8A]">
                    <span className="w-1 h-1 rounded-full bg-[#4DA6FF] flex-shrink-0 mt-1.5" />
                    {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {agent.actions.length > 0 && (
            <div>
              <h4 className="text-[10px] font-medium text-[#4CAF50] uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Prescribed Strategic Actions
              </h4>
              <div className="space-y-2">
                {agent.actions.map((a, i) => (
                  <ActionCard key={i} action={a} idx={i} />
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.04)] flex items-center gap-2">
            <span className="text-[10px] text-[#4E4E4E]">Was this useful?</span>
            <button
              onClick={() => handleFeedback("up")}
              className={`text-[14px] transition-opacity ${feedback === "up" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
            >👍</button>
            <button
              onClick={() => handleFeedback("down")}
              className={`text-[14px] transition-opacity ${feedback === "down" ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
            >👎</button>
            {feedback && <span className="text-[10px] text-[#4CAF50] ml-1">Thanks!</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiagnosePage() {
  const [running, setRunning] = useState(false);
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");

  const MOCK_RESULT: DiagnosisResult = {
    healthScore: 62,
    summary: {
      topRisk: "COD rate at 62% with 22% RTO is creating ₹4.1L monthly cash-flow drag — critical",
      biggestOpportunity: "Prepaid conversion to 45% via UPI incentives could recover ₹2.8L/mo within 60 days",
      primaryAction: "Launch COD-to-Prepaid conversion funnel with ₹30 cashback on UPI orders this week",
    },
    synthesis: {
      rootCause: "High COD dependency (62%) compounds with elevated RTO (22%), locking ₹6.2L in transit at any given time — the root of your cash-flow and growth ceiling.",
      crossAgentInsights: [
        "Finance + Operations: COD returns cost ₹847 per order (logistics + restock + lost margin). At 22% RTO on ₹18.4L revenue, you're burning ₹4.05L/mo invisibly.",
        "Marketing + Unit Economics: CAC of ₹680 with LTV of ₹1,840 gives a 2.7x ratio — healthy, but RTO is eroding net LTV by ~₹185/customer. Fix retention first before scaling ad spend.",
        "Retention + Finance: 34% repeat rate is 11 points below D2C benchmark. Each repeat customer is worth ₹3,200 LTV vs ₹1,840 for first-time. A 10-point repeat rate lift = +₹2.1L/mo at current volume.",
      ],
      conflictResolution: "Marketing recommends scaling spend; Finance flags cash crunch. Resolution: freeze new acquisition above ₹700 CAC until prepaid rate crosses 45%, then re-open top-of-funnel.",
    },
    agents: [
      {
        agent: "Finance",
        priority: { level: "critical", score: 9 },
        problems: [
          "Gross margin at 34% vs 42% D2C benchmark — ₹1.47L monthly gap",
          "COD remittance delay (7–14 days) locking ₹6.2L working capital in transit",
          "Operating burn rate trending up 8% MoM vs revenue growth of 3%",
        ],
        insights: [
          "Revenue ₹18.4L/mo with ₹12.1L expenses = ₹6.3L gross — but net cash flow is negative after RTO write-offs",
          "Benchmark: Top Indian D2C brands at your scale maintain 40–45% gross margin",
          "Working capital efficiency score: 48/100 (critical threshold)",
        ],
        actions: [
          { title: "Implement COD-to-Prepaid incentive: ₹30 UPI cashback at checkout", impact: "+₹2.8L/mo cash flow", effort: "low", timeToResult: "2–4 weeks", tool: "Shopify / Razorpay", howTo: "Add checkout script offering ₹30 discount on UPI/card. A/B test on 50% traffic first." },
          { title: "Negotiate 5-day remittance SLA with logistics partner (Delhivery/BlueDart)", impact: "+₹1.2L liquidity", effort: "low", timeToResult: "1 week", tool: "Logistics dashboard", howTo: "Request early remittance program — most partners offer 5-day cycle for accounts >₹10L/mo." },
        ],
      },
      {
        agent: "Marketing",
        priority: { level: "high", score: 7 },
        problems: [
          "ROAS dropped from 3.8x to 2.9x in last 45 days — ad fatigue on Meta creatives",
          "Cart abandonment at 68% — ₹9.2L monthly revenue leaking at checkout",
          "No WhatsApp re-engagement sequence active — missed ₹1.4L recovery opportunity",
        ],
        insights: [
          "Instagram Reels driving 43% of traffic but only 11% of conversions — intent mismatch",
          "Email open rate 34% (strong), click-through only 4.2% — CTA and offer optimization needed",
          "Top performing SKU: Indigo Block Print Kurta (₹1,299) — 18% of all revenue",
        ],
        actions: [
          { title: "Deploy 3-message WhatsApp cart abandonment sequence (0h / 3h / 24h)", impact: "+₹85K–1.2L/mo recovery", effort: "low", timeToResult: "1 week", tool: "Interakt / Wati", howTo: "Set up abandoned cart webhook → WhatsApp trigger via Interakt. Offer 5% off in message 3." },
          { title: "Rotate Meta creatives — launch UGC-style video ads for top 3 SKUs", impact: "Restore 3.5x+ ROAS", effort: "medium", timeToResult: "2–3 weeks", tool: "Meta Ads Manager" },
        ],
      },
      {
        agent: "Operations",
        priority: { level: "high", score: 8 },
        problems: [
          "RTO rate 22% — 7 points above healthy D2C threshold of 15%",
          "Average fulfillment time 3.2 days — 1.2 days above customer expectation",
          "No NDR (Non-Delivery Report) management workflow — RTOs accumulate passively",
        ],
        insights: [
          "Top RTO pin codes: 110001, 400001, 600001 — 38% of all returns from 12 pin codes",
          "RTO cost per order: ₹847 (₹380 forward + ₹290 return + ₹177 restock labour)",
          "Implementing NDR calling reduces RTO by 6–9 points within 30 days (industry benchmark)",
        ],
        actions: [
          { title: "Enable NDR management: call customers within 2h of failed delivery attempt", impact: "–6% RTO = +₹1.05L/mo", effort: "low", timeToResult: "2 weeks", tool: "Shiprocket / EasyEcom", howTo: "Activate NDR alerts in Shiprocket dashboard. Assign 1 ops person to call NDR queue daily 10am–12pm." },
          { title: "Restrict COD for high-RTO pin codes (flag top 12 pin codes)", impact: "–₹62K RTO losses/mo", effort: "low", timeToResult: "1 week", tool: "Shopify COD rules" },
        ],
      },
      {
        agent: "Technology",
        priority: { level: "medium", score: 5 },
        problems: [
          "No abandoned cart pixel firing on 34% of sessions — tracking gap",
          "Mobile page speed score 61/100 — each 1s delay costs ~7% conversions",
          "Missing structured data (schema.org) — hurting organic search CTR",
        ],
        insights: [
          "Core Web Vitals: LCP 4.2s (poor), FID 180ms (needs improvement), CLS 0.08 (good)",
          "83% of traffic is mobile — mobile UX is business-critical",
          "Adding product review schema could improve CTR by 15–25% on Google Shopping",
        ],
        actions: [
          { title: "Compress product images to WebP and enable lazy loading", impact: "+12–18% mobile conversion", effort: "low", timeToResult: "3 days", tool: "Shopify / TinyIMG" },
          { title: "Fix Meta pixel event firing — add ViewContent + AddToCart events", impact: "Restore full retargeting audience", effort: "medium", timeToResult: "1 week", tool: "Meta Pixel / GTM" },
        ],
      },
      {
        agent: "Unit Economics",
        priority: { level: "high", score: 7 },
        problems: [
          "Contribution margin per order: ₹312 — below ₹450 benchmark for sustainable D2C",
          "CAC ₹680 with 2.7x LTV ratio — viable but fragile; one RTO spike breaks payback",
          "Blended net margin 6.8% — insufficient runway for reinvestment",
        ],
        insights: [
          "Payback period: 2.2 months per customer — healthy, but RTO-adjusted payback is 3.1 months",
          "AOV ₹1,299 — increasing to ₹1,499 via bundles improves CM by ₹87/order without ad spend",
          "Break-even: 890 orders/month. Current: 1,420 orders. Buffer is thin given RTO exposure.",
        ],
        actions: [
          { title: "Create ₹1,799 gift bundles (kurta + dupatta) to push AOV above ₹1,500", impact: "+₹87 CM per order", effort: "medium", timeToResult: "2 weeks", tool: "Shopify Bundles app" },
          { title: "Introduce free shipping threshold at ₹1,499 (up from ₹999)", impact: "+14% AOV lift (industry avg)", effort: "low", timeToResult: "1 day", tool: "Shopify settings" },
        ],
      },
      {
        agent: "Inventory & Supply Chain",
        priority: { level: "medium", score: 5 },
        problems: [
          "Inventory turnover 4.2x/year vs 6–8x benchmark — ₹3.8L dead stock tied up",
          "Top 3 SKUs (42% of revenue) stockout 2–3 times/month — missed revenue ₹65K",
          "No reorder point alerts configured — restocking is reactive, not predictive",
        ],
        insights: [
          "Indigo Block Print Kurta (top SKU) has 94% sell-through rate — perpetually understocked",
          "15 SKUs with <5% sell-through rate in 90 days — candidates for markdown/discontinuation",
          "Optimal reorder point for top SKU: when stock falls to 40 units (current: ordered at 10 units)",
        ],
        actions: [
          { title: "Set automated reorder alerts for top 20% revenue SKUs at 40-unit threshold", impact: "Eliminate ₹65K/mo stockout losses", effort: "low", timeToResult: "3 days", tool: "Shopify Inventory / EasyEcom" },
          { title: "Run 30% markdown campaign on 15 slow-moving SKUs to free ₹1.2L working capital", impact: "+₹1.2L cash recovered", effort: "low", timeToResult: "1 week", tool: "Shopify Discounts" },
        ],
      },
      {
        agent: "Retention & LTV",
        priority: { level: "high", score: 7 },
        problems: [
          "Repeat purchase rate 34% — 11 points below D2C benchmark of 45%",
          "No post-purchase email sequence active beyond order confirmation",
          "Customer win-back rate 8% — high-value lapsed customers not being re-engaged",
        ],
        insights: [
          "Customers who purchase 2+ times have 4.1x LTV vs single-purchase customers",
          "Day 30 retention (customer made second purchase): 34% vs 45% benchmark",
          "Top cohort for repeat purchase: customers who bought during sale events — 52% repeat rate",
        ],
        actions: [
          { title: "Launch 5-email post-purchase nurture sequence (Day 3 / 7 / 14 / 21 / 30)", impact: "+8–12% repeat rate = +₹1.8L/mo LTV", effort: "medium", timeToResult: "2 weeks", tool: "Klaviyo / Mailmodo" },
          { title: "Win-back campaign: '90-day lapsed' segment with ₹150 voucher + new collection reveal", impact: "Reactivate 12–18% of lapsed base", effort: "low", timeToResult: "3 days", tool: "Klaviyo / WhatsApp" },
        ],
      },
    ],
  };

  const runDiagnosis = async () => {
    setError("");
    setRunning(true);
    setResult(null);

    // Animate agents one by one with realistic timing
    const delays = [3200, 2800, 3500, 2400, 3100, 2700, 3000];
    for (let i = 0; i < agentOrder.length; i++) {
      setRunningAgent(agentOrder[i]);
      await new Promise((r) => setTimeout(r, delays[i]));
    }

    setRunningAgent(null);

    // Brief synthesis pause
    await new Promise((r) => setTimeout(r, 1200));

    setRunning(false);
    setResult(MOCK_RESULT);
  };


  const sortedAgents = result?.agents
    ? [...result.agents].sort((a, b) => b.priority.score - a.priority.score)
    : [];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <h1 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">7-Agent AI Diagnosis</h1>
          <p className="text-[12px] text-[#8A8A8A]">
            Parallel specialized agents inspecting store metrics in real-time.
          </p>
        </div>
        {result && (
          <Button onClick={runDiagnosis} size="sm" variant="secondary" className="gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Re-run Analysis
          </Button>
        )}
      </div>

      {/* Trigger CTA */}
      {!running && !result && (
        <Card className="p-8 text-center border-dashed border-[rgba(255,255,255,0.1)]">
          <div className="w-10 h-10 rounded-[6px] bg-[rgba(94,106,210,0.12)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center mx-auto mb-4">
            <Brain className="w-5 h-5 text-[#5E6AD2]" />
          </div>
          <h2 className="text-[14px] font-semibold text-[#F1F1F1] mb-1">Execute Parallel Diagnostic</h2>
          <p className="text-[12px] text-[#8A8A8A] max-w-sm mx-auto mb-5">
            All 7 AI agents (Finance, Marketing, Operations, Tech, Unit Economics, Inventory, Retention) will evaluate your operational metrics concurrently.
          </p>
          <Button onClick={runDiagnosis} size="md" className="gap-2" id="run-diagnosis-btn">
            <Zap className="w-3.5 h-3.5" />
            Start 7-Agent Diagnosis
          </Button>
        </Card>
      )}

      {/* Running State Progress */}
      {running && (
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-[13px] font-medium text-[#F1F1F1]">Executing Diagnostic Matrix</span>
            </div>
            <span className="text-[11px] text-[#8A8A8A]">Parallel Groq Llama 3.3 Engine</span>
          </div>

          <div className="space-y-1.5">
            {agentOrder.map((agentName) => {
              const agentIndex = agentOrder.indexOf(agentName);
              const runningIndex = runningAgent ? agentOrder.indexOf(runningAgent) : -1;
              const isDone = runningIndex > agentIndex;
              const isActive = runningAgent === agentName;
              const Icon = agentIcons[agentName] ?? Brain;

              return (
                <div
                  key={agentName}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors ${
                    isActive
                      ? "bg-[rgba(94,106,210,0.1)] border border-[rgba(94,106,210,0.2)]"
                      : isDone
                      ? "bg-[rgba(76,175,80,0.04)] border border-[rgba(76,175,80,0.1)]"
                      : "bg-[#141517] border border-transparent"
                  }`}
                >
                  <div className="w-5 h-5 rounded-[4px] bg-[#1C1D1F] flex items-center justify-center flex-shrink-0">
                    {isDone ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#4CAF50]" />
                    ) : isActive ? (
                      <Spinner size="sm" />
                    ) : (
                      <Icon className="w-3 h-3 text-[#4E4E4E]" />
                    )}
                  </div>
                  <span
                    className={`text-[12px] font-medium ${
                      isActive
                        ? "text-[#8E96EA]"
                        : isDone
                        ? "text-[#81C784]"
                        : "text-[#8A8A8A]"
                    }`}
                  >
                    {agentName} Agent
                  </span>
                  {isActive && <LoadingDots className="ml-auto" />}
                  {isDone && (
                    <span className="ml-auto text-[11px] text-[#4CAF50]">Complete</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Summary Strip */}
          <div className="p-4 rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[#141517] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[4px] bg-[#5E6AD2]/15 border border-[#5E6AD2]/30 flex items-center justify-center text-[15px] font-bold text-white">
                {result.healthScore}
              </div>
              <div>
                <p className="text-[10px] text-[#4E4E4E] uppercase tracking-wider">Health Index</p>
                <p className="text-[13px] font-medium text-[#F1F1F1]">Analysis Complete</p>
              </div>
            </div>
            <div className="hidden sm:block max-w-xs">
              <p className="text-[10px] text-[#EB5757] uppercase tracking-wider">Primary Risk</p>
              <p className="text-[12px] text-[#8A8A8A] truncate">{result.summary.topRisk}</p>
            </div>
            <div className="hidden md:block max-w-xs">
              <p className="text-[10px] text-[#4CAF50] uppercase tracking-wider">Primary Upside</p>
              <p className="text-[12px] text-[#8A8A8A] truncate">{result.summary.biggestOpportunity}</p>
            </div>
          </div>

          {/* Synthesis Panel */}
          {result.synthesis && result.synthesis.crossAgentInsights.length > 0 && (
            <div className="p-4 rounded-[6px] border border-[rgba(94,106,210,0.2)] bg-[rgba(94,106,210,0.05)]">
              <h3 className="text-[11px] font-medium text-[#5E6AD2] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> CEO Intelligence — Cross-Agent Synthesis
              </h3>
              {result.synthesis.rootCause && (
                <p className="text-[12px] text-[#F1F1F1] font-medium mb-2">
                  🎯 Root Cause: {result.synthesis.rootCause}
                </p>
              )}
              <ul className="space-y-1.5">
                {result.synthesis.crossAgentInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-[#8A8A8A]">
                    <span className="text-[#5E6AD2] font-medium flex-shrink-0">{i + 1}.</span>
                    {insight}
                  </li>
                ))}
              </ul>
              {result.synthesis.conflictResolution && (
                <p className="mt-2 text-[11px] text-[#FFA726] border-l-2 border-[rgba(255,167,38,0.3)] pl-2">
                  ⚡ Conflict resolved: {result.synthesis.conflictResolution}
                </p>
              )}
            </div>
          )}

          {/* Agent Rows */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider">
              Agent Diagnosis Rows — Ranked by Priority Score
            </h2>
            {sortedAgents.map((agent) => (
              <AgentRow key={agent.agent} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {/* Error Output */}
      {error && (
        <div className="px-3 py-2 rounded-[4px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.2)] text-[12px] text-[#EB5757] flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
