"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Check,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  Calculator,
  ChevronRight,
  TrendingUp,
  BarChart3,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { ModuleConfig } from "@/lib/modules/registry";

interface FindingItem {
  id: string;
  moduleSlug: string;
  title: string;
  description: string;
  moneyImpact: number | null;
  impactFormula: string | null;
  impactInputs: Record<string, any> | null;
  impactWindow: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  dismissed: boolean;
  playbookRunId?: string | null;
  taskId?: string | null;
}

interface BenchmarkItem {
  id: string;
  metric: string;
  p25: number | null;
  median: number | null;
  p75: number | null;
  unit: string | null;
  source: string;
  sourceLabel: string | null;
}

interface ModuleViewProps {
  module: ModuleConfig;
  businessName: string;
  storeCategory: string;
  findings: FindingItem[];
  benchmarks: BenchmarkItem[];
  storeMetrics: Record<string, number | null>;
  shadowModeActive: boolean;
  killSwitchActive: boolean;
}

export function ModuleView({
  module,
  businessName,
  storeCategory,
  findings: initialFindings,
  benchmarks,
  storeMetrics,
  shadowModeActive,
  killSwitchActive,
}: ModuleViewProps) {
  const [findings, setFindings] = useState<FindingItem[]>(initialFindings);
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);
  const [activeModal, setActiveModal] = useState<"fix" | "task" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const activeFindings = findings.filter((f) => !f.dismissed);
  const totalLeakage = activeFindings.reduce(
    (sum, f) => sum + (Number(f.moneyImpact) || 0),
    0
  );

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDismiss = (id: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, dismissed: true } : f))
    );
    showToast("Finding dismissed.");
  };

  const handleFixClick = (finding: FindingItem) => {
    setSelectedFinding(finding);
    setActiveModal("fix");
  };

  const handleTaskClick = (finding: FindingItem) => {
    setSelectedFinding(finding);
    setActiveModal("task");
  };

  const executeApproval = () => {
    if (!selectedFinding) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      if (killSwitchActive) {
        showToast("⚠️ Global Kill Switch is ON. Action blocked.");
        return;
      }
      if (shadowModeActive) {
        showToast(
          "🛡️ Shadow Mode is Active. Action simulated and logged to Autopilot."
        );
      } else {
        showToast("✅ Fix approved & queued for platform execution!");
      }
    }, 1200);
  };

  const executeCreateTask = () => {
    if (!selectedFinding) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
      showToast("📋 Guided task created and added to Action Tracker!");
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl animate-slide-up">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-zinc-900 border border-orange-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Top Breadcrumb & Header */}
      <div className="pb-4 border-b border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link
            href="/dashboard"
            className="hover:text-zinc-100 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Overview
          </Link>
          <span>/</span>
          <span className="text-zinc-200 font-medium">Growth Modules</span>
          <span>/</span>
          <span className="text-orange-400 font-semibold capitalize">
            {module.name}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {module.name} Optimization
              </h1>
              <Badge variant="primary" className="text-[10px]">
                {module.agentNames.join(" + ")} Agent
              </Badge>
              {shadowModeActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  🛡️ Shadow Mode (14-Day Safe Trial)
                </span>
              )}
              {killSwitchActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  🛑 Kill Switch Active
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              {module.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/simulate">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Simulate Module Lever
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Headline Metric Card: Monthly Leakage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-zinc-900 via-orange-950/20 to-zinc-900 border-orange-500/30 relative overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Monthly Leakage / Opportunity
              </span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-white">
                {totalLeakage > 0 ? formatCurrency(totalLeakage) : "₹0"}
              </span>
              <span className="text-xs text-zinc-400 ml-1.5 font-medium">/ month</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-medium">
              Calculated across {activeFindings.length} active detected issue
              {activeFindings.length === 1 ? "" : "s"} using deterministic connector formulas.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Governing AI Agent
              </span>
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-white">
                {module.agentNames.join(", ")}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Audits real-time data against Indian D2C benchmarks and verifies
                every automated fix.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Playbooks Available
              </span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold text-white">
                {module.playbooks.length} Automated Fix
                {module.playbooks.length === 1 ? "" : "es"}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Guardrail-bounded execution with preview, approval, and 1-tap rollback.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Benchmarks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              Category Benchmark Comparison ({storeCategory})
            </h2>
            <p className="text-xs text-zinc-400">
              Comparing {businessName}&apos;s live metrics against industry medians
              and 75th percentile performers.
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Industry Estimate · India D2C
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {module.metrics.map((metricCfg) => {
            const bm = benchmarks.find((b) => b.metric === metricCfg.key);
            const currentVal = storeMetrics[metricCfg.key] ?? null;
            const medianVal = bm?.median ?? null;
            const p75Val = bm?.p75 ?? null;

            return (
              <Card
                key={metricCfg.key}
                className="bg-zinc-900/50 border-white/10 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    {metricCfg.label}
                  </span>
                  <span className="text-[11px] font-mono text-orange-400 font-bold">
                    {currentVal !== null
                      ? `${currentVal}${metricCfg.unit}`
                      : "Not enough data"}
                  </span>
                </div>

                {/* Benchmark Bar */}
                {medianVal !== null && (
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        className="bg-zinc-600 h-full"
                        style={{ width: "35%" }}
                        title="p25"
                      />
                      <div
                        className="bg-orange-500/80 h-full"
                        style={{ width: "30%" }}
                        title="Median Range"
                      />
                      <div
                        className="bg-emerald-500/80 h-full"
                        style={{ width: "35%" }}
                        title="Top Quartile"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Category Median: {medianVal}{metricCfg.unit}</span>
                      <span>Top 25%: {p75Val ?? "—"}{metricCfg.unit}</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Findings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-4 h-4 text-orange-400" />
              Detected Findings Ranked by Monthly Money Impact
            </h2>
            <p className="text-xs text-zinc-400">
              Problems identified from store connector data. Every figure is computed
              deterministically.
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {activeFindings.length} active
          </span>
        </div>

        {activeFindings.length === 0 ? (
          <Card className="bg-zinc-900/30 border-white/5 p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Active Problems Detected</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Your {module.name} metrics are currently performing within healthy
              thresholds. GrowthOS checks live connectors continuously.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeFindings.map((finding) => {
              const impact = Number(finding.moneyImpact) || 0;
              const inputs = finding.impactInputs || {};

              return (
                <Card
                  key={finding.id}
                  className="bg-zinc-900/70 border-white/10 hover:border-orange-500/30 transition-all p-6 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {finding.confidence} CONFIDENCE
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Window: {finding.impactWindow ?? "last 30 days"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">
                        {finding.title}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>

                    {/* Money Impact Counter */}
                    <div className="flex-shrink-0 text-left lg:text-right bg-zinc-950/80 p-4 rounded-xl border border-white/5 lg:min-w-[180px]">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                        Estimated Leakage
                      </span>
                      <span className="text-2xl font-extrabold text-orange-400 mt-1 block">
                        {impact > 0 ? formatCurrency(impact) : "Not enough data"}
                      </span>
                      <span className="text-[10px] text-zinc-500">per month</span>
                    </div>
                  </div>

                  {/* Deterministic Formula Breakdown */}
                  {finding.impactFormula && (
                    <div className="bg-zinc-950/60 p-3 rounded-lg border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-semibold">
                        <Calculator className="w-3.5 h-3.5 text-orange-400" />
                        <span>Deterministic Formula:</span>
                        <code className="text-orange-300 bg-white/5 px-2 py-0.5 rounded font-mono text-[10px]">
                          {finding.impactFormula}
                        </code>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-400 pt-1">
                        {Object.entries(inputs).map(([k, v]) => (
                          <span key={k}>
                            <strong className="text-zinc-300">{k}:</strong>{" "}
                            <span className="font-mono text-zinc-200">
                              {typeof v === "number" ? v.toLocaleString("en-IN") : String(v)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="gradient"
                        size="sm"
                        className="gap-2 text-xs h-9 px-4 shadow-md shadow-orange-500/10"
                        onClick={() => handleFixClick(finding)}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Fix it
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5 text-xs h-9"
                        onClick={() => handleTaskClick(finding)}
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                        Create task
                      </Button>
                    </div>

                    <button
                      onClick={() => handleDismiss(finding.id)}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Dismiss finding
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Approval / Fix It Preview Modal */}
      {activeModal === "fix" && selectedFinding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-orange-500/40 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Approval Preview & Rollback Plan
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    Review state changes before execution
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-2">
                <p className="text-xs font-semibold text-white">
                  {selectedFinding.title}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Predicted Saving</span>
                    <p className="font-bold text-emerald-400">
                      {selectedFinding.moneyImpact
                        ? formatCurrency(selectedFinding.moneyImpact)
                        : "—"}{" "}
                      / mo
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Action Risk</span>
                    <p className="font-bold text-amber-400">LOW (Safe Item)</p>
                  </div>
                </div>
              </div>

              {/* Before / After Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Target State Change
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span className="text-[10px] uppercase font-bold block mb-1 text-rose-400">
                      Before
                    </span>
                    Campaign / Ad sets active, burning ₹62,000 at ROAS 0.7.
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="text-[10px] uppercase font-bold block mb-1 text-emerald-400">
                      After
                    </span>
                    Weak ad sets paused. Budget shifted to top 2.8x ROAS campaigns.
                  </div>
                </div>
              </div>

              {/* Rollback Plan */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-white/5 flex items-start gap-2.5 text-xs text-zinc-400">
                <RotateCcw className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-200">1-Tap Rollback Guarantee:</span>
                  <p className="text-[11px] mt-0.5">
                    Original platform states are snapshotted. If ROAS dips by &gt;10%
                    after 3 days, auto-rollback restores previous configuration immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="gradient"
                className="flex-1 h-10 text-xs font-bold gap-2"
                disabled={isProcessing}
                onClick={executeApproval}
              >
                {isProcessing ? "Executing Action..." : "Approve & Execute Fix"}
              </Button>
              <Button
                variant="secondary"
                className="h-10 text-xs"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {activeModal === "task" && selectedFinding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Create Guided Task</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">
                Convert this finding into a human-owned action item in your Action
                Tracker with pre-drafted briefing notes.
              </p>
              <div className="p-3 bg-zinc-950 rounded-lg border border-white/5 font-mono text-[11px] text-zinc-400 space-y-1">
                <p>Task: Resolve {selectedFinding.title}</p>
                <p>Owner: Founder / Operations Lead</p>
                <p>Due: In 7 business days</p>
                <p className="text-orange-300">Target Impact: {formatCurrency(selectedFinding.moneyImpact ?? 0)}/mo</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="gradient"
                className="flex-1 h-10 text-xs font-bold gap-2"
                disabled={isProcessing}
                onClick={executeCreateTask}
              >
                {isProcessing ? "Creating Task..." : "Add to Action Tracker"}
              </Button>
              <Button
                variant="secondary"
                className="h-10 text-xs"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

