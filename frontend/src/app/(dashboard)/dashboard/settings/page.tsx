import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Store, Globe, Mail, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, business] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    }),
    db.business.findFirst({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-[11px] text-[#8A8A8A] hover:text-[#F1F1F1] mb-2 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Overview
        </Link>
        <h1 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">Account & Store Settings</h1>
        <p className="text-[12px] text-[#8A8A8A]">Manage organizational profiles, plan parameters, and Groq engine context.</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-[13px]">
            <Mail className="w-3.5 h-3.5 text-[#5E6AD2]" />
            Account Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-[4px] bg-[#101113] border border-[rgba(255,255,255,0.05)]">
            <div className="w-8 h-8 rounded-full bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#F1F1F1]">{user?.name}</p>
              <p className="text-[11px] text-[#8A8A8A]">{user?.email}</p>
            </div>
            <Badge variant="primary">Pro Plan</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Store Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-[13px]">
              <Store className="w-3.5 h-3.5 text-[#4CAF50]" />
              Store Parameters
            </CardTitle>
            <Link href="/onboarding">
              <Button variant="outline" size="sm">Edit Context</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {business ? (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Store Name", value: business.name },
                { label: "Industry", value: business.industry ?? "—" },
                { label: "Business Type", value: business.businessType },
                { label: "Health Score", value: business.healthScore ? `${business.healthScore}/100` : "—" },
                { label: "Website", value: business.website ?? "—" },
                { label: "Fulfillment", value: business.fulfillmentMethod ?? "—" },
              ].map((item) => (
                <div key={item.label} className="p-2.5 rounded-[4px] bg-[#101113] border border-[rgba(255,255,255,0.05)]">
                  <p className="text-[10px] text-[#4E4E4E] uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-[12px] text-[#F1F1F1] font-medium truncate">{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[12px] text-[#8A8A8A] mb-3">No store parameters configured yet.</p>
              <Link href="/onboarding">
                <Button size="sm">Configure Store Profile</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engine Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-[13px]">
            <Key className="w-3.5 h-3.5 text-[#F4C430]" />
            AI Orchestration Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-[4px] bg-[#101113] border border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-[#8A8A8A]" />
              <div>
                <p className="text-[12px] font-medium text-[#F1F1F1]">Groq AI Cluster</p>
                <p className="text-[11px] text-[#4E4E4E]">Llama 3.3-70B Versatile · Parallel Execution Enabled</p>
              </div>
            </div>
            <Badge variant="success">Operational</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
