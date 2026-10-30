// src/lib/access/plan-limits.ts
// GrowthOS — Plan Limits Config
//
// IMPORTANT: All numeric limits live HERE — not scattered in page logic.
// Update this file to change what each plan can do. Never hardcode limits elsewhere.
//
// Prices are intentionally NOT stored here; they live in the billing UI config
// and will be wired to Razorpay in a later phase.

export type PlanTier = "STARTER" | "GROWTH" | "PRO";

export type AlertFrequency = "weekly" | "realtime";

export interface PlanLimit {
  /** Max stores the user can connect */
  maxStores: number;
  /** Alert delivery frequency */
  alertFrequency: AlertFrequency;
  /** AI strategy simulations per calendar month. -1 = unlimited */
  simulationsPerMonth: number;
  /** Maximum autonomy level the plan unlocks */
  autonomyLevel: "SUGGEST" | "APPROVE_EACH" | "AUTO_RUN";
  /** Max playbook runs per month. -1 = unlimited */
  playbookRunsPerMonth: number;
  /** Shadow mode minimum days before live execution is unlocked */
  shadowModeDays: number;
}

/**
 * Edit this object to change plan limits.
 * Prices are confirmed separately and wired in the billing phase.
 */
export const PLAN_LIMITS: Record<PlanTier, PlanLimit> = {
  STARTER: {
    maxStores: 1,
    alertFrequency: "weekly",
    simulationsPerMonth: 5,
    autonomyLevel: "SUGGEST",
    playbookRunsPerMonth: 10,
    shadowModeDays: 14,
  },
  GROWTH: {
    maxStores: 3,
    alertFrequency: "realtime",
    simulationsPerMonth: -1,
    autonomyLevel: "APPROVE_EACH",
    playbookRunsPerMonth: -1,
    shadowModeDays: 14,
  },
  PRO: {
    maxStores: 10,
    alertFrequency: "realtime",
    simulationsPerMonth: -1,
    autonomyLevel: "AUTO_RUN",
    playbookRunsPerMonth: -1,
    shadowModeDays: 7,  // Pro users can exit shadow mode faster
  },
};

/**
 * Placeholder prices — confirm before hardcoding in billing UI.
 * These are ONLY used in the billing page display, never in access checks.
 */
export const PLAN_DISPLAY: Record<
  PlanTier,
  { name: string; monthlyPrice: number; annualPrice: number; popular?: boolean }
> = {
  STARTER: { name: "Starter", monthlyPrice: 999,  annualPrice: 799  },
  GROWTH:  { name: "Growth",  monthlyPrice: 2999, annualPrice: 2399, popular: true },
  PRO:     { name: "Pro",     monthlyPrice: 7999, annualPrice: 6399 },
};

/** Returns the limit for a given plan tier */
export function getPlanLimits(tier: PlanTier): PlanLimit {
  return PLAN_LIMITS[tier];
}

/** Checks whether a plan's autonomy level permits a requested level */
export function autonomyPermitted(
  planTier: PlanTier,
  requested: "SUGGEST" | "APPROVE_EACH" | "AUTO_RUN"
): boolean {
  const order: Record<string, number> = { SUGGEST: 0, APPROVE_EACH: 1, AUTO_RUN: 2 };
  const planMax = order[PLAN_LIMITS[planTier].autonomyLevel] ?? 0;
  return order[requested] <= planMax;
}

