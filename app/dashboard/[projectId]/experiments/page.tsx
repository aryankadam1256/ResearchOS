"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  Plus,
  ChevronDown,
  ChevronRight,
  Hash,
  Cpu,
  Thermometer,
  BarChart3,
  Clock,
  User,
} from "lucide-react";

interface ExperimentRun {
  id: string;
  runNumber: number;
  model: string;
  prompt: string;
  hyperparams: Record<string, number | string>;
  metrics: Record<string, number>;
  notes: string;
  createdAt: string;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  status: "draft" | "running" | "completed" | "failed";
  createdBy: string;
  runs: ExperimentRun[];
  createdAt: string;
}

const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "1",
    title: "Prompt Engineering for Math Reasoning",
    description: "Testing various prompt formats for GSM8K math benchmarks with different LLMs.",
    status: "running",
    createdBy: "Ravi",
    createdAt: "2026-03-10",
    runs: [
      {
        id: "r1",
        runNumber: 1,
        model: "GPT-4",
        prompt: "Solve the following math problem step by step:\n{problem}",
        hyperparams: { temperature: 0.7, top_p: 0.95, max_tokens: 512 },
        metrics: { accuracy: 0.72, avg_tokens: 234 },
        notes: "Baseline zero-shot with step-by-step instruction",
        createdAt: "2026-03-10",
      },
      {
        id: "r2",
        runNumber: 2,
        model: "GPT-4",
        prompt: "You are a math tutor. Think carefully and solve:\n{problem}\nShow your work.",
        hyperparams: { temperature: 0.3, top_p: 0.9, max_tokens: 512 },
        metrics: { accuracy: 0.78, avg_tokens: 312 },
        notes: "Added persona + lower temperature. Significant improvement.",
        createdAt: "2026-03-11",
      },
      {
        id: "r3",
        runNumber: 3,
        model: "Claude 3.5 Sonnet",
        prompt: "You are a math tutor. Think carefully and solve:\n{problem}\nShow your work.",
        hyperparams: { temperature: 0.3, top_p: 0.9, max_tokens: 512 },
        metrics: { accuracy: 0.82, avg_tokens: 289 },
        notes: "Same prompt on Claude — even better results.",
        createdAt: "2026-03-12",
      },
    ],
  },
  {
    id: "2",
    title: "LoRA Fine-tuning Llama 3 on Domain Data",
    description: "Testing LoRA ranks and learning rates for domain adaptation.",
    status: "completed",
    createdBy: "Dev",
    createdAt: "2026-03-05",
    runs: [
      {
        id: "r4",
        runNumber: 1,
        model: "Llama 3 8B",
        prompt: "N/A (fine-tuning)",
        hyperparams: { lora_rank: 16, lr: 0.0002, epochs: 3, batch_size: 8 },
        metrics: { loss: 1.23, eval_acc: 0.68 },
        notes: "Baseline LoRA config",
        createdAt: "2026-03-05",
      },
      {
        id: "r5",
        runNumber: 2,
        model: "Llama 3 8B",
        prompt: "N/A (fine-tuning)",
        hyperparams: { lora_rank: 64, lr: 0.0001, epochs: 5, batch_size: 4 },
        metrics: { loss: 0.89, eval_acc: 0.76 },
        notes: "Higher rank + lower LR + more epochs. Best so far.",
        createdAt: "2026-03-07",
      },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/20",
  running: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/20 text-red-400 border-red-500/20",
};

function RunRow({ run }: { run: ExperimentRun }) {
  return (
    <div className="rounded-lg border border-white/[0.04] bg-zinc-950/50 p-4 ml-4 hover:border-white/[0.08] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[9px] border-white/[0.1] text-zinc-500 font-mono"
          >
            <Hash className="mr-0.5 h-2.5 w-2.5" />
            Run {run.runNumber}
          </Badge>
          <Badge
            variant="outline"
            className="text-[9px] border-sky-500/20 text-sky-400"
          >
            <Cpu className="mr-0.5 h-2.5 w-2.5" />
            {run.model}
          </Badge>
        </div>
        <span className="text-[10px] text-zinc-600">{run.createdAt}</span>
      </div>

      {/* Prompt */}
      <div className="mb-3">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
          Prompt
        </p>
        <pre className="text-xs text-zinc-400 bg-zinc-900/80 rounded-md p-2 overflow-x-auto font-mono whitespace-pre-wrap">
          {run.prompt}
        </pre>
      </div>

      {/* Hyperparams + Metrics side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
            <Thermometer className="inline h-2.5 w-2.5 mr-0.5" />
            Hyperparameters
          </p>
          <div className="space-y-0.5">
            {Object.entries(run.hyperparams).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-zinc-500 font-mono">{k}</span>
                <span className="text-zinc-300 font-mono">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
            <BarChart3 className="inline h-2.5 w-2.5 mr-0.5" />
            Metrics
          </p>
          <div className="space-y-0.5">
            {Object.entries(run.metrics).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-zinc-500 font-mono">{k}</span>
                <span className="text-emerald-400 font-mono font-semibold">
                  {typeof v === "number" && v < 10 ? v.toFixed(2) : v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      {run.notes && (
        <p className="mt-2 text-xs text-zinc-500 italic">💡 {run.notes}</p>
      )}
    </div>
  );
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-white/[0.06] bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-5">
        {/* Header */}
        <div
          className="flex items-start justify-between cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-3">
            <button className="mt-0.5 text-zinc-600 hover:text-zinc-400 transition-colors">
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {experiment.title}
                </h3>
                <Badge
                  className={cn(
                    "text-[9px] h-4 px-1.5",
                    STATUS_STYLES[experiment.status]
                  )}
                >
                  {experiment.status}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {experiment.description}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-600">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {experiment.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {experiment.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {experiment.runs.length} runs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded runs */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-white/[0.04] pt-4">
            {experiment.runs.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
            <Button
              size="sm"
              variant="outline"
              className="ml-4 border-white/[0.08] text-zinc-500 hover:text-zinc-300 text-xs"
            >
              <Plus className="mr-1.5 h-3 w-3" />
              Add Run
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExperimentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
            <FlaskConical className="h-6 w-6 text-amber-400" />
            Experiment Ledger
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {MOCK_EXPERIMENTS.length} experiments ·{" "}
            {MOCK_EXPERIMENTS.reduce((s, e) => s + e.runs.length, 0)} total runs
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20">
          <Plus className="mr-2 h-4 w-4" />
          New Experiment
        </Button>
      </div>

      {/* Experiments list */}
      <div className="space-y-4">
        {MOCK_EXPERIMENTS.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </div>
  );
}
