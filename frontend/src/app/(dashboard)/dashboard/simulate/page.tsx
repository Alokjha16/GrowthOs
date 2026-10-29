"use client";

import { useState } from "react";
import {
  FlaskConical,
  ShoppingCart,
  Truck,
  RefreshCw,
  Package,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRESETS = [
  {
    id: "free-shipping",
    icon: ShoppingCart,
    label: "Free Shipping Threshold",
    description: "Set free shipping on orders $75+",
    prompt: "Implement a free shipping threshold at $75+ to increase average order value",
  },
  {
    id: "3pl",
    icon: Truck,
    label: "3PL Fulfillment Migration",
    description: "Move from self-fulfillment to 3PL",
    prompt: "Migrate from self-fulfillment to a third-party logistics (3PL) provider",
  },
  {
    id: "subscription",
    icon: RefreshCw,
    label: "Subscribe & Save Model",
    description: "Launch subscription / auto-replenish",
    prompt: "Introduce a Subscribe & Save subscription model with 15% discount for subscribers",
  },
  {
    id: "bundling",
    icon: Package,
    label: "AOV Bundling",
    description: "Introduce product bundle offers",
    prompt: "Create curated product bundles to increase average order value by 30%+",
  },
  {
    id: "cac-reduction",
    icon: TrendingDown,
    label: "CAC Reduction Campaign",
    description: "Strategies to cut acquisition cost",
    prompt: "Launch a CAC reduction initiative — focus on organic channels, referrals, and improved ROAS",
  },
  {
    id: "cart-recovery",
    icon: AlertCircle,
    label: "Cart Recovery Optimization",
    description: "Recover abandoned carts at scale",
    prompt: "Implement a comprehensive cart abandonment recovery system with SMS, retargeting, and exit-intent offers",
  },
];

interface SimResult {
  decision: string;
  shortTermOutcome: { revenueChange: string; description: string };
  longTermOutcome: { revenueChange: string; description: string };
  risks: string[];
  opportunities: string[];
  confidenceScore: number;
}

export default function SimulatePage() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customStrategy, setCustomStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState("");

  const runSimulation = async (strategy: string) => {
    setError("");
    setLoading(true);
    setResult(null);

    const bizRes = await fetch("/api/business");
    const bizData = await bizRes.json();
    const business = bizData.businesses?.[0];

    if (!business) {
      setError("No business profile found. Please complete onboarding first.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, strategy }),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Simulation failed");
      return;
    }

    const data = await res.json();
    setResult(data);
  };

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setCustomStrategy("");
    runSimulation(preset.prompt);
  };

  const handleCustom = () => {
    if (!customStrategy.trim()) return;
    setSelectedPreset(null);
    runSimulation(customStrategy);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="pb-3 border-b border-[rgba(255,255,255,0.06)]">
        <h1 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">Strategy Simulator</h1>
        <p className="text-[12px] text-[#8A8A8A]">
          Stress-test strategic growth moves against current business context before capital deployment.
        </p>
      </div>

      {/* Preset Strategy Cards */}
      <div>
        <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-3">
          Preset Strategic Moves
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id && loading;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => handlePreset(preset)}
                disabled={loading}
                className={`text-left p-3.5 rounded-[6px] border border-[rgba(255,255,255,0.07)] bg-[#141517] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.12)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${
                  isSelected ? "border-[#5E6AD2]/50 bg-[#5E6AD2]/5" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-6 rounded-[4px] bg-[#1C1D1F] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    {isSelected ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#5E6AD2] animate-spin" />
                    ) : (
                      <preset.icon className="w-3.5 h-3.5 text-[#5E6AD2]" />
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#4E4E4E] group-hover:text-[#8A8A8A] transition-colors" />
                </div>
                <h3 className="text-[13px] font-medium text-[#F1F1F1] mb-0.5">
                  {preset.label}
                </h3>
                <p className="text-[11px] text-[#8A8A8A] line-clamp-2">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Prompt Box */}
      <div>
        <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider mb-3">
          Custom Hypothesis
        </h2>
        <Card>
          <CardContent className="p-3">
            <div className="flex gap-2">
              <input
                id="custom-strategy-input"
                type="text"
                placeholder="Describe a custom move... e.g. 'Launch a wholesale B2B channel targeting salon distributors'"
                value={customStrategy}
                onChange={(e) => setCustomStrategy(e.target.value)}
                className="flex-1 h-8 rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#1C1D1F] px-3 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none focus:border-[#5E6AD2]"
              />
              <Button
                id="run-custom-simulation-btn"
                onClick={handleCustom}
                disabled={loading || !customStrategy.trim()}
                loading={loading && !selectedPreset}
                size="sm"
                className="gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Simulate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Running Loader */}
      {loading && (
        <Card className="p-6 text-center">
          <Loader2 className="w-5 h-5 text-[#5E6AD2] animate-spin mx-auto mb-2" />
          <p className="text-[13px] font-medium text-[#F1F1F1]">Calculating Scenario Outcome...</p>
          <p className="text-[11px] text-[#8A8A8A] mt-0.5">Llama 3.3 modeling short-term dip & long-term ROAS trajectory</p>
        </Card>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-medium text-[#4E4E4E] uppercase tracking-wider">
              Simulation Results
            </h2>
            <Badge variant="primary">Confidence Score: {result.confidenceScore}%</Badge>
          </div>

          <Card className="border-[#5E6AD2]/30 bg-[#5E6AD2]/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5">
                <FlaskConical className="w-4 h-4 text-[#5E6AD2] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold text-[#8E96EA] uppercase tracking-wider mb-0.5">Hypothesis Tested</p>
                  <p className="text-[13px] text-[#F1F1F1] font-medium">{result.decision}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcome Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-[rgba(244,196,48,0.2)]">
              <CardContent className="p-4">
                <p className="text-[10px] font-semibold text-[#F4C430] uppercase tracking-wider mb-1">
                  Short-Term (30–90 Days)
                </p>
                <p className="text-[20px] font-semibold text-[#F1F1F1] tracking-tight mb-1">
                  {result.shortTermOutcome.revenueChange}
                </p>
                <p className="text-[12px] text-[#8A8A8A] leading-relaxed">{result.shortTermOutcome.description}</p>
              </CardContent>
            </Card>

            <Card className="border-[rgba(76,175,80,0.2)]">
              <CardContent className="p-4">
                <p className="text-[10px] font-semibold text-[#4CAF50] uppercase tracking-wider mb-1">
                  Long-Term (6–18 Months)
                </p>
                <p className="text-[20px] font-semibold text-[#F1F1F1] tracking-tight mb-1">
                  {result.longTermOutcome.revenueChange}
                </p>
                <p className="text-[12px] text-[#8A8A8A] leading-relaxed">{result.longTermOutcome.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Risk & Upside Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.risks.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-[10px] font-semibold text-[#EB5757] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Downside Risks
                  </h3>
                  <ul className="space-y-1.5">
                    {result.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-[#8A8A8A]">
                        <span className="w-1 h-1 rounded-full bg-[#EB5757] flex-shrink-0 mt-1.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.opportunities.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-[10px] font-semibold text-[#4CAF50] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Potential Opportunities
                  </h3>
                  <ul className="space-y-1.5">
                    {result.opportunities.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-[#8A8A8A]">
                        <CheckCircle className="w-3 h-3 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="px-3 py-2 rounded-[4px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.2)] text-[12px] text-[#EB5757] flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
