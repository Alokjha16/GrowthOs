"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Megaphone,
  Truck,
  Monitor,
  BarChart3,
  Package,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
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

const RANG_STUDIO_DEMO_RESULTS: AgentResult[] = [
  {
    agent: "Finance",
    priority: { level: "critical", score: 9 },
    problems: [
      "Gross profit margin is 39.1% — 16 points below Indian apparel benchmark of 55–65%",
      "High COGS and 62% COD dependency are eroding monthly net profit by ₹2.95L vs benchmark",
    ],
    insights: [
      "Monthly revenue: ₹18.4L | Monthly expenses: ₹11.2L | Net profit: ₹7.2L (39.1% margin)",
      "Unabsorbed return shipping losses from 22% RTO cut net profit margin by 3.2 percentage points",
    ],
    actions: [
      {
        title: "Renegotiate fabric supplier terms for top 3 ethnic wear SKUs",
        impact: "Recover 5% COGS margin → +₹92,000/month profit",
        effort: "medium",
        timeToResult: "30 days",
        tool: "Unicommerce COGS Analytics / Direct Supplier Review",
      },
      {
        title: "Introduce dynamic COD fee of ₹80 for non-tier-1 pincodes",
        impact: "Shift 15% COD orders to Prepaid → +₹36,800/month net cash flow",
        effort: "low",
        timeToResult: "7 days",
        tool: "Razorpay Magic Checkout Rules",
      },
    ],
  },
  {
    agent: "Operations",
    priority: { level: "critical", score: 9 },
    problems: [
      "COD RTO rate is 22% (vs 12–15% benchmark), causing ₹23,900/month in freight losses",
      "Fulfillment SLA is 4.8 days vs 2.5-day benchmark, directly driving order cancellations",
    ],
    insights: [
      "Out of 1,240 orders/month, 768 are COD; 169 COD orders returned to origin (RTO)",
      "Tier-3 pincodes in UP, Bihar, and MP account for 64% of total RTO volume",
    ],
    actions: [
      {
        title: "Enable automated WhatsApp NDR (Non-Delivery Report) confirmation flow",
        impact: "Reduce RTO by 6 percentage points → Save ₹14,300/month freight loss",
        effort: "low",
        timeToResult: "14 days",
        tool: "Shiprocket NDR + Interakt / AiSensy WhatsApp API",
      },
      {
        title: "Block high-RTO pincodes (>35% historic return) for COD checkout",
        impact: "Eliminate high-risk orders → Immediate ₹9,600/month savings",
        effort: "low",
        timeToResult: "3 days",
        tool: "Gokwik / Razorpay Pincode Risk Engine",
      },
    ],
  },
  {
    agent: "Marketing",
    priority: { level: "high", score: 7 },
    problems: [
      "Meta Ads blended ROAS fell from 3.8x to 2.2x over the last 60 days",
      "Blended CAC is ₹680 — elevated relative to AOV of ₹1,480 (CAC is 46% of order value)",
    ],
    insights: [
      "Ad spend: ₹3.4L/month across Meta (80%) and Google Shopping (20%)",
      "Video UGC ads featuring ethnic wear styling convert 2.4x better than static image ads",
    ],
    actions: [
      {
        title: "Reallocate 40% of Meta budget to Creator UGC video ads",
        impact: "Lift ROAS to 3.1x → Save ₹54,000/month in wasted ad spend",
        effort: "medium",
        timeToResult: "14 days",
        tool: "Meta Ads Manager + Creator UGC Sourcing",
      },
    ],
  },
  {
    agent: "Technology",
    priority: { level: "high", score: 6 },
    problems: [
      "Checkout conversion rate is 1.8% vs 2.8% Indian D2C benchmark",
      "Mobile cart abandonment rate is 78%, concentrated on payment method selection page",
    ],
    insights: [
      "68% of mobile traffic drops off when entering address & selecting payment method",
      "Lack of Instant UPI (1-click checkout) adds 3 Friction steps on mobile browser",
    ],
    actions: [
      {
        title: "Deploy Razorpay Magic 1-Click Checkout with auto-fill address",
        impact: "Lift checkout conversion by 0.6% → +₹1.84L/month incremental revenue",
        effort: "low",
        timeToResult: "5 days",
        tool: "Razorpay Magic Checkout / Gokwik Instant Checkout",
      },
    ],
  },
  {
    agent: "Unit Economics",
    priority: { level: "medium", score: 5 },
    problems: [
      "Contribution Margin 2 (after marketing & shipping) is 14.2% — dangerously low buffer",
    ],
    insights: [
      "Top 20% of SKUs (Anarkali Suits & Kurti Sets) generate 68% of gross margin",
      "Bottom 30% of SKUs have negative CM2 after accounting for ad CAC and return freight",
    ],
    actions: [
      {
        title: "Bundle low-margin Kurtis into 2-pack offers at ₹2,299 AOV threshold",
        impact: "Increase AOV from ₹1,480 to ₹2,100 → Expand CM2 to 21.5%",
        effort: "low",
        timeToResult: "10 days",
        tool: "Shopify Bundles / Bold Bundles App",
      },
    ],
  },
  {
    agent: "Inventory & Supply Chain",
    priority: { level: "medium", score: 4 },
    problems: [
      "34% of working capital (₹4.2L) is tied up in slow-moving winter collection inventory",
    ],
    insights: [
      "Chanderi Silk Dupattas have a turnover velocity of 84 days (benchmark < 30 days)",
    ],
    actions: [
      {
        title: "Run flash end-of-season clearance sale bundled with high-velocity SKUs",
        impact: "Free up ₹2.8L cash locked in deadstock within 14 days",
        effort: "low",
        timeToResult: "7 days",
        tool: "Shopify Discount Rules + WhatsApp Blast",
      },
    ],
  },
  {
    agent: "Retention & LTV",
    priority: { level: "low", score: 3 },
    problems: [
      "Repeat customer rate is 18% vs 30% benchmark for Indian fashion D2C brands",
    ],
    insights: [
      "92% of repeat purchases occur within 45 days of initial delivery",
      "Post-purchase email flow open rate is only 12% — WhatsApp has 84% open rate",
    ],
    actions: [
      {
        title: "Launch post-delivery WhatsApp VIP flow with 15% discount for 2nd order",
        impact: "Lift 60-day repeat rate from 18% to 26% → +₹1.1L/month LTV growth",
        effort: "low",
        timeToResult: "14 days",
        tool: "Interakt / AiSensy WhatsApp Flow Automation",
      },
    ],
  },
];

function ActionItemCard({ action }: { action: ActionItem }) {
  return (
    <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          {action.title}
        </h4>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
          {action.impact}
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-zinc-400 pt-1">
        <span>⏱ <strong>Timeline:</strong> {action.timeToResult}</span>
        <span>🛠 <strong>Tool:</strong> {action.tool}</span>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentResult }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = agentIcons[agent.agent] || Brain;
  const isCritical = agent.priority.level === "critical";

  return (
    <Card className={`bg-zinc-900/60 border-white/10 transition-all ${isCritical ? "border-rose-500/30" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{agent.agent} Agent</h3>
                <Badge priority={agent.priority.level} />
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                {agent.problems[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-400 font-semibold hidden sm:inline">
              {agent.actions.length} Prescribed Actions
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </div>
        </div>

        {expanded && (
          <div className="pt-3 border-t border-white/10 space-y-4 animate-fade-in">
            {/* Identified Risk Points */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Identified Bottlenecks & Risk Points
              </p>
              <ul className="space-y-1">
                {agent.problems.map((prob, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Data Insights */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Empirical Data Insights
              </p>
              <ul className="space-y-1">
                {agent.insights.map((ins, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prescribed Action Plan */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Prescribed Action Plan & Expected ROI
              </p>
              <div className="space-y-2">
                {agent.actions.map((act, i) => (
                  <ActionItemCard key={i} action={act} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DemoPage() {
  const [agents] = useState<AgentResult[]>(RANG_STUDIO_DEMO_RESULTS);

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex flex-col font-sans overflow-x-hidden relative">
      <Navbar />

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-orange-950/80 via-amber-950/70 to-zinc-900 border-b border-orange-500/30 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2 text-zinc-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong>PITCH DEMO MODE:</strong> Exploring live diagnosis for <strong>Rang Studio</strong> (Ethnic Wear D2C · ₹18.4L/mo · 62% COD · 22% RTO).
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="sm" className="h-8 text-xs gap-1.5">
                Analyze Your Store Free
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full space-y-6">
        {/* Store Header Strip */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">Rang Studio</h1>
              <Badge variant="primary">Apparel & Ethnic Wear</Badge>
              <Badge variant="secondary" className="border-emerald-500/30 text-emerald-400">
                ₹18.4L Revenue/mo
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Shopify India · Jaipur Manufacturing · Shiprocket 3PL · 62% COD · 22% RTO
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="gradient" className="gap-2 text-xs">
                <Brain className="w-4 h-4" />
                Connect Your Store
              </Button>
            </Link>
          </div>
        </div>

        {/* Diagnostic Brief & Health ring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Score */}
          <Card className="flex flex-col items-center justify-center p-6 text-center bg-zinc-900/80 border-white/10">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Store Health Index
            </p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="#FFA726" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="194 314"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">62</span>
                <span className="text-xs text-zinc-400">/100</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-amber-400 mt-3">Moderate Risk · Margin Bleed</p>
          </Card>

          {/* CEO Intelligence */}
          <Card className="md:col-span-2 p-6 bg-zinc-900/80 border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4" /> CEO Intelligence — Cross-Agent Synthesis
            </h3>
            <p className="text-xs font-semibold text-white leading-relaxed">
              🎯 <strong>Root Cause:</strong> 62% COD dependency combined with a 22% RTO rate is eroding ₹23,900/mo in freight losses while masking Facebook Ad inefficiency.
            </p>
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">1.</span>
                <span>
                  <strong>Finance + Operations:</strong> High COD (62%) and low gross margins (39.1%) create an urgent profit deficit of ₹2.95L/mo vs Indian ethnic wear benchmarks (55-65%).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">2.</span>
                <span>
                  <strong>Technology + Marketing:</strong> Razorpay 1-Click Magic Checkout with a ₹50 prepaid incentive can convert ~12% of COD orders to prepaid, saving ₹8,900/mo in RTO.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">3.</span>
                <span>
                  <strong>Retention + Unit Economics:</strong> Shifting customer repeat touchpoints from email to automated WhatsApp flows can elevate repeat revenue from 28% to 33%.
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 7 Agent Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              7 Specialized Agent Diagnoses — Ranked by Priority
            </h2>
            <span className="text-xs text-zinc-500">Click any row to expand strategic action plan</span>
          </div>

          <div className="space-y-2">
            {agents.map((agent) => (
              <AgentCard key={agent.agent} agent={agent} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-orange-950/40 to-zinc-950 border border-white/10 text-center space-y-4">
          <h3 className="text-xl font-extrabold text-white">Ready to run GrowthOS on your own store?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Connect Shopify India, WooCommerce, Shiprocket, or Razorpay in under 60 seconds.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="gap-2 text-xs px-8 h-11">
                Start Free Trial Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-white/5 text-center text-xs text-zinc-500 relative z-10">
        © {new Date().getFullYear()} GrowthOS Inc. Pitch Demo Mode. All rights reserved.
      </footer>
    </div>
  );
}
