// ── Roles ───────────────────────────────────────────────────────
export type UserRole =
  | "lead_writer"
  | "experimenter"
  | "lit_reviewer"
  | "data_lead"
  | "coordinator";

export const ROLE_META: Record<
  UserRole,
  { label: string; emoji: string; color: string }
> = {
  lead_writer: {
    label: "Lead Writer",
    emoji: "🖊️",
    color: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  experimenter: {
    label: "Experimenter",
    emoji: "🧪",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  lit_reviewer: {
    label: "Lit Reviewer",
    emoji: "📚",
    color: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  data_lead: {
    label: "Data Lead",
    emoji: "📊",
    color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  coordinator: {
    label: "Coordinator",
    emoji: "🎯",
    color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
};

// ── Phases ───────────────────────────────────────────────────────
export type PhaseName =
  | "literature_review"
  | "methodology"
  | "experimentation"
  | "results"
  | "writing"
  | "revision";

export const PHASES: { name: PhaseName; label: string; icon: string }[] = [
  { name: "literature_review", label: "Literature Review", icon: "📖" },
  { name: "methodology", label: "Methodology", icon: "🔬" },
  { name: "experimentation", label: "Experimentation", icon: "🧪" },
  { name: "results", label: "Results", icon: "📊" },
  { name: "writing", label: "Writing", icon: "✍️" },
  { name: "revision", label: "Revision", icon: "🔄" },
];

// ── Navigation ──────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Heatmap", href: "/dashboard/heatmap", icon: "Flame" },
  { label: "Check-ins", href: "/dashboard/checkins", icon: "CheckSquare" },
  { label: "Phases", href: "/dashboard/phases", icon: "Lock" },
  { label: "Papers", href: "/dashboard/papers", icon: "FileText" },
  { label: "Experiments", href: "/dashboard/experiments", icon: "FlaskConical" },
  { label: "Reviews", href: "/dashboard/reviews", icon: "Eye" },
  { label: "Red Team", href: "/dashboard/red-team", icon: "ShieldAlert" },
  { label: "Bib Generator", href: "/dashboard/bib-generator", icon: "BookOpen" },
];

// ── Mock user (will be replaced by auth) ────────────────────────
export const MOCK_USER = {
  id: "user-1",
  name: "Prateek",
  email: "prateek@research.ai",
  role: "coordinator" as UserRole,
  avatarUrl: null,
};

export const MOCK_TEAM = [
  { id: "user-1", name: "Prateek", role: "coordinator" as UserRole, isOnline: true },
  { id: "user-2", name: "Ananya", role: "lead_writer" as UserRole, isOnline: true },
  { id: "user-3", name: "Ravi", role: "experimenter" as UserRole, isOnline: false },
  { id: "user-4", name: "Sneha", role: "lit_reviewer" as UserRole, isOnline: true },
  { id: "user-5", name: "Dev", role: "data_lead" as UserRole, isOnline: false },
];
