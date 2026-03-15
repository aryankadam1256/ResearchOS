"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  FileText,
  Search,
  Upload,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Tag,
  Calendar,
  User,
  Filter,
} from "lucide-react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  tags: string[];
  source: "manual" | "arxiv_sync";
  uploadedBy: string;
  date: string;
  annotationCount: number;
  hasTldr: boolean;
  arxivId?: string;
}

const MOCK_PAPERS: Paper[] = [
  {
    id: "1",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Jason Wei", "Xuezhi Wang", "Dale Schuurmans", "et al."],
    abstract: "We explore how generating a chain of thought — a series of intermediate reasoning steps — significantly improves the ability of large language models to perform complex reasoning.",
    tags: ["prompting", "reasoning", "chain-of-thought"],
    source: "manual",
    uploadedBy: "Sneha",
    date: "2026-03-14",
    annotationCount: 12,
    hasTldr: true,
  },
  {
    id: "2",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: ["Yuntao Bai", "Saurav Kadavath", "et al."],
    abstract: "We experiment with methods for training a harmless AI assistant through a process we call constitutional AI (CAI). The idea is to use a set of principles to make judgments about outputs.",
    tags: ["alignment", "RLHF", "safety"],
    source: "manual",
    uploadedBy: "Ananya",
    date: "2026-03-13",
    annotationCount: 8,
    hasTldr: true,
  },
  {
    id: "3",
    title: "Scaling Data-Constrained Language Models",
    authors: ["Niklas Muennighoff", "Alexander Rush", "et al."],
    abstract: "We investigate scaling language models in data-constrained regimes, exploring strategies for repeating data and augmenting datasets.",
    tags: ["scaling", "data", "training"],
    source: "arxiv_sync",
    uploadedBy: "ArXiv Sync",
    date: "2026-03-12",
    annotationCount: 3,
    hasTldr: false,
    arxivId: "2305.16264",
  },
  {
    id: "4",
    title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
    authors: ["Rafael Rafailov", "Archit Sharma", "et al."],
    abstract: "We introduce Direct Preference Optimization (DPO), an algorithm that implicitly optimizes the same objective as existing RLHF algorithms but is simpler to implement.",
    tags: ["DPO", "RLHF", "alignment"],
    source: "manual",
    uploadedBy: "Ravi",
    date: "2026-03-11",
    annotationCount: 15,
    hasTldr: true,
  },
  {
    id: "5",
    title: "LORA: Low-Rank Adaptation of Large Language Models",
    authors: ["Edward J. Hu", "Yelong Shen", "et al."],
    abstract: "We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture.",
    tags: ["fine-tuning", "efficiency", "LoRA"],
    source: "arxiv_sync",
    uploadedBy: "ArXiv Sync",
    date: "2026-03-10",
    annotationCount: 6,
    hasTldr: true,
    arxivId: "2106.09685",
  },
];

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-white/[0.1] hover:bg-zinc-900/60 group cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {paper.source === "arxiv_sync" && (
                <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/20 text-[9px] h-4 px-1.5">
                  ✨ ArXiv Sync
                </Badge>
              )}
              {paper.hasTldr && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/20 text-[9px] h-4 px-1.5">
                  <Sparkles className="mr-1 h-2.5 w-2.5" />
                  TL;DR
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
              {paper.title}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {paper.authors.join(", ")}
            </p>
            <p className="mt-2 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
              {paper.abstract}
            </p>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {paper.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[9px] border-white/[0.06] text-zinc-500 hover:bg-white/[0.04] cursor-pointer"
                >
                  <Tag className="mr-1 h-2 w-2" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta */}
            <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-600">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {paper.uploadedBy}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {paper.date}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {paper.annotationCount} notes
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="border-white/[0.08] text-zinc-400 hover:text-zinc-200 h-8"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            {!paper.hasTldr && (
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10 h-8"
              >
                <Sparkles className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PapersPage() {
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "manual" | "arxiv_sync">("all");

  const filtered = MOCK_PAPERS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesSource =
      filterSource === "all" || p.source === filterSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
            <FileText className="h-6 w-6 text-sky-400" />
            Paper Vault
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {MOCK_PAPERS.length} papers · {MOCK_PAPERS.filter((p) => p.hasTldr).length}{" "}
            with TL;DR summaries
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20">
          <Upload className="mr-2 h-4 w-4" />
          Upload Paper
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input
            placeholder="Search papers, tags, authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-white/[0.08] bg-white/[0.03] text-zinc-200 placeholder:text-zinc-600"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "manual", "arxiv_sync"] as const).map((source) => (
            <Button
              key={source}
              size="sm"
              variant="outline"
              onClick={() => setFilterSource(source)}
              className={cn(
                "text-xs border-white/[0.08]",
                filterSource === source
                  ? "bg-white/[0.08] text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {source === "all"
                ? "All"
                : source === "manual"
                  ? "Manual"
                  : "ArXiv"}
            </Button>
          ))}
        </div>
      </div>

      {/* Papers list */}
      <div className="space-y-3">
        {filtered.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-zinc-700" />
            <p className="mt-3 text-sm text-zinc-500">
              No papers found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
