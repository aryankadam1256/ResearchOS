"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Upload,
  Star,
  Clock,
  FileText,
  Send,
  AlertCircle,
} from "lucide-react";

interface BlindReview {
  id: string;
  documentTitle: string;
  status: "pending" | "in_progress" | "submitted";
  rating: number | null;
  critique: string | null;
  deadline: string;
  createdAt: string;
}

const MOCK_REVIEWS: BlindReview[] = [
  {
    id: "1",
    documentTitle: "Section 3: Methodology — Prompt Engineering Framework",
    status: "in_progress",
    rating: null,
    critique: null,
    deadline: "2026-03-18",
    createdAt: "2026-03-13",
  },
  {
    id: "2",
    documentTitle: "Section 2: Related Work — LLM Alignment Techniques",
    status: "submitted",
    rating: 4,
    critique:
      "Strong coverage of RLHF and DPO approaches. Missing recent work on constitutional AI methods. Section transition between 2.1 and 2.2 needs smoother connective text. Consider adding a comparison table.",
    deadline: "2026-03-15",
    createdAt: "2026-03-10",
  },
  {
    id: "3",
    documentTitle: "Section 1: Introduction — Research Motivation",
    status: "submitted",
    rating: 5,
    critique:
      "Excellent framing of the research gap. The three contributions are clearly stated. Minor suggestion: strengthen the last paragraph to better preview the paper structure.",
    deadline: "2026-03-12",
    createdAt: "2026-03-08",
  },
  {
    id: "4",
    documentTitle: "Section 4: Experimental Setup — Datasets and Baselines",
    status: "pending",
    rating: null,
    critique: null,
    deadline: "2026-03-20",
    createdAt: "2026-03-14",
  },
];

const STATUS_STYLES = {
  pending: { label: "Pending", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/20" },
  in_progress: { label: "In Progress", color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  submitted: { label: "Submitted", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-700"
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: BlindReview }) {
  const [critique, setCritique] = useState("");
  const statusMeta = STATUS_STYLES[review.status];
  const daysUntilDeadline = Math.ceil(
    (new Date(review.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-white/[0.1]",
        review.status === "in_progress" && "ring-1 ring-amber-500/10"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge className={cn("text-[9px] h-4 px-1.5", statusMeta.color)}>
                {statusMeta.label}
              </Badge>
              {daysUntilDeadline <= 2 && daysUntilDeadline > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/20 text-[9px] h-4 px-1.5">
                  <AlertCircle className="mr-0.5 h-2.5 w-2.5" />
                  Due soon
                </Badge>
              )}
            </div>

            <h3 className="text-sm font-semibold text-zinc-100">
              {review.documentTitle}
            </h3>

            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-zinc-600">
              <span className="flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                Author hidden
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {review.deadline}
                {daysUntilDeadline > 0 && ` (${daysUntilDeadline}d)`}
              </span>
            </div>

            {/* Submitted review */}
            {review.status === "submitted" && review.critique && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Rating:
                  </span>
                  <StarRating rating={review.rating ?? 0} />
                </div>
                <div className="rounded-lg bg-zinc-950/50 border border-white/[0.04] p-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {review.critique}
                  </p>
                </div>
              </div>
            )}

            {/* In-progress review form */}
            {review.status === "in_progress" && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {["Clarity", "Rigor", "Novelty"].map((criterion) => (
                    <div key={criterion}>
                      <p className="text-[10px] text-zinc-600 mb-1">
                        {criterion}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            className="text-zinc-700 hover:text-amber-400 transition-colors"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Textarea
                  placeholder="Write your critique (min 100 words)..."
                  value={critique}
                  onChange={(e) => setCritique(e.target.value)}
                  className="min-h-[80px] resize-none border-white/[0.08] bg-white/[0.03] text-zinc-200 placeholder:text-zinc-600"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-600">
                    {critique.trim().split(/\s+/).filter(Boolean).length}/100
                    words min
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  >
                    <Send className="mr-1.5 h-3 w-3" />
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action button for viewing */}
          <Button
            size="sm"
            variant="outline"
            className="border-white/[0.08] text-zinc-400 hover:text-zinc-200 shrink-0 h-8"
          >
            <FileText className="h-3 w-3 mr-1.5" />
            View Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewsPage() {
  const pendingCount = MOCK_REVIEWS.filter(
    (r) => r.status === "pending" || r.status === "in_progress"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
            <Eye className="h-6 w-6 text-violet-400" />
            Blind Review
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {pendingCount} reviews pending · Anonymous peer review for internal
            drafts
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20">
          <Upload className="mr-2 h-4 w-4" />
          Submit for Review
        </Button>
      </div>

      {/* Explainer */}
      <Card className="border-indigo-500/10 bg-indigo-950/10">
        <CardContent className="flex items-center gap-3 p-4">
          <EyeOff className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <p className="text-sm text-indigo-300 font-medium">
              Reviews are anonymous
            </p>
            <p className="text-xs text-indigo-400/60">
              Authors and reviewers are randomly assigned. You won&apos;t know
              who wrote the draft, and they won&apos;t know who reviewed it.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reviews list */}
      <div className="space-y-3">
        {MOCK_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
