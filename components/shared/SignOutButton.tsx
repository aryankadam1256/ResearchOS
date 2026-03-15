"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SignOutButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-md p-1.5 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-zinc-900 border-zinc-700 text-zinc-100">
        Sign out
      </TooltipContent>
    </Tooltip>
  );
}
