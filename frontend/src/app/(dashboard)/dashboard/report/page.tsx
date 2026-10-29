"use client";

import { useState } from "react";
import {
  FileBarChart,
  Download,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  Zap,
  Brain,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHealthScoreColor, getHealthScoreLabel } from "@/lib/utils";

interface ActionPlanItem {
  day: string;
  action: string;
  owner: string;
}

interface ReportData {
  reportId: string;
  title: string;
  healthScore: number;
  executiveSummary: string;
  chiefRisk: string;
  topOpportunity: string;
  immediateAction: string;
  actionPlan: ActionPlanItem[];
}

function ReportView({ report }: { report: ReportData }) {
  const scoreColor = getHealthScoreColor(report.healthScore);
  const scoreLabel = getHealthScoreLabel(report.healthScore);

  return (
    <div id="report-content" className="space-y-4">
      {/* Report Header Card */}
      <Card className="p-5 border-[rgba(255,255,255,0.08)] bg-[#141517]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-[4px] bg-[#5E6AD2] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] font-medium text-[#8E96EA] uppercase tracking-wider">
                GrowthOS Strategic Synthesis
              </span>
            </div>
            <h2 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">{report.title}</h2>
            <p className="text-[11px] text-[#4E4E4E] mt-0.5">
              Synthesized {new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 mx-auto"
              style={{ borderColor: scoreColor }}
            >
              <div>
                <div className="text-[16px] font-semibold text-white">{report.healthScore}</div>
                <div className="text-[9px] text-[#8A8A8A]">/100</div>
              </div>
            </div>
            <p className="text-[11px] font-medium mt-1" style={{ color: scoreColor }}>
              {scoreLabel}
            </p>
          </div>
        </div>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-[10px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileBarChart className="w-3 h-3 text-[#5E6AD2]" /> Executive Summary
          </h3>
          <p className="text-[13px] text-[#F1F1F1] leading-relaxed">{report.executiveSummary}</p>
        </CardContent>
      </Card>

      {/* Core Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-[rgba(235,87,87,0.2)] bg-[rgba(235,87,87,0.03)]">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EB5757]" />
              <p className="text-[10px] font-semibold text-[#EB5757] uppercase tracking-wider">Chief Risk</p>
            </div>
            <p className="text-[12px] text-[#8A8A8A] leading-relaxed">{report.chiefRisk}</p>
          </CardContent>
        </Card>

        <Card className="border-[rgba(76,175,80,0.2)] bg-[rgba(76,175,80,0.03)]">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#4CAF50]" />
              <p className="text-[10px] font-semibold text-[#4CAF50] uppercase tracking-wider">Top Opportunity</p>
            </div>
            <p className="text-[12px] text-[#8A8A8A] leading-relaxed">{report.topOpportunity}</p>
          </CardContent>
        </Card>

        <Card className="border-[rgba(94,106,210,0.2)] bg-[rgba(94,106,210,0.03)]">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="w-3.5 h-3.5 text-[#5E6AD2]" />
              <p className="text-[10px] font-semibold text-[#8E96EA] uppercase tracking-wider">Immediate Action</p>
            </div>
            <p className="text-[12px] text-[#8A8A8A] leading-relaxed">{report.immediateAction}</p>
          </CardContent>
        </Card>
      </div>

      {/* 30-Day Execution Roadmap */}
      {report.actionPlan && report.actionPlan.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-[10px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#5E6AD2]" /> 30-Day Tactical Execution Plan
            </h3>
            <div className="space-y-2">
              {report.actionPlan.map((item: ActionPlanItem, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-[4px] bg-[#101113] border border-[rgba(255,255,255,0.05)]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#5E6AD2]/15 flex items-center justify-center text-[10px] font-bold text-[#8E96EA] flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-medium text-[#8E96EA] bg-[#5E6AD2]/10 px-1.5 py-0.5 rounded-[3px]">
                        {item.day}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[#4E4E4E]">
                        <User className="w-3 h-3" />
                        {item.owner}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#F1F1F1] truncate">{item.action}</p>
                  </div>
                  <CheckCircle className="w-3.5 h-3.5 text-[#4E4E4E] hover:text-[#4CAF50] cursor-pointer transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  const generateReport = async () => {
    setError("");
    setLoading(true);
    setReport(null);

    const bizRes = await fetch("/api/business");
    const bizData = await bizRes.json();
    const business = bizData.businesses?.[0];

    if (!business) {
      setError("No business profile found. Complete onboarding first.");
      setLoading(false);
      return;
    }

    const histRes = await fetch("/api/history");
    const histData = await histRes.json();
    const latestAnalysis = histData.analyses?.[0];

    if (!latestAnalysis) {
      setError("No diagnosis found. Please run the AI Diagnosis first.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId: business.id,
        analysisId: latestAnalysis.id,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Report generation failed");
      return;
    }

    const data = await res.json();
    setReport(data);
  };

  const exportPDF = async () => {
    if (!report) return;
    setPdfLoading(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const element = document.getElementById("report-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: "#0F1011",
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`GrowthOS-Executive-Brief-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)] flex-wrap gap-3">
        <div>
          <h1 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">CEO Executive Brief</h1>
          <p className="text-[12px] text-[#8A8A8A]">
            Institutional strategic report synthesized from 7-agent operational diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {report && (
            <Button
              id="export-pdf-btn"
              variant="secondary"
              size="sm"
              onClick={exportPDF}
              loading={pdfLoading}
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </Button>
          )}
          <Button
            id="generate-report-btn"
            size="sm"
            onClick={generateReport}
            loading={loading}
            className="gap-1.5"
          >
            <FileBarChart className="w-3.5 h-3.5" />
            {report ? "Regenerate Brief" : "Synthesize Brief"}
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <Card className="p-8 text-center">
          <Loader2 className="w-5 h-5 text-[#5E6AD2] animate-spin mx-auto mb-2" />
          <p className="text-[13px] font-medium text-[#F1F1F1]">Synthesizing CEO Executive Brief...</p>
          <p className="text-[11px] text-[#8A8A8A] mt-0.5">
            Llama 3.3 organizing key risks, high-leverage opportunities, and 30-day action plan
          </p>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !report && !error && (
        <Card className="p-8 text-center border-dashed border-[rgba(255,255,255,0.1)]">
          <div className="w-10 h-10 rounded-[6px] bg-[rgba(94,106,210,0.12)] border border-[rgba(94,106,210,0.2)] flex items-center justify-center mx-auto mb-4">
            <FileBarChart className="w-5 h-5 text-[#5E6AD2]" />
          </div>
          <h2 className="text-[14px] font-semibold text-[#F1F1F1] mb-1">No Brief Synthesized Yet</h2>
          <p className="text-[12px] text-[#8A8A8A] max-w-sm mx-auto mb-5">
            Synthesize all 7 agent diagnostics into a single executive briefing with actionable milestones.
          </p>
          <p className="text-[11px] text-[#4E4E4E]">
            <Brain className="w-3 h-3 inline mr-1" />
            Requires a completed 7-Agent Diagnosis first
          </p>
        </Card>
      )}

      {/* Report view */}
      {report && !loading && <ReportView report={report} />}

      {/* Error display */}
      {error && (
        <div className="px-3 py-2 rounded-[4px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.2)] text-[12px] text-[#EB5757] flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
