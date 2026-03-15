"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Download,
  CheckSquare,
  Square,
  Copy,
  CheckCircle2,
  FileDown,
} from "lucide-react";

interface BibEntry {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  bibtex: string;
  selected: boolean;
}

const MOCK_ENTRIES: BibEntry[] = [
  {
    id: "1",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Wei, Jason", "Wang, Xuezhi", "Schuurmans, Dale"],
    year: 2022,
    venue: "NeurIPS",
    bibtex: `@article{wei2022chain,
  title={Chain-of-Thought Prompting Elicits Reasoning in Large Language Models},
  author={Wei, Jason and Wang, Xuezhi and Schuurmans, Dale and others},
  journal={Advances in Neural Information Processing Systems},
  volume={35},
  year={2022}
}`,
    selected: true,
  },
  {
    id: "2",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: ["Bai, Yuntao", "Kadavath, Saurav"],
    year: 2022,
    venue: "arXiv",
    bibtex: `@article{bai2022constitutional,
  title={Constitutional AI: Harmlessness from AI Feedback},
  author={Bai, Yuntao and Kadavath, Saurav and others},
  journal={arXiv preprint arXiv:2212.08073},
  year={2022}
}`,
    selected: true,
  },
  {
    id: "3",
    title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
    authors: ["Rafailov, Rafael", "Sharma, Archit"],
    year: 2023,
    venue: "NeurIPS",
    bibtex: `@article{rafailov2023direct,
  title={Direct Preference Optimization: Your Language Model is Secretly a Reward Model},
  author={Rafailov, Rafael and Sharma, Archit and others},
  journal={Advances in Neural Information Processing Systems},
  volume={36},
  year={2023}
}`,
    selected: true,
  },
  {
    id: "4",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Hu, Edward J.", "Shen, Yelong"],
    year: 2021,
    venue: "ICLR",
    bibtex: `@article{hu2021lora,
  title={LoRA: Low-Rank Adaptation of Large Language Models},
  author={Hu, Edward J. and Shen, Yelong and others},
  journal={International Conference on Learning Representations},
  year={2022}
}`,
    selected: false,
  },
  {
    id: "5",
    title: "Scaling Data-Constrained Language Models",
    authors: ["Muennighoff, Niklas", "Rush, Alexander"],
    year: 2023,
    venue: "NeurIPS",
    bibtex: `@article{muennighoff2023scaling,
  title={Scaling Data-Constrained Language Models},
  author={Muennighoff, Niklas and Rush, Alexander and others},
  journal={Advances in Neural Information Processing Systems},
  volume={36},
  year={2023}
}`,
    selected: false,
  },
];

export default function BibGeneratorPage() {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [copied, setCopied] = useState(false);
  const selectedEntries = entries.filter((e) => e.selected);

  const toggleEntry = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const selectAll = () => {
    setEntries((prev) => prev.map((e) => ({ ...e, selected: true })));
  };

  const bibOutput = selectedEntries.map((e) => e.bibtex).join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(bibOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([bibOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "references.bib";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-50">
            <BookOpen className="h-6 w-6 text-teal-400" />
            LaTeX Bib Generator
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Select papers from your vault to generate a .bib file.{" "}
            {selectedEntries.length} of {entries.length} selected.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="border-white/[0.08] text-zinc-400 hover:text-zinc-200"
          >
            <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
            Select All
          </Button>
          <Button
            onClick={handleDownload}
            disabled={selectedEntries.length === 0}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/20"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download .bib
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: Paper selection */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold px-1">
            Papers from Vault
          </p>
          {entries.map((entry) => (
            <Card
              key={entry.id}
              onClick={() => toggleEntry(entry.id)}
              className={cn(
                "border-white/[0.06] bg-zinc-900/40 cursor-pointer transition-all hover:border-white/[0.1]",
                entry.selected && "ring-1 ring-teal-500/20 border-teal-500/15"
              )}
            >
              <CardContent className="p-3.5 flex items-start gap-3">
                <div className="mt-0.5">
                  {entry.selected ? (
                    <CheckSquare className="h-4 w-4 text-teal-400" />
                  ) : (
                    <Square className="h-4 w-4 text-zinc-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 line-clamp-2">
                    {entry.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {entry.authors.join(", ")} · {entry.year}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-1.5 text-[9px] border-white/[0.06] text-zinc-600"
                  >
                    {entry.venue}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: BibTeX preview */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">
              Generated BibTeX ({selectedEntries.length} entries)
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={selectedEntries.length === 0}
              className="border-white/[0.08] text-zinc-500 hover:text-zinc-300 text-xs h-7"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Card className="border-white/[0.06] bg-zinc-950/80">
            <CardContent className="p-0">
              {selectedEntries.length > 0 ? (
                <pre className="p-4 text-xs font-mono text-emerald-400/80 overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                  {bibOutput}
                </pre>
              ) : (
                <div className="p-8 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-zinc-700" />
                  <p className="mt-2 text-sm text-zinc-600">
                    Select papers to generate BibTeX
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
