import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getModule, type ModuleSlug } from "@/lib/modules/registry";
import { ModuleView } from "@/components/modules/module-view";

export const dynamic = "force-dynamic";

interface ModulePageProps {
  params: Promise<{ module: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { module: rawModuleSlug } = await params;
  const moduleConfig = getModule(rawModuleSlug as ModuleSlug);

  if (!moduleConfig) {
    notFound();
  }

  const business = await db.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) {
    redirect("/onboarding");
  }

  // Fetch Autopilot Preferences (Kill switch & shadow mode status)
  const prefs = await db.autopilotPreferences.findUnique({
    where: { userId: session.user.id },
  });

  // Fetch Findings for this module
  const findings = await db.finding.findMany({
    where: {
      businessId: business.id,
      moduleSlug: moduleConfig.dbSlug,
      dismissed: false,
    },
  });

  // Fetch Benchmarks for this module and category
  const category = business.storeCategory || "APPAREL";
  const benchmarks = await db.benchmark.findMany({
    where: {
      moduleSlug: moduleConfig.dbSlug,
      category,
    },
  });

  // Extract store's current metrics for benchmark comparison
  const storeMetrics: Record<string, number | null> = {
    roas: business.returnOnAdSpend ? Number(business.returnOnAdSpend) : null,
    cac: business.customerAcquisitionCost ? Number(business.customerAcquisitionCost) : null,
    repeat_rate: business.repeatCustomerPercentage ?? null,
    gross_margin:
      business.monthlyRevenue && business.monthlyExpenses
        ? Number(
            (
              ((Number(business.monthlyRevenue) - Number(business.monthlyExpenses)) /
                Number(business.monthlyRevenue)) *
              100
            ).toFixed(1)
          )
        : 39.1,
    contribution_margin: 14.2,
    aov: business.averageOrderValue ? Number(business.averageOrderValue) : null,
    inventory_turnover: business.inventoryTurnover ? Number(business.inventoryTurnover) : null,
    days_of_stock: 34,
    stockout_rate: 4,
    ltv_cac_ratio: 2.1,
    lapsed_customer_pct: 32,
    cart_abandonment_rate: business.cartAbandonmentRate ?? null,
    checkout_conversion: 1.8,
    rto_rate: business.rtoRate ?? null,
    cod_rate: business.codRate ?? null,
    fulfillment_sla: 4.8,
  };

  const serializedFindings = findings.map((f: any) => ({
    id: f.id,
    moduleSlug: f.moduleSlug,
    title: f.title,
    description: f.description,
    moneyImpact: f.moneyImpact ? Number(f.moneyImpact) : null,
    impactFormula: f.impactFormula ?? null,
    impactInputs: (f.impactInputs as Record<string, any>) ?? null,
    impactWindow: f.impactWindow ?? null,
    confidence: f.confidence,
    dismissed: Boolean(f.dismissed),
    playbookRunId: f.playbookRunId ?? null,
    taskId: f.taskId ?? null,
  }));

  const serializedBenchmarks = benchmarks.map((b: any) => ({
    id: b.id,
    metric: b.metric,
    p25: b.p25 ? Number(b.p25) : null,
    median: b.median ? Number(b.median) : null,
    p75: b.p75 ? Number(b.p75) : null,
    unit: b.unit ?? null,
    source: b.source,
    sourceLabel: b.sourceLabel ?? null,
  }));

  return (
    <ModuleView
      module={moduleConfig}
      businessName={business.name}
      storeCategory={category}
      findings={serializedFindings}
      benchmarks={serializedBenchmarks}
      storeMetrics={storeMetrics}
      shadowModeActive={prefs?.shadowModeActive ?? true}
      killSwitchActive={prefs?.killSwitchActive ?? false}
    />
  );
}

