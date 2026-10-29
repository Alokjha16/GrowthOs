"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Zap,
  Sparkles,
  ArrowUpRight,
  Shield,
  Download,
  Building,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gstin, setGstin] = useState("");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      monthly: 999,
      annual: 799,
      features: ["1 Connected Store", "5 AI Diagnoses / month", "7 Parallel Agents", "Indian D2C Benchmarks"],
    },
    {
      id: "growth",
      name: "Growth",
      monthly: 2999,
      annual: 2399,
      popular: true,
      features: [
        "Unlimited AI Diagnoses",
        "Strategy Scenario Simulator",
        "CEO Executive PDF Exports",
        "Full RAG Knowledge Base",
        "Shiprocket & Razorpay Integration",
      ],
    },
    {
      id: "agency",
      name: "Agency",
      monthly: 7999,
      annual: 6399,
      features: ["Up to 10 Connected Stores", "White-label PDF Reports", "Dedicated Account Manager", "Custom Fine-tuning Access"],
    },
  ];

  const invoices = [
    { id: "INV-2026-001", date: "Jul 01, 2026", desc: "Growth Plan — Monthly", amount: "₹2,999", status: "PAID" },
    { id: "INV-2026-002", date: "Jun 01, 2026", desc: "Growth Plan — Monthly", amount: "₹2,999", status: "PAID" },
    { id: "INV-2026-003", date: "May 01, 2026", desc: "Starter Plan — Monthly", amount: "₹999", status: "PAID" },
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowModal(true);
  };

  const executeRazorpayCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowModal(false);
      alert("✅ Subscription updated successfully! Payment processed via Razorpay.");
    }, 1500);
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-orange-400" />
            Billing & Subscriptions
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your subscription tier, billing cycle, INR invoices, and GST details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="border-emerald-500/30 text-emerald-400">
            ● Active Subscription
          </Badge>
        </div>
      </div>

      {/* Active Subscription Overview */}
      <Card className="bg-gradient-to-r from-zinc-900 via-orange-950/20 to-zinc-900 border-orange-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Current Plan</span>
                <Badge variant="success">Active</Badge>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Growth Plan (₹2,999/month)</h2>
              <p className="text-xs text-zinc-400">
                Renews automatically on <strong>August 31, 2026</strong>. Includes unlimited 7-agent diagnoses & PDF exports.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="gradient"
                className="gap-2 text-xs h-10 px-5"
                onClick={() => handleUpgrade("agency")}
              >
                <Sparkles className="w-4 h-4" />
                Upgrade to Agency
              </Button>
              <Button
                variant="secondary"
                className="text-xs h-10 px-4 text-zinc-300"
                onClick={() => handleUpgrade("growth")}
              >
                Change Billing
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-[11px] text-zinc-400">Monthly Usage Quota</p>
              <p className="text-sm font-bold text-emerald-400">Unlimited Diagnoses</p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Connected Stores</p>
              <p className="text-sm font-bold text-white">1 Store (Rang Studio)</p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Payment Method</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>UPI / Auto-Debit (Razorpay)</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Tier Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Available Subscriptions</h2>
            <p className="text-xs text-zinc-400">Switch plan or toggle between monthly & annual billing (Save 20%)</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/80 p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                billingCycle === "monthly" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors flex items-center gap-1 ${
                billingCycle === "annual" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === "growth";
            const price = billingCycle === "annual" ? plan.annual : plan.monthly;

            return (
              <Card
                key={plan.id}
                className={`p-6 flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? "bg-zinc-900/90 border-2 border-orange-500 shadow-xl shadow-orange-500/10"
                    : "bg-zinc-900/40 border-white/10"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] font-bold text-white uppercase tracking-wider">
                    Current Active Tier
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹{price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-zinc-400">/month</span>
                  </div>

                  <ul className="space-y-2 pt-4 border-t border-white/10 text-xs text-zinc-300">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <Button variant="secondary" disabled className="w-full text-xs opacity-60">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? "gradient" : "secondary"}
                      className="w-full text-xs"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* GST Details */}
      <Card className="bg-zinc-900/40 border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Indian GSTIN Invoicing</h3>
            <p className="text-xs text-zinc-400">Add your GSTIN to get tax invoice credit for business expense claims.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 max-w-md">
          <input
            type="text"
            placeholder="e.g. 27AAAAA0000A1Z5"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg text-xs text-white uppercase placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
          />
          <Button variant="secondary" size="sm" className="text-xs" onClick={() => alert("GSTIN saved!")}>
            Save GSTIN
          </Button>
        </div>
      </Card>

      {/* Invoice History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Invoice History</h2>
        <Card className="bg-zinc-900/40 border-white/10 overflow-hidden">
          <div className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/[0.02]">
                <div className="space-y-1">
                  <p className="font-semibold text-white">{inv.desc}</p>
                  <p className="text-zinc-500 font-mono text-[10px]">{inv.id} · {inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white">{inv.amount}</span>
                  <Badge variant="success">{inv.status}</Badge>
                  <button
                    onClick={() => alert(`Downloading Invoice ${inv.id}`)}
                    className="p-1.5 text-zinc-400 hover:text-orange-300 transition-colors"
                    title="Download Tax Invoice"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Razorpay Checkout Modal Simulation */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                  RZP
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Razorpay Secure Checkout</h3>
                  <p className="text-[10px] text-zinc-400">GrowthOS Subscription Payment</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-white/5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Selected Plan:</span>
                <span className="text-white font-bold capitalize">{selectedPlan} Plan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Billing Cycle:</span>
                <span className="text-white capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                <span className="text-white">Total Payable:</span>
                <span className="text-emerald-400">
                  ₹{selectedPlan === "agency" ? "7,999" : selectedPlan === "starter" ? "999" : "2,999"} / mo
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Select Payment Method (India)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  UPI / GPay / PhonePe
                </div>
                <div className="p-3 rounded-lg border border-white/10 bg-zinc-950 text-zinc-400 flex items-center gap-2">
                  Credit / Debit Card
                </div>
              </div>
            </div>

            <Button
              variant="gradient"
              className="w-full h-11 text-xs font-bold gap-2"
              disabled={isProcessing}
              onClick={executeRazorpayCheckout}
            >
              {isProcessing ? (
                <span>Processing Payment via Razorpay...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Pay & Confirm Subscription
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
