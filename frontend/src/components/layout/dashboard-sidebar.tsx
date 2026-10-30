"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Brain,
  FlaskConical,
  FileBarChart,
  History,
  Settings,
  CreditCard,
  LogOut,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  Truck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/diagnose", label: "AI Diagnosis", icon: Brain, badge: "7 Agents" },
  { href: "/dashboard/simulate", label: "Strategy Simulator", icon: FlaskConical },
  { href: "/dashboard/report", label: "CEO Brief", icon: FileBarChart },
  { href: "/dashboard/history", label: "History & Logs", icon: History },
];

const moduleNav = [
  { href: "/dashboard/ads",         label: "Ads",         icon: BarChart3,    color: "text-blue-400",   activeBg: "bg-blue-500/15 border-blue-500/30",   activeColor: "text-blue-300"   },
  { href: "/dashboard/profit",      label: "Profit",      icon: TrendingUp,   color: "text-emerald-400",activeBg: "bg-emerald-500/15 border-emerald-500/30",activeColor: "text-emerald-300"},
  { href: "/dashboard/inventory",   label: "Inventory",   icon: Package,      color: "text-amber-400",  activeBg: "bg-amber-500/15 border-amber-500/30",  activeColor: "text-amber-300"  },
  { href: "/dashboard/retention",   label: "Retention",   icon: Users,        color: "text-violet-400", activeBg: "bg-violet-500/15 border-violet-500/30",activeColor: "text-violet-300" },
  { href: "/dashboard/cart-cro",    label: "Cart / CRO",  icon: ShoppingCart, color: "text-orange-400", activeBg: "bg-orange-500/15 border-orange-500/30",activeColor: "text-orange-300" },
  { href: "/dashboard/fulfillment", label: "Fulfillment", icon: Truck,        color: "text-rose-400",   activeBg: "bg-rose-500/15 border-rose-500/30",   activeColor: "text-rose-300"   },
];

const secondaryNav = [
  { href: "/dashboard/billing",  label: "Billing & Plans", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings",         icon: Settings    },
];

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export function DashboardSidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [modulesExpanded, setModulesExpanded] = useState(true);

  // Determine if any module route is active so section header glows
  const anyModuleActive = moduleNav.some((m) => pathname.startsWith(m.href));

  return (
    <aside className="w-60 h-screen bg-zinc-950/80 backdrop-blur-xl border-r border-white/[0.08] flex flex-col flex-shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.jpeg"
            alt="GrowthOS"
            width={160}
            height={48}
            className="h-10 w-auto object-contain rounded"
            priority
          />
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Core Menu */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
            Core Menu
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-200"
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold text-orange-300 bg-orange-500/20 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Growth Modules */}
        <div>
          <button
            onClick={() => setModulesExpanded((v) => !v)}
            className={cn(
              "w-full px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest flex items-center justify-between transition-colors",
              anyModuleActive ? "text-orange-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <span>Growth Modules</span>
            {modulesExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>

          {modulesExpanded && (
            <nav className="space-y-1">
              {moduleNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group relative",
                      isActive
                        ? `${item.activeBg} border shadow-sm ${item.activeColor}`
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-colors",
                        isActive ? item.activeColor : `${item.color} opacity-60 group-hover:opacity-100`
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Configuration */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
            Configuration
          </div>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-200"
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-white/[0.06] bg-zinc-950/60">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-white/[0.06]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
            {userName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {userName || "User"}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {userEmail || ""}
            </p>
          </div>
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/login";
            }}
            title="Sign out"
            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors rounded-md hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
