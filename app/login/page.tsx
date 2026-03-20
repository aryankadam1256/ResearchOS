"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@research.org");
  const [password, setPassword] = useState("ResearchOS@2026");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-16 text-foreground selection:bg-primary/30">
      <Card className="w-full max-w-md border-border/80 bg-card/95 shadow-lg">
        <CardContent className="px-7 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <h1 className="text-center text-2xl font-semibold uppercase tracking-[0.06em] text-foreground">Research OS</h1>
            <p className="mt-1 text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Workspace Authentication</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Identity ID</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-background px-3.5 text-sm shadow-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Passphrase</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 bg-background px-3.5 text-sm font-mono tracking-[0.08em] shadow-sm"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="mt-6 h-11 w-full gap-2 text-sm font-semibold shadow-md"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
              SECURE CONNECTION ESTABLISHED
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
