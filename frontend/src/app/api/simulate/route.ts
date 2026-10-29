import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { runSimulation } from "@/lib/ai/simulate";
import { type BusinessContext } from "@/agents/shared";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { businessId, strategy } = await req.json();

    if (!strategy) return NextResponse.json({ error: "Strategy is required" }, { status: 400 });

    const business = await db.business.findFirst({
      where: { id: businessId, userId: session.user.id },
    });

    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const simulation = await db.simulation.create({
      data: {
        businessId: business.id,
        createdById: session.user.id,
        status: "PENDING",
        strategy,
      },
    });

    const ctx: BusinessContext = {
      name: business.name,
      industry: business.industry,
      description: business.description,
      businessType: business.businessType,
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
      codRate:                  business.codRate          ?? null,
      rtoRate:                  business.rtoRate          ?? null,
      prepaidPercentage:        business.prepaidPercentage ?? null,
    };

    const result = await runSimulation(ctx, strategy);

    const updated = await db.simulation.update({
      where: { id: simulation.id },
      data: {
        status: "COMPLETED",
        shortTermOutcome: result.shortTermOutcome,
        longTermOutcome: result.longTermOutcome,
        risks: result.risks,
        opportunities: result.opportunities,
        confidenceScore: result.confidenceScore,
      },
    });

    return NextResponse.json({
      simulationId: updated.id,
      decision: result.decision,
      shortTermOutcome: result.shortTermOutcome,
      longTermOutcome: result.longTermOutcome,
      risks: result.risks,
      opportunities: result.opportunities,
      confidenceScore: result.confidenceScore,
    });
  } catch (err) {
    console.error("[SIMULATE ERROR]", err);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
