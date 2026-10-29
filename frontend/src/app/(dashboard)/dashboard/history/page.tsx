"use client";

import { useEffect, useState } from "react";
import {
  History,
  Brain,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHealthScoreColor, getHealthScoreLabel, timeAgo } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalysisRecord {
  id: string;
  healthScore: number | null;
  summary: { topRisk?: string; biggestOpportunity?: string } | null;
  createdAt: string;
  status: string;
}

interface SimulationRecord {
  id: string;
  strategy: string;
  confidenceScore: number | null;
  shortTermOutcome: { revenueChange: string; description: string } | null;
  longTermOutcome: { revenueChange: string; description: string } | null;
  createdAt: string;
}

interface SnapshotRecord {
  id: string;
  revenue: number;
  expenses: number;
  customers: number;
  repeatRate: number;
  healthScore: number | null;
  averageOrderValue: number | null;
  customerAcquisitionCost: number | null;
  createdAt: string;
}

interface HistoryData {
  analyses: AnalysisRecord[];
  simulations: SimulationRecord[];
  snapshots: SnapshotRecord[];
}

function DeltaBadge({ current, previous, suffix = "" }: { current: number; previous: number; suffix?: string }) {
  const delta = current - previous;
  const pct = previous > 0 ? ((delta / previous) * 100).toFixed(1) : "0";
  if (delta > 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#4CAF50]">
      <TrendingUp className="w-3 h-3" />+{pct}%{suffix}
    </span>
  );
  if (delta < 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#EB5757]">
      <TrendingDown className="w-3 h-3" />{pct}%{suffix}
    </span>
  );
  return <span className="inline-flex items-center gap-0.5 text-[11px] text-[#4E4E4E]"><Minus className="w-3 h-3" />—</span>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1D1F] border border-[rgba(255,255,255,0.08)] rounded-[4px] px-2.5 py-1.5 text-[11px]">
        <p className="text-[#8A8A8A] mb-0.5">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}/100 Health Score</p>
      </div>
    );
  }
  return null;
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load history");
        setLoading(false);
      });
  }, []);

  const chartData = data?.snapshots.map((s, i) => ({
    name: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.healthScore ?? 0,
    revenue: Math.round(Number(s.revenue) / 1000),
    index: i,
  }));

  const analyses = data?.analyses ?? [];
  const simulations = data?.simulations ?? [];

  const latestTwo = analyses.slice(0, 2);
  const prevAnalysis = latestTwo[1];
  const currentAnalysis = latestTwo[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-5 h-5 text-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 rounded-[4px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.2)] text-[12px] text-[#EB5757] flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[rgba(255,255,255,0.06)]">
        <h1 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">Historical Snapshots & Logs</h1>
        <p className="text-[12px] text-[#8A8A8A]">
          Track store diagnostic score evolution and audit historical simulation scenario runs.
        </p>
      </div>

      {/* Health Trend Chart */}
      {chartData && chartData.length > 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Health Score Trajectory</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8A8A8A", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#8A8A8A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#5E6AD2"
                  strokeWidth={2}
                  dot={{ fill: "#5E6AD2", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#8E96EA" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-6 text-center border-dashed border-[rgba(255,255,255,0.1)]">
          <Brain className="w-6 h-6 text-[#4E4E4E] mx-auto mb-2" />
          <p className="text-[12px] text-[#8A8A8A]">
            Execute 2+ diagnoses to render your historical health trajectory chart.
          </p>
        </Card>
      )}

      {/* Delta Metrics */}
      {currentAnalysis && prevAnalysis && (
        <div>
          <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-3">
            Latest vs. Previous Run Comparison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3.5">
                <p className="text-[11px] text-[#8A8A8A] mb-1">Health Score Delta</p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[20px] font-semibold tracking-tight"
                    style={{ color: getHealthScoreColor(currentAnalysis.healthScore ?? 0) }}
                  >
                    {currentAnalysis.healthScore ?? "—"}
                  </span>
                  {prevAnalysis.healthScore != null && currentAnalysis.healthScore != null && (
                    <DeltaBadge
                      current={currentAnalysis.healthScore}
                      previous={prevAnalysis.healthScore}
                    />
                  )}
                </div>
                <p className="text-[10px] text-[#4E4E4E] mt-0.5">
                  {getHealthScoreLabel(currentAnalysis.healthScore ?? 0)}
                </p>
              </CardContent>
            </Card>

            {data?.snapshots && data.snapshots.length >= 2 && (
              <>
                <Card>
                  <CardContent className="p-3.5">
                    <p className="text-[11px] text-[#8A8A8A] mb-1">Monthly Revenue</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-semibold text-[#F1F1F1] tracking-tight">
                        ${Math.round(Number(data.snapshots[data.snapshots.length - 1].revenue) / 1000)}K
                      </span>
                      <DeltaBadge
                        current={Number(data.snapshots[data.snapshots.length - 1].revenue)}
                        previous={Number(data.snapshots[data.snapshots.length - 2].revenue)}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3.5">
                    <p className="text-[11px] text-[#8A8A8A] mb-1">Monthly Customers</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-semibold text-[#F1F1F1] tracking-tight">
                        {data.snapshots[data.snapshots.length - 1].customers.toLocaleString()}
                      </span>
                      <DeltaBadge
                        current={data.snapshots[data.snapshots.length - 1].customers}
                        previous={data.snapshots[data.snapshots.length - 2].customers}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      {/* Diagnosis Audit Log */}
      <div>
        <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-3">
          Diagnostic Audit Log ({analyses.length})
        </h2>
        {analyses.length === 0 ? (
          <Card className="p-6 text-center border-dashed border-[rgba(255,255,255,0.1)]">
            <Brain className="w-6 h-6 text-[#4E4E4E] mx-auto mb-2" />
            <p className="text-[12px] text-[#8A8A8A]">No completed diagnoses logged yet.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {analyses.map((a, i) => {
              const summary = a.summary as { topRisk?: string; biggestOpportunity?: string } | null;
              return (
                <div
                  key={a.id}
                  className="p-3 rounded-[6px] border border-[rgba(255,255,255,0.07)] bg-[#141517] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-7 h-7 rounded-[4px] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{ color: getHealthScoreColor(a.healthScore ?? 0) }}
                    >
                      {a.healthScore ?? "—"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-medium text-[#F1F1F1]">Diagnosis Run #{analyses.length - i}</span>
                        {i === 0 && <Badge variant="primary">Latest</Badge>}
                        <span className="text-[11px] text-[#4E4E4E] flex items-center gap-1">
                          <History className="w-3 h-3" />
                          {timeAgo(a.createdAt)}
                        </span>
                      </div>
                      {summary?.topRisk && (
                        <p className="text-[11px] text-[#8A8A8A] truncate">
                          <span className="text-[#EB5757]">Risk: </span>{summary.topRisk}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulation Audit Log */}
      {simulations.length > 0 && (
        <div>
          <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-3">
            Simulation Log ({simulations.length})
          </h2>
          <div className="space-y-2">
            {simulations.map((s) => {
              const short = s.shortTermOutcome as { revenueChange: string } | null;
              const long = s.longTermOutcome as { revenueChange: string } | null;
              return (
                <div
                  key={s.id}
                  className="p-3 rounded-[6px] border border-[rgba(255,255,255,0.07)] bg-[#141517] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-[4px] bg-[#1C1D1F] border border-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-3.5 h-3.5 text-[#5E6AD2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-[#F1F1F1] truncate">
                        {s.strategy}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#8A8A8A]">
                        {short && <span className="text-[#F4C430]">Short: {short.revenueChange}</span>}
                        {long && <span className="text-[#4CAF50]">Long: {long.revenueChange}</span>}
                        <span className="text-[#4E4E4E]">Confidence {s.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#4E4E4E] flex-shrink-0">{timeAgo(s.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
