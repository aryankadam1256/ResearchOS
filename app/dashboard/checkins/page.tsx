"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MOCK_TEAM, ROLE_META, type UserRole } from "@/lib/constants";
import { CheckSquare, MessageSquare, ThumbsUp, AlertCircle, Plus, Calendar } from "lucide-react";

interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  summary: string;
  roadblock: string | null;
  date: string;
  reactions: number;
}

const MOCK_CHECKINS: CheckIn[] = [
  {
    id: "1",
    userId: "user-2",
    userName: "Ananya",
    role: "lead_writer",
    summary:
      "Drafted the Introduction and Related Work sections. Reviewed 4 papers on prompt engineering taxonomy. Created an outline for the Methodology section with key experiment descriptions.",
    roadblock: null,
    date: "2026-03-15",
    reactions: 3,
  },
  {
    id: "2",
    userId: "user-1",
    userName: "Prateek",
    role: "coordinator",
    summary:
      "Coordinated meeting to align experiment evaluation metrics. Updated the project timeline. Pinged Ravi about missing check-in from yesterday.",
    roadblock: "Need to finalize evaluation criteria before experiments can proceed.",
    date: "2026-03-15",
    reactions: 2,
  },
  {
    id: "3",
    userId: "user-4",
    userName: "Sneha",
    role: "lit_reviewer",
    summary:
      "Found 6 new papers on ArXiv about instruction tuning for LLMs. Added annotations to 3 papers. Highlighted conflicting findings between two prominent studies.",
    roadblock: null,
    date: "2026-03-15",
    reactions: 4,
  },
  {
    id: "4",
    userId: "user-5",
    userName: "Dev",
    role: "data_lead",
    summary:
      "Preprocessed the evaluation dataset. Fixed data leakage issue in train/test split. Ran baseline experiments with default hyperparameters.",
    roadblock: "GPU allocation taking longer than expected — only 2 of 4 GPUs available.",
    date: "2026-03-14",
    reactions: 1,
  },
  {
    id: "5",
    userId: "user-3",
    userName: "Ravi",
    role: "experimenter",
    summary:
      "Ran 8 prompt variations on GPT-4. Best performing prompt achieved 78% accuracy on validation set. Documented all hyperparameters and prompt templates.",
    roadblock: null,
    date: "2026-03-14",
    reactions: 5,
  },
];

function CheckInCard({ checkin }: { checkin: CheckIn }) {
  const roleMeta = ROLE_META[checkin.role];
  const isToday = checkin.date === new Date().toISOString().split("T")[0];

  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-white/[0.1]",
        isToday && "ring-1 ring-indigo-500/20"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 border border-white/[0.08] mt-0.5">
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-xs font-semibold text-white">
              {checkin.userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-zinc-200">
                {checkin.userName}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] uppercase tracking-wider border h-4 px-1.5",
                  roleMeta.color
                )}
              >
                {roleMeta.label}
              </Badge>
              <span className="text-xs text-zinc-600">
                {isToday ? "Today" : checkin.date}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
              {checkin.summary}
            </p>
            {checkin.roadblock && (
              <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300/80">{checkin.roadblock}</p>
              </div>
            )}
            <div className="mt-3 flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                <ThumbsUp className="h-3 w-3" />
                {checkin.reactions}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                <MessageSquare className="h-3 w-3" />
                Reply
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewCheckinForm({ onSubmit }: { onSubmit: () => void }) {
  const [summary, setSummary] = useState("");
  const [roadblock, setRoadblock] = useState("");
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Card className="border-indigo-500/20 bg-indigo-950/10 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
          <Plus className="h-4 w-4 text-indigo-400" />
          New Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Textarea
            placeholder="What did you work on today? Be specific about progress, decisions, and findings. (Max 100 words)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[100px] resize-none border-white/[0.08] bg-white/[0.03] text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50"
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
          placeholder="Any roadblocks or blockers? (optional)"
          value={roadblock}
          onChange={(e) => setRoadblock(e.target.value)}
          className="min-h-[60px] resize-none border-white/[0.08] bg-white/[0.03] text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/50"
        />
        <div className="flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={wordCount === 0 || wordCount > 100}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20"
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Submit Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckinsPage() {
  const [showForm, setShowForm] = useState(false);
  const todayCheckins = MOCK_CHECKINS.filter(
    (c) => c.date === new Date().toISOString().split("T")[0]
  );
  const olderCheckins = MOCK_CHECKINS.filter(
    (c) => c.date !== new Date().toISOString().split("T")[0]
  );

  // Who hasn't checked in today
  const checkedInToday = new Set(todayCheckins.map((c) => c.userId));
  const missing = MOCK_TEAM.filter((m) => !checkedInToday.has(m.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
            <CheckSquare className="h-6 w-6 text-indigo-400" />
            Daily Check-ins
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Proof of Progress — {todayCheckins.length}/{MOCK_TEAM.length}{" "}
            checked in today
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="outline"
          className="border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Check-in
        </Button>
      </div>

      {/* Missing members alert */}
      {missing.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-950/10">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-300">
                Missing today:{" "}
                {missing.map((m) => m.name).join(", ")}
              </p>
              <p className="text-xs text-amber-400/60">
                {missing.length} member{missing.length > 1 ? "s haven't" : " hasn't"} submitted today&apos;s check-in yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New check-in form */}
      {showForm && <NewCheckinForm onSubmit={() => setShowForm(false)} />}

      {/* Today's check-ins */}
      {todayCheckins.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-zinc-600" />
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Today
            </h2>
          </div>
          <div className="space-y-3">
            {todayCheckins.map((checkin) => (
              <CheckInCard key={checkin.id} checkin={checkin} />
            ))}
          </div>
        </div>
      )}

      {/* Older check-ins */}
      {olderCheckins.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-zinc-600" />
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Previous
            </h2>
          </div>
          <div className="space-y-3">
            {olderCheckins.map((checkin) => (
              <CheckInCard key={checkin.id} checkin={checkin} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
