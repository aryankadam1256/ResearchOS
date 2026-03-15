"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_META, type UserRole } from "@/lib/constants";
import { Flame } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────
interface ActivityDay {
  date: string;
  actionCount: number;
}

interface MemberHeatmapData {
  id: string;
  name: string;
  role: UserRole;
  isOnline: boolean;
  activity: ActivityDay[];
}

// ── Generate mock activity data ────────────────────────────────
function generateMockActivity(days: number): ActivityDay[] {
  const result: ActivityDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Simulate realistic patterns: weekends lower, some zero days
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActivity = isWeekend ? Math.random() * 4 : Math.random() * 12;
    const ghostChance = Math.random();
    const actionCount =
      ghostChance < 0.1 ? 0 : Math.floor(baseActivity);
    result.push({ date: dateStr, actionCount });
  }
  return result;
}

const MOCK_HEATMAP_DATA: MemberHeatmapData[] = MOCK_TEAM.map((m) => ({
  ...m,
  activity: generateMockActivity(30),
}));

// ── Intensity mapping ──────────────────────────────────────────
const INTENSITY_LEVELS = [
  { min: 0, max: 0, bg: "bg-zinc-800/50", label: "No activity" },
  { min: 1, max: 2, bg: "bg-emerald-900/60", label: "Light" },
  { min: 3, max: 5, bg: "bg-emerald-700/70", label: "Moderate" },
  { min: 6, max: 9, bg: "bg-emerald-500/80", label: "Active" },
  { min: 10, max: Infinity, bg: "bg-emerald-400", label: "On Fire 🔥" },
];

function getIntensity(count: number) {
  return (
    INTENSITY_LEVELS.find((l) => count >= l.min && count <= l.max) ??
    INTENSITY_LEVELS[0]
  );
}

// ── Subcomponents ──────────────────────────────────────────────
function PresenceDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {isOnline && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      )}
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          isOnline ? "bg-emerald-400" : "bg-zinc-600"
        )}
      />
    </span>
  );
}

function HeatmapCell({ day }: { day: ActivityDay }) {
  const intensity = getIntensity(day.actionCount);
  const date = new Date(day.date);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "h-[14px] w-[14px] rounded-[3px] transition-all duration-200",
            "hover:scale-150 hover:ring-2 hover:ring-white/20 hover:z-10",
            "cursor-pointer",
            intensity.bg
          )}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-zinc-900 border-zinc-700 text-zinc-100"
      >
        <p className="font-semibold text-xs">{formatted}</p>
        <p className="text-[11px] text-zinc-400">
          {day.actionCount} action{day.actionCount !== 1 ? "s" : ""} ·{" "}
          {intensity.label}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

function MemberRow({ member }: { member: MemberHeatmapData }) {
  const roleMeta = ROLE_META[member.role];
  const totalActions = member.activity.reduce(
    (s, d) => s + d.actionCount,
    0
  );
  const streak = useMemo(() => {
    let count = 0;
    for (let i = member.activity.length - 1; i >= 0; i--) {
      if (member.activity[i].actionCount > 0) count++;
      else break;
    }
    return count;
  }, [member.activity]);

  const avgPerDay = (totalActions / member.activity.length).toFixed(1);

  return (
    <div className="group flex items-start gap-5 rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 backdrop-blur-sm transition-all hover:border-white/[0.1] hover:bg-zinc-900/60">
      {/* Member info */}
      <div className="flex w-36 shrink-0 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <PresenceDot isOnline={member.isOnline} />
          <span className="truncate text-sm font-medium text-zinc-100">
            {member.name}
          </span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "w-fit text-[9px] uppercase tracking-wider border",
            roleMeta.color
          )}
        >
          {roleMeta.label}
        </Badge>
        <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-zinc-500">
          <span>{totalActions} total · {avgPerDay}/day</span>
          <span className={cn(streak >= 7 ? "text-emerald-400" : "")}>
            {streak}d streak {streak >= 7 ? "🔥" : ""}
          </span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex flex-wrap gap-[3px]">
        {member.activity.map((day) => (
          <HeatmapCell key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function HeatmapPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const data = MOCK_HEATMAP_DATA;
  const onlineCount = data.filter((d) => d.isOnline).length;
  const days = 30;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
            <Flame className="h-6 w-6 text-orange-400" />
            Team Discipline Heatmap
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Last {days} days · {onlineCount} of {data.length} members online
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-2">
          <span>Less</span>
          {INTENSITY_LEVELS.map((level) => (
            <Tooltip key={level.label}>
              <TooltipTrigger asChild>
                <div
                  className={cn("h-3.5 w-3.5 rounded-[2px] cursor-help", level.bg)}
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs"
              >
                {level.label} ({level.min === 10 ? "10+" : `${level.min}–${level.max}`})
              </TooltipContent>
            </Tooltip>
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Team summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-white/[0.06] bg-zinc-900/60">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Team Total
            </p>
            <p className="mt-1 text-xl font-bold text-zinc-50">
              {data.reduce(
                (s, m) =>
                  s + m.activity.reduce((a, d) => a + d.actionCount, 0),
                0
              )}{" "}
              actions
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-zinc-900/60">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Best Streak
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-400">
              {Math.max(
                ...data.map((m) => {
                  let c = 0;
                  for (let i = m.activity.length - 1; i >= 0; i--) {
                    if (m.activity[i].actionCount > 0) c++;
                    else break;
                  }
                  return c;
                })
              )}{" "}
              days 🔥
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-zinc-900/60">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Zero Days
            </p>
            <p className="mt-1 text-xl font-bold text-red-400">
              {data.reduce(
                (s, m) =>
                  s +
                  m.activity.filter((d) => d.actionCount === 0).length,
                0
              )}{" "}
              gaps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Member rows */}
      <div className="space-y-3">
        {data.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
