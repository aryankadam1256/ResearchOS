"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_META } from "@/lib/constants";
import {
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";

interface RedTeamSlot {
  id: string;
  userId: string;
  userName: string;
  weekStart: string;
  focusArea: string;
  findings: string | null;
  completed: boolean;
}

function getMonday(offset: number): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

const MOCK_SLOTS: RedTeamSlot[] = [
  {
    id: "1",
    userId: "user-2",
    userName: "Ananya",
    weekStart: getMonday(-2),
    focusArea: "Methodology — Are baselines fair and sufficient?",
    findings:
      "Found that Baseline 3 uses a different evaluation split, making comparison unfair. Recommended standardizing on the same test set. Also flagged that we don't account for prompt sensitivity in our ablation study.",
    completed: true,
  },
  {
    id: "2",
    userId: "user-3",
    userName: "Ravi",
    weekStart: getMonday(-1),
    focusArea: "Literature Review — Missing key references?",
    findings:
      "Identified 3 missing papers that directly address our research question. The 2024 survey by Park et al. should be cited. Also, our framing of 'prompt engineering' needs updating — the field is moving toward 'prompt programming'.",
    completed: true,
  },
  {
    id: "3",
    userId: "user-4",
    userName: "Sneha",
    weekStart: getMonday(0),
    focusArea: "Experimental Design — Statistical significance & reproducibility",
    findings: null,
    completed: false,
  },
  {
    id: "4",
    userId: "user-5",
    userName: "Dev",
    weekStart: getMonday(1),
    focusArea: "Data — Are there bias or leakage issues?",
    findings: null,
    completed: false,
  },
  {
    id: "5",
    userId: "user-1",
    userName: "Prateek",
    weekStart: getMonday(2),
    focusArea: "Writing — Clarity, flow, and logical consistency",
    findings: null,
    completed: false,
  },
];

function SlotCard({ slot, isCurrentWeek }: { slot: RedTeamSlot; isCurrentWeek: boolean }) {
  const member = MOCK_TEAM.find((m) => m.id === slot.userId);
  const roleMeta = member ? ROLE_META[member.role] : null;

  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-zinc-900/40 backdrop-blur-sm transition-all",
        isCurrentWeek && "ring-1 ring-red-500/20 border-red-500/15 bg-red-950/10",
        slot.completed && "opacity-75"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border border-white/[0.08]">
            <AvatarFallback
              className={cn(
                "text-xs font-semibold text-white",
                isCurrentWeek
                  ? "bg-gradient-to-br from-red-600 to-orange-600"
                  : "bg-gradient-to-br from-zinc-600 to-zinc-700"
              )}
            >
              {slot.userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-zinc-100">
                {slot.userName}
              </span>
              {roleMeta && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] uppercase tracking-wider border h-4 px-1.5",
                    roleMeta.color
                  )}
                >
                  {roleMeta.label}
                </Badge>
              )}
              {isCurrentWeek && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/20 text-[9px] h-4 px-1.5 animate-pulse">
                  This Week
                </Badge>
              )}
              {slot.completed && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[9px] h-4 px-1.5">
                  <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />
                  Done
                </Badge>
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" />
              Week of {slot.weekStart}
            </div>

            <div className="mt-2 flex items-start gap-2">
              <Target className="h-3.5 w-3.5 text-zinc-600 mt-0.5 shrink-0" />
              <p className="text-sm text-zinc-400">{slot.focusArea}</p>
            </div>

            {/* Findings */}
            {slot.findings && (
              <div className="mt-3 rounded-lg bg-zinc-950/50 border border-white/[0.04] p-3">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">
                  🔍 Findings
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {slot.findings}
                </p>
              </div>
            )}

            {!slot.completed && isCurrentWeek && (
              <div className="mt-3 rounded-lg bg-red-950/20 border border-red-500/10 p-3">
                <p className="text-xs text-red-300">
                  ⏳ Review in progress — submit findings by Sunday
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RedTeamPage() {
  const currentWeekStart = getMonday(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
          <ShieldAlert className="h-6 w-6 text-red-400" />
          Red Team Schedule
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Weekly rotating logic critic — one member finds flaws in the team&apos;s
          work each week.
        </p>
      </div>

      {/* Rotation preview */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {MOCK_SLOTS.map((slot, idx) => {
          const isCurrentWeek = slot.weekStart === currentWeekStart;
          return (
            <React.Fragment key={slot.id}>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                  isCurrentWeek
                    ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                    : slot.completed
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-zinc-800 text-zinc-600"
                )}
              >
                {slot.completed && <CheckCircle2 className="h-3 w-3" />}
                {isCurrentWeek && <Clock className="h-3 w-3" />}
                {slot.userName}
              </div>
              {idx < MOCK_SLOTS.length - 1 && (
                <ArrowRight className="h-3 w-3 text-zinc-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Slot cards */}
      <div className="space-y-3">
        {MOCK_SLOTS.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            isCurrentWeek={slot.weekStart === currentWeekStart}
          />
        ))}
      </div>
    </div>
  );
}
