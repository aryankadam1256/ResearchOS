import Link from "next/link";
import { Layers, Activity, Lock, Database, FlaskConical, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const features = [
    {
      icon: Activity,
      title: "Cross-Discipline Heatmap",
      desc: "Monitor activity across all connected workstreams. Track individual contributions in real time.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Lock,
      title: "Phase-Locking",
      desc: "Block critical transitions until peer reviews and consensus milestones are fully met.",
      color: "text-zinc-500",
      bg: "bg-zinc-500/10",
    },
    {
      icon: Database,
      title: "Data Vaults & Literature",
      desc: "Upload methodology outlines, safely store dataset references, and annotate collectively.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: FlaskConical,
      title: "Active Trials Ledger",
      desc: "Structured operational logs for every procedural iteration, experiment, and output analysis.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: ShieldAlert,
      title: "Ethics & Safety",
      desc: "Automated compliance checks and constraint evaluation for all standard operational procedures.",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      icon: CheckCircle2,
      title: "Milestone Sync",
      desc: "Synchronized progress check-ins. Keep visibility high and track overarching grant submissions.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.12em]">Research OS</span>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="px-4 shadow-sm">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden px-6 py-20 text-center md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Multi-Disciplinary Research Environment
            </div>

            <h1 className="text-pretty text-4xl font-semibold md:text-6xl">
              Command and Control for <br />
              <span className="text-primary/85">
                Scientific Workstreams.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              Maintain momentum, centralize literature, track trial deployments, and ensure ethical constraints are met across your entire organization. Research OS brings strict standard operating procedure to modern science.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="h-11 px-7 text-sm font-semibold shadow-md">
                  Initialize Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-11 px-7 text-sm shadow-sm">
                  Access Demo Clearance
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border/70 bg-muted/25 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-semibold text-foreground">
                Universal Infrastructure
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Agile deployment for biology, computer science, clinical trials, and beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div
                    className={"mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl " + feature.bg}
                  >
                    <feature.icon className={"h-6 w-6 " + feature.color} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-lg">
            <h2 className="text-3xl font-semibold text-foreground">
              Ready to synchronize operations?
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Gain access to the dashboard using institutional credentials. Request standard login:{" "}
              <span className="font-mono text-foreground font-medium bg-muted px-2 py-0.5 rounded">ResearchOS@2026</span>
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button size="lg" className="h-11 px-7 shadow-md">
                Authenticate Securely
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-muted/10 px-6 py-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Research OS &middot; Enterprise Grade &middot; Fully Scalable
        </p>
      </footer>
    </div>
  );
}
