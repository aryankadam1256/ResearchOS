"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Dna, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { name: "Prateek (Coordinator)", email: "prateek@research.ai" },
  { name: "Ananya (Lead Writer)", email: "ananya@research.ai" },
  { name: "Ravi (Experimenter)", email: "ravi@research.ai" },
  { name: "Sneha (Lit Reviewer)", email: "sneha@research.ai" },
  { name: "Dev (Data Lead)", email: "dev@research.ai" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("ResearchOS@2026");
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: demoEmail,
      password: "ResearchOS@2026",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Demo login failed. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-zinc-950 to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.10),transparent_60%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30">
              <Dna className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ResearchOS</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Discipline meets
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              intelligence.
            </span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-sm">
            The Research OS built for LLM paper teams — track progress, manage papers, run experiments, and ship with rigor.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["Team Heatmap", "Phase-Locking", "Paper Vault", "Experiment Ledger", "Blind Review"].map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-zinc-600">
            Built for your 5-member LLM research team.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Dna className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ResearchOS</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-50">Welcome back</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Sign in to your research workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@research.ai"
                required
                autoComplete="email"
                className="border-white/[0.08] bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="border-white/[0.08] bg-white/[0.04] pr-10 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-950/30 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-950 px-3 text-xs text-zinc-600">
                or try a demo account
              </span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleDemoLogin(account.email)}
                disabled={loading}
                className={cn(
                  "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5",
                  "flex items-center justify-between text-left transition-all",
                  "hover:border-white/[0.1] hover:bg-white/[0.04]",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    {account.name}
                  </p>
                  <p className="text-xs text-zinc-600">{account.email}</p>
                </div>
                <span className="text-xs text-indigo-400">Quick login →</span>
              </button>
            ))}
            <p className="text-center text-xs text-zinc-700 pt-1">
              Default password: <span className="font-mono text-zinc-600">ResearchOS@2026</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
