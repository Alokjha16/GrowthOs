import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  Brain,
  FlaskConical,
  FileBarChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getHealthScoreColor, getHealthScoreLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const business = await db.business.findFirst({
    where: { userId: session.user.id },
    include: {
      analyses: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!business) {
    redirect("/onboarding");
  }

  const lastAnalysis = business.analyses[0];
  const healthScore = business.healthScore ?? null;
  const summary = lastAnalysis?.summary as {
    topRisk?: string;
    biggestOpportunity?: string;
    primaryAction?: string;
  } | null;

  const revenue = Number(business.monthlyRevenue);
  const expenses = Number(business.monthlyExpenses);
  const profit = revenue - expenses;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0";

  const kpiCards = [
    {
      label: "Monthly Revenue",
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(expenses),
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      label: "Net Profit",
      value: formatCurrency(profit),
      sub: `${margin}% margin`,
      icon: TrendingUp,
      color: profit >= 0 ? "text-emerald-400" : "text-rose-400",
      bg: profit >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20",
    },
    {
      label: "Avg. Order Value",
      value: business.averageOrderValue ? formatCurrency(Number(business.averageOrderValue)) : "—",
      icon: ShoppingCart,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Acquisition Cost",
      value: business.customerAcquisitionCost
        ? formatCurrency(Number(business.customerAcquisitionCost))
        : "—",
      icon: Users,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Blended ROAS",
      value: business.returnOnAdSpend ? `${Number(business.returnOnAdSpend).toFixed(1)}x` : "—",
      icon: BarChart3,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{business.name}</h1>
            <Badge variant="primary">{business.industry ?? "E-Commerce"}</Badge>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Institutional Intelligence Platform · {business.businessType}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/diagnose">
            <Button variant="gradient" className="gap-2 shadow-lg shadow-orange-500/20">
              <Brain className="w-4 h-4" />
              Run 7-Agent Diagnosis
            </Button>
          </Link>
          <Link href="/dashboard/simulate">
            <Button variant="secondary" className="gap-2">
              <FlaskConical className="w-4 h-4" />
              Simulate Strategy
            </Button>
          </Link>
        </div>
      </div>

      {/* Health Score + Diagnostic Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Ring Widget */}
        <Card className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/80 border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all" />
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
            Store Health Index
          </p>

          {healthScore !== null ? (
            <>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke={getHealthScoreColor(healthScore)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(healthScore / 100) * 314} 314`}
                    className="transition-all duration-1000"
                    style={{ filter: `drop-shadow(0 0 10px ${getHealthScoreColor(healthScore)}80)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{healthScore}</span>
                  <span className="text-xs text-zinc-400">/100</span>
                </div>
              </div>
              <p
                className="text-sm font-semibold mt-4"
                style={{ color: getHealthScoreColor(healthScore) }}
              >
                {getHealthScoreLabel(healthScore)}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                <Brain className="w-8 h-8 text-zinc-500" />
              </div>
              <p className="text-xs text-zinc-400">Run your first diagnosis to calculate health score</p>
              <Link href="/dashboard/diagnose">
                <Button size="sm" variant="gradient">Run Diagnosis</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Executive Diagnostic Brief */}
        <Card className="lg:col-span-2 bg-zinc-900/80 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Latest Executive Diagnostic Brief
              </CardTitle>
              {lastAnalysis && <Badge variant="success">Completed</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary ? (
              <>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">Chief Risk Identified</p>
                      <p className="text-sm text-zinc-200">{summary.topRisk}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Highest Leverage Opportunity</p>
                      <p className="text-sm text-zinc-200">{summary.biggestOpportunity}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">Recommended Immediate Action</p>
                      <p className="text-sm text-zinc-200">{summary.primaryAction}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Brain className="w-10 h-10 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400 max-w-md mb-4">
                  Run a diagnosis to inspect risks, opportunities, and AI-driven growth recommendations.
                </p>
                <Link href="/dashboard/diagnose">
                  <Button variant="gradient" size="sm" className="gap-2">
                    <Brain className="w-4 h-4" />
                    Start 7-Agent Diagnosis
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
          Unit Metrics & Operational KPIs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label} className="hover:border-orange-500/30 transition-all group">
              <CardContent className="p-5">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <p className="text-xs text-zinc-400 mb-1">{kpi.label}</p>
                <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                {kpi.sub && <p className="text-[11px] text-zinc-500 mt-1">{kpi.sub}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Action Workflows */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
          Interactive Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              href: "/dashboard/diagnose",
              icon: Brain,
              label: "Run 7-Agent Diagnosis",
              desc: "Parallel AI agent audit across store operations",
              glow: "border-orange-500/20 hover:border-orange-500/40",
              iconBg: "bg-orange-500/20 text-orange-400",
            },
            {
              href: "/dashboard/simulate",
              icon: FlaskConical,
              label: "Simulate Growth Strategy",
              desc: "Test strategic moves before committing capital",
              glow: "border-amber-500/20 hover:border-amber-500/40",
              iconBg: "bg-amber-500/20 text-amber-400",
            },
            {
              href: "/dashboard/report",
              icon: FileBarChart,
              label: "Generate CEO Brief",
              desc: "Synthesize findings into an exportable PDF report",
              glow: "border-emerald-500/20 hover:border-emerald-500/40",
              iconBg: "bg-emerald-500/20 text-emerald-400",
            },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className={`p-6 cursor-pointer hover:bg-zinc-900/90 transition-all ${action.glow} group hover:-translate-y-1`}>
                <div className={`w-11 h-11 rounded-xl ${action.iconBg} flex items-center justify-center mb-4`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
                  {action.label}
                </h3>
                <p className="text-xs text-zinc-400">{action.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
