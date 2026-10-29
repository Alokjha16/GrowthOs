"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, HelpCircle, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    badge: "No credit card",
    desc: "Start with the Finance Agent. Find your first ₹40K leak at zero cost.",
    monthly: 0,
    annual: 0,
    popular: false,
    isFree: true,
    agentNote: "Finance Agent only",
    features: [
      "Finance Agent (full access)",
      "3 AI Diagnoses per month",
      "COD & RTO Risk Calculator",
      "Indian D2C Benchmarks (₹)",
      "1 Connected Store",
      "Community support",
    ],
    locked: [
      "6 additional AI agents",
      "Strategy Scenario Simulator",
      "CEO PDF Exports",
    ],
    cta: "Start Free — No Card Needed",
    href: "/register?plan=free",
  },
  {
    name: "Founder",
    badge: null,
    desc: "For fast-scaling D2C brands that need the full intelligence layer.",
    monthly: 999,
    annual: 799,
    popular: true,
    isFree: false,
    agentNote: "All 7 agents",
    features: [
      "All 7 AI Agents (full access)",
      "30 AI Diagnoses per month",
      "Strategy Scenario Simulator",
      "CEO Executive PDF Exports",
      "Shiprocket & Razorpay Integration",
      "Indian D2C Benchmarks (₹)",
      "COD, RTO & NDR Engine",
      "Priority WhatsApp & Email Support",
    ],
    locked: [],
    cta: "Start 14-Day Free Trial",
    href: "/register?plan=founder",
  },
  {
    name: "Scale",
    badge: null,
    desc: "For high-volume brands needing unlimited diagnoses and historical trends.",
    monthly: 2999,
    annual: 2499,
    popular: false,
    isFree: false,
    agentNote: "All 7 agents + history",
    features: [
      "Everything in Founder",
      "Unlimited AI Diagnoses",
      "Historical Snapshot Trend Deltas",
      "Full RAG Empirical Knowledge Base",
      "Custom Prompt Fine-tuning Access",
      "Cross-Channel Attribution Reports",
      "Dedicated Account Specialist",
    ],
    locked: [],
    cta: "Start Scale Trial",
    href: "/register?plan=scale",
  },
  {
    name: "Agency",
    badge: null,
    desc: "For D2C agencies & holding groups managing multiple brands.",
    monthly: 7999,
    annual: 5999,
    popular: false,
    isFree: false,
    agentNote: "All 7 × up to 10 stores",
    features: [
      "Up to 10 Connected Stores",
      "White-label PDF Reports with logo",
      "Cross-Store Benchmark Comparison",
      "All Scale features included",
      "24/7 SLA Priority Support",
    ],
    locked: [],
    cta: "Contact Agency Sales",
    href: "/register?plan=agency",
  },
];

const faqs = [
  {
    q: "What does the free plan actually give me?",
    a: "Full access to the Finance Agent — our most impactful agent. It analyzes your profit margins, contribution margin, expense ratios, and cash flow. Most founders identify their first ₹40,000+/month leak here before ever paying a rupee.",
  },
  {
    q: "Why is the Finance Agent free forever?",
    a: "Because we believe you should see ROI before you pay. The Finance Agent shows you the money. Once you see ₹1.8L/mo leaking from RTO or ad spend, you'll want the Operations and Marketing agents to fix it. The upgrade sells itself.",
  },
  {
    q: "Amazon and Shopify give me analytics for free. Why pay for GrowthOS?",
    a: "Amazon shows you Amazon. Shopify shows you Shopify. Neither talks to the other, and neither tells you *why* something happened or *what to do*. GrowthOS pulls all your channels (Shopify, Amazon, Meesho, Shiprocket, Razorpay) into one AI brain and gives you a prioritized action plan — not just a chart.",
  },
  {
    q: "Is my store financial data secure?",
    a: "Yes. GrowthOS uses AES-256 encryption. We never share your revenue or customer data with third parties or use private data to train open LLM models.",
  },
  {
    q: "Can I export PDF reports for co-founders or investors?",
    a: "Yes — Founder, Scale, and Agency plan members can generate and download executive CEO briefing reports in one click. Perfect for board decks and weekly reviews.",
  },
  {
    q: "Can I cancel or switch plans at any time?",
    a: "Absolutely. No lock-in contracts. Upgrade, downgrade, or cancel from billing settings anytime.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex flex-col font-sans overflow-x-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-orange-600/15 via-amber-600/15 to-orange-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-amber-600/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Start free. Upgrade when the ROI is obvious.
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Find ₹40K/mo leaks{" "}
            <span className="gradient-text">before paying a rupee</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            The Finance Agent is free forever. Most founders discover their biggest growth lever there — and upgrade when they&apos;re ready to fix it.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-semibold ${!annual ? "text-white" : "text-zinc-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-14 h-8 rounded-full bg-zinc-800 border border-white/10 p-1 flex items-center transition-colors relative"
            >
              <div
                className={`w-6 h-6 rounded-full transition-transform ${
                  annual ? "translate-x-6 bg-gradient-to-r from-orange-500 to-amber-500" : "translate-x-0 bg-zinc-500"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${annual ? "text-white" : "text-zinc-400"}`}>
                Annual
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* ROI Anchor */}
        <div className="max-w-3xl mx-auto mb-10 p-4 rounded-xl bg-orange-500/8 border border-orange-500/20 text-center">
          <p className="text-sm text-zinc-300">
            💡 <strong className="text-white">ROI reality check:</strong> If GrowthOS finds 1 insight — say, your RTO rate is costing{" "}
            <span className="text-amber-400 font-semibold">₹40,000/month</span> in NDR losses — the Founder plan pays for itself{" "}
            <span className="text-orange-400 font-semibold">50× over.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => {
            const price = plan.isFree ? 0 : annual ? plan.annual : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col justify-between relative transition-all duration-300 shimmer-card ${
                  plan.popular
                    ? "bg-zinc-900/90 border-2 border-orange-500 shadow-2xl shadow-orange-500/20 md:-translate-y-2"
                    : plan.isFree
                    ? "bg-zinc-900/40 border border-orange-500/30 hover:border-orange-500/50"
                    : "bg-zinc-900/40 border border-white/[0.08] hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}
                {plan.isFree && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
                    Free Forever
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="text-[10px] font-semibold text-zinc-500 mt-0.5">{plan.agentNote}</div>
                  </div>
                  <p className="text-xs text-zinc-400 min-h-[40px] leading-relaxed mb-5">{plan.desc}</p>

                  <div className="flex items-baseline gap-1 mb-5">
                    {plan.isFree ? (
                      <span className="text-4xl font-extrabold text-orange-400">₹0</span>
                    ) : (
                      <>
                        <span className="text-4xl font-extrabold text-white">₹{price.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-zinc-400">/mo</span>
                        {annual && <span className="text-[10px] text-zinc-500 ml-1">billed annually</span>}
                      </>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-5 border-t border-white/[0.08] mb-6">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {plan.locked.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs text-zinc-600">
                        <Lock className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? "gradient" : plan.isFree ? "secondary" : "secondary"}
                    className={`w-full h-11 text-xs font-semibold gap-2 ${plan.isFree ? "border-orange-500/40 text-orange-300 hover:bg-orange-500/10" : ""}`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Demo Mode Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-zinc-900 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              See it before you try it
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Explore our interactive demo loaded with <strong>Rang Studio</strong> (ethnic wear D2C, ₹18.4L/mo, 62% COD). No sign up. No credit card. Just the full experience.
            </p>
          </div>
          <Link href="/demo">
            <Button variant="secondary" className="whitespace-nowrap gap-2 text-xs h-11 px-6 border-orange-500/30 text-orange-300 hover:bg-orange-500/10">
              Launch Live Demo →
            </Button>
          </Link>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-400" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-2 shimmer-card hover:border-white/20 transition-colors">
                <h4 className="text-sm font-semibold text-white">{faq.q}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-white/5 text-center text-xs text-zinc-500 relative z-10">
        © {new Date().getFullYear()} GrowthOS Inc. All rights reserved. Built for Indian D2C Founders.
      </footer>
    </div>
  );
}
