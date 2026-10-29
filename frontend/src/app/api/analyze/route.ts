import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { runFullDiagnosis } from "@/lib/ai/analyze";
import { type BusinessContext } from "@/agents/shared";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { businessId } = await req.json();

    const [business, recentSnapshots] = await Promise.all([
      db.business.findFirst({ where: { id: businessId, userId: session.user.id } }),
      db.businessSnapshot.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Create pending analysis record
    const analysis = await db.analysis.create({
      data: {
        businessId: business.id,
        createdById: session.user.id,
        status: "IN_PROGRESS",
      },
    });

    // Build context — includes India-specific fields + historical snapshots
    const ctx: BusinessContext = {
      name:                     business.name,
      industry:                 business.industry,
      description:              business.description,
      businessType:             business.businessType,
      monthlyRevenue:           business.monthlyRevenue           ? Number(business.monthlyRevenue)           : 0,
      monthlyExpenses:          business.monthlyExpenses          ? Number(business.monthlyExpenses)          : 0,
      customersPerMonth:        business.customersPerMonth        ?? null,
      repeatCustomerPercentage: business.repeatCustomerPercentage ?? null,
      marketingChannels:        business.marketingChannels,
      pricingLevel:             business.pricingLevel,
      averageOrderValue:        business.averageOrderValue        ? Number(business.averageOrderValue)        : null,
      customerAcquisitionCost:  business.customerAcquisitionCost  ? Number(business.customerAcquisitionCost)  : null,
      returnOnAdSpend:          business.returnOnAdSpend          ? Number(business.returnOnAdSpend)          : null,
      cartAbandonmentRate:      business.cartAbandonmentRate,
      fulfillmentMethod:        business.fulfillmentMethod,
      inventoryTurnover:        business.inventoryTurnover        ? Number(business.inventoryTurnover)        : null,
      returnRatePercentage:     business.returnRatePercentage,
      // India-specific
      codRate:                  business.codRate          ?? null,
      rtoRate:                  business.rtoRate          ?? null,
      prepaidPercentage:        business.prepaidPercentage ?? null,
    };

    // Run 7-agent parallel diagnosis + synthesis (passing snapshots for trend awareness)
    const result = await runFullDiagnosis(ctx, recentSnapshots);

    // Save snapshot including India metrics
    await db.businessSnapshot.create({
      data: {
        businessId:             business.id,
        revenue:                business.monthlyRevenue,
        expenses:               business.monthlyExpenses,
        customers:              business.customersPerMonth,
        repeatRate:             business.repeatCustomerPercentage,
        healthScore:            result.healthScore,
        averageOrderValue:      business.averageOrderValue,
        customerAcquisitionCost: business.customerAcquisitionCost,
        returnOnAdSpend:        business.returnOnAdSpend,
        cartAbandonmentRate:    business.cartAbandonmentRate,
        codRate:                business.codRate,
        rtoRate:                business.rtoRate,
      },
    });

    // Update analysis with results
    const updatedAnalysis = await db.analysis.update({
      where: { id: analysis.id },
      data: {
        status:      "COMPLETED",
        healthScore: result.healthScore,
        summary:     result.summary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        agents:        JSON.parse(JSON.stringify(result.agents))   as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inputSnapshot: JSON.parse(JSON.stringify(ctx))             as any,
      },
    });

    // Update business health score cache
    await db.business.update({
      where: { id: business.id },
      data:  { healthScore: result.healthScore },
    });

    return NextResponse.json({
      analysisId:   updatedAnalysis.id,
      healthScore:  result.healthScore,
      summary:      result.summary,
      agents:       result.agents,
      synthesis:    result.synthesis,
    });
  } catch (err) {
    console.error("[ANALYZE ERROR]", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
