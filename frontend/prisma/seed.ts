// prisma/seed.ts — GrowthOS demo seed
// Creates demo@growthos.ai / Test@1234 with Rang Studio Indian D2C brand data
// Phase 1: Added Subscription, Entitlement, AutopilotPreferences, Findings,
//          Benchmarks, AlertPreferences, and PlaybookAccuracy records.

import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

// Seeds must use DIRECT_URL (port 5432 session pooler)
const db = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

async function main() {
  console.log("🌱 Seeding GrowthOS with Rang Studio (Indian D2C)...\n");

  // ── 1. Demo user ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcryptjs.hash("Test@1234", 12);
  const user = await db.user.upsert({
    where:  { email: "demo@growthos.ai" },
    update: { password: hashedPassword },
    create: { email: "demo@growthos.ai", name: "Jainam (Demo)", password: hashedPassword },
  });
  console.log(`✅ User: ${user.email} / Test@1234`);

  // ── 2. Business ───────────────────────────────────────────────────────────────
  const existing = await db.business.findFirst({ where: { userId: user.id } });
  const businessData = {
    userId:                   user.id,
    name:                     "Rang Studio",
    businessType:             "ECOMMERCE" as const,
    industry:                 "Apparel & Ethnic Wear",
    storeCategory:            "APPAREL",
    website:                  "https://rangstudio.in",
    description:              "Premium Indian ethnic wear D2C brand — kurtas, co-ords, and festive collections. Manufactured in Jaipur, shipped pan-India via Shiprocket. Target: women 22–40, Tier 1 & 2 cities.",
    monthlyRevenue:           1840000,   // ₹18.4L
    monthlyExpenses:          1120000,   // ₹11.2L
    customersPerMonth:        1470,
    repeatCustomerPercentage: 28,
    pricingLevel:             "MEDIUM" as const,
    averageOrderValue:        1250,      // ₹1,250
    customerAcquisitionCost:  380,       // ₹380
    returnOnAdSpend:          2.4,
    cartAbandonmentRate:      71,
    fulfillmentMethod:        "THREE_PL" as const,
    marketingChannels:        ["INSTAGRAM", "FACEBOOK", "WHATSAPP", "GOOGLE_ADS", "MEESHO_ADS"],
    healthScore:              62,
    // India-specific
    codRate:                  62,        // 62% COD
    rtoRate:                  22,        // 22% RTO
    prepaidPercentage:        38,
  };

  const business = existing
    ? await db.business.update({ where: { id: existing.id }, data: businessData })
    : await db.business.create({ data: businessData });
  console.log(`✅ Business: "${business.name}"`);

  // ── 3. 6 months of historical snapshots ─────────────────────────────────────
  await db.businessSnapshot.deleteMany({ where: { businessId: business.id } });

  const snapshots = [
    { m: 5, rev: 1050000, exp: 680000,  cust: 900,  repeat: 24, aov: 1168, cac: 310, roas: 2.0,  cart: 76, cod: 71, rto: 18, score: 48 },
    { m: 4, rev: 1220000, exp: 770000,  cust: 1050, repeat: 25, aov: 1162, cac: 330, roas: 2.1,  cart: 75, cod: 69, rto: 19, score: 52 },
    { m: 3, rev: 1410000, exp: 880000,  cust: 1180, repeat: 26, aov: 1195, cac: 345, roas: 2.2,  cart: 74, cod: 67, rto: 20, score: 55 },
    { m: 2, rev: 1580000, exp: 970000,  cust: 1290, repeat: 27, aov: 1225, cac: 358, roas: 2.3,  cart: 73, cod: 65, rto: 21, score: 58 },
    { m: 1, rev: 1710000, exp: 1045000, cust: 1380, repeat: 27, aov: 1239, cac: 370, roas: 2.35, cart: 72, cod: 63, rto: 22, score: 60 },
    { m: 0, rev: 1840000, exp: 1120000, cust: 1470, repeat: 28, aov: 1250, cac: 380, roas: 2.4,  cart: 71, cod: 62, rto: 22, score: 62 },
  ];

  for (const s of snapshots) {
    const date = new Date();
    date.setMonth(date.getMonth() - s.m);
    date.setDate(1);
    await db.businessSnapshot.create({
      data: {
        businessId:              business.id,
        revenue:                 s.rev,
        expenses:                s.exp,
        customers:               s.cust,
        repeatRate:              s.repeat,
        healthScore:             s.score,
        averageOrderValue:       s.aov,
        customerAcquisitionCost: s.cac,
        returnOnAdSpend:         s.roas,
        cartAbandonmentRate:     s.cart,
        codRate:                 s.cod,
        rtoRate:                 s.rto,
        createdAt:               date,
      },
    });
  }
  console.log(`✅ 6 months of historical snapshots (showing rising CAC + RTO trends)`);

  // ── 4. Knowledge Base Chunks (RAG Seed Data) ────────────────────────────────
  await db.knowledgeChunk.deleteMany({});
  const knowledgeData = [
    {
      source: "Shiprocket Annual D2C Logistics Benchmark Report 2024",
      category: "operations",
      industry: "Apparel & Ethnic Wear",
      content: "Indian apparel D2C brands average 60-65% COD orders. Return to Origin (RTO) rates for COD apparel range between 18% and 25%, costing brands an average of ₹240 per returned order in forward and reverse freight. Brands implementing active Non-Delivery Report (NDR) workflows with immediate customer contact via WhatsApp within 2 hours of failed attempt reduce overall RTO by 6-8 percentage points.",
    },
    {
      source: "Razorpay D2C Payments & Conversion Playbook",
      category: "technology",
      industry: null,
      content: "Implementing 1-click checkout engines (such as Razorpay Magic Checkout or Gokwik) increases prepaid conversion by 20% to 35% on Indian D2C stores. Offering an instant ₹50 flat discount or 5% off for prepaid payments yields a 4.2x ROI by avoiding RTO shipping losses and improving cash flow cycles by 14 days.",
    },
    {
      source: "Indian D2C Finance & Profitability State of Industry",
      category: "finance",
      industry: "Apparel & Ethnic Wear",
      content: "Healthy gross margins for Indian apparel D2C brands range from 55% to 65%. Brands running gross margins below 45% routinely bleed capital due to unabsorbed logistics overhead, high customer acquisition costs (CAC), and aggressive festive discounting. COGS target should be capped at 35-40% of retail price.",
    },
    {
      source: "Meta & Google Ad Performance in Tier 1 & Tier 2 India",
      category: "marketing",
      industry: null,
      content: "Blended ROAS benchmark for scaling Indian D2C brands is 2.5x to 3.5x. Meta ad costs (CAC) typically spike during festival seasons (Q3-Q4) by 25-40%. Diversifying 20-30% of ad spend to Google Shopping and High-intent Search campaigns stabilizes blended ROAS and attracts higher-intent prepaid customers.",
    },
    {
      source: "WhatsApp Business D2C Retention Playbook 2024",
      category: "retention",
      industry: null,
      content: "In India, WhatsApp marketing flows achieve an 85-90% open rate and 18-24% click-through rate compared to email's 12% open rate. Post-purchase automated sequences (Day 3 care guide, Day 15 review + coupon, Day 45 replenishment) increase repeat customer revenue by 22-30% within 60 days.",
    },
    {
      source: "Indian D2C Supply Chain & WMS Insights",
      category: "inventory",
      industry: null,
      content: "Optimal inventory turnover velocity for Indian lifestyle and apparel D2C is 6x-8x per year. Stockout rates above 5% cause permanent LTV degradation as 65% of Indian buyers purchase from competitors if an item is out of stock. Implementing automated reorder point alerts prevents stockouts of top 20% revenue-generating SKUs.",
    },
  ];

  for (const k of knowledgeData) {
    await db.knowledgeChunk.create({ data: k });
  }
  console.log(`✅ Seeded ${knowledgeData.length} RAG knowledge chunks for Indian D2C benchmarks`);

  // ── 5. Phase 1: Subscription & Entitlement (GROWTH Plan) ───────────────────
  const subscription = await db.subscription.upsert({
    where:  { userId: user.id },
    update: { planTier: "GROWTH", status: "active", billingCycle: "monthly" },
    create: {
      userId:           user.id,
      planTier:         "GROWTH",
      billingCycle:     "monthly",
      status:           "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
    },
  });

  await db.entitlement.deleteMany({ where: { userId: user.id } });
  await db.entitlement.create({
    data: {
      userId:         user.id,
      subscriptionId: subscription.id,
      type:           "PLAN",
      planTier:       "GROWTH",
      status:         "ACTIVE",
    },
  });
  console.log(`✅ Seeded Growth Plan Subscription & Active Entitlement for user`);

  // ── 6. Phase 1: Autopilot & Alert Preferences ──────────────────────────────
  await db.autopilotPreferences.upsert({
    where:  { userId: user.id },
    update: { shadowModeActive: true, killSwitchActive: false },
    create: {
      userId:                  user.id,
      killSwitchActive:        false,
      shadowModeActive:        true,
      shadowModeStartedAt:     new Date(Date.now() - 3 * 86400000),
      autoRollbackEnabled:     false,
      maxBudgetChangePct:      20,
      maxPriceChangePct:       10,
      maxDailyAdSpendShiftPct: 25,
      protectedEntityIds:      [],
    },
  });

  await db.alertPreferences.upsert({
    where:  { userId: user.id },
    update: { emailEnabled: true },
    create: {
      userId:                       user.id,
      emailEnabled:                 true,
      whatsappEnabled:              false,
      weeklyDigestDay:              1,
      roasDropThresholdPct:         20,
      stockDaysThreshold:           7,
      rtoSpikeThresholdPct:         5,
      abandonmentSpikeThresholdPct: 10,
    },
  });
  console.log(`✅ Seeded Autopilot & Alert Preferences (Shadow Mode = ON, Kill Switch = OFF)`);

  // ── 7. Phase 1: Benchmarks (Seeded for APPAREL Category) ───────────────────
  const benchmarksData = [
    { moduleSlug: "ADS" as const,         category: "APPAREL", metric: "roas",                  p25: 1.8,  median: 2.8,  p75: 4.2,  unit: "x",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Meta D2C India Benchmark 2024" },
    { moduleSlug: "ADS" as const,         category: "APPAREL", metric: "cac",                   p25: 280,  median: 420,  p75: 680,  unit: "₹",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Bain & Co D2C India Report 2024" },
    { moduleSlug: "PROFIT" as const,      category: "APPAREL", metric: "gross_margin",          p25: 45,   median: 58,   p75: 65,   unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Bain & Co D2C India Report 2024" },
    { moduleSlug: "PROFIT" as const,      category: "APPAREL", metric: "contribution_margin",   p25: 14,   median: 22,   p75: 32,   unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Bain & Co D2C India Report 2024" },
    { moduleSlug: "PROFIT" as const,      category: "APPAREL", metric: "aov",                   p25: 900,  median: 1350, p75: 2100, unit: "₹",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Unicommerce D2C Report 2024" },
    { moduleSlug: "INVENTORY" as const,   category: "APPAREL", metric: "inventory_turnover",    p25: 3.5,  median: 6.0,  p75: 9.0,  unit: "x",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Unicommerce Inventory Report 2024" },
    { moduleSlug: "INVENTORY" as const,   category: "APPAREL", metric: "days_of_stock",         p25: 21,   median: 35,   p75: 60,   unit: "days", source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Unicommerce Inventory Report 2024" },
    { moduleSlug: "RETENTION" as const,   category: "APPAREL", metric: "repeat_rate",           p25: 18,   median: 28,   p75: 40,   unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Klaviyo India D2C Benchmark 2024" },
    { moduleSlug: "RETENTION" as const,   category: "APPAREL", metric: "ltv_cac_ratio",         p25: 1.5,  median: 2.5,  p75: 4.0,  unit: "x",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Klaviyo India D2C Benchmark 2024" },
    { moduleSlug: "CART_CRO" as const,    category: "APPAREL", metric: "cart_abandonment_rate", p25: 55,   median: 68,   p75: 80,   unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Razorpay D2C Checkout Report 2024" },
    { moduleSlug: "CART_CRO" as const,    category: "APPAREL", metric: "checkout_conversion",   p25: 1.2,  median: 2.0,  p75: 3.5,  unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Razorpay D2C Checkout Report 2024" },
    { moduleSlug: "FULFILLMENT" as const, category: "APPAREL", metric: "rto_rate",              p25: 10,   median: 15,   p75: 22,   unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Shiprocket Logistics Report 2024" },
    { moduleSlug: "FULFILLMENT" as const, category: "APPAREL", metric: "cod_rate",              p25: 40,   median: 58,   p75: 72,   unit: "%",    source: "INDUSTRY_ESTIMATE" as const, sourceLabel: "Industry estimate — Shiprocket Logistics Report 2024" },
  ];

  for (const bm of benchmarksData) {
    await db.benchmark.upsert({
      where: {
        moduleSlug_category_metric: {
          moduleSlug: bm.moduleSlug,
          category:   bm.category,
          metric:     bm.metric,
        },
      },
      update: bm,
      create: bm,
    });
  }
  console.log(`✅ Seeded ${benchmarksData.length} category benchmarks for Apparel & Ethnic Wear`);

  // ── 8. Phase 1: Findings (Deterministic Money Impacts) ──────────────────────
  await db.finding.deleteMany({ where: { businessId: business.id } });

  const findingsData = [
    {
      businessId:    business.id,
      moduleSlug:    "ADS" as const,
      title:         "3 Meta ad sets spent ₹62,000 at ROAS 0.7 — below break-even",
      description:   "Three ad sets in your 'Ethnic Festive Collection' campaign have a ROAS of 0.7x over the last 30 days. Your break-even ROAS (based on 39% gross margin) is 2.56x. Pausing these ad sets would stop ₹41,000/month of guaranteed losses.",
      moneyImpact:   41000,
      impactFormula: "wasted_spend = ad_sets_spend × (1 - roas / breakeven_roas)",
      impactInputs:  { adSetsSpend: 62000, roas: 0.7, breakevenRoas: 2.56, grossMarginPct: 39 },
      impactWindow:  "last 30 days",
      confidence:    "HIGH" as const,
      dismissed:     false,
    },
    {
      businessId:    business.id,
      moduleSlug:    "FULFILLMENT" as const,
      title:         "COD orders to 14 pincodes have 38% RTO — ₹33,000/month loss",
      description:   "14 pincodes across UP, Bihar, and Rajasthan show a 38% RTO rate on COD orders — more than double your average. Each RTO costs ₹240 in forward + reverse freight. Switching these pincodes to prepaid-only would eliminate this loss.",
      moneyImpact:   33000,
      impactFormula: "rto_loss = high_rto_cod_orders × rto_rate × avg_rto_cost",
      impactInputs:  { highRtoCodOrders: 362, rtoRate: 0.38, avgRtoCost: 240 },
      impactWindow:  "last 30 days",
      confidence:    "HIGH" as const,
      dismissed:     false,
    },
    {
      businessId:    business.id,
      moduleSlug:    "RETENTION" as const,
      title:         "1,240 customers haven't reordered in 90+ days — ₹1.1L/month win-back opportunity",
      description:   "1,240 customers who purchased between 90 and 180 days ago have not placed a second order. Based on your average order value of ₹1,250 and a typical 8% win-back conversion rate, a targeted WhatsApp campaign could recover approximately ₹1.1L/month.",
      moneyImpact:   110000,
      impactFormula: "winback_revenue = lapsed_customers × winback_conversion_rate × aov",
      impactInputs:  { lapsedCustomers: 1240, winbackConversionRate: 0.071, aov: 1250 },
      impactWindow:  "last 90 days",
      confidence:    "MEDIUM" as const,
      dismissed:     false,
    },
  ];

  for (const f of findingsData) {
    await db.finding.create({ data: f });
  }
  console.log(`✅ Seeded ${findingsData.length} findings with quantified monthly money impact`);

  // ── 9. Phase 1: Playbook Accuracy Baseline ─────────────────────────────────
  const playbookAccuracies = [
    { playbookSlug: "pause-wasting-ad-sets",          moduleSlug: "ADS" as const },
    { playbookSlug: "prepaid-only-high-rto-pincodes", moduleSlug: "FULFILLMENT" as const },
    { playbookSlug: "winback-campaign-lapsed",        moduleSlug: "RETENTION" as const },
    { playbookSlug: "enable-abandoned-cart-recovery", moduleSlug: "CART_CRO" as const },
    { playbookSlug: "reorder-draft-low-stock",        moduleSlug: "INVENTORY" as const },
    { playbookSlug: "reprice-loss-making-skus",       moduleSlug: "PROFIT" as const },
  ];

  for (const pa of playbookAccuracies) {
    await db.playbookAccuracy.upsert({
      where:  { playbookSlug: pa.playbookSlug },
      update: pa,
      create: { ...pa, totalRuns: 0, accurateRuns: 0, avgAccuracyPct: null },
    });
  }
  console.log(`✅ Seeded PlaybookAccuracy records for 6 core playbooks`);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Seed complete!");
  console.log("   Email:        demo@growthos.ai");
  console.log("   Password:     Test@1234");
  console.log("   Store:        Rang Studio — ₹18.4L/mo · COD 62% · RTO 22%");
  console.log("   Subscription: Growth Plan (Active)");
  console.log("   Autopilot:    Shadow Mode ON · Kill Switch OFF");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
