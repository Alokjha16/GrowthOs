// prisma/seed.ts — GrowthOS demo seed
// Creates demo@growthos.ai / Test@1234 with Rang Studio Indian D2C brand data

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
    // oldest → newest (month offset from today)
    { m: 5, rev: 1050000, exp: 680000,  cust: 900,  repeat: 24, aov: 1168, cac: 310, roas: 2.0, cart: 76, cod: 71, rto: 18, score: 48 },
    { m: 4, rev: 1220000, exp: 770000,  cust: 1050, repeat: 25, aov: 1162, cac: 330, roas: 2.1, cart: 75, cod: 69, rto: 19, score: 52 },
    { m: 3, rev: 1410000, exp: 880000,  cust: 1180, repeat: 26, aov: 1195, cac: 345, roas: 2.2, cart: 74, cod: 67, rto: 20, score: 55 },
    { m: 2, rev: 1580000, exp: 970000,  cust: 1290, repeat: 27, aov: 1225, cac: 358, roas: 2.3, cart: 73, cod: 65, rto: 21, score: 58 },
    { m: 1, rev: 1710000, exp: 1045000, cust: 1380, repeat: 27, aov: 1239, cac: 370, roas: 2.35,cart: 72, cod: 63, rto: 22, score: 60 },
    { m: 0, rev: 1840000, exp: 1120000, cust: 1470, repeat: 28, aov: 1250, cac: 380, roas: 2.4, cart: 71, cod: 62, rto: 22, score: 62 },
  ];

  for (const s of snapshots) {
    const date = new Date();
    date.setMonth(date.getMonth() - s.m);
    date.setDate(1);
    await db.businessSnapshot.create({
      data: {
        businessId:             business.id,
        revenue:                s.rev,
        expenses:               s.exp,
        customers:              s.cust,
        repeatRate:             s.repeat,
        healthScore:            s.score,
        averageOrderValue:      s.aov,
        customerAcquisitionCost: s.cac,
        returnOnAdSpend:        s.roas,
        cartAbandonmentRate:    s.cart,
        codRate:                s.cod,
        rtoRate:                s.rto,
        createdAt:              date,
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

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Seed complete!");
  console.log("   Email:    demo@growthos.ai");
  console.log("   Password: Test@1234");
  console.log("   Store:    Rang Studio — ₹18.4L/mo · COD 62% · RTO 22%");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
