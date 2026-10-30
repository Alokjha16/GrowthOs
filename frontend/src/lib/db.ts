// src/lib/db.ts — GrowthOS resilient Database Client
// Tries PrismaClient (PostgreSQL / Supabase) with graceful zero-latency fallback to local demo store
// Phase 1: Extended with Subscription, Entitlement, AutopilotPreferences, Finding,
//          PlaybookRun, Action, Task, AuditLog, Benchmark, AlertLog, AlertPreferences,
//          PlaybookAccuracy models — all with safeExec + in-memory fallback pattern

import { PrismaClient } from "@prisma/client";
import { type AgentResult } from "@/agents/shared";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEMO DATASET (Rang Studio — Indian D2C Ethnic Wear Case Study)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_USER_ID = "demo-user-rang-studio";
const DEMO_BIZ_ID = "biz-rang-studio";
const DEMO_SUB_ID = "sub-rang-studio";
const DEMO_ENT_ID = "ent-rang-studio";

const RANG_STUDIO_AGENT_RESULTS: AgentResult[] = [
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
        clickPath: "Inventory > Suppliers > Contract Review > Margin Optimization",
        howTo: "Compare raw cotton and modal fabric procurement rates in Sanganer/Jaipur clusters. Target 8% volume discount across top 3 moving SKUs.",
      },
      {
        title: "Introduce dynamic COD fee of ₹80 for non-tier-1 pincodes",
        impact: "Shift 15% COD orders to Prepaid → +₹36,800/month net cash flow",
        effort: "low",
        timeToResult: "7 days",
        tool: "Razorpay Magic Checkout Rules",
        clickPath: "Settings > Payment Gateways > COD Verification & Friction Rules",
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
        clickPath: "Integrations > Shiprocket > Webhooks > Trigger WhatsApp Bot on NDR",
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
      "Lack of Instant UPI (1-click checkout) adds 3 friction steps on mobile browser",
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

const mockSnapshots = [
  { id: "snap-5", businessId: DEMO_BIZ_ID, revenue: 1050000, expenses: 680000, customers: 900, repeatRate: 24, averageOrderValue: 1168, customerAcquisitionCost: 310, returnOnAdSpend: 2.0, cartAbandonmentRate: 76, codRate: 71, rtoRate: 18, healthScore: 48, createdAt: new Date(Date.now() - 5 * 30 * 86400000) },
  { id: "snap-4", businessId: DEMO_BIZ_ID, revenue: 1220000, expenses: 770000, customers: 1050, repeatRate: 25, averageOrderValue: 1162, customerAcquisitionCost: 330, returnOnAdSpend: 2.1, cartAbandonmentRate: 75, codRate: 69, rtoRate: 19, healthScore: 52, createdAt: new Date(Date.now() - 4 * 30 * 86400000) },
  { id: "snap-3", businessId: DEMO_BIZ_ID, revenue: 1410000, expenses: 880000, customers: 1180, repeatRate: 26, averageOrderValue: 1195, customerAcquisitionCost: 345, returnOnAdSpend: 2.2, cartAbandonmentRate: 74, codRate: 67, rtoRate: 20, healthScore: 55, createdAt: new Date(Date.now() - 3 * 30 * 86400000) },
  { id: "snap-2", businessId: DEMO_BIZ_ID, revenue: 1580000, expenses: 970000, customers: 1290, repeatRate: 27, averageOrderValue: 1225, customerAcquisitionCost: 358, returnOnAdSpend: 2.3, cartAbandonmentRate: 73, codRate: 65, rtoRate: 21, healthScore: 58, createdAt: new Date(Date.now() - 2 * 30 * 86400000) },
  { id: "snap-1", businessId: DEMO_BIZ_ID, revenue: 1710000, expenses: 1045000, customers: 1380, repeatRate: 27, averageOrderValue: 1239, customerAcquisitionCost: 370, returnOnAdSpend: 2.35, cartAbandonmentRate: 72, codRate: 63, rtoRate: 22, healthScore: 60, createdAt: new Date(Date.now() - 1 * 30 * 86400000) },
  { id: "snap-0", businessId: DEMO_BIZ_ID, revenue: 1840000, expenses: 1120000, customers: 1470, repeatRate: 28, averageOrderValue: 1250, customerAcquisitionCost: 380, returnOnAdSpend: 2.4, cartAbandonmentRate: 71, codRate: 62, rtoRate: 22, healthScore: 62, createdAt: new Date() },
];

const mockKnowledge = [
  { id: "k-1", source: "Shiprocket Annual D2C Logistics Benchmark Report 2024", category: "operations", industry: "Apparel & Ethnic Wear", content: "Indian apparel D2C brands average 60-65% COD orders. Return to Origin (RTO) rates for COD apparel range between 18% and 25%, costing brands an average of ₹240 per returned order in forward and reverse freight. Brands implementing active Non-Delivery Report (NDR) workflows with immediate customer contact via WhatsApp within 2 hours of failed attempt reduce overall RTO by 6-8 percentage points.", createdAt: new Date() },
  { id: "k-2", source: "Razorpay Magic Checkout D2C Conversion Study 2024", category: "technology", industry: "Apparel & Ethnic Wear", content: "Address entry is the single largest drop-off point in Indian e-commerce checkout funnels, responsible for 68% of cart abandonment on mobile devices. 1-click checkout solutions pre-populating delivery addresses and saved UPI handles for 50M+ network shoppers boost checkout completion rates from 1.8% to 2.8%, generating an average 18-22% increase in net GMV.", createdAt: new Date() },
  { id: "k-3", source: "Indian D2C Fashion & Apparel Playbook — Bain & Co", category: "finance", industry: "Apparel & Ethnic Wear", content: "Healthy Indian ethnic wear D2C brands maintain gross margins of 58-65%. At blended customer acquisition cost (CAC) of ₹350-450 and Average Order Value (AOV) of ₹1,200-1,600, contribution margin after marketing and logistics should exceed 22%. Brands with repeat customer rates below 25% require disproportionate ad spend and struggle with unit profitability.", createdAt: new Date() },
  { id: "k-4", source: "Klaviyo & Interakt D2C Retention Benchmark India", category: "retention", industry: null, content: "WhatsApp automated flows for Indian D2C brands generate 82-88% open rates and 34% CTR within 1 hour of delivery confirmation, compared to 14% open rates for transactional email. Automated post-purchase cross-sell workflows sent on Day 3 post-delivery lift 30-day repeat purchase rate by 7.4 percentage points.", createdAt: new Date() },
];

// ── Phase 1 seed data ─────────────────────────────────────────────────────────

const mockSubscriptions: any[] = [
  { id: DEMO_SUB_ID, userId: DEMO_USER_ID, planTier: "GROWTH", billingCycle: "monthly", status: "active", currentPeriodEnd: new Date(Date.now() + 30 * 86400000), externalId: null, createdAt: new Date("2026-01-01"), updatedAt: new Date() },
];

const mockEntitlements: any[] = [
  { id: DEMO_ENT_ID, userId: DEMO_USER_ID, subscriptionId: DEMO_SUB_ID, type: "PLAN", planTier: "GROWTH", moduleSlug: null, status: "ACTIVE", expiresAt: null, createdAt: new Date("2026-01-01") },
];

const mockAutopilotPrefs: any[] = [
  { id: "prefs-rang-studio", userId: DEMO_USER_ID, killSwitchActive: false, shadowModeActive: true, shadowModeStartedAt: new Date(Date.now() - 3 * 86400000), autoRollbackEnabled: false, maxBudgetChangePct: 20, maxPriceChangePct: 10, maxDailyAdSpendShiftPct: 25, protectedEntityIds: [], createdAt: new Date("2026-01-01"), updatedAt: new Date() },
];

const mockFindings: any[] = [
  { id: "finding-ads-001", businessId: DEMO_BIZ_ID, moduleSlug: "ADS", title: "3 Meta ad sets spent ₹62,000 at ROAS 0.7 — below break-even", description: "Three ad sets in your 'Ethnic Festive Collection' campaign have a ROAS of 0.7x over the last 30 days. Your break-even ROAS (based on 39% gross margin) is 2.56x. Pausing these ad sets would stop ₹41,000/month of guaranteed losses.", moneyImpact: 41000, impactFormula: "wasted_spend = ad_sets_spend × (1 - roas / breakeven_roas)", impactInputs: { adSetsSpend: 62000, roas: 0.7, breakevenRoas: 2.56, grossMarginPct: 39 }, impactWindow: "last 30 days", confidence: "HIGH", dismissed: false, dismissedAt: null, resolvedAt: null, playbookRunId: null, taskId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "finding-profit-001", businessId: DEMO_BIZ_ID, moduleSlug: "PROFIT", title: "SKU 'Silk Anarkali Kurta Set' loses ₹38 per order after marketing and shipping", description: "After factoring in COGS (₹480), Shiprocket reverse/forward freight (₹190), and blended ad CAC (₹380), SKU 'Silk Anarkali Kurta Set' (selling at ₹999) has a negative contribution margin of -₹38 per order. Repricing to ₹1,149 restores positive unit contribution.", moneyImpact: 27000, impactFormula: "monthly_loss = monthly_unit_volume × abs(contribution_margin_per_unit)", impactInputs: { sku: "Silk Anarkali Kurta Set", monthlyOrders: 710, sellingPrice: 999, cogs: 480, freight: 190, cac: 380, netLossPerOrder: 38 }, impactWindow: "last 30 days", confidence: "HIGH", dismissed: false, dismissedAt: null, resolvedAt: null, playbookRunId: null, taskId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "finding-inventory-001", businessId: DEMO_BIZ_ID, moduleSlug: "INVENTORY", title: "'Chanderi Festive Kurti' stock runs out in 6 days — ₹74,000 stockout risk", description: "With a current sales velocity of 12 units/day and only 72 units remaining in stock, this top-seller SKU will completely stock out before the supplier's 11-day reorder cycle arrives. Immediate purchase order drafting prevents lost revenue.", moneyImpact: 74000, impactFormula: "lost_revenue = daily_sales_velocity × stockout_days × retail_aov", impactInputs: { sku: "Chanderi Festive Kurti", currentStock: 72, dailyVelocity: 12, daysRemaining: 6, supplierLeadTimeDays: 11, stockoutDays: 5, retailPrice: 1250 }, impactWindow: "next 14 days", confidence: "HIGH", dismissed: false, dismissedAt: null, resolvedAt: null, playbookRunId: null, taskId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "finding-retention-001", businessId: DEMO_BIZ_ID, moduleSlug: "RETENTION", title: "1,240 customers haven't reordered in 90+ days — ₹1.1L/month win-back opportunity", description: "1,240 customers who purchased between 90 and 180 days ago have not placed a second order. Based on your average order value of ₹1,250 and a typical 8% win-back conversion rate, a targeted WhatsApp campaign could recover approximately ₹1.1L/month.", moneyImpact: 110000, impactFormula: "winback_revenue = lapsed_customers × winback_conversion_rate × aov", impactInputs: { lapsedCustomers: 1240, winbackConversionRate: 0.071, aov: 1250 }, impactWindow: "last 90 days", confidence: "MEDIUM", dismissed: false, dismissedAt: null, resolvedAt: null, playbookRunId: null, taskId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "finding-cart-001", businessId: DEMO_BIZ_ID, moduleSlug: "CART_CRO", title: "71% of mobile carts abandoned with no automated recovery flow active", description: "Mobile checkout abandonment rate reached 71% over the last 30 days with no automated recovery sequence enabled. Deploying an abandoned-cart WhatsApp recovery flow with a capped 10% coupon recovers 10-15% of abandoned carts.", moneyImpact: 58000, impactFormula: "recoverable_revenue = abandoned_carts × recovery_conversion_rate × aov", impactInputs: { totalAbandonedCarts: 654, estimatedRecoveryRate: 0.071, aov: 1250 }, impactWindow: "last 30 days", confidence: "MEDIUM", dismissed: false, dismissedAt: null, resolvedAt: null, playbookRunId: null, taskId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "finding-fulfillment-001", businessId: DEMO_BIZ_ID, moduleSlug: "FULFILLMENT", title: "COD orders to 14 pincodes have 38% RTO — ₹33,000/month loss", description: "14 pincodes across UP, Bihar, and Rajasthan show a 38% RTO rate on COD orders — more than double your average. Each RTO costs ₹240 in forward + reverse freight. Switching these pincodes to prepaid-only would eliminate this loss.", moneyImpact: 33000, impactFormula: "rto_loss = high_rto_cod_orders × rto_rate × avg_rto_cost", impactInputs: { highRtoCodOrders: 362, rtoRate: 0.38, avgRtoCost: 240 }, impactWindow: "last 30 days", confidence: "HIGH", dismissed: false, dismissedAt: null, resolvedAt: null, playbookRunId: null, taskId: null, createdAt: new Date(), updatedAt: new Date() },
];

const mockBenchmarks: any[] = [
  { id: "bm-ads-roas", moduleSlug: "ADS", category: "APPAREL", metric: "roas", p25: 1.8, median: 2.8, p75: 4.2, unit: "x", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Meta D2C India Benchmark 2024", lastUpdated: new Date() },
  { id: "bm-ads-cac", moduleSlug: "ADS", category: "APPAREL", metric: "cac", p25: 280, median: 420, p75: 680, unit: "₹", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Bain & Co D2C India Report 2024", lastUpdated: new Date() },
  { id: "bm-profit-gm", moduleSlug: "PROFIT", category: "APPAREL", metric: "gross_margin", p25: 45, median: 58, p75: 65, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Bain & Co D2C India Report 2024", lastUpdated: new Date() },
  { id: "bm-profit-cm", moduleSlug: "PROFIT", category: "APPAREL", metric: "contribution_margin", p25: 14, median: 22, p75: 32, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Bain & Co D2C India Report 2024", lastUpdated: new Date() },
  { id: "bm-profit-aov", moduleSlug: "PROFIT", category: "APPAREL", metric: "aov", p25: 900, median: 1350, p75: 2100, unit: "₹", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Unicommerce D2C Report 2024", lastUpdated: new Date() },
  { id: "bm-inv-turn", moduleSlug: "INVENTORY", category: "APPAREL", metric: "inventory_turnover", p25: 3.5, median: 6.0, p75: 9.0, unit: "x", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Unicommerce Inventory Report 2024", lastUpdated: new Date() },
  { id: "bm-inv-dos", moduleSlug: "INVENTORY", category: "APPAREL", metric: "days_of_stock", p25: 21, median: 35, p75: 60, unit: "days", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Unicommerce Inventory Report 2024", lastUpdated: new Date() },
  { id: "bm-ret-repeat", moduleSlug: "RETENTION", category: "APPAREL", metric: "repeat_rate", p25: 18, median: 28, p75: 40, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Klaviyo India D2C Benchmark 2024", lastUpdated: new Date() },
  { id: "bm-ret-ltv", moduleSlug: "RETENTION", category: "APPAREL", metric: "ltv_cac_ratio", p25: 1.5, median: 2.5, p75: 4.0, unit: "x", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Klaviyo India D2C Benchmark 2024", lastUpdated: new Date() },
  { id: "bm-cart-abandon", moduleSlug: "CART_CRO", category: "APPAREL", metric: "cart_abandonment_rate", p25: 55, median: 68, p75: 80, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Razorpay D2C Checkout Report 2024", lastUpdated: new Date() },
  { id: "bm-cart-conv", moduleSlug: "CART_CRO", category: "APPAREL", metric: "checkout_conversion", p25: 1.2, median: 2.0, p75: 3.5, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Razorpay D2C Checkout Report 2024", lastUpdated: new Date() },
  { id: "bm-ful-rto", moduleSlug: "FULFILLMENT", category: "APPAREL", metric: "rto_rate", p25: 10, median: 15, p75: 22, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Shiprocket Logistics Report 2024", lastUpdated: new Date() },
  { id: "bm-ful-cod", moduleSlug: "FULFILLMENT", category: "APPAREL", metric: "cod_rate", p25: 40, median: 58, p75: 72, unit: "%", source: "INDUSTRY_ESTIMATE", sourceLabel: "Industry estimate — Shiprocket Logistics Report 2024", lastUpdated: new Date() },
];

const mockAlertPrefs: any[] = [
  { id: "alert-prefs-rang-studio", userId: DEMO_USER_ID, emailEnabled: true, whatsappEnabled: false, whatsappNumber: null, quietHoursStart: null, quietHoursEnd: null, weeklyDigestDay: 1, roasDropThresholdPct: 20, stockDaysThreshold: 7, rtoSpikeThresholdPct: 5, abandonmentSpikeThresholdPct: 10, createdAt: new Date("2026-01-01"), updatedAt: new Date() },
];

const mockPlaybookAccuracy: any[] = [
  { id: "pa-pause-ads", playbookSlug: "pause-wasting-ad-sets", moduleSlug: "ADS", totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null, lastUpdated: new Date() },
  { id: "pa-prepaid", playbookSlug: "prepaid-only-high-rto-pincodes", moduleSlug: "FULFILLMENT", totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null, lastUpdated: new Date() },
  { id: "pa-winback", playbookSlug: "winback-campaign-lapsed", moduleSlug: "RETENTION", totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null, lastUpdated: new Date() },
  { id: "pa-cart", playbookSlug: "enable-abandoned-cart-recovery", moduleSlug: "CART_CRO", totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null, lastUpdated: new Date() },
  { id: "pa-reorder", playbookSlug: "reorder-draft-low-stock", moduleSlug: "INVENTORY", totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null, lastUpdated: new Date() },
  { id: "pa-reprice", playbookSlug: "reprice-loss-making-skus", moduleSlug: "PROFIT", totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null, lastUpdated: new Date() },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRISMA CLIENT & FALLBACK WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prismaInstance?: PrismaClient;
  dbOffline?: boolean;
  lastChecked?: number;
  memoryStore?: any;
};

// In-Memory store singleton preserved across hot-reloads and route handlers
const initialMemoryStore = {
  users: [
    { id: DEMO_USER_ID, email: "demo@growthos.ai", name: "Jainam (Rang Studio)", password: "$2a$12$e0LU5bH38Xv3LhU4R7XbqeC6rXo8jU6eM9r.v9vI1QzP8Z3ZkI9Ky", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces", emailVerified: null, createdAt: new Date("2024-01-01T00:00:00Z"), updatedAt: new Date() },
  ],
  businesses: [
    { id: DEMO_BIZ_ID, userId: DEMO_USER_ID, name: "Rang Studio", businessType: "ECOMMERCE", industry: "Apparel & Ethnic Wear", storeCategory: "APPAREL", website: "https://rangstudio.in", description: "Premium Indian ethnic wear D2C brand — kurtas, co-ords, and festive collections. Manufactured in Jaipur, shipped pan-India via Shiprocket. Target: women 22–40, Tier 1 & 2 cities.", monthlyRevenue: 1840000, monthlyExpenses: 1120000, customersPerMonth: 1470, repeatCustomerPercentage: 28, pricingLevel: "MEDIUM", averageOrderValue: 1250, customerAcquisitionCost: 380, returnOnAdSpend: 2.4, cartAbandonmentRate: 71, fulfillmentMethod: "THREE_PL", marketingChannels: ["INSTAGRAM", "FACEBOOK", "WHATSAPP", "GOOGLE_ADS", "MEESHO_ADS"], employeeCount: 12, healthScore: 62, codRate: 62, rtoRate: 22, prepaidPercentage: 38, inventoryTurnover: 4.2, returnRatePercentage: 22, createdAt: new Date("2024-01-01T00:00:00Z"), updatedAt: new Date() },
  ],
  snapshots: [...mockSnapshots],
  analyses: [
    { id: "analysis-initial-rang-studio", businessId: DEMO_BIZ_ID, createdById: DEMO_USER_ID, status: "COMPLETED", healthScore: 62, summary: { topRisk: "22% RTO rate combined with 62% COD dependency is eroding ₹2.95L/month in unrecoverable courier freight charges.", biggestOpportunity: "Implementing 2-hour WhatsApp NDR verification and ₹100 prepaid UPI incentive can reduce RTO from 22% to 15%, adding ₹1.8L directly to bottom-line profit.", primaryAction: "Activate automated WhatsApp verification for all COD orders above ₹1,500 using Shiprocket Engage / Bikayi API within 24 hours." }, agents: RANG_STUDIO_AGENT_RESULTS, inputSnapshot: null, createdAt: new Date(), updatedAt: new Date() },
  ],
  simulations: [
    { id: "sim-initial-rang-studio", businessId: DEMO_BIZ_ID, createdById: DEMO_USER_ID, status: "COMPLETED", strategy: "Shift 25% of COD customers to prepaid via instant UPI cashback of ₹75 and deploy WhatsApp NDR automation", confidenceScore: 88, committedPlaybookRunId: null, shortTermOutcome: { revenueImpact: "+₹1.4L / month", expenseImpact: "-₹48,000 / month (freight savings)", netMarginImpact: "+3.8 percentage points", customerSentiment: "Positive (82% approval on WhatsApp confirmation)" }, longTermOutcome: { annualizedSavings: "₹16.8 Lakhs", repeatPurchaseLift: "+18%", enterpriseValuationLift: "+₹45 Lakhs" }, risks: ["Low initial customer response to WhatsApp messages if not branded with clear logo", "Payment gateway drop-offs during instant UPI incentive redirect"], opportunities: ["Scale Shiprocket integration to auto-tag high-risk pincodes", "Bundle ethnic wear accessories to raise AOV above ₹2,000 threshold"], createdAt: new Date(), updatedAt: new Date() },
  ],
  reports: [
    { id: "rep-initial-rang-studio", businessId: DEMO_BIZ_ID, createdById: DEMO_USER_ID, analysisId: "analysis-initial-rang-studio", simulationId: null, type: "EXECUTIVE_SUMMARY", title: "Rang Studio Q4 Executive Growth & Unit Economics Report", executiveSummary: "Rang Studio demonstrates resilient customer acquisition across Tier 1 & 2 markets with ₹18.4L MRR, but profitability is severely bottlenecked by a 22% RTO rate on 62% COD orders. Immediate implementation of WhatsApp NDR automation and Razorpay Magic 1-click checkout will unlock ₹1.8L/month in net profit.", chiefRisk: "Unabsorbed reverse shipping freight of ₹23,900/month directly eroding EBITDA margins.", topOpportunity: "Recovering 7 percentage points of RTO through automated WhatsApp NDR verification.", immediateAction: "Configure Shiprocket WhatsApp NDR webhook and deploy Razorpay Magic 1-click checkout within 48 hours.", actionPlan: [{ step: 1, action: "Enable WhatsApp NDR workflow on Shiprocket", owner: "Operations Lead", timeline: "Day 1-3" }, { step: 2, action: "Implement ₹80 COD fee on high-risk pincodes", owner: "Finance Lead", timeline: "Day 4-7" }, { step: 3, action: "Reallocate 40% ad budget to UGC creator reels", owner: "Growth Marketer", timeline: "Day 8-14" }], createdAt: new Date(), updatedAt: new Date() },
  ],
  knowledge: [...mockKnowledge],
  feedback: [] as any[],
  subscriptions: [...mockSubscriptions],
  entitlements: [...mockEntitlements],
  autopilotPrefs: [...mockAutopilotPrefs],
  findings: [...mockFindings],
  playbookRuns: [] as any[],
  actions: [] as any[],
  tasks: [] as any[],
  auditLogs: [] as any[],
  benchmarks: [...mockBenchmarks],
  alertLogs: [] as any[],
  alertPrefs: [...mockAlertPrefs],
  playbookAccuracy: [...mockPlaybookAccuracy],
};

const memoryStore: typeof initialMemoryStore = (globalForPrisma.memoryStore ??= initialMemoryStore);

const rawPrisma =
  globalForPrisma.prismaInstance ??
  new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaInstance = rawPrisma;
}

async function withTimeout<T>(promise: Promise<T>, ms = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Database query timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function safeExec(prismaFn: () => Promise<any>, fallbackFn: () => any): Promise<any> {
  const now = Date.now();
  if (globalForPrisma.dbOffline && globalForPrisma.lastChecked && now - globalForPrisma.lastChecked < 60000) {
    return fallbackFn();
  }
  try {
    const result = await withTimeout(prismaFn(), 1200);
    globalForPrisma.dbOffline = false;
    globalForPrisma.lastChecked = now;
    return result;
  } catch {
    globalForPrisma.dbOffline = true;
    globalForPrisma.lastChecked = now;
    return fallbackFn();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DB IMPLEMENTATION WITH FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

const dbImplementation = {

  // ── Original models ──────────────────────────────────────────────────────

  user: {
    findUnique: async (args: any) => safeExec(() => rawPrisma.user.findUnique(args), () => {
      const email = args?.where?.email?.toLowerCase();
      const id = args?.where?.id;
      return memoryStore.users.find((u) => (email && u.email.toLowerCase() === email) || (id && u.id === id)) || null;
    }),
    count: async (args?: any) => safeExec(() => rawPrisma.user.count(args), () => memoryStore.users.length),
    create: async (args: any) => safeExec(() => rawPrisma.user.create(args), () => {
      const u = { id: `user-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.users.push(u); return u;
    }),
    upsert: async (args: any) => safeExec(() => rawPrisma.user.upsert(args), () => {
      const email = args?.where?.email?.toLowerCase();
      const idx = memoryStore.users.findIndex((u) => u.email.toLowerCase() === email);
      if (idx >= 0) { memoryStore.users[idx] = { ...memoryStore.users[idx], ...args.update, updatedAt: new Date() }; return memoryStore.users[idx]; }
      const created = { id: `user-${Date.now()}`, ...args.create, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.users.push(created); return created;
    }),
  },

  business: {
    findFirst: async (args?: any) => safeExec(() => rawPrisma.business.findFirst(args), () => {
      const userId = args?.where?.userId;
      const id = args?.where?.id;
      const biz = memoryStore.businesses.find((b) => (userId && (b.userId === userId || userId === DEMO_USER_ID)) || (id && b.id === id)) || memoryStore.businesses[0];
      if (!biz) return null;
      if (args?.include?.analyses) {
        const list = memoryStore.analyses.filter((a) => a.businessId === biz.id && (!args.include.analyses.where?.status || a.status === args.include.analyses.where.status)).sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
        return { ...biz, analyses: args.include.analyses.take ? list.slice(0, args.include.analyses.take) : list };
      }
      return biz;
    }),
    findMany: async (args?: any) => safeExec(() => rawPrisma.business.findMany(args), () => {
      const userId = args?.where?.userId;
      return memoryStore.businesses.filter((b) => !userId || b.userId === userId || userId === DEMO_USER_ID);
    }),
    create: async (args: any) => safeExec(() => rawPrisma.business.create(args), () => {
      const b = { id: `biz-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.businesses.push(b); return b;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.business.update(args), () => {
      const idx = memoryStore.businesses.findIndex((b) => b.id === args?.where?.id);
      if (idx >= 0) { memoryStore.businesses[idx] = { ...memoryStore.businesses[idx], ...args.data, updatedAt: new Date() }; return memoryStore.businesses[idx]; }
      return memoryStore.businesses[0];
    }),
  },

  businessSnapshot: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.businessSnapshot.findMany(args), () => {
      let list = [...memoryStore.snapshots];
      if (args?.where?.businessId) list = list.filter((s) => s.businessId === args.where.businessId);
      list.sort((a, b) => args?.orderBy?.createdAt === "desc" ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.businessSnapshot.create(args), () => {
      const s = { id: `snap-${Date.now()}`, ...args.data, createdAt: args.data.createdAt ?? new Date() };
      memoryStore.snapshots.push(s); return s;
    }),
    deleteMany: async (args?: any) => safeExec(() => rawPrisma.businessSnapshot.deleteMany(args), () => {
      if (args?.where?.businessId) memoryStore.snapshots = memoryStore.snapshots.filter((s) => s.businessId !== args.where.businessId);
      return { count: 0 };
    }),
  },

  analysis: {
    findFirst: async (args?: any) => safeExec(() => rawPrisma.analysis.findFirst(args), () => {
      const id = args?.where?.id; const bid = args?.where?.businessId;
      return memoryStore.analyses.find((a) => (id && a.id === id) || (bid && a.businessId === bid)) || memoryStore.analyses[0] || null;
    }),
    findMany: async (args?: any) => safeExec(() => rawPrisma.analysis.findMany(args), () => {
      let list = [...memoryStore.analyses];
      if (args?.where?.businessId) list = list.filter((a) => a.businessId === args.where.businessId);
      if (args?.where?.status) list = list.filter((a) => a.status === args.where.status);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.analysis.create(args), () => {
      const a = { id: `analysis-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.analyses.unshift(a); return a;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.analysis.update(args), () => {
      const idx = memoryStore.analyses.findIndex((a) => a.id === args?.where?.id);
      if (idx >= 0) { memoryStore.analyses[idx] = { ...memoryStore.analyses[idx], ...args.data, updatedAt: new Date() }; return memoryStore.analyses[idx]; }
      return memoryStore.analyses[0];
    }),
  },

  simulation: {
    findFirst: async (args?: any) => safeExec(() => rawPrisma.simulation.findFirst(args), () => {
      return memoryStore.simulations.find((s) => s.id === args?.where?.id) || memoryStore.simulations[0] || null;
    }),
    findMany: async (args?: any) => safeExec(() => rawPrisma.simulation.findMany(args), () => {
      let list = [...memoryStore.simulations];
      if (args?.where?.businessId) list = list.filter((s) => s.businessId === args.where.businessId);
      if (args?.where?.status) list = list.filter((s) => s.status === args.where.status);
      if (args?.where?.createdById) list = list.filter((s) => s.createdById === args.where.createdById);
      if (args?.where?.createdAt?.gte) list = list.filter((s) => s.createdAt >= args.where.createdAt.gte);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.simulation.create(args), () => {
      const s = { id: `sim-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.simulations.unshift(s); return s;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.simulation.update(args), () => {
      const idx = memoryStore.simulations.findIndex((s) => s.id === args?.where?.id);
      if (idx >= 0) { memoryStore.simulations[idx] = { ...memoryStore.simulations[idx], ...args.data, updatedAt: new Date() }; return memoryStore.simulations[idx]; }
      return memoryStore.simulations[0];
    }),
  },

  report: {
    findFirst: async (args?: any) => safeExec(() => rawPrisma.report.findFirst(args), () => {
      return memoryStore.reports.find((r) => r.id === args?.where?.id) || memoryStore.reports[0] || null;
    }),
    findMany: async (args?: any) => safeExec(() => rawPrisma.report.findMany(args), () => {
      let list = [...memoryStore.reports];
      if (args?.where?.businessId) list = list.filter((r) => r.businessId === args.where.businessId);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.report.create(args), () => {
      const r = { id: `rep-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.reports.unshift(r); return r;
    }),
  },

  knowledgeChunk: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.knowledgeChunk.findMany(args), () => {
      let list = [...memoryStore.knowledge];
      if (args?.where?.category) list = list.filter((k) => k.category === args.where.category);
      return args?.take ? list.slice(0, args.take) : list;
    }),
    deleteMany: async () => ({ count: 0 }),
    create: async (args: any) => safeExec(() => rawPrisma.knowledgeChunk.create(args), () => {
      const k = { id: `k-${Date.now()}`, ...args.data, createdAt: new Date() };
      memoryStore.knowledge.push(k); return k;
    }),
  },

  agentFeedback: {
    create: async (args: any) => safeExec(() => rawPrisma.agentFeedback.create(args), () => {
      const fb = { id: `fb-${Date.now()}`, ...args.data, createdAt: new Date() };
      memoryStore.feedback.push(fb); return fb;
    }),
  },

  // ── Phase 1: New models ──────────────────────────────────────────────────

  subscription: {
    findFirst: async (args?: any) => safeExec(() => rawPrisma.subscription.findFirst(args), () => {
      return memoryStore.subscriptions.find((s) => !args?.where?.userId || s.userId === args.where.userId) || null;
    }),
    findUnique: async (args?: any) => safeExec(() => rawPrisma.subscription.findUnique(args), () => {
      const { userId, id } = args?.where ?? {};
      return memoryStore.subscriptions.find((s) => (userId && s.userId === userId) || (id && s.id === id)) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.subscription.create(args), () => {
      const s = { id: `sub-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.subscriptions.push(s); return s;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.subscription.update(args), () => {
      const idx = memoryStore.subscriptions.findIndex((s) => s.id === args?.where?.id || s.userId === args?.where?.userId);
      if (idx >= 0) { memoryStore.subscriptions[idx] = { ...memoryStore.subscriptions[idx], ...args.data, updatedAt: new Date() }; return memoryStore.subscriptions[idx]; }
      return memoryStore.subscriptions[0];
    }),
    upsert: async (args: any) => safeExec(() => rawPrisma.subscription.upsert(args), () => {
      const userId = args?.where?.userId;
      const idx = memoryStore.subscriptions.findIndex((s) => s.userId === userId);
      if (idx >= 0) { memoryStore.subscriptions[idx] = { ...memoryStore.subscriptions[idx], ...args.update, updatedAt: new Date() }; return memoryStore.subscriptions[idx]; }
      const c = { id: `sub-${Date.now()}`, ...args.create, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.subscriptions.push(c); return c;
    }),
  },

  entitlement: {
    findFirst: async (args?: any) => safeExec(() => rawPrisma.entitlement.findFirst(args), () => {
      let list = [...memoryStore.entitlements];
      if (args?.where?.userId) list = list.filter((e) => e.userId === args.where.userId);
      if (args?.where?.type) list = list.filter((e) => e.type === args.where.type);
      if (args?.where?.status) list = list.filter((e) => e.status === args.where.status);
      if (args?.where?.moduleSlug) list = list.filter((e) => e.moduleSlug === args.where.moduleSlug);
      if (args?.orderBy?.createdAt === "desc") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list[0] || null;
    }),
    findMany: async (args?: any) => safeExec(() => rawPrisma.entitlement.findMany(args), () => {
      let list = [...memoryStore.entitlements];
      if (args?.where?.userId) list = list.filter((e) => e.userId === args.where.userId);
      if (args?.where?.status) list = list.filter((e) => e.status === args.where.status);
      return list;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.entitlement.create(args), () => {
      const e = { id: `ent-${Date.now()}`, ...args.data, createdAt: new Date() };
      memoryStore.entitlements.push(e); return e;
    }),
  },

  autopilotPreferences: {
    findUnique: async (args?: any) => safeExec(() => rawPrisma.autopilotPreferences.findUnique(args), () => {
      return memoryStore.autopilotPrefs.find((p) => p.userId === args?.where?.userId) || null;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.autopilotPreferences.findFirst(args), () => {
      return memoryStore.autopilotPrefs.find((p) => !args?.where?.userId || p.userId === args.where.userId) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.autopilotPreferences.create(args), () => {
      const p = { id: `prefs-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.autopilotPrefs.push(p); return p;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.autopilotPreferences.update(args), () => {
      const idx = memoryStore.autopilotPrefs.findIndex((p) => p.userId === args?.where?.userId);
      if (idx >= 0) { memoryStore.autopilotPrefs[idx] = { ...memoryStore.autopilotPrefs[idx], ...args.data, updatedAt: new Date() }; return memoryStore.autopilotPrefs[idx]; }
      return memoryStore.autopilotPrefs[0];
    }),
    upsert: async (args: any) => safeExec(() => rawPrisma.autopilotPreferences.upsert(args), () => {
      const userId = args?.where?.userId;
      const idx = memoryStore.autopilotPrefs.findIndex((p) => p.userId === userId);
      if (idx >= 0) { memoryStore.autopilotPrefs[idx] = { ...memoryStore.autopilotPrefs[idx], ...args.update, updatedAt: new Date() }; return memoryStore.autopilotPrefs[idx]; }
      const c = { id: `prefs-${Date.now()}`, ...args.create, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.autopilotPrefs.push(c); return c;
    }),
  },

  finding: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.finding.findMany(args), () => {
      let list = [...memoryStore.findings];
      if (args?.where?.businessId) list = list.filter((f) => f.businessId === args.where.businessId);
      if (args?.where?.moduleSlug) list = list.filter((f) => f.moduleSlug === args.where.moduleSlug);
      if (args?.where?.dismissed !== undefined) list = list.filter((f) => f.dismissed === args.where.dismissed);
      list.sort((a, b) => (Number(b.moneyImpact) || 0) - (Number(a.moneyImpact) || 0));
      return args?.take ? list.slice(0, args.take) : list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.finding.findFirst(args), () => {
      return memoryStore.findings.find((f) => f.id === args?.where?.id) || memoryStore.findings[0] || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.finding.create(args), () => {
      const f = { id: `finding-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.findings.push(f); return f;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.finding.update(args), () => {
      const idx = memoryStore.findings.findIndex((f) => f.id === args?.where?.id);
      if (idx >= 0) { memoryStore.findings[idx] = { ...memoryStore.findings[idx], ...args.data, updatedAt: new Date() }; return memoryStore.findings[idx]; }
      return null;
    }),
  },

  playbookRun: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.playbookRun.findMany(args), () => {
      let list = [...memoryStore.playbookRuns];
      if (args?.where?.businessId) list = list.filter((r) => r.businessId === args.where.businessId);
      if (args?.where?.status) list = list.filter((r) => r.status === args.where.status);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.playbookRun.findFirst(args), () => {
      const id = args?.where?.id; const token = args?.where?.approvalToken;
      return memoryStore.playbookRuns.find((r) => (id && r.id === id) || (token && r.approvalToken === token)) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.playbookRun.create(args), () => {
      const r = { id: `run-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.playbookRuns.unshift(r); return r;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.playbookRun.update(args), () => {
      const idx = memoryStore.playbookRuns.findIndex((r) => r.id === args?.where?.id);
      if (idx >= 0) { memoryStore.playbookRuns[idx] = { ...memoryStore.playbookRuns[idx], ...args.data, updatedAt: new Date() }; return memoryStore.playbookRuns[idx]; }
      return null;
    }),
  },

  action: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.action.findMany(args), () => {
      let list = [...memoryStore.actions];
      if (args?.where?.businessId) list = list.filter((a) => a.businessId === args.where.businessId);
      if (args?.where?.playbookRunId) list = list.filter((a) => a.playbookRunId === args.where.playbookRunId);
      if (args?.where?.status) list = list.filter((a) => a.status === args.where.status);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.action.findFirst(args), () => {
      const id = args?.where?.id; const key = args?.where?.idempotencyKey;
      return memoryStore.actions.find((a) => (id && a.id === id) || (key && a.idempotencyKey === key)) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.action.create(args), () => {
      const a = { id: `action-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.actions.unshift(a); return a;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.action.update(args), () => {
      const idx = memoryStore.actions.findIndex((a) => a.id === args?.where?.id);
      if (idx >= 0) { memoryStore.actions[idx] = { ...memoryStore.actions[idx], ...args.data, updatedAt: new Date() }; return memoryStore.actions[idx]; }
      return null;
    }),
  },

  task: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.task.findMany(args), () => {
      let list = [...memoryStore.tasks];
      if (args?.where?.businessId) list = list.filter((t) => t.businessId === args.where.businessId);
      if (args?.where?.status) list = list.filter((t) => t.status === args.where.status);
      if (args?.where?.moduleSlug) list = list.filter((t) => t.moduleSlug === args.where.moduleSlug);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.task.findFirst(args), () => {
      return memoryStore.tasks.find((t) => t.id === args?.where?.id) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.task.create(args), () => {
      const t = { id: `task-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.tasks.unshift(t); return t;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.task.update(args), () => {
      const idx = memoryStore.tasks.findIndex((t) => t.id === args?.where?.id);
      if (idx >= 0) { memoryStore.tasks[idx] = { ...memoryStore.tasks[idx], ...args.data, updatedAt: new Date() }; return memoryStore.tasks[idx]; }
      return null;
    }),
  },

  auditLog: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.auditLog.findMany(args), () => {
      let list = [...memoryStore.auditLogs];
      if (args?.where?.businessId) list = list.filter((l) => l.businessId === args.where.businessId);
      if (args?.where?.actionId) list = list.filter((l) => l.actionId === args.where.actionId);
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.auditLog.create(args), () => {
      const l = { id: `audit-${Date.now()}`, ...args.data, createdAt: new Date() };
      memoryStore.auditLogs.unshift(l); return l;
    }),
  },

  benchmark: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.benchmark.findMany(args), () => {
      let list = [...memoryStore.benchmarks];
      if (args?.where?.moduleSlug) list = list.filter((b) => b.moduleSlug === args.where.moduleSlug);
      if (args?.where?.category) list = list.filter((b) => b.category === args.where.category);
      if (args?.where?.metric) list = list.filter((b) => b.metric === args.where.metric);
      return list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.benchmark.findFirst(args), () => {
      let list = [...memoryStore.benchmarks];
      if (args?.where?.moduleSlug) list = list.filter((b) => b.moduleSlug === args.where.moduleSlug);
      if (args?.where?.category) list = list.filter((b) => b.category === args.where.category);
      if (args?.where?.metric) list = list.filter((b) => b.metric === args.where.metric);
      return list[0] || null;
    }),
    upsert: async (args: any) => safeExec(() => rawPrisma.benchmark.upsert(args), () => {
      const { moduleSlug, category, metric } = args.where;
      const idx = memoryStore.benchmarks.findIndex((b) => b.moduleSlug === moduleSlug && b.category === category && b.metric === metric);
      if (idx >= 0) { memoryStore.benchmarks[idx] = { ...memoryStore.benchmarks[idx], ...args.update }; return memoryStore.benchmarks[idx]; }
      const c = { id: `bm-${Date.now()}`, ...args.create }; memoryStore.benchmarks.push(c); return c;
    }),
  },

  alertLog: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.alertLog.findMany(args), () => {
      let list = [...memoryStore.alertLogs];
      if (args?.where?.businessId) list = list.filter((l) => l.businessId === args.where.businessId);
      if (args?.where?.userId) list = list.filter((l) => l.userId === args.where.userId);
      if (args?.where?.alertType) list = list.filter((l) => l.alertType === args.where.alertType);
      if (args?.where?.dedupKey) list = list.filter((l) => l.dedupKey === args.where.dedupKey);
      list.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
      return args?.take ? list.slice(0, args.take) : list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.alertLog.findFirst(args), () => {
      const token = args?.where?.approvalToken; const dup = args?.where?.dedupKey;
      return memoryStore.alertLogs.find((l) => (token && l.approvalToken === token) || (dup && l.dedupKey === dup)) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.alertLog.create(args), () => {
      const l = { id: `alert-${Date.now()}`, ...args.data, sentAt: new Date() };
      memoryStore.alertLogs.unshift(l); return l;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.alertLog.update(args), () => {
      const idx = memoryStore.alertLogs.findIndex((l) => l.id === args?.where?.id);
      if (idx >= 0) { memoryStore.alertLogs[idx] = { ...memoryStore.alertLogs[idx], ...args.data }; return memoryStore.alertLogs[idx]; }
      return null;
    }),
  },

  alertPreferences: {
    findUnique: async (args?: any) => safeExec(() => rawPrisma.alertPreferences.findUnique(args), () => {
      return memoryStore.alertPrefs.find((p) => p.userId === args?.where?.userId) || null;
    }),
    create: async (args: any) => safeExec(() => rawPrisma.alertPreferences.create(args), () => {
      const p = { id: `alertpref-${Date.now()}`, ...args.data, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.alertPrefs.push(p); return p;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.alertPreferences.update(args), () => {
      const idx = memoryStore.alertPrefs.findIndex((p) => p.userId === args?.where?.userId);
      if (idx >= 0) { memoryStore.alertPrefs[idx] = { ...memoryStore.alertPrefs[idx], ...args.data, updatedAt: new Date() }; return memoryStore.alertPrefs[idx]; }
      return null;
    }),
    upsert: async (args: any) => safeExec(() => rawPrisma.alertPreferences.upsert(args), () => {
      const userId = args?.where?.userId;
      const idx = memoryStore.alertPrefs.findIndex((p) => p.userId === userId);
      if (idx >= 0) { memoryStore.alertPrefs[idx] = { ...memoryStore.alertPrefs[idx], ...args.update, updatedAt: new Date() }; return memoryStore.alertPrefs[idx]; }
      const c = { id: `alertpref-${Date.now()}`, ...args.create, createdAt: new Date(), updatedAt: new Date() };
      memoryStore.alertPrefs.push(c); return c;
    }),
  },

  playbookAccuracy: {
    findMany: async (args?: any) => safeExec(() => rawPrisma.playbookAccuracy.findMany(args), () => {
      let list = [...memoryStore.playbookAccuracy];
      if (args?.where?.moduleSlug) list = list.filter((p) => p.moduleSlug === args.where.moduleSlug);
      return list;
    }),
    findFirst: async (args?: any) => safeExec(() => rawPrisma.playbookAccuracy.findFirst(args), () => {
      return memoryStore.playbookAccuracy.find((p) => p.playbookSlug === args?.where?.playbookSlug) || null;
    }),
    upsert: async (args: any) => safeExec(() => rawPrisma.playbookAccuracy.upsert(args), () => {
      const slug = args.where.playbookSlug;
      const idx = memoryStore.playbookAccuracy.findIndex((p) => p.playbookSlug === slug);
      if (idx >= 0) { memoryStore.playbookAccuracy[idx] = { ...memoryStore.playbookAccuracy[idx], ...args.update, lastUpdated: new Date() }; return memoryStore.playbookAccuracy[idx]; }
      const c = { id: `pa-${Date.now()}`, ...args.create }; memoryStore.playbookAccuracy.push(c); return c;
    }),
    update: async (args: any) => safeExec(() => rawPrisma.playbookAccuracy.update(args), () => {
      const slug = args?.where?.playbookSlug;
      const idx = memoryStore.playbookAccuracy.findIndex((p) => p.playbookSlug === slug);
      if (idx >= 0) { memoryStore.playbookAccuracy[idx] = { ...memoryStore.playbookAccuracy[idx], ...args.data, lastUpdated: new Date() }; return memoryStore.playbookAccuracy[idx]; }
      return null;
    }),
  },

  $connect: async () => safeExec(() => rawPrisma.$connect(), () => Promise.resolve()),
  $disconnect: async () => safeExec(() => rawPrisma.$disconnect(), () => Promise.resolve()),
};

export const db = dbImplementation as unknown as PrismaClient;
