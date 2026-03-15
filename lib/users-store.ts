/**
 * In-memory users store.
 * In production, replace this with a real database (PostgreSQL + Drizzle).
 *
 * Passwords are hashed with bcrypt (cost factor 10).
 * Default credentials for the 5 team members are listed below.
 *
 * Default password for ALL accounts: ResearchOS@2026
 */
import { UserRole } from "@/lib/constants";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

// bcrypt hash of "ResearchOS@2026" (cost=10)
// Generated with: bcrypt.hashSync("ResearchOS@2026", 10)
const DEFAULT_HASH =
  "$2b$10$TuNsb8typO0vtIfFf1Raa.plPmTh4jzTPnLIjSh3RDpqDqNVpLDei";

export const USERS_STORE: StoredUser[] = [
  {
    id: "user-1",
    name: "Prateek",
    email: "prateek@research.ai",
    passwordHash: DEFAULT_HASH,
    role: "coordinator",
  },
  {
    id: "user-2",
    name: "Ananya",
    email: "ananya@research.ai",
    passwordHash: DEFAULT_HASH,
    role: "lead_writer",
  },
  {
    id: "user-3",
    name: "Ravi",
    email: "ravi@research.ai",
    passwordHash: DEFAULT_HASH,
    role: "experimenter",
  },
  {
    id: "user-4",
    name: "Sneha",
    email: "sneha@research.ai",
    passwordHash: DEFAULT_HASH,
    role: "lit_reviewer",
  },
  {
    id: "user-5",
    name: "Dev",
    email: "dev@research.ai",
    passwordHash: DEFAULT_HASH,
    role: "data_lead",
  },
];
