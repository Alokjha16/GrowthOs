import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#090A0F] text-zinc-100 overflow-hidden relative">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-0 left-64 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <DashboardSidebar
        userName={session.user.name}
        userEmail={session.user.email}
        userImage={session.user.image}
      />
      <main className="flex-1 overflow-y-auto z-10">
        <div className="min-h-screen p-6 lg:p-10 animate-slide-up">
          {children}
        </div>
      </main>
    </div>
  );
}
