"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[rgba(255,255,255,0.07)] rounded-[6px] bg-[#141517] p-5 space-y-4">
      {/* Google Auth Button */}
      <Button
        type="button"
        variant="secondary"
        className="w-full justify-center gap-2 text-[12px] h-8"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative flex items-center justify-center my-2">
        <div className="border-t border-[rgba(255,255,255,0.06)] w-full" />
        <span className="bg-[#141517] px-2 text-[10px] text-[#4E4E4E] uppercase tracking-wider absolute">or</span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="email"
          type="email"
          label="Work Email"
          placeholder="founder@brand.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="px-3 py-2 rounded-[4px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.2)] text-[11px] text-[#EB5757] flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full justify-center gap-1.5 h-8">
          Sign In
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Brand Header */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-[4px] bg-[#5E6AD2] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[14px] font-semibold text-[#F1F1F1] tracking-tight">GrowthOS</span>
        </Link>
        <h1 className="text-[16px] font-semibold text-[#F1F1F1] tracking-tight">Sign in to your workspace</h1>
        <p className="text-[12px] text-[#8A8A8A] mt-0.5">Enter your credentials to access institutional insights.</p>
      </div>

      <Suspense fallback={<div className="p-5 text-center text-xs text-[#8A8A8A]">Loading login options...</div>}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-[12px] text-[#8A8A8A]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#8E96EA] hover:underline font-medium">
          Create account
        </Link>
      </p>
    </div>
  );
}
