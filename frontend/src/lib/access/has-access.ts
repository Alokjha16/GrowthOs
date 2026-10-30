// src/lib/access/has-access.ts
// GrowthOS — Shared Access Check
//
// EVERY page and API endpoint must call hasAccess() before serving restricted content.
// This is the ONE place where plan enforcement lives.
//
// Usage (server component / API route):
//   const { allowed, planTier, reason } = await hasAccess(session.user.id);
//   const { allowed } = await hasAccess(session.user.id, "ADS");

import { db } from "@/lib/db";
import { PLAN_LIMITS, type PlanTier, type PlanLimit } from "./plan-limits";

export type ModuleSlugDB =
  | "ADS"
  | "PROFIT"
  | "INVENTORY"
  | "RETENTION"
  | "CART_CRO"
  | "FULFILLMENT";

export interface AccessResult {
  allowed: boolean;
  planTier: PlanTier;
  limits: PlanLimit;
  reason?: string;
}

/**
 * Primary access check.
 *
 * @param userId       - The authenticated user's id (from session.user.id)
 * @param moduleSlug   - Optional. If provided, also checks for a MODULE entitlement
 *                       (future standalone path). Today MODULE entitlements are never
 *                       created so this falls through to the PLAN check.
 *
 * Graceful degradation: If no entitlement exists (demo / no billing wired yet),
 * the user defaults to STARTER tier. Nothing hard-walls until billing is live.
 */
export async function hasAccess(
  userId: string,
  moduleSlug?: ModuleSlugDB
): Promise<AccessResult> {
  // ── 1. Find active PLAN entitlement ────────────────────────────────────────
  let planTier: PlanTier = "STARTER"; // graceful default

  try {
    const entitlement = await db.entitlement.findFirst({
      where: {
        userId,
        type: "PLAN",
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });

    if (entitlement?.planTier) {
      // Check expiry
      if (
        !entitlement.expiresAt ||
        new Date(entitlement.expiresAt) > new Date()
      ) {
        planTier = entitlement.planTier as PlanTier;
      }
    }
  } catch {
    // DB unavailable — graceful degradation to STARTER
  }

  const limits = PLAN_LIMITS[planTier];

  // ── 2. Check MODULE entitlement (future standalone path) ───────────────────
  if (moduleSlug) {
    try {
      const moduleEntitlement = await db.entitlement.findFirst({
        where: {
          userId,
          type: "MODULE",
          moduleSlug: moduleSlug,
          status: "ACTIVE",
        },
      });
      if (moduleEntitlement) {
        // Has explicit module access — allow regardless of plan
        return { allowed: true, planTier, limits };
      }
    } catch {
      // Ignore — fall through to plan check
    }
  }

  // ── 3. All modules are visible on all plans (spec: "plans limit USAGE") ────
  // Module pages always render. Usage limits are enforced at action-run time.
  return { allowed: true, planTier, limits };
}

/**
 * Check whether the user has remaining simulation quota this month.
 * Call before /api/simulate.
 */
export async function canRunSimulation(userId: string): Promise<{
  allowed: boolean;
  planTier: PlanTier;
  used: number;
  limit: number;
}> {
  const { planTier, limits } = await hasAccess(userId);

  if (limits.simulationsPerMonth === -1) {
    return { allowed: true, planTier, used: 0, limit: -1 };
  }

  // Count simulations created by this user this calendar month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let used = 0;
  try {
    const result = await db.simulation.findMany({
      where: { createdById: userId, createdAt: { gte: startOfMonth } },
    });
    used = result.length;
  } catch {
    // DB error — allow the request (graceful degradation)
    return { allowed: true, planTier, used: 0, limit: limits.simulationsPerMonth };
  }

  return {
    allowed: used < limits.simulationsPerMonth,
    planTier,
    used,
    limit: limits.simulationsPerMonth,
  };
}

/**
 * Check whether the user's autonomy level permits a requested action level.
 * Call before executing any playbook action.
 */
export async function canUseAutonomyLevel(
  userId: string,
  requested: "SUGGEST" | "APPROVE_EACH" | "AUTO_RUN"
): Promise<{ allowed: boolean; planTier: PlanTier; maxLevel: string }> {
  const { planTier, limits } = await hasAccess(userId);
  const order: Record<string, number> = { SUGGEST: 0, APPROVE_EACH: 1, AUTO_RUN: 2 };
  const maxAllowed = limits.autonomyLevel;
  const allowed = (order[requested] ?? 0) <= (order[maxAllowed] ?? 0);
  return { allowed, planTier, maxLevel: maxAllowed };
}

