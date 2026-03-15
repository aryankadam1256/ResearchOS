import Link from "next/link";
import { Dna, Flame, Lock, FileText, FlaskConical, Eye, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  // Already logged in? Go to dashboard
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const features = [
    {
      icon: Flame,
      title: "Discipline Heatmap",
      desc: "GitHub-style activity grid. See who's working, who's ghosting — in real time.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: Lock,
      title: "Phase-Locking",
      desc: "Block 'Results' until all 5 members sign off on 'Methodology'. Hard enforced.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: FileText,
      title: "Paper Vault + TL;DR",
      desc: "Upload PDFs, annotate together, and auto-summarize with Claude AI.",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      icon: FlaskConical,
      title: "Experiment Ledger",
      desc: "Structured logs for every LLM prompt iteration and hyperparameter run.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: Eye,
      title: "Blind Review",
      desc: "Anonymous peer-critique module for internal drafts. No bias, just rigor.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: CheckCircle2,
      title: "Daily Check-ins",
      desc: "100-word Proof of Progress each day. No check-in? Everyone knows.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Dna className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold">ResearchOS</span>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-28 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute left-1/4 top-20 h-32 w-32 rounded-full bg-purple-600/10 blur-2xl" />
        <div className="absolute right-1/4 top-20 h-32 w-32 rounded-full bg-sky-600/10 blur-2xl" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            Built for 5-person LLM research teams
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Discipline &{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligence
            </span>
            <br />
            for Research Teams.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
            Stop losing momentum to ghosting, scattered papers, and sloppy experiment tracking.
            ResearchOS keeps your team disciplined, your literature organized, and your rigor tight.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/25 text-base font-medium">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="h-12 px-8 border-white/[0.08] text-zinc-300 hover:bg-white/[0.04] text-base"
              >
                Try Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
              Everything your research team needs
            </h2>
            <p className="mt-3 text-zinc-500">
              Three tiers: Discipline, Intelligence, and Rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-white/[0.1] hover:bg-zinc-900/60"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="mb-1.5 font-semibold text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] px-6 py-20 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-bold text-zinc-100">
            Ready to start your research?
          </h2>
          <p className="mt-3 text-zinc-500">
            Sign in with any team member account. Default password:{" "}
            <span className="font-mono text-zinc-400">ResearchOS@2026</span>
          </p>
          <Link href="/login" className="mt-8 inline-block">
            <Button className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/25">
              Sign in to ResearchOS
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-8 text-center">
        <p className="text-xs text-zinc-700">
          ResearchOS · Built with Next.js 16, Tailwind CSS, shadcn/ui
        </p>
      </footer>
    </div>
  );
}
