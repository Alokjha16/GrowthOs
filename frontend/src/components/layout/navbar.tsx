import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/[0.08] px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.jpeg"
            alt="GrowthOS"
            width={220}
            height={64}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/demo" className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Live Demo
          </Link>
          <div className="flex items-center gap-2.5 ml-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient" size="sm" className="text-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
