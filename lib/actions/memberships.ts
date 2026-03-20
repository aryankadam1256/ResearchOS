"use server";

import { db } from "@/lib/db";
import { memberships, users } from "@/lib/db/schema";
import {
  requireProjectAccess,
  type MembershipRole,
} from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function getProjectMembers(projectId: string) {
  await requireProjectAccess(projectId, "observer");

  return db.query.memberships.findMany({
    where: eq(memberships.projectId, projectId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          bio: true,
        },
      },
    },
  });
}

export async function updateMemberRole(
  projectId: string,
  targetUserId: string,
  newRole: MembershipRole
) {
  await requireProjectAccess(projectId, "admin");

  const [updated] = await db
    .update(memberships)
    .set({ role: newRole })
    .where(
      and(
        eq(memberships.projectId, projectId),
        eq(memberships.userId, targetUserId)
      )
    )
    .returning();

  revalidatePath(`/dashboard/${projectId}`);
  return updated;
}

export async function removeMember(
  projectId: string,
  targetUserId: string
) {
  const { user } = await requireProjectAccess(projectId, "admin");

  // Prevent removing yourself if you're the last admin
  if (targetUserId === user.id) {
    const admins = await db.query.memberships.findMany({
      where: and(
        eq(memberships.projectId, projectId),
        eq(memberships.role, "admin")
      ),
    });

    if (admins.length <= 1) {
      throw new Error(
        "Cannot remove the last admin. Transfer admin role first."
      );
    }
  }

  await db
    .delete(memberships)
    .where(
      and(
        eq(memberships.projectId, projectId),
        eq(memberships.userId, targetUserId)
      )
    );

  revalidatePath(`/dashboard/${projectId}`);
}
