"use server";

import crypto from "crypto";
import { db } from "@/lib/db";
import {
  invitations,
  memberships,
  notifications,
  users,
} from "@/lib/db/schema";
import {
  requireAuth,
  requireProjectAccess,
  type MembershipRole,
} from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function createInvitation(
  projectId: string,
  data: {
    email?: string;
    role: MembershipRole;
    expiresInDays?: number;
  }
) {
  const { user } = await requireProjectAccess(projectId, "admin");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays ?? 7));

  const [invitation] = await db
    .insert(invitations)
    .values({
      projectId,
      invitedBy: user.id,
      email: data.email,
      token,
      role: data.role,
      expiresAt,
    })
    .returning();

  // If email is specified, create an in-app notification for the user if they exist
  if (data.email) {
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (targetUser) {
      await db.insert(notifications).values({
        userId: targetUser.id,
        type: "invite",
        title: "Project Invitation",
        message: `You've been invited to join a project as ${data.role}.`,
        link: `/invite/${token}`,
        metadata: { projectId, invitationId: invitation.id },
      });
    }
  }

  revalidatePath(`/dashboard/${projectId}`);
  return { invitation, inviteUrl: `/invite/${token}` };
}

export async function acceptInvitation(token: string) {
  const user = await requireAuth();

  const [invitation] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.token, token),
        eq(invitations.status, "pending")
      )
    )
    .limit(1);

  if (!invitation) {
    throw new Error("Invalid or already used invitation.");
  }

  // Check expiry
  if (new Date() > invitation.expiresAt) {
    await db
      .update(invitations)
      .set({ status: "expired" })
      .where(eq(invitations.id, invitation.id));
    throw new Error("This invitation has expired.");
  }

  // If locked to a specific email, verify it matches
  if (invitation.email && invitation.email !== user.email) {
    throw new Error("This invitation was sent to a different email address.");
  }

  // Create membership (idempotent — skip if already a member)
  await db
    .insert(memberships)
    .values({
      userId: user.id,
      projectId: invitation.projectId,
      role: invitation.role,
    })
    .onConflictDoNothing();

  // Mark invitation as accepted
  await db
    .update(invitations)
    .set({ status: "accepted" })
    .where(eq(invitations.id, invitation.id));

  revalidatePath("/dashboard");
  return invitation.projectId;
}

export async function revokeInvitation(invitationId: string) {
  // Look up the invitation to get projectId for auth check
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.id, invitationId))
    .limit(1);

  if (!invitation) throw new Error("Invitation not found.");

  await requireProjectAccess(invitation.projectId, "admin");

  await db
    .update(invitations)
    .set({ status: "revoked" })
    .where(eq(invitations.id, invitationId));

  revalidatePath(`/dashboard/${invitation.projectId}`);
}

export async function getProjectInvitations(projectId: string) {
  await requireProjectAccess(projectId, "admin");

  return db.query.invitations.findMany({
    where: eq(invitations.projectId, projectId),
    with: {
      inviter: {
        columns: { id: true, name: true, email: true },
      },
    },
    orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
  });
}
