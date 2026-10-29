import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const business = await db.business.findFirst({
      where: { userId: session.user.id },
    });

    if (!business) return NextResponse.json({ analyses: [], simulations: [], snapshots: [] });

    const [analyses, simulations, snapshots] = await Promise.all([
      db.analysis.findMany({
        where: { businessId: business.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          healthScore: true,
          summary: true,
          createdAt: true,
          status: true,
        },
      }),
      db.simulation.findMany({
        where: { businessId: business.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          strategy: true,
          confidenceScore: true,
          shortTermOutcome: true,
          longTermOutcome: true,
          createdAt: true,
        },
      }),
      db.businessSnapshot.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "asc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({ analyses, simulations, snapshots });
  } catch (err) {
    console.error("[HISTORY ERROR]", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
