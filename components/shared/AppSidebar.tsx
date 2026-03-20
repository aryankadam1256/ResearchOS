"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Thermometer,
  ShieldAlert,
  GraduationCap,
  Users,
  PencilRuler,
  FlaskConical,
  ArrowLeft,
} from "lucide-react";

import { SignOutButton } from "@/components/shared/SignOutButton";

function getNavigation(projectId: string) {
  const base = `/dashboard/${projectId}`;
  return [
    {
      title: "Core Operations",
      items: [
        { title: "Command Center", url: base, icon: LayoutDashboard },
        { title: "Literature & Papers", url: `${base}/papers`, icon: BookOpen },
        { title: "Drafting Pipeline", url: `${base}/bib-generator`, icon: PencilRuler },
        { title: "Active Trials", url: `${base}/experiments`, icon: FlaskConical },
      ],
    },
    {
      title: "Project Mechanics",
      items: [
        { title: "Phase Progression", url: `${base}/phases`, icon: Layers },
        { title: "Review Milestones", url: `${base}/reviews`, icon: GraduationCap },
        { title: "Author Heatmap", url: `${base}/heatmap`, icon: Thermometer },
      ],
    },
    {
      title: "Governance",
      items: [
        { title: "Ethics & Safety", url: `${base}/red-team`, icon: ShieldAlert },
        { title: "Peer Check-ins", url: `${base}/checkins`, icon: Users },
      ],
    },
  ];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  researcher: "Researcher",
  observer: "Observer",
};

interface AppSidebarProps {
  user: {
    name: string;
    role: string;
  };
  projectId: string;
  projectTitle?: string;
}

export function AppSidebar({ user, projectId, projectTitle }: AppSidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigation(projectId);

  if (!user) return null;

  return (
    <Sidebar className="border-r border-border/80">
      <SidebarHeader className="flex h-16 items-center border-b border-border/80 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          <span className="hidden text-sm font-semibold uppercase tracking-[0.1em] md:inline-block truncate">
            {projectTitle ?? "Project"}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <AnimatePresence>
          {navigation.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1, duration: 0.3 }}
            >
              <SidebarGroup>
                <SidebarGroupLabel className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.title}
                            className="h-9 rounded-lg transition-all hover:bg-muted/80"
                          >
                            <Link href={item.url} className="flex items-center w-full relative">
                              {isActive && (
                                <motion.div
                                  layoutId="activeNavIndicator"
                                  className="absolute left-0 w-1 h-full bg-primary rounded-r-sm -ml-[12px]"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                              <item.icon className={`mr-3 h-4 w-4 ${isActive ? "" : "text-muted-foreground"}`} />
                              <span className={isActive ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {groupIndex < navigation.length - 1 && <SidebarSeparator className="my-4" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/80 p-4 pb-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm border shadow-sm shrink-0">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="truncate text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
          <SignOutButton />
        </motion.div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
