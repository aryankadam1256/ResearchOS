import { auth } from "@/auth";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

// ── Role hierarchy for permission checks ──
const ROLE_HIERARCHY: Record<string, number> = {
  observer: 0,
  researcher: 1,
  admin: 2,
};

export type MembershipRole = "admin" | "researcher" | "observer";

/**
 * Get the current authenticated user from the session.
 * Returns null if not logged in.
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

/**
 * Require authentication. Redirects to /login if not authenticated.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Require project membership with a minimum role level.
 * Redirects to /dashboard if user is not a member.
 * Throws if user has insufficient permissions.
 */
export async function requireProjectAccess(
  projectId: string,
  minRole: MembershipRole = "observer"
) {
  const user = await requireAuth();

  const [membership] = await db
    .select()
    .from(memberships)
    .where(
      and(
        eq(memberships.projectId, projectId),
        eq(memberships.userId, user.id)
      )
    )
    .limit(1);

  if (!membership) {
    redirect("/dashboard");
  }

  if (ROLE_HIERARCHY[membership.role] < ROLE_HIERARCHY[minRole]) {
    throw new Error(
      `Insufficient permissions. Required: ${minRole}, have: ${membership.role}`
    );
  }

  return { user, membership };
}

/**
 * Get a user's membership for a specific project without redirecting.
 */
export async function getProjectMembership(
  projectId: string,
  userId: string
) {
  const [membership] = await db
    .select()
    .from(memberships)
    .where(
      and(
        eq(memberships.projectId, projectId),
        eq(memberships.userId, userId)
      )
    )
    .limit(1);

  return membership ?? null;
}

/**
 * Get all projects a user belongs to, with project details.
 */
export async function getUserProjects(userId: string) {
  return db.query.memberships.findMany({
    where: eq(memberships.userId, userId),
    with: {
      project: true,
    },
    orderBy: [desc(memberships.joinedAt)],
  });
}
