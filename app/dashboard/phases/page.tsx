"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PHASES, MOCK_TEAM, ROLE_META, MOCK_USER } from "@/lib/constants";
import { Lock, Unlock, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

interface PhaseData {
  name: string;
  label: string;
  icon: string;
  status: "completed" | "active" | "locked";
  signoffs: string[]; // user IDs who signed off
}

const MOCK_PHASES: PhaseData[] = PHASES.map((phase, idx) => ({
  ...phase,
  status: idx === 0 ? "completed" : idx === 1 ? "active" : "locked",
  signoffs:
    idx === 0
      ? MOCK_TEAM.map((m) => m.id)
      : idx === 1
        ? ["user-1", "user-2", "user-4"]
        : [],
}));

function PhaseCard({ phase, index }: { phase: PhaseData; index: number }) {
  const [signoffComment, setSignoffComment] = useState("");
  const progress = (phase.signoffs.length / MOCK_TEAM.length) * 100;
  const isSigned = phase.signoffs.includes(MOCK_USER.id);
  const signedMembers = MOCK_TEAM.filter((m) =>
    phase.signoffs.includes(m.id)
  );
  const unsignedMembers = MOCK_TEAM.filter(
    (m) => !phase.signoffs.includes(m.id)
  );

  return (
    <Card
      className={cn(
        "border-white/[0.06] backdrop-blur-sm transition-all relative overflow-hidden",
        phase.status === "active" &&
          "bg-indigo-950/20 border-indigo-500/20 ring-1 ring-indigo-500/10",
        phase.status === "completed" && "bg-emerald-950/10 border-emerald-500/10",
        phase.status === "locked" && "bg-zinc-900/30 opacity-50"
      )}
    >
      {/* Phase number indicator */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          phase.status === "completed" && "bg-emerald-500",
          phase.status === "active" && "bg-indigo-500",
          phase.status === "locked" && "bg-zinc-700"
        )}
      />

      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-lg",
                phase.status === "completed" && "bg-emerald-500/20",
                phase.status === "active" && "bg-indigo-500/20",
                phase.status === "locked" && "bg-zinc-800"
              )}
            >
              {phase.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : phase.status === "locked" ? (
                <Lock className="h-5 w-5 text-zinc-600" />
              ) : (
                <span>{phase.icon}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-semibold",
                    phase.status === "locked"
                      ? "text-zinc-600"
                      : "text-zinc-100"
                  )}
                >
                  {phase.label}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] uppercase tracking-wider h-4 px-1.5",
                    phase.status === "completed" &&
                      "border-emerald-500/30 text-emerald-400",
                    phase.status === "active" &&
                      "border-indigo-500/30 text-indigo-400",
                    phase.status === "locked" &&
                      "border-zinc-700 text-zinc-600"
                  )}
                >
                  {phase.status}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Phase {index + 1} of {PHASES.length}
              </p>
            </div>
          </div>

          {/* Sign-off button */}
          {phase.status === "active" && !isSigned && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Sign Off
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">
                    Sign off on {phase.label}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    By signing off, you confirm that this phase is complete and
                    meets quality standards.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="Optional: Add a comment or note any reservations..."
                  value={signoffComment}
                  onChange={(e) => setSignoffComment(e.target.value)}
                  className="border-white/[0.08] bg-white/[0.03] text-zinc-200"
                />
                <DialogFooter>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    Confirm Sign-off
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {phase.status === "active" && isSigned && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              ✓ Signed
            </Badge>
          )}
        </div>

        {/* Progress bar */}
        {phase.status !== "locked" && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">
                {phase.signoffs.length}/{MOCK_TEAM.length} sign-offs
              </span>
              <span className="text-xs text-zinc-500">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-1.5 bg-zinc-800"
            />
          </div>
        )}

        {/* Signed / unsigned avatars */}
        {phase.status === "active" && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1">
                Signed:
              </span>
              <div className="flex -space-x-1.5">
                {signedMembers.map((m) => (
                  <Avatar
                    key={m.id}
                    className="h-6 w-6 border-2 border-zinc-900 ring-1 ring-emerald-500/30"
                  >
                    <AvatarFallback className="bg-emerald-600/30 text-[9px] text-emerald-300 font-semibold">
                      {m.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            {unsignedMembers.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1">
                  Pending:
                </span>
                <div className="flex -space-x-1.5">
                  {unsignedMembers.map((m) => (
                    <Avatar
                      key={m.id}
                      className="h-6 w-6 border-2 border-zinc-900 ring-1 ring-amber-500/20"
                    >
                      <AvatarFallback className="bg-zinc-800 text-[9px] text-zinc-500 font-semibold">
                        {m.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PhasesPage() {
  const currentPhase = MOCK_PHASES.find((p) => p.status === "active");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
          <Lock className="h-6 w-6 text-indigo-400" />
          Phase-Locking
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          All 5 members must sign off before the next phase unlocks.
          Currently on:{" "}
          <span className="text-indigo-400 font-medium">
            {currentPhase?.label}
          </span>
        </p>
      </div>

      {/* Phase pipeline visualization */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {MOCK_PHASES.map((phase, idx) => (
          <React.Fragment key={phase.name}>
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                phase.status === "completed" &&
                  "bg-emerald-500/20 text-emerald-400",
                phase.status === "active" &&
                  "bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30",
                phase.status === "locked" && "bg-zinc-800 text-zinc-600"
              )}
            >
              <span>{phase.icon}</span>
              {phase.label}
            </div>
            {idx < MOCK_PHASES.length - 1 && (
              <ArrowRight className="h-4 w-4 text-zinc-700 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Phase cards */}
      <div className="space-y-4">
        {MOCK_PHASES.map((phase, idx) => (
          <PhaseCard key={phase.name} phase={phase} index={idx} />
        ))}
      </div>
    </div>
  );
}
