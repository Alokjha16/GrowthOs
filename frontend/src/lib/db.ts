// src/lib/db.ts — GrowthOS resilient Database Client
// Tries PrismaClient (PostgreSQL / Supabase) with graceful zero-latency fallback to local demo store

import { PrismaClient } from "@prisma/client";
import { type AgentResult } from "@/agents/shared";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEMO DATASET (Rang Studio — Indian D2C Ethnic Wear Case Study)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_USER_ID = "demo-user-rang-studio";
const DEMO_BIZ_ID = "biz-rang-studio";

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
  { id: "snap-5", businessId: DEMO_BIZ_ID, revenue: 1050000, expenses: 680000,  customers: 900,  repeatRate: 24, averageOrderValue: 1168, customerAcquisitionCost: 310, returnOnAdSpend: 2.0, cartAbandonmentRate: 76, codRate: 71, rtoRate: 18, healthScore: 48, createdAt: new Date(Date.now() - 5 * 30 * 86400000) },
  { id: "snap-4", businessId: DEMO_BIZ_ID, revenue: 1220000, expenses: 770000,  customers: 1050, repeatRate: 25, averageOrderValue: 1162, customerAcquisitionCost: 330, returnOnAdSpend: 2.1, cartAbandonmentRate: 75, codRate: 69, rtoRate: 19, healthScore: 52, createdAt: new Date(Date.now() - 4 * 30 * 86400000) },
  { id: "snap-3", businessId: DEMO_BIZ_ID, revenue: 1410000, expenses: 880000,  customers: 1180, repeatRate: 26, averageOrderValue: 1195, customerAcquisitionCost: 345, returnOnAdSpend: 2.2, cartAbandonmentRate: 74, codRate: 67, rtoRate: 20, healthScore: 55, createdAt: new Date(Date.now() - 3 * 30 * 86400000) },
  { id: "snap-2", businessId: DEMO_BIZ_ID, revenue: 1580000, expenses: 970000,  customers: 1290, repeatRate: 27, averageOrderValue: 1225, customerAcquisitionCost: 358, returnOnAdSpend: 2.3, cartAbandonmentRate: 73, codRate: 65, rtoRate: 21, healthScore: 58, createdAt: new Date(Date.now() - 2 * 30 * 86400000) },
  { id: "snap-1", businessId: DEMO_BIZ_ID, revenue: 1710000, expenses: 1045000, customers: 1380, repeatRate: 27, averageOrderValue: 1239, customerAcquisitionCost: 370, returnOnAdSpend: 2.35,cartAbandonmentRate: 72, codRate: 63, rtoRate: 22, healthScore: 60, createdAt: new Date(Date.now() - 1 * 30 * 86400000) },
  { id: "snap-0", businessId: DEMO_BIZ_ID, revenue: 1840000, expenses: 1120000, customers: 1470, repeatRate: 28, averageOrderValue: 1250, customerAcquisitionCost: 380, returnOnAdSpend: 2.4, cartAbandonmentRate: 71, codRate: 62, rtoRate: 22, healthScore: 62, createdAt: new Date() },
];

const mockKnowledge = [
  {
    id: "k-1",
    source: "Shiprocket Annual D2C Logistics Benchmark Report 2024",
    category: "operations",
    industry: "Apparel & Ethnic Wear",
    content: "Indian apparel D2C brands average 60-65% COD orders. Return to Origin (RTO) rates for COD apparel range between 18% and 25%, costing brands an average of ₹240 per returned order in forward and reverse freight. Brands implementing active Non-Delivery Report (NDR) workflows with immediate customer contact via WhatsApp within 2 hours of failed attempt reduce overall RTO by 6-8 percentage points.",
    createdAt: new Date(),
  },
  {
    id: "k-2",
    source: "Razorpay Magic Checkout D2C Conversion Study 2024",
    category: "technology",
    industry: "Apparel & Ethnic Wear",
    content: "Address entry is the single largest drop-off point in Indian e-commerce checkout funnels, responsible for 68% of cart abandonment on mobile devices. 1-click checkout solutions pre-populating delivery addresses and saved UPI handles for 50M+ network shoppers boost checkout completion rates from 1.8% to 2.8%, generating an average 18-22% increase in net GMV.",
    createdAt: new Date(),
  },
  {
    id: "k-3",
    source: "Indian D2C Fashion & Apparel Playbook — Bain & Co",
    category: "finance",
    industry: "Apparel & Ethnic Wear",
    content: "Healthy Indian ethnic wear D2C brands maintain gross margins of 58-65%. At blended customer acquisition cost (CAC) of ₹350-450 and Average Order Value (AOV) of ₹1,200-1,600, contribution margin after marketing and logistics should exceed 22%. Brands with repeat customer rates below 25% require disproportionate ad spend and struggle with unit profitability.",
    createdAt: new Date(),
  },
  {
    id: "k-4",
    source: "Klaviyo & Interakt D2C Retention Benchmark India",
    category: "retention",
    industry: null,
    content: "WhatsApp automated flows for Indian D2C brands generate 82-88% open rates and 34% CTR within 1 hour of delivery confirmation, compared to 14% open rates for transactional email. Automated post-purchase cross-sell workflows sent on Day 3 post-delivery lift 30-day repeat purchase rate by 7.4 percentage points.",
    createdAt: new Date(),
  },
];

// In-Memory store singleton
const memoryStore = {
  users: [
    {
      id: DEMO_USER_ID,
      email: "demo@growthos.ai",
      name: "Jainam (Rang Studio)",
      password: "$2a$12$e0LU5bH38Xv3LhU4R7XbqeC6rXo8jU6eM9r.v9vI1QzP8Z3ZkI9Ky",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      emailVerified: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date(),
    },
  ],
  businesses: [
    {
      id: DEMO_BIZ_ID,
      userId: DEMO_USER_ID,
      name: "Rang Studio",
      businessType: "ECOMMERCE",
      industry: "Apparel & Ethnic Wear",
      website: "https://rangstudio.in",
      description: "Premium Indian ethnic wear D2C brand — kurtas, co-ords, and festive collections. Manufactured in Jaipur, shipped pan-India via Shiprocket. Target: women 22–40, Tier 1 & 2 cities.",
      monthlyRevenue: 1840000,
      monthlyExpenses: 1120000,
      customersPerMonth: 1470,
      repeatCustomerPercentage: 28,
      pricingLevel: "MEDIUM",
      averageOrderValue: 1250,
      customerAcquisitionCost: 380,
      returnOnAdSpend: 2.4,
      cartAbandonmentRate: 71,
      fulfillmentMethod: "THREE_PL",
      marketingChannels: ["INSTAGRAM", "FACEBOOK", "WHATSAPP", "GOOGLE_ADS", "MEESHO_ADS"],
      employeeCount: 12,
      healthScore: 62,
      codRate: 62,
      rtoRate: 22,
      prepaidPercentage: 38,
      inventoryTurnover: 4.2,
      returnRatePercentage: 22,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date(),
    },
  ],
  snapshots: [...mockSnapshots],
  analyses: [
    {
      id: "analysis-initial-rang-studio",
      businessId: DEMO_BIZ_ID,
      createdById: DEMO_USER_ID,
      status: "COMPLETED",
      healthScore: 62,
      summary: {
        topRisk: "22% RTO rate combined with 62% COD dependency is eroding ₹2.95L/month in unrecoverable courier freight charges.",
        biggestOpportunity: "Implementing 2-hour WhatsApp NDR verification and ₹100 prepaid UPI incentive can reduce RTO from 22% to 15%, adding ₹1.8L directly to bottom-line profit.",
        primaryAction: "Activate automated WhatsApp verification for all COD orders above ₹1,500 using Shiprocket Engage / Bikayi API within 24 hours.",
      },
      agents: RANG_STUDIO_AGENT_RESULTS,
      inputSnapshot: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  simulations: [
    {
      id: "sim-initial-rang-studio",
      businessId: DEMO_BIZ_ID,
      createdById: DEMO_USER_ID,
      status: "COMPLETED",
      strategy: "Shift 25% of COD customers to prepaid via instant UPI cashback of ₹75 and deploy WhatsApp NDR automation",
      confidenceScore: 88,
      shortTermOutcome: {
        revenueImpact: "+₹1.4L / month",
        expenseImpact: "-₹48,000 / month (freight savings)",
        netMarginImpact: "+3.8 percentage points",
        customerSentiment: "Positive (82% approval on WhatsApp confirmation)",
      },
      longTermOutcome: {
        annualizedSavings: "₹16.8 Lakhs",
        repeatPurchaseLift: "+18%",
        enterpriseValuationLift: "+₹45 Lakhs",
      },
      risks: [
        "Low initial customer response to WhatsApp messages if not branded with clear logo",
        "Payment gateway drop-offs during instant UPI incentive redirect",
      ],
      opportunities: [
        "Scale Shiprocket integration to auto-tag high-risk pincodes",
        "Bundle ethnic wear accessories to raise AOV above ₹2,000 threshold",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  reports: [
    {
      id: "rep-initial-rang-studio",
      businessId: DEMO_BIZ_ID,
      createdById: DEMO_USER_ID,
      analysisId: "analysis-initial-rang-studio",
      simulationId: null,
      type: "EXECUTIVE_SUMMARY",
      title: "Rang Studio Q4 Executive Growth & Unit Economics Report",
      executiveSummary: "Rang Studio demonstrates resilient customer acquisition across Tier 1 & 2 markets with ₹18.4L MRR, but profitability is severely bottlenecked by a 22% RTO rate on 62% COD orders. Immediate implementation of WhatsApp NDR automation and Razorpay Magic 1-click checkout will unlock ₹1.8L/month in net profit.",
      chiefRisk: "Unabsorbed reverse shipping freight of ₹23,900/month directly eroding EBITDA margins.",
      topOpportunity: "Recovering 7 percentage points of RTO through automated WhatsApp NDR verification.",
      immediateAction: "Configure Shiprocket WhatsApp NDR webhook and deploy Razorpay Magic 1-click checkout within 48 hours.",
      actionPlan: [
        { step: 1, action: "Enable WhatsApp NDR workflow on Shiprocket", owner: "Operations Lead", timeline: "Day 1-3" },
        { step: 2, action: "Implement ₹80 COD fee on high-risk pincodes", owner: "Finance Lead", timeline: "Day 4-7" },
        { step: 3, action: "Reallocate 40% ad budget to UGC creator reels", owner: "Growth Marketer", timeline: "Day 8-14" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  knowledge: [...mockKnowledge],
  feedback: [] as any[],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRISMA CLIENT & FALLBACK WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prismaInstance?: PrismaClient;
  dbOffline?: boolean;
  lastChecked?: number;
};

const rawPrisma =
  globalForPrisma.prismaInstance ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaInstance = rawPrisma;
}

// Timeout helper: if a query takes > 1200ms or fails, switch to fallback
async function withTimeout<T>(promise: Promise<T>, ms: number = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Database query timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function safeExec(prismaFn: () => Promise<any>, fallbackFn: () => any): Promise<any> {
  // If previously marked offline within the last 60 seconds, skip slow connection attempts
  const now = Date.now();
  if (globalForPrisma.dbOffline && globalForPrisma.lastChecked && now - globalForPrisma.lastChecked < 60000) {
    return fallbackFn();
  }

  try {
    const result = await withTimeout(prismaFn(), 1200);
    globalForPrisma.dbOffline = false;
    globalForPrisma.lastChecked = now;
    return result;
  } catch (err: any) {
    globalForPrisma.dbOffline = true;
    globalForPrisma.lastChecked = now;
    return fallbackFn();
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. COMPLETE MOCK / FALLBACK MODELS
// ─────────────────────────────────────────────────────────────────────────────

const dbImplementation = {

  user: {
    findUnique: async (args: any) => {
      return safeExec(
        () => rawPrisma.user.findUnique(args),
        () => {
          const email = args?.where?.email?.toLowerCase();
          const id = args?.where?.id;
          return (
            memoryStore.users.find(
              (u) => (email && u.email.toLowerCase() === email) || (id && u.id === id)
            ) || null
          );
        }
      );
    },
    count: async (args?: any) => {
      return safeExec(
        () => rawPrisma.user.count(args),
        () => memoryStore.users.length
      );
    },
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.user.create(args),
        () => {
          const newUser = {
            id: `user-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryStore.users.push(newUser);
          return newUser;
        }
      );
    },
    upsert: async (args: any) => {
      return safeExec(
        () => rawPrisma.user.upsert(args),
        () => {
          const email = args?.where?.email?.toLowerCase();
          const idx = memoryStore.users.findIndex((u) => u.email.toLowerCase() === email);
          if (idx >= 0) {
            memoryStore.users[idx] = { ...memoryStore.users[idx], ...args.update, updatedAt: new Date() };
            return memoryStore.users[idx];
          }
          const created = { id: `user-${Date.now()}`, ...args.create, createdAt: new Date(), updatedAt: new Date() };
          memoryStore.users.push(created);
          return created;
        }
      );
    },
  },

  business: {
    findFirst: async (args?: any) => {
      return safeExec(
        () => rawPrisma.business.findFirst(args),
        () => {
          const userId = args?.where?.userId;
          const id = args?.where?.id;
          const biz =
            memoryStore.businesses.find(
              (b) => (userId && (b.userId === userId || userId === DEMO_USER_ID)) || (id && b.id === id)
            ) || memoryStore.businesses[0];

          if (!biz) return null;

          if (args?.include?.analyses) {
            const completedAnalyses = memoryStore.analyses
              .filter((a) => a.businessId === biz.id && (!args.include.analyses.where?.status || a.status === args.include.analyses.where.status))
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            return {
              ...biz,
              analyses: args.include.analyses.take ? completedAnalyses.slice(0, args.include.analyses.take) : completedAnalyses,
            };
          }

          return biz;
        }
      );
    },
    findMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.business.findMany(args),
        () => {
          const userId = args?.where?.userId;
          return memoryStore.businesses.filter(
            (b) => !userId || b.userId === userId || userId === DEMO_USER_ID
          );
        }
      );
    },
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.business.create(args),
        () => {
          const newBiz = {
            id: `biz-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryStore.businesses.push(newBiz);
          return newBiz;
        }
      );
    },
    update: async (args: any) => {
      return safeExec(
        () => rawPrisma.business.update(args),
        () => {
          const id = args?.where?.id;
          const idx = memoryStore.businesses.findIndex((b) => b.id === id);
          if (idx >= 0) {
            memoryStore.businesses[idx] = {
              ...memoryStore.businesses[idx],
              ...args.data,
              updatedAt: new Date(),
            };
            return memoryStore.businesses[idx];
          }
          return memoryStore.businesses[0];
        }
      );
    },
  },

  businessSnapshot: {
    findMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.businessSnapshot.findMany(args),
        () => {
          let list = [...memoryStore.snapshots];
          if (args?.where?.businessId) {
            list = list.filter((s) => s.businessId === args.where.businessId);
          }
          if (args?.orderBy?.createdAt === "desc") {
            list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          } else {
            list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          }
          if (args?.take) {
            list = list.slice(0, args.take);
          }
          return list;
        }
      );
    },
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.businessSnapshot.create(args),
        () => {
          const snap = {
            id: `snap-${Date.now()}`,
            ...args.data,
            createdAt: args.data.createdAt ?? new Date(),
          };
          memoryStore.snapshots.push(snap);
          return snap;
        }
      );
    },
    deleteMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.businessSnapshot.deleteMany(args),
        () => {
          if (args?.where?.businessId) {
            memoryStore.snapshots = memoryStore.snapshots.filter(
              (s) => s.businessId !== args.where.businessId
            );
          }
          return { count: 0 };
        }
      );
    },
  },

  analysis: {
    findFirst: async (args?: any) => {
      return safeExec(
        () => rawPrisma.analysis.findFirst(args),
        () => {
          const id = args?.where?.id;
          const businessId = args?.where?.businessId;
          return (
            memoryStore.analyses.find(
              (a) => (id && a.id === id) || (businessId && a.businessId === businessId)
            ) || memoryStore.analyses[0] || null
          );
        }
      );
    },
    findMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.analysis.findMany(args),
        () => {
          let list = [...memoryStore.analyses];
          if (args?.where?.businessId) {
            list = list.filter((a) => a.businessId === args.where.businessId);
          }
          if (args?.where?.status) {
            list = list.filter((a) => a.status === args.where.status);
          }
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          if (args?.take) list = list.slice(0, args.take);
          return list;
        }
      );
    },
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.analysis.create(args),
        () => {
          const newA = {
            id: `analysis-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryStore.analyses.unshift(newA);
          return newA;
        }
      );
    },
    update: async (args: any) => {
      return safeExec(
        () => rawPrisma.analysis.update(args),
        () => {
          const id = args?.where?.id;
          const idx = memoryStore.analyses.findIndex((a) => a.id === id);
          if (idx >= 0) {
            memoryStore.analyses[idx] = {
              ...memoryStore.analyses[idx],
              ...args.data,
              updatedAt: new Date(),
            };
            return memoryStore.analyses[idx];
          }
          return memoryStore.analyses[0];
        }
      );
    },
  },

  simulation: {
    findFirst: async (args?: any) => {
      return safeExec(
        () => rawPrisma.simulation.findFirst(args),
        () => {
          const id = args?.where?.id;
          return memoryStore.simulations.find((s) => s.id === id) || memoryStore.simulations[0] || null;
        }
      );
    },
    findMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.simulation.findMany(args),
        () => {
          let list = [...memoryStore.simulations];
          if (args?.where?.businessId) {
            list = list.filter((s) => s.businessId === args.where.businessId);
          }
          if (args?.where?.status) {
            list = list.filter((s) => s.status === args.where.status);
          }
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          if (args?.take) list = list.slice(0, args.take);
          return list;
        }
      );
    },
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.simulation.create(args),
        () => {
          const sim = {
            id: `sim-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryStore.simulations.unshift(sim);
          return sim;
        }
      );
    },
    update: async (args: any) => {
      return safeExec(
        () => rawPrisma.simulation.update(args),
        () => {
          const id = args?.where?.id;
          const idx = memoryStore.simulations.findIndex((s) => s.id === id);
          if (idx >= 0) {
            memoryStore.simulations[idx] = {
              ...memoryStore.simulations[idx],
              ...args.data,
              updatedAt: new Date(),
            };
            return memoryStore.simulations[idx];
          }
          return memoryStore.simulations[0];
        }
      );
    },
  },

  report: {
    findFirst: async (args?: any) => {
      return safeExec(
        () => rawPrisma.report.findFirst(args),
        () => {
          const id = args?.where?.id;
          return memoryStore.reports.find((r) => r.id === id) || memoryStore.reports[0] || null;
        }
      );
    },
    findMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.report.findMany(args),
        () => {
          let list = [...memoryStore.reports];
          if (args?.where?.businessId) {
            list = list.filter((r) => r.businessId === args.where.businessId);
          }
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          if (args?.take) list = list.slice(0, args.take);
          return list;
        }
      );
    },
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.report.create(args),
        () => {
          const rep = {
            id: `rep-${Date.now()}`,
            ...args.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryStore.reports.unshift(rep);
          return rep;
        }
      );
    },
  },

  knowledgeChunk: {
    findMany: async (args?: any) => {
      return safeExec(
        () => rawPrisma.knowledgeChunk.findMany(args),
        () => {
          let list = [...memoryStore.knowledge];
          if (args?.where?.category) {
            list = list.filter((k) => k.category === args.where.category);
          }
          if (args?.take) list = list.slice(0, args.take);
          return list;
        }
      );
    },
    deleteMany: async () => ({ count: 0 }),
  },

  agentFeedback: {
    create: async (args: any) => {
      return safeExec(
        () => rawPrisma.agentFeedback.create(args),
        () => {
          const fb = { id: `fb-${Date.now()}`, ...args.data, createdAt: new Date() };
          memoryStore.feedback.push(fb);
          return fb;
        }
      );
    },
  },

  $connect: async () => {
    return safeExec(
      () => rawPrisma.$connect(),
      () => Promise.resolve()
    );
  },
  $disconnect: async () => {
    return safeExec(
      () => rawPrisma.$disconnect(),
      () => Promise.resolve()
    );
  },
};

export const db = dbImplementation as unknown as PrismaClient;

