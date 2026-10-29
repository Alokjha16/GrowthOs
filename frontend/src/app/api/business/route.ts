import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const businesses = await db.business.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ businesses });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name,
      businessType,
      industry,
      website,
      description,
      monthlyRevenue,
      monthlyExpenses,
      customersPerMonth,
      repeatCustomerPercentage,
      marketingChannels,
      pricingLevel,
      averageOrderValue,
      customerAcquisitionCost,
      returnOnAdSpend,
      cartAbandonmentRate,
      fulfillmentMethod,
      // India-specific
      codRate,
      rtoRate,
      prepaidPercentage,
    } = body;

    const existing = await db.business.findFirst({
      where: { userId: session.user.id },
    });

    const data = {
      userId: session.user.id,
      name,
      businessType: businessType ?? "ECOMMERCE",
      industry:     industry     || null,
      website:      website      || null,
      description:  description  || null,
      // Financials — all optional
      monthlyRevenue:           monthlyRevenue           ? parseFloat(monthlyRevenue)           : null,
      monthlyExpenses:          monthlyExpenses          ? parseFloat(monthlyExpenses)          : null,
      customersPerMonth:        customersPerMonth        ? parseInt(customersPerMonth)          : null,
      repeatCustomerPercentage: repeatCustomerPercentage ? parseInt(repeatCustomerPercentage)   : null,
      marketingChannels:        marketingChannels        ?? [],
      pricingLevel:             pricingLevel             ?? "MEDIUM",
      averageOrderValue:        averageOrderValue        ? parseFloat(averageOrderValue)        : null,
      customerAcquisitionCost:  customerAcquisitionCost  ? parseFloat(customerAcquisitionCost)  : null,
      returnOnAdSpend:          returnOnAdSpend          ? parseFloat(returnOnAdSpend)          : null,
      cartAbandonmentRate:      cartAbandonmentRate      ? parseInt(cartAbandonmentRate)        : null,
      fulfillmentMethod:        fulfillmentMethod        || null,
      // India-specific
      codRate:          codRate          ? parseInt(codRate)          : null,
      rtoRate:          rtoRate          ? parseInt(rtoRate)          : null,
      prepaidPercentage: prepaidPercentage ? parseInt(prepaidPercentage) : null,
    };

    let business;
    if (existing) {
      business = await db.business.update({ where: { id: existing.id }, data });
    } else {
      business = await db.business.create({ data });
    }

    return NextResponse.json({ business }, { status: 201 });
  } catch (err) {
    console.error("[BUSINESS ERROR]", err);
    return NextResponse.json({ error: "Failed to save business" }, { status: 500 });
  }
}
