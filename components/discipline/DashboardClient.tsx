"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_META, PHASES, type UserRole } from "@/lib/constants";
import {
  Flame,
  CheckSquare,
  FileText,
  FlaskConical,
  Eye,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  user: { name: string; role: UserRole };
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <Card className="border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm overflow-hidden relative group hover:border-white/[0.1] transition-all duration-300">
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradient
        )}
      />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {title}
            </p>
            <p className="mt-1.5 text-2xl font-bold text-zinc-50">{value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
          </div>
          <div className="rounded-lg bg-white/[0.05] p-2.5">
            <Icon className="h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickCheckin() {
  const [summary, setSummary] = useState("");
  const [roadblock, setRoadblock] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  if (submitted) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-950/20 backdrop-blur-sm">
        <CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-emerald-300">Check-in submitted!</p>
            <p className="text-sm text-emerald-400/60">
              Your activity has been logged on the heatmap.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckSquare className="h-4 w-4 text-indigo-400" />
          Daily Proof of Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Textarea
            placeholder="What did you accomplish today? (100 words max)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[80px] resize-none border-white/[0.08] bg-white/[0.03] text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50"
          />
          <p
            className={cn(
              "mt-1 text-xs",
              wordCount > 100 ? "text-red-400" : "text-zinc-600"
            )}
          >
            {wordCount}/100 words
          </p>
        </div>
        <Textarea
          placeholder="Any roadblocks? (optional)"
          value={roadblock}
          onChange={(e) => setRoadblock(e.target.value)}
          className="min-h-[50px] resize-none border-white/[0.08] bg-white/[0.03] text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50"
        />
        <Button
          onClick={() => setSubmitted(true)}
          disabled={wordCount === 0 || wordCount > 100}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20"
        >
          Submit Check-in
        </Button>
      </CardContent>
    </Card>
  );
}

function PhaseProgress() {
  const currentPhaseIdx = 1;
  const signoffs = 3;
  const total = 5;

  return (
    <Card className="border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Phase Progress
          </span>
          <Link href="/dashboard/phases">
            <Badge
              variant="outline"
              className="border-white/[0.08] text-zinc-500 hover:bg-white/[0.04] cursor-pointer text-[10px]"
            >
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Badge>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {PHASES.map((phase, idx) => {
          const isActive = idx === currentPhaseIdx;
          const isCompleted = idx < currentPhaseIdx;
          const isLocked = idx > currentPhaseIdx;

          return (
            <div
              key={phase.name}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive && "bg-indigo-500/10 border border-indigo-500/20",
                isCompleted && "opacity-60",
                isLocked && "opacity-30"
              )}
            >
              <span className="text-sm">{phase.icon}</span>
              <span
                className={cn(
                  "flex-1 text-sm",
                  isActive ? "text-zinc-200 font-medium" : "text-zinc-500"
                )}
              >
                {phase.label}
              </span>
              {isActive && (
                <span className="text-xs text-indigo-400">
                  {signoffs}/{total} signed
                </span>
              )}
              {isCompleted && (
                <span className="text-xs text-emerald-500">✓</span>
              )}
              {isLocked && <span className="text-xs text-zinc-700">🔒</span>}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ActionItems() {
  const items = [
    { text: "Review blind draft #3", due: "Due Friday", urgent: false, icon: Eye },
    { text: "Sign off on Methodology", due: "2/5 remaining", urgent: true, icon: CheckSquare },
    { text: "You're Red Team critic this week", due: "Submit by Sunday", urgent: false, icon: ShieldAlert },
  ];

  return (
    <Card className="border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Action Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-white/[0.03]",
              item.urgent && "border border-amber-500/20 bg-amber-500/5"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0",
                item.urgent ? "text-amber-400" : "text-zinc-600"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 truncate">{item.text}</p>
              <p className="text-xs text-zinc-600">{item.due}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GhostAlert() {
  const ghosting = MOCK_TEAM.filter((m) => !m.isOnline);
  if (ghosting.length === 0) return null;

  return (
    <Card className="border-red-500/20 bg-red-950/10 backdrop-blur-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-300">
            {ghosting.map((m) => m.name).join(", ")}{" "}
            {ghosting.length === 1 ? "hasn't" : "haven't"} checked in today
          </p>
          <p className="text-xs text-red-400/60">
            Consider a nudge to keep the momentum going.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const roleMeta = ROLE_META[user.role] ?? ROLE_META["coordinator"];
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          {greeting}, {user.name}{" "}
          <span className="text-lg">{roleMeta.emoji}</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here&apos;s what&apos;s happening with your research team today.
        </p>
      </div>

      <GhostAlert />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Team Streak"
          value="12 days"
          subtitle="All 5 members checked in"
          icon={Flame}
          gradient="bg-gradient-to-br from-orange-500/5 to-transparent"
        />
        <StatCard
          title="Papers"
          value={47}
          subtitle="8 added this week"
          icon={FileText}
          gradient="bg-gradient-to-br from-sky-500/5 to-transparent"
        />
        <StatCard
          title="Experiments"
          value={23}
          subtitle="156 total runs logged"
          icon={FlaskConical}
          gradient="bg-gradient-to-br from-amber-500/5 to-transparent"
        />
        <StatCard
          title="Online Now"
          value={`${MOCK_TEAM.filter((m) => m.isOnline).length}/${MOCK_TEAM.length}`}
          subtitle="Team members present"
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-500/5 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <QuickCheckin />
          <ActionItems />
        </div>
        <div className="lg:col-span-2">
          <PhaseProgress />
        </div>
      </div>
    </div>
  );
}
