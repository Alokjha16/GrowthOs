import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { analysisId, agentName, rating, comment } = await req.json();

    await db.agentFeedback.create({
      data: {
        analysisId: analysisId ?? "unknown",
        agentName:  agentName  ?? "unknown",
        rating:     Number(rating) ?? 3,
        comment:    comment    ?? null,
        userId:     session.user.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[FEEDBACK ERROR]", err);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
