"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SignOutButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-auto"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover border-border text-popover-foreground text-xs">
          Disconnect
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
