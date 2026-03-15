"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  CheckSquare,
  Lock,
  FileText,
  FlaskConical,
  Eye,
  ShieldAlert,
  BookOpen,
  Dna,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_META, type UserRole } from "@/lib/constants";
import { SignOutButton } from "@/components/shared/SignOutButton";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Flame,
  CheckSquare,
  Lock,
  FileText,
  FlaskConical,
  Eye,
  ShieldAlert,
  BookOpen,
};

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" }],
  },
  {
    title: "Discipline",
    items: [
      { label: "Heatmap", href: "/dashboard/heatmap", icon: "Flame" },
      { label: "Check-ins", href: "/dashboard/checkins", icon: "CheckSquare" },
      { label: "Phases", href: "/dashboard/phases", icon: "Lock" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Papers", href: "/dashboard/papers", icon: "FileText" },
      { label: "Experiments", href: "/dashboard/experiments", icon: "FlaskConical" },
    ],
  },
  {
    title: "Rigor",
    items: [
      { label: "Reviews", href: "/dashboard/reviews", icon: "Eye" },
      { label: "Red Team", href: "/dashboard/red-team", icon: "ShieldAlert" },
      { label: "Bib Generator", href: "/dashboard/bib-generator", icon: "BookOpen" },
    ],
  },
];

function PresenceDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {isOnline && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      )}
      <span
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          isOnline ? "bg-emerald-400" : "bg-zinc-600"
        )}
      />
    </span>
  );
}

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const roleMeta = ROLE_META[user.role] ?? ROLE_META["coordinator"];
  const onlineCount = MOCK_TEAM.filter((m) => m.isOnline).length;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/[0.06] bg-zinc-950">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <Dna className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-zinc-50">
            ResearchOS
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-wide uppercase">
            LLM Research Suite
          </p>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
                    isActive
                      ? "bg-white/[0.08] text-zinc-50 shadow-sm"
                      : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-indigo-400"
                          : "text-zinc-600 group-hover:text-zinc-400"
                      )}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </ScrollArea>

      <Separator className="bg-white/[0.06]" />

      {/* Team presence */}
      <div className="px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Team ({onlineCount}/{MOCK_TEAM.length} online)
        </p>
        <div className="space-y-1.5">
          {MOCK_TEAM.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-white/[0.04] cursor-default">
                  <PresenceDot isOnline={member.isOnline} />
                  <span
                    className={cn(
                      "text-xs truncate",
                      member.isOnline ? "text-zinc-300" : "text-zinc-600"
                    )}
                  >
                    {member.name}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-zinc-900 border-zinc-700 text-zinc-100"
              >
                <p className="text-xs">
                  {ROLE_META[member.role].emoji} {ROLE_META[member.role].label}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* User profile + sign out */}
      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <Avatar className="h-8 w-8 border border-white/[0.08]">
          <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-xs font-semibold text-white">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-zinc-200">
            {user.name}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "mt-0.5 h-4 text-[9px] uppercase tracking-wider border px-1.5",
              roleMeta.color
            )}
          >
            {roleMeta.label}
          </Badge>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
