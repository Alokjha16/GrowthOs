import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateReport } from "@/lib/ai/report";
import { type BusinessContext, type AgentResult } from "@/agents/shared";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { businessId, analysisId } = await req.json();

    const [business, analysis] = await Promise.all([
      db.business.findFirst({ where: { id: businessId, userId: session.user.id } }),
      db.analysis.findFirst({ where: { id: analysisId, businessId } }),
    ]);

    if (!business || !analysis) {
      return NextResponse.json({ error: "Business or analysis not found" }, { status: 404 });
    }

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

    const agents = (analysis.agents as unknown as AgentResult[]) ?? [];
    const healthScore = analysis.healthScore ?? 50;

    const result = await generateReport(ctx, agents, healthScore);

    const report = await db.report.create({
      data: {
        businessId: business.id,
        createdById: session.user.id,
        analysisId: analysis.id,
        type: "EXECUTIVE_SUMMARY",
        title: result.title,
        executiveSummary: result.executiveSummary,
        chiefRisk: result.chiefRisk,
        topOpportunity: result.topOpportunity,
        immediateAction: result.immediateAction,
        actionPlan: result.actionPlan,
      },
    });

    return NextResponse.json({
      reportId: report.id,
      title: report.title,
      healthScore: result.healthScore,
      executiveSummary: result.executiveSummary,
      chiefRisk: result.chiefRisk,
      topOpportunity: result.topOpportunity,
      immediateAction: result.immediateAction,
      actionPlan: result.actionPlan,
    });
  } catch (err) {
    console.error("[REPORT ERROR]", err);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
