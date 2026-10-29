"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap,
  Plug,
  RefreshCw,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

// ─── Constants ───────────────────────────────────────────────────────────────

const MARKETING_CHANNELS = [
  "INSTAGRAM", "FACEBOOK", "WHATSAPP", "GOOGLE_ADS",
  "YOUTUBE", "MEESHO_ADS", "FLIPKART_ADS", "EMAIL", "SEO", "INFLUENCER",
];

const steps = [
  { id: 0, label: "Connect", icon: Plug },
  { id: 1, label: "Store Basics", icon: Store },
  { id: 2, label: "Financials", icon: DollarSign },
  { id: 3, label: "Metrics", icon: ShoppingCart },
];

// ─── Platform Definitions ─────────────────────────────────────────────────────

type Platform = "shopify" | "woocommerce" | "shiprocket" | "razorpay" | "meta";

const PLATFORMS: {
  id: Platform;
  name: string;
  description: string;
  color: string;
  fields: string[];
  logo: string;
}[] = [
  {
    id: "shopify",
    name: "Shopify India",
    description: "Revenue, orders, AOV, fulfillment & repeat rate",
    color: "#96BF48",
    fields: ["Revenue", "Expenses", "Orders", "AOV", "Repeat Rate"],
    logo: "S",
  },
  {
    id: "shiprocket",
    name: "Shiprocket",
    description: "COD rate, RTO rate, shipping cost & courier sync",
    color: "#7F54B3",
    fields: ["COD Rate", "RTO Rate", "Fulfillment", "Return %"],
    logo: "SR",
  },
  {
    id: "razorpay",
    name: "Razorpay / Magic",
    description: "Prepaid %, revenue, refund rate & checkout conversions",
    color: "#0C2340",
    fields: ["Prepaid %", "Revenue", "COD vs Prepaid"],
    logo: "RZP",
  },
  {
    id: "meta",
    name: "Meta & Google Ads",
    description: "ROAS, CAC & acquisition channel performance",
    color: "#0082FB",
    fields: ["ROAS", "CAC", "Ad Channels"],
    logo: "M",
  },
];

// ─── Simulated Import Data ────────────────────────────────────────────────────

type FormData = {
  name: string;
  industry: string;
  website: string;
  description: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  customersPerMonth: string;
  repeatCustomerPercentage: string;
  pricingLevel: string;
  averageOrderValue: string;
  customerAcquisitionCost: string;
  returnOnAdSpend: string;
  cartAbandonmentRate: string;
  fulfillmentMethod: string;
  codRate: string;
  rtoRate: string;
  prepaidPercentage: string;
  marketingChannels: string[];
};

type ImportedFields = Partial<Record<keyof FormData, boolean>>;

function simulateImport(platform: Platform): Partial<FormData> {
  const profiles: Record<Platform, Partial<FormData>> = {
    shopify: {
      monthlyRevenue: "1840000",
      monthlyExpenses: "1120000",
      customersPerMonth: "1470",
      repeatCustomerPercentage: "28",
      averageOrderValue: "1250",
      fulfillmentMethod: "THREE_PL",
      marketingChannels: ["INSTAGRAM", "FACEBOOK", "WHATSAPP"],
      pricingLevel: "MEDIUM",
    },
    shiprocket: {
      codRate: "62",
      rtoRate: "22",
      fulfillmentMethod: "THREE_PL",
    },
    razorpay: {
      prepaidPercentage: "38",
      monthlyRevenue: "1840000",
    },
    woocommerce: {
      monthlyRevenue: "850000",
      monthlyExpenses: "520000",
      customersPerMonth: "720",
      repeatCustomerPercentage: "22",
      averageOrderValue: "1180",
      marketingChannels: ["SEO", "GOOGLE_ADS", "WHATSAPP"],
    },
    meta: {
      returnOnAdSpend: "2.4",
      customerAcquisitionCost: "380",
      marketingChannels: ["INSTAGRAM", "FACEBOOK", "GOOGLE_ADS"],
    },
  };
  return profiles[platform];
}

// ─── Component ────────────────────────────────────────────────────────────────

const initialForm: FormData = {
  name: "",
  industry: "",
  website: "",
  description: "",
  monthlyRevenue: "",
  monthlyExpenses: "",
  customersPerMonth: "",
  repeatCustomerPercentage: "",
  pricingLevel: "MEDIUM",
  averageOrderValue: "",
  customerAcquisitionCost: "",
  returnOnAdSpend: "",
  cartAbandonmentRate: "",
  fulfillmentMethod: "",
  codRate: "",
  rtoRate: "",
  prepaidPercentage: "",
  marketingChannels: [],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [importedFields, setImportedFields] = useState<ImportedFields>({});
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [connecting, setConnecting] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // If user manually edits a field, remove the "imported" badge
    setImportedFields((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const toggleChannel = (channel: string) => {
    setForm((prev) => ({
      ...prev,
      marketingChannels: prev.marketingChannels.includes(channel)
        ? prev.marketingChannels.filter((c) => c !== channel)
        : [...prev.marketingChannels, channel],
    }));
  };

  const handleConnect = async (platform: Platform) => {
    if (connectedPlatforms.includes(platform)) return;
    setConnecting(platform);
    await new Promise((r) => setTimeout(r, 1800)); // simulate OAuth + fetch

    const imported = simulateImport(platform);
    const newImportedFields: ImportedFields = {};

    setForm((prev) => {
      const next = { ...prev };
      for (const [key, val] of Object.entries(imported)) {
        const k = key as keyof FormData;
        if (val !== undefined) {
          if (Array.isArray(val) && Array.isArray(next[k])) {
            // Merge channels without duplicates
            const merged = Array.from(new Set([...(next[k] as string[]), ...(val as string[])]));
            (next as Record<string, unknown>)[k] = merged;
          } else if (!next[k]) {
            // Only fill empty fields
            (next as Record<string, unknown>)[k] = val;
          }
          newImportedFields[k] = true;
        }
      }
      return next;
    });

    setImportedFields((prev) => ({ ...prev, ...newImportedFields }));
    setConnectedPlatforms((prev) => [...prev, platform]);
    setConnecting(null);
  };

  const next = () => {
    setError("");
    if (step === 1 && !form.name.trim()) {
      setError("Store name is required.");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, businessType: "ECOMMERCE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save business");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── Sub-components ────────────────────────────────────────────────────────

  const ImportedBadge = () => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-[#4CAF50]/10 border border-[#4CAF50]/25 text-[#4CAF50] text-[10px] font-medium leading-none">
      <CheckCircle className="w-2.5 h-2.5" /> Imported
    </span>
  );

  const FieldLabel = ({
    htmlFor,
    label,
    fieldKey,
    optional,
  }: {
    htmlFor: string;
    label: string;
    fieldKey?: keyof FormData;
    optional?: boolean;
  }) => (
    <div className="flex items-center gap-2 mb-1">
      <label htmlFor={htmlFor} className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider">
        {label}
      </label>
      {fieldKey && importedFields[fieldKey] && <ImportedBadge />}
      {optional && !importedFields[fieldKey as keyof FormData] && (
        <span className="text-[10px] text-[#4E4E4E]">optional</span>
      )}
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  const importCount = Object.values(importedFields).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0F1011] text-[#F1F1F1] flex flex-col">
      {/* Header */}
      <header className="border-b border-[rgba(255,255,255,0.06)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] bg-[#5E6AD2] flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight">GrowthOS Setup</span>
        </div>
        <div className="flex items-center gap-3">
          {importCount > 0 && (
            <span className="text-[11px] text-[#4CAF50] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {importCount} fields imported
            </span>
          )}
          <span className="text-[11px] text-[#4E4E4E]">Step {step} of 3</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl space-y-6">

          {/* Steps Indicator */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[11px] font-semibold transition-colors ${
                    step > s.id
                      ? "bg-[#4CAF50] text-white"
                      : step === s.id
                      ? "bg-[#5E6AD2] text-white"
                      : "bg-[#1C1D1F] text-[#4E4E4E] border border-[rgba(255,255,255,0.08)]"
                  }`}
                >
                  {step > s.id ? <CheckCircle className="w-3 h-3" /> : s.id === 0 ? <Plug className="w-3 h-3" /> : s.id}
                </div>
                <span className={`text-[12px] font-medium ${step >= s.id ? "text-[#F1F1F1]" : "text-[#4E4E4E]"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#2E2E2E] ml-1" />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="border border-[rgba(255,255,255,0.07)] rounded-[6px] bg-[#141517] p-6 space-y-4">
            <div>
              <h1 className="text-[15px] font-semibold text-[#F1F1F1] tracking-tight">
                {step === 0 && "Connect Your Platforms"}
                {step === 1 && "Store Identification"}
                {step === 2 && "Financial Profile"}
                {step === 3 && "E-Commerce Operational Metrics"}
              </h1>
              <p className="text-[12px] text-[#8A8A8A]">
                {step === 0 && "Connect your existing tools and GrowthOS will auto-fill your data. Skip if you prefer to enter manually."}
                {step === 1 && "Basic information used by the 7 AI agents to frame operational context."}
                {step === 2 && "Monthly aggregate financials for unit economic calculation. All fields optional."}
                {step === 3 && "Key performance indicators powering AI diagnostics. All fields optional."}
              </p>
            </div>

            {/* ── Step 0: Connect Platforms ── */}
            {step === 0 && (
              <div className="space-y-2">
                {PLATFORMS.map((p) => {
                  const isConnected = connectedPlatforms.includes(p.id);
                  const isConnecting = connecting === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-[5px] border transition-all ${
                        isConnected
                          ? "border-[#4CAF50]/30 bg-[#4CAF50]/5"
                          : "border-[rgba(255,255,255,0.07)] bg-[#1C1D1F] hover:border-[rgba(255,255,255,0.12)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Platform logo pill */}
                        <div
                          className="w-8 h-8 rounded-[5px] flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: p.color + "22", border: `1px solid ${p.color}44`, color: p.color }}
                        >
                          {p.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-[#F1F1F1]">{p.name}</span>
                            {isConnected && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-[#4CAF50]/10 border border-[#4CAF50]/25 text-[#4CAF50] text-[10px] font-medium">
                                <CheckCircle className="w-2.5 h-2.5" /> Connected
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#4E4E4E] mt-0.5">{p.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.fields.map((f) => (
                              <span key={f} className="px-1.5 py-0.5 rounded-[3px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[10px] text-[#8A8A8A]">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConnect(p.id)}
                        disabled={isConnected || isConnecting}
                        className={`flex-shrink-0 ml-3 px-3 py-1.5 rounded-[4px] text-[11px] font-medium border transition-all flex items-center gap-1.5 ${
                          isConnected
                            ? "border-[#4CAF50]/30 text-[#4CAF50] bg-transparent cursor-default"
                            : isConnecting
                            ? "border-[rgba(255,255,255,0.08)] text-[#8A8A8A] bg-transparent cursor-wait"
                            : "border-[rgba(255,255,255,0.1)] text-[#F1F1F1] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)]"
                        }`}
                      >
                        {isConnecting ? (
                          <><RefreshCw className="w-3 h-3 animate-spin" /> Importing…</>
                        ) : isConnected ? (
                          <><CheckCircle className="w-3 h-3" /> Done</>
                        ) : (
                          <>Connect</>
                        )}
                      </button>
                    </div>
                  );
                })}

                {/* Data notice */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-[4px] bg-[rgba(94,106,210,0.06)] border border-[rgba(94,106,210,0.15)] mt-3">
                  <AlertCircle className="w-3.5 h-3.5 text-[#5E6AD2] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
                    GrowthOS reads your data read-only to pre-fill the setup form. You can review and edit all values before saving.
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 1: Store Basics ── */}
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <FieldLabel htmlFor="store-name" label="Store / Brand Name *" />
                  <input
                    id="store-name"
                    name="name"
                    placeholder="e.g. Acme Apparel"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#1C1D1F] px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none focus:border-[#5E6AD2]"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="industry" label="Industry Niche" fieldKey="industry" optional />
                  <input
                    id="industry"
                    name="industry"
                    placeholder="e.g. Apparel, Beauty, Consumer Electronics"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#1C1D1F] px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none focus:border-[#5E6AD2]"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="website" label="Store Domain" fieldKey="website" optional />
                  <input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourbrand.com"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#1C1D1F] px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none focus:border-[#5E6AD2]"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="description" label="Store Overview" optional />
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Brief description of product catalog and target demographic..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#1C1D1F] p-2.5 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none focus:border-[#5E6AD2] resize-none"
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Financials ── */}
            {step === 2 && (
              <div className="space-y-3">
                {connectedPlatforms.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#4CAF50]/5 border border-[#4CAF50]/20">
                    <CheckCircle className="w-3.5 h-3.5 text-[#4CAF50]" />
                    <span className="text-[11px] text-[#4CAF50]">
                      Fields pre-filled from {connectedPlatforms.map(p => PLATFORMS.find(x => x.id === p)?.name).join(" & ")}. Review and edit below.
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="monthly-revenue" label="Monthly Revenue (₹)" fieldKey="monthlyRevenue" optional />
                    <input id="monthly-revenue" name="monthlyRevenue" type="number" placeholder="1840000" value={form.monthlyRevenue} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.monthlyRevenue ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="monthly-expenses" label="Monthly Expenses (₹)" fieldKey="monthlyExpenses" optional />
                    <input id="monthly-expenses" name="monthlyExpenses" type="number" placeholder="1120000" value={form.monthlyExpenses} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.monthlyExpenses ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="customers-per-month" label="Monthly Orders" fieldKey="customersPerMonth" optional />
                    <input id="customers-per-month" name="customersPerMonth" type="number" placeholder="1470" value={form.customersPerMonth} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.customersPerMonth ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="repeat-rate" label="Repeat Customer Rate (%)" fieldKey="repeatCustomerPercentage" optional />
                    <input id="repeat-rate" name="repeatCustomerPercentage" type="number" placeholder="28" min="0" max="100" value={form.repeatCustomerPercentage} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.repeatCustomerPercentage ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                </div>
                <Select id="pricing-level" name="pricingLevel" label="Pricing Positioning" value={form.pricingLevel} onChange={handleChange}>
                  <option value="LOW">Budget / Value</option>
                  <option value="MEDIUM">Mid-Market</option>
                  <option value="HIGH">Premium / Luxury</option>
                </Select>
              </div>
            )}

            {/* ── Step 3: Metrics ── */}
            {step === 3 && (
              <div className="space-y-3">
                {connectedPlatforms.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#4CAF50]/5 border border-[#4CAF50]/20">
                    <CheckCircle className="w-3.5 h-3.5 text-[#4CAF50]" />
                    <span className="text-[11px] text-[#4CAF50]">
                      Metrics pre-filled from connected platforms. All fields are optional.
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="aov" label="Avg. Order Value — AOV (₹)" fieldKey="averageOrderValue" optional />
                    <input id="aov" name="averageOrderValue" type="number" placeholder="1250" value={form.averageOrderValue} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.averageOrderValue ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="cac" label="Acquisition Cost — CAC (₹)" fieldKey="customerAcquisitionCost" optional />
                    <input id="cac" name="customerAcquisitionCost" type="number" placeholder="380" value={form.customerAcquisitionCost} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.customerAcquisitionCost ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="roas" label="Blended ROAS" fieldKey="returnOnAdSpend" optional />
                    <input id="roas" name="returnOnAdSpend" type="number" placeholder="2.4" step="0.1" value={form.returnOnAdSpend} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.returnOnAdSpend ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="cart-abandonment" label="Cart Abandonment (%)" fieldKey="cartAbandonmentRate" optional />
                    <input id="cart-abandonment" name="cartAbandonmentRate" type="number" placeholder="71" min="0" max="100" value={form.cartAbandonmentRate} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.cartAbandonmentRate ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                </div>
                {/* India-Specific COD & RTO Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="cod-rate" label="COD Order Rate (%)" fieldKey="codRate" optional />
                    <input id="cod-rate" name="codRate" type="number" placeholder="62" min="0" max="100" value={form.codRate} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.codRate ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="rto-rate" label="Return to Origin — RTO (%)" fieldKey="rtoRate" optional />
                    <input id="rto-rate" name="rtoRate" type="number" placeholder="22" min="0" max="100" value={form.rtoRate} onChange={handleChange}
                      className={`w-full rounded-[4px] border px-3 py-2 text-[13px] text-[#F1F1F1] placeholder-[#4E4E4E] focus:outline-none bg-[#1C1D1F] focus:border-[#5E6AD2] ${importedFields.rtoRate ? "border-[#4CAF50]/40" : "border-[rgba(255,255,255,0.08)]"}`}
                    />
                  </div>
                </div>
                <Select id="fulfillment-method" name="fulfillmentMethod" label="Fulfillment Infrastructure" value={form.fulfillmentMethod} onChange={handleChange}>
                  <option value="">Select Fulfillment Type</option>
                  <option value="SELF_FULFILLED">Self-Fulfilled</option>
                  <option value="THREE_PL">3PL (Third-Party Logistics)</option>
                  <option value="DROPSHIPPING">Dropshipping</option>
                  <option value="HYBRID">Hybrid Model</option>
                </Select>

                <div>
                  <FieldLabel htmlFor="channels" label="Acquisition Channels" optional />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {MARKETING_CHANNELS.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`px-2 py-1 rounded-[4px] text-[11px] font-medium border transition-colors ${
                          form.marketingChannels.includes(ch)
                            ? "bg-[#5E6AD2]/15 border-[#5E6AD2]/50 text-[#8E96EA]"
                            : "bg-[#1C1D1F] border-[rgba(255,255,255,0.08)] text-[#8A8A8A] hover:text-[#F1F1F1]"
                        }`}
                      >
                        {ch.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="px-3 py-2 rounded-[4px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.2)] text-[11px] text-[#EB5757]">
                {error}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <Button variant="ghost" size="sm" onClick={back} disabled={step === 0} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                {step === 0 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-[11px] text-[#4E4E4E] hover:text-[#8A8A8A] transition-colors"
                  >
                    Skip — enter manually
                  </button>
                )}
                {step < 3 ? (
                  <Button onClick={next} size="sm" className="gap-1.5">
                    {step === 0 ? (connectedPlatforms.length > 0 ? "Review imported data" : "Continue") : "Continue"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} loading={loading} size="sm" className="gap-1.5">
                    Initialize Workspace
                    <Zap className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
