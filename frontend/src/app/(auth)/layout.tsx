import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090A0F] flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <header className="border-b border-white/[0.06] px-6 py-3 relative z-20">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.jpeg"
            alt="GrowthOS"
            width={180}
            height={52}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
