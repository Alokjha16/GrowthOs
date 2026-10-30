// src/lib/modules/registry.ts
// GrowthOS — Config-driven Module Registry
// Adding a new module = adding one entry here. No other file changes needed.

export type ModuleSlug =
  | "ads"
  | "profit"
  | "inventory"
  | "retention"
  | "cart-cro"
  | "fulfillment";

export interface PlaybookConfig {
  slug: string;
  name: string;
  description: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  /** Platform adapters this playbook requires */
  platforms: string[];
}

export interface BenchmarkMetricConfig {
  key: string;          // matches Benchmark.metric in DB
  label: string;        // "Repeat Rate"
  unit: "%" | "₹" | "x" | "days";
  higherIsBetter: boolean;
}

export interface ModuleConfig {
  slug: ModuleSlug;
  name: string;
  description: string;
  /** DB enum value — must match Prisma ModuleSlug enum */
  dbSlug: "ADS" | "PROFIT" | "INVENTORY" | "RETENTION" | "CART_CRO" | "FULFILLMENT";
  route: string;
  icon: string;          // lucide icon name
  color: string;         // tailwind color class for accents
  agentNames: string[];  // names of agents that feed this module
  metrics: BenchmarkMetricConfig[];
  playbooks: PlaybookConfig[];
  /** UNUSED — future standalone-product config. Do not read this at runtime today. */
  standalone?: {
    headline: string;
    problemStatement: string;
    price: string;       // placeholder, not enforced
  };
}

export const MODULE_REGISTRY: ModuleConfig[] = [
  {
    slug: "ads",
    name: "Ads",
    description: "Detect wasted ad spend, low-ROAS campaigns, and high CAC across Meta & Google.",
    dbSlug: "ADS",
    route: "/dashboard/ads",
    icon: "BarChart3",
    color: "blue",
    agentNames: ["Marketing"],
    metrics: [
      { key: "roas",          label: "Blended ROAS",     unit: "x",    higherIsBetter: true  },
      { key: "cac",           label: "Customer CAC",     unit: "₹",    higherIsBetter: false },
      { key: "repeat_rate",   label: "Repeat Rate",      unit: "%",    higherIsBetter: true  },
    ],
    playbooks: [
      {
        slug: "pause-wasting-ad-sets",
        name: "Pause Wasting Ad Sets & Reallocate Budget",
        description: "Identify ad sets below break-even ROAS, pause them, and shift budget to top performers.",
        riskLevel: "LOW",
        platforms: ["meta_ads"],
      },
    ],
    standalone: {
      headline: "Stop burning ad budget",
      problemStatement: "Most D2C brands waste 30–40% of ad spend on ad sets below break-even ROAS.",
      price: "TBD",
    },
  },
  {
    slug: "profit",
    name: "Profit",
    description: "Surface loss-making SKUs, margin erosion, and discount-driven profit leakage.",
    dbSlug: "PROFIT",
    route: "/dashboard/profit",
    icon: "TrendingUp",
    color: "emerald",
    agentNames: ["Finance", "Unit Economics"],
    metrics: [
      { key: "gross_margin",      label: "Gross Margin",        unit: "%",    higherIsBetter: true  },
      { key: "contribution_margin", label: "Contribution Margin", unit: "%",  higherIsBetter: true  },
      { key: "aov",               label: "Avg. Order Value",    unit: "₹",    higherIsBetter: true  },
    ],
    playbooks: [
      {
        slug: "reprice-loss-making-skus",
        name: "Reprice Loss-Making SKUs",
        description: "Propose price increases for SKUs with negative contribution margin — applied only after approval.",
        riskLevel: "HIGH",
        platforms: ["shopify"],
      },
    ],
    standalone: {
      headline: "Find your hidden profit leaks",
      problemStatement: "The average D2C brand has 3–5 SKUs losing money on every order.",
      price: "TBD",
    },
  },
  {
    slug: "inventory",
    name: "Inventory",
    description: "Flag stock-out risk, overstock tying up cash, and slow-moving SKUs.",
    dbSlug: "INVENTORY",
    route: "/dashboard/inventory",
    icon: "Package",
    color: "amber",
    agentNames: ["Inventory"],
    metrics: [
      { key: "inventory_turnover",  label: "Inventory Turnover",  unit: "x",    higherIsBetter: true  },
      { key: "stockout_rate",       label: "Stockout Rate",       unit: "%",    higherIsBetter: false },
      { key: "days_of_stock",       label: "Days of Stock",       unit: "days", higherIsBetter: true  },
    ],
    playbooks: [
      {
        slug: "reorder-draft-low-stock",
        name: "Draft Purchase Order for Low-Stock SKUs",
        description: "Auto-draft a supplier purchase order for SKUs with < 14 days of stock.",
        riskLevel: "LOW",
        platforms: ["shopify"],
      },
    ],
    standalone: {
      headline: "Never stock out again",
      problemStatement: "65% of Indian D2C buyers switch brands when a product is out of stock.",
      price: "TBD",
    },
  },
  {
    slug: "retention",
    name: "Retention",
    description: "Detect low repeat-purchase rates, lapsed customer segments, and cohort drop-offs.",
    dbSlug: "RETENTION",
    route: "/dashboard/retention",
    icon: "Users",
    color: "violet",
    agentNames: ["Retention"],
    metrics: [
      { key: "repeat_rate",         label: "Repeat Purchase Rate", unit: "%",  higherIsBetter: true  },
      { key: "ltv_cac_ratio",       label: "LTV : CAC Ratio",      unit: "x",  higherIsBetter: true  },
      { key: "lapsed_customer_pct", label: "Lapsed Customer %",    unit: "%",  higherIsBetter: false },
    ],
    playbooks: [
      {
        slug: "winback-campaign-lapsed",
        name: "Win-Back Campaign for Lapsed Customers",
        description: "Launch a targeted email/WhatsApp win-back campaign for customers who haven't purchased in 90+ days.",
        riskLevel: "LOW",
        platforms: ["manual"],
      },
    ],
    standalone: {
      headline: "Double your repeat purchase rate",
      problemStatement: "A 5% lift in repeat rate adds 25–95% to profit — without spending on new customer acquisition.",
      price: "TBD",
    },
  },
  {
    slug: "cart-cro",
    name: "Cart / CRO",
    description: "Identify checkout funnel drop-offs, high cart abandonment, and missing recovery flows.",
    dbSlug: "CART_CRO",
    route: "/dashboard/cart-cro",
    icon: "ShoppingCart",
    color: "orange",
    agentNames: ["Technology"],
    metrics: [
      { key: "cart_abandonment_rate", label: "Cart Abandonment",    unit: "%",  higherIsBetter: false },
      { key: "checkout_conversion",   label: "Checkout Conversion", unit: "%",  higherIsBetter: true  },
    ],
    playbooks: [
      {
        slug: "enable-abandoned-cart-recovery",
        name: "Enable Abandoned-Cart Recovery Flow",
        description: "Enable an automated cart-recovery email/WhatsApp sequence with a capped discount code.",
        riskLevel: "LOW",
        platforms: ["shopify", "manual"],
      },
    ],
    standalone: {
      headline: "Recover your abandoned carts",
      problemStatement: "71% of carts are abandoned. A recovery flow captures 10–15% of those sales back.",
      price: "TBD",
    },
  },
  {
    slug: "fulfillment",
    name: "Fulfillment",
    description: "Surface high-RTO pincodes, late shipments by courier, and COD-driven losses.",
    dbSlug: "FULFILLMENT",
    route: "/dashboard/fulfillment",
    icon: "Truck",
    color: "rose",
    agentNames: ["Operations"],
    metrics: [
      { key: "rto_rate",        label: "RTO Rate",          unit: "%",  higherIsBetter: false },
      { key: "cod_rate",        label: "COD Rate",          unit: "%",  higherIsBetter: false },
      { key: "fulfillment_sla", label: "Avg. Dispatch SLA", unit: "days", higherIsBetter: false },
    ],
    playbooks: [
      {
        slug: "prepaid-only-high-rto-pincodes",
        name: "Prepaid-Only for High-RTO Pincodes",
        description: "Switch COD to prepaid-only for pincodes with >35% historical RTO rate.",
        riskLevel: "MEDIUM",
        platforms: ["shopify"],
      },
    ],
    standalone: {
      headline: "Stop losing money on RTO",
      problemStatement: "The average Indian D2C brand loses ₹240 per RTO shipment. High-risk pincodes can be blocked in minutes.",
      price: "TBD",
    },
  },
];

/** Look up a module by its slug */
export function getModule(slug: ModuleSlug): ModuleConfig | undefined {
  return MODULE_REGISTRY.find((m) => m.slug === slug);
}

/** Look up a module by its DB enum slug */
export function getModuleByDbSlug(
  dbSlug: ModuleConfig["dbSlug"]
): ModuleConfig | undefined {
  return MODULE_REGISTRY.find((m) => m.dbSlug === dbSlug);
}

/** All module slugs in display order */
export const MODULE_SLUGS: ModuleSlug[] = MODULE_REGISTRY.map((m) => m.slug);

