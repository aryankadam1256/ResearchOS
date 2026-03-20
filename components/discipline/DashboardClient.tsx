"use client";

import React, { useState, useEffect } from "react";
import { type UserRole } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, CheckCircle2, Server, FolderSync } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, type Variants } from "framer-motion";

interface DashboardClientProps {
  user: {
    name: string;
    role: UserRole;
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

export default function DashboardClient({ user }: DashboardClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <motion.div 
      className="space-y-7 px-2 pb-12 pt-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-1.5">
          <motion.h1 
            className="text-3xl font-semibold text-foreground lg:text-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Research Command
          </motion.h1>
          <motion.p 
            className="max-w-2xl text-base text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Welcome back, {user.name}. You are currently viewing cross-disciplinary analytics and active workstreams.
          </motion.p>
        </div>
        <motion.div 
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/80 bg-card px-4 py-2.5 shadow-sm transition-colors hover:bg-muted/50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
           <FolderSync className="w-4 h-4 text-muted-foreground" />
           <span className="text-sm font-medium">Context: Clinical Trial Alpha</span>
        </motion.div>
      </motion.div>

      {/* Main Layout Grid - Reordered and restructured */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        
        {/* Left Column (Stats & Upcoming Constraints) - 4 SPAN */}
        <motion.div variants={itemVariants} className="space-y-6 xl:col-span-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -2 }}>
              <Card className="h-full border-border/80 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Data Processing</CardTitle>
                  <Server className="h-4 w-4 text-primary opacity-70" />
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-2xl font-semibold">84.2%</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-emerald-500 font-medium">Optimal</span> threshold
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }}>
              <Card className="h-full border-border/80 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Datasets</CardTitle>
                  <Database className="h-4 w-4 text-primary opacity-70" />
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-2xl font-semibold">14</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-emerald-500 font-medium">3 sets</span> pending cleaning
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <Card className="h-full border-border/80 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Drafts in Review</CardTitle>
                  <FileText className="h-4 w-4 text-primary opacity-70" />
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-2xl font-semibold">03</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    Pending peer methodology
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <Card className="group relative h-full overflow-hidden border-primary/30 shadow-sm transition-all">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                  <CardTitle className="text-sm font-medium text-primary">Milestone Lock</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-semibold text-primary">On Target</div>
                  <p className="text-xs text-primary/80 mt-1 font-medium">
                    Phase 3 unlocks in 5 days
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="pt-4">
             <div className="mb-4 flex items-center justify-between">
               <h2 className="text-lg font-semibold">Project Constraints</h2>
             </div>
             <div className="space-y-3">
              <motion.div 
                whileHover={{ scale: 1.01, x: 2 }}
                className="flex cursor-pointer flex-col rounded-xl border border-destructive/20 bg-card p-4 shadow-sm transition-colors hover:border-destructive/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="destructive" className="font-medium text-[10px]">Critical</Badge>
                  <span className="text-xs font-semibold text-destructive font-mono">T-Minus 48h</span>
                </div>
                <h3 className="font-medium text-sm">Grant Proposal Submission</h3>
                <p className="text-xs text-muted-foreground mt-1">Requires digital sign-off from all Principal Investigators.</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01, x: 2 }}
                className="flex cursor-pointer flex-col rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-amber-500/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="font-medium text-[10px] bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0">Warning</Badge>
                  <span className="text-xs font-semibold font-mono">5 Days</span>
                </div>
                <h3 className="font-medium text-sm">Phase 1 Protocol Freeze</h3>
                <p className="text-xs text-muted-foreground mt-1">Stop modifying the base methodology and finalize experimental variables.</p>
              </motion.div>
             </div>
          </div>
        </motion.div>

        {/* Right Column (Focus / Feeds) - 8 SPAN */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-border/80 bg-muted/30 p-6 lg:p-8 xl:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Active Workstream Log</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest updates across all connected multi-disciplinary modules.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-background text-[10px] uppercase tracking-[0.08em] shadow-sm">Sync Active</Badge>
            </div>
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/80 before:to-transparent">
            
            {[
              { init: "JB", title: "Dataset Alpha Validated", time: "14:02 PM", desc: "Data collection phase complete. Evaluated 150k samples. Outliers removed. Proceeding to main statistical analysis phase.", border: "border-primary", bg: "bg-primary text-primary-foreground" },
              { init: "AK", title: "Literature Review Merged", time: "09:15 AM", desc: "Merged 14 new citations regarding prior behavioral trials. The Introduction section draft is now fully referenced and ready for peer evaluation.", border: "border-secondary", bg: "bg-secondary text-secondary-foreground" },
              { init: "PR", title: "Equipment Alert", time: "Yesterday", desc: "High resource usage detected on Cluster Array-7 during batch analysis. Restarting sub-routines to manage memory overflow.", border: "border-secondary", bg: "bg-secondary text-secondary-foreground", descColor: "text-destructive/90" },
              { init: "SYS", title: "Protocol Automated Check", time: "Feb 12", desc: "Routine compliance and ethics constraint checker executed. No violations found in standard operational procedures.", border: "border-secondary", bg: "bg-muted text-muted-foreground border border-border" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex items-start gap-6 group"
              >
                <div className="relative pt-1 pl-1">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={"flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow-sm shrink-0 z-10 text-xs font-semibold relative " + item.bg}
                  >
                    {item.init}
                  </motion.div>
                </div>
                <div className="flex-1 rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-semibold text-sm">{item.title}</div>
                    <time className="font-mono text-xs text-muted-foreground">{item.time}</time>
                  </div>
                  <div className={"text-sm " + (item.descColor || "text-muted-foreground")}>
                    {item.desc}
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
