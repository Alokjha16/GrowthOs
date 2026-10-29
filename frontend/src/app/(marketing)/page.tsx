import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Zap,
  ArrowRight,
  DollarSign,
  Megaphone,
  Truck,
  Monitor,
  BarChart3,
  Package,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Clock,
  IndianRupee,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

const AGENTS = [
  { name: "Finance Agent", role: "Profit Margins, Expense Ratios & Cash Flow", metric: "Avg. ₹2.3L/mo leakage found", icon: DollarSign, color: "from-orange-500 to-amber-500", glow: "border-orange-500/30", free: true },
  { name: "Marketing Agent", role: "Blended CAC, ROAS & Ad Channel Optimization", metric: "Diagnoses 4+ ad channels", icon: Megaphone, color: "from-amber-500 to-yellow-500", glow: "border-amber-500/30", free: false },
  { name: "Operations Agent", role: "Fulfillment SLA & Logistics Bottlenecks", metric: "COD / RTO risk in real-time", icon: Truck, color: "from-orange-600 to-red-500", glow: "border-orange-600/30", free: false },
  { name: "Technology Agent", role: "Cart Abandonment & Checkout Conversion Rate", metric: "Checkout funnel audit", icon: Monitor, color: "from-amber-600 to-orange-500", glow: "border-amber-600/30", free: false },
  { name: "Unit Economics Agent", role: "Contribution Margins & LTV:CAC Ratio", metric: "SKU-level profitability", icon: BarChart3, color: "from-orange-500 to-yellow-500", glow: "border-orange-500/30", free: false },
  { name: "Inventory Agent", role: "Stockout Risk & Turnover Velocity", metric: "Deadstock early warning", icon: Package, color: "from-red-500 to-amber-600", glow: "border-rose-500/30", free: false },
  { name: "Retention Agent", role: "Repeat Customer Rate & LTV Growth", metric: "WhatsApp flow ROI calc", icon: RefreshCw, color: "from-amber-500 to-orange-600", glow: "border-amber-500/30", free: false },
];

const PAIN_STATS = [
  { stat: "6", label: "separate dashboards a D2C founder checks every day", icon: Monitor },
  { stat: "11hrs", label: "lost weekly to manual data reconciliation across tools", icon: Clock },
  { stat: "₹3.5L", label: "average consultant fee for one strategic audit", icon: IndianRupee },
  { stat: "72%", label: "of failed D2C brands cited 'no real-time visibility' as root cause", icon: TrendingUp },
];

type CellValue = boolean | "partial" | string;

const COMPARISON: { feature: string; amazon: CellValue; shopify: CellValue; meesho: CellValue; sheets: CellValue; bi: CellValue; growthos: CellValue }[] = [
  { feature: "Cross-channel unified view", amazon: false, shopify: false, meesho: false, sheets: "partial", bi: "partial", growthos: true },
  { feature: "COD & RTO risk engine", amazon: false, shopify: false, meesho: false, sheets: false, bi: false, growthos: true },
  { feature: "AI diagnosis (what to fix)", amazon: false, shopify: false, meesho: false, sheets: false, bi: false, growthos: true },
  { feature: "India-specific benchmarks", amazon: "partial", shopify: false, meesho: "partial", sheets: false, bi: false, growthos: true },
  { feature: "Time to insight", amazon: "Hours", shopify: "Hours", meesho: "Hours", sheets: "Days", bi: "2–3 hrs", growthos: "< 4 sec" },
  { feature: "Strategy simulation", amazon: false, shopify: false, meesho: false, sheets: false, bi: false, growthos: true },
  { feature: "CEO brief / PDF export", amazon: false, shopify: false, meesho: false, sheets: false, bi: "partial", growthos: true },
  { feature: "Cost/month", amazon: "Free", shopify: "Free", meesho: "Free", sheets: "Free", bi: "₹15–50K", growthos: "Free → ₹799" },
];

function CompCell({ value }: { value: CellValue }) {
  if (value === true) return <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />;
  if (value === false) return <XCircle className="w-4 h-4 text-zinc-600 mx-auto" />;
  if (value === "partial") return <AlertCircle className="w-4 h-4 text-amber-400 mx-auto" />;
  return <span className="text-xs text-zinc-300 font-medium">{value}</span>;
}

function GrowthOSCell({ value }: { value: CellValue }) {
  if (value === true) return <CheckCircle2 className="w-5 h-5 text-orange-400 mx-auto" />;
  return <span className="text-xs font-bold text-orange-300">{value as string}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex flex-col font-sans overflow-x-hidden relative">
      {/* Ambient Orb — Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-orange-600/25 via-amber-600/15 to-orange-950/10 rounded-full blur-[140px] pointer-events-none" />
      {/* Ambient Orb — Bottom Right */}
      <div className="absolute bottom-[20%] right-0 w-[500px] h-[400px] bg-gradient-to-tl from-amber-600/15 via-orange-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-16 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-300 mb-8 shadow-lg shadow-orange-500/10 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          The intelligence layer Shopify, Amazon & Meesho can&apos;t give you
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] mb-6 animate-fade-in-up">
          Your data is trapped in{" "}
          <span className="gradient-text-warm">6 dashboards.</span>
          <br />
          <span className="gradient-text">Your growth is paying the price.</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mb-4 leading-relaxed font-normal animate-fade-in-up-delay-1">
          GrowthOS pulls your Shopify, Amazon, Meesho, Shiprocket & Razorpay data into one AI brain — and tells you exactly what to fix and in what order.
        </p>
        <p className="text-sm text-zinc-500 mb-10 animate-fade-in-up-delay-2">
          7 specialized agents. Sub-4 second diagnosis. <span className="text-orange-400 font-semibold">Free to start.</span>
        </p>

        <div className="flex items-center gap-4 mb-16 animate-fade-in-up-delay-2">
          <Link href="/register">
            <Button variant="gradient" size="lg" className="gap-2 text-base px-7 h-12">
              Start Free — No Credit Card
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="secondary" size="lg" className="text-base px-6 h-12 gap-2 border-orange-500/30 text-orange-300 hover:bg-orange-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Live Demo
            </Button>
          </Link>
        </div>

        {/* Hero Mockup Graphic */}
        <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-zinc-900/60 p-3 backdrop-blur-2xl shadow-2xl shadow-orange-500/10 relative group animate-float">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 mb-3">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-zinc-500 ml-2 font-mono">growthos.app/dashboard</span>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-white/5">
            <Image
              src="/hero_mockup.jpg"
              alt="GrowthOS Dashboard Mockup"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover group-hover:scale-[1.01] transition-transform duration-700"
              priority
            />
          </div>
        </div>
      </section>

      {/* ─── TRACTION STRIP ───────────────────────────────────── */}
      <div className="traction-strip py-4 relative z-10 overflow-hidden">
        <div className="flex items-center justify-center gap-12 flex-wrap px-6">
          {[
            { icon: Users, label: "400+ D2C brands onboarded" },
            { icon: IndianRupee, label: "₹850 Cr+ GMV analyzed" },
            { icon: Sparkles, label: "7 AI agents · Groq Llama-3.3" },
            { icon: ShieldCheck, label: "4.9★ avg founder rating" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-zinc-400">
              <Icon className="w-3.5 h-3.5 text-orange-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PAIN SECTION ─────────────────────────────────────── */}
      <section className="px-6 py-24 border-t border-white/[0.06] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 mb-4">
              The Problem Every Indian D2C Founder Faces
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              You&apos;re not struggling because<br />
              <span className="gradient-text-warm">you lack data.</span>
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto text-base">
              You have too much of it — scattered across tools that don&apos;t talk to each other. Every platform shows you a piece. Nobody shows you the picture.
            </p>
          </div>

          {/* Pain Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {PAIN_STATS.map(({ stat, label }) => (
              <div key={stat} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.06] shimmer-card hover:border-orange-500/20 transition-colors duration-300">
                <div className="pain-stat mb-3">{stat}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>

          {/* Before / After Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="p-7 rounded-2xl bg-zinc-900/40 border border-rose-500/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">WITHOUT GROWTHOS</div>
              <p className="text-sm font-semibold text-white mb-5">A Monday morning for a D2C founder 👇</p>
              <div className="space-y-3">
                {[
                  "Open Amazon Seller Central → check ACOS & returns",
                  "Switch to Shopify → check revenue & abandoned carts",
                  "Open Meesho panel → check orders & RTO count",
                  "Check Shiprocket → count NDR & undelivered",
                  "Open Razorpay → reconcile settlements",
                  "Paste everything into Google Sheets",
                  "Still don't know *why* CAC went up last week",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-zinc-400">
                    <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <p className="text-xs text-rose-300 font-medium">⏱ 3 hours later. Still no clear answer on what to prioritize.</p>
              </div>
            </div>

            {/* After */}
            <div className="p-7 rounded-2xl bg-zinc-900/40 border border-orange-500/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">WITH GROWTHOS</div>
              <p className="text-sm font-semibold text-white mb-5">Same Monday morning, different story 👇</p>
              <div className="space-y-3">
                {[
                  "Open GrowthOS → all channels auto-synced overnight",
                  "7 AI agents already ran diagnosis in parallel",
                  "Chief risk flagged: RTO rate ↑12% = ₹1.8L/mo loss",
                  "Root cause identified: Meesho tier-3 city pincode cluster",
                  "Action card: Block 23 high-RTO pincodes in Shiprocket",
                  "Scenario sim: reducing RTO by 8% adds ₹1.2L net margin",
                  "CEO brief generated → shared with co-founder in 1 click",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-orange-300 font-medium">⚡ 4 seconds. Clear next action. Data-backed decision.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-white/[0.06] bg-zinc-950/70 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300 mb-4">
              Competitive Landscape
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why GrowthOS instead of{" "}
              <span className="gradient-text">what you already use</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm">
              Amazon, Shopify, and Meesho give you free dashboards. They show you{" "}
              <em>what happened</em>. GrowthOS tells you <em>why</em> and <em>what to do</em>.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] pb-1">
            <table className="w-full min-w-[780px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-44">Capability</th>
                  {["Amazon Seller Central", "Shopify Analytics", "Meesho / Flipkart", "Google Sheets", "Zoho / Power BI"].map(col => (
                    <th key={col} className="px-4 py-4 text-xs font-semibold text-zinc-500 text-center">{col}</th>
                  ))}
                  <th className="px-4 py-4 text-center comparison-highlight comparison-highlight-top">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-bold text-orange-300">GrowthOS</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-white/[0.05] ${i % 2 === 0 ? "bg-zinc-900/20" : ""}`}>
                    <td className="px-5 py-3.5 text-xs text-zinc-300 font-medium">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center"><CompCell value={row.amazon} /></td>
                    <td className="px-4 py-3.5 text-center"><CompCell value={row.shopify} /></td>
                    <td className="px-4 py-3.5 text-center"><CompCell value={row.meesho} /></td>
                    <td className="px-4 py-3.5 text-center"><CompCell value={row.sheets} /></td>
                    <td className="px-4 py-3.5 text-center"><CompCell value={row.bi} /></td>
                    <td className={`px-4 py-3.5 text-center comparison-highlight${i === COMPARISON.length - 1 ? " comparison-highlight-bottom" : ""}`}>
                      <GrowthOSCell value={row.growthos} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-5 mt-4 px-2 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full support</span>
            <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Partial / manual</span>
            <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-zinc-600" /> Not available</span>
          </div>
        </div>
      </section>

      {/* ─── 7 AI AGENTS ──────────────────────────────────────── */}
      <section className="px-6 py-24 border-t border-white/[0.06] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300 mb-4">
              <Brain className="w-3.5 h-3.5" /> Parallel Groq Llama-3.3 Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              7 Specialized AI Agents,{" "}
              <span className="gradient-text">one unified diagnosis</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm">
              Not generic LLM advice. Domain-specific agent personas built around e-commerce unit economics — running simultaneously in under 4 seconds.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-orange-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Finance Agent is free forever — no credit card needed
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className={`p-6 rounded-2xl border bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/80 transition-all duration-300 ${agent.glow} group hover:-translate-y-1 shimmer-card relative`}
              >
                {agent.free && (
                  <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full free-badge">
                    FREE
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <agent.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">{agent.role}</p>
                <div className="text-[11px] text-zinc-500 border-t border-white/[0.06] pt-3 font-medium">
                  {agent.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDIA SECTION ────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-white/[0.06] bg-zinc-950/80 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 mb-4">
              🇮🇳 Built exclusively for Indian D2C — not a US tool retrofitted for India
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Generic tools ignore{" "}
              <span className="gradient-text">COD, RTO & Lakhs</span>
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm">
              Shopify Analytics was built for Shopify. Amazon for Amazon. GrowthOS was built for the Indian founder who sells on all of them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { stat: "₹ Lakhs", color: "text-emerald-400", title: "Native INR Financials", desc: "All CAC, LTV, and action impacts in ₹ and Indian lakhs — not USD. E.g. ₹18.4L/mo revenue, not $22,000." },
              { stat: "COD & RTO", color: "text-amber-400", title: "Fulfillment Risk Engine", desc: "Pre-calculates cash-in-transit risk, NDR shipping loss (₹240/order), and prepaid conversion upside." },
              { stat: "Razorpay", color: "text-orange-400", title: "Indian Tech Stack", desc: "Prescribes specific Indian tools: Razorpay Magic Checkout, Shiprocket NDR, Gokwik & Unicommerce." },
              { stat: "WhatsApp", color: "text-amber-500", title: "WhatsApp-First Retention", desc: "Replaces low-ROI email sequences with high-converting post-purchase WhatsApp flows via Interakt/AiSensy." },
            ].map(({ stat, color, title, desc }) => (
              <div key={stat} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] shimmer-card hover:border-white/20 transition-colors duration-300 space-y-2">
                <div className={`text-2xl font-black ${color}`}>{stat}</div>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/demo">
              <Button variant="secondary" size="lg" className="gap-2 text-sm px-7 border-orange-500/30 text-orange-300 hover:bg-orange-500/10">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Try live demo with Rang Studio (Ethnic Wear D2C doing ₹18.4L/mo) →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUE PILLARS ────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, color: "orange", title: "Sub-4s Parallel Diagnosis", desc: "Run all 7 agents simultaneously via Groq inference. Identify your store's chief risk score before your coffee brews." },
            { icon: TrendingUp, color: "amber", title: "Strategy Scenario Simulator", desc: "Test 3PL migration, free shipping thresholds, or subscription bundles before committing capital. AI-modeled P&L impact." },
            { icon: ShieldCheck, color: "emerald", title: "CEO Brief & PDF Export", desc: "Synthesize findings into an executive briefing with a 30-day tactical roadmap — board-presentation ready in one click." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-8 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 shimmer-card group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-gradient-to-b from-orange-950/30 to-zinc-950 border-t border-white/[0.06] text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300">
            Free to start · No credit card · Upgrade when the ROI is obvious
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Start with the Finance Agent.<br />
            <span className="gradient-text">Free, forever.</span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Most founders find a ₹40,000+/month leak in their first diagnosis. The paid plan costs ₹799. The ROI calculates itself.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="gap-2 text-base px-8 h-12 animate-border-pulse">
                Launch Free Diagnosis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg" className="text-base px-6 h-12">
                See Pricing →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5 text-center text-xs text-zinc-500 relative z-10">
        © {new Date().getFullYear()} GrowthOS Inc. All rights reserved. · Built for Indian D2C Founders.
      </footer>
    </div>
  );
}
