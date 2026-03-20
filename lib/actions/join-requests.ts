"use server";

import { db } from "@/lib/db";
import {
  joinRequests,
  memberships,
  notifications,
} from "@/lib/db/schema";
import {
  requireAuth,
  requireProjectAccess,
  getProjectMembership,
  type MembershipRole,
} from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function createJoinRequest(
  projectId: string,
  data: { message?: string }
) {
  const user = await requireAuth();

  // Check if already a member
  const existing = await getProjectMembership(projectId, user.id);
  if (existing) {
    throw new Error("You are already a member of this project.");
  }

  const [request] = await db
    .insert(joinRequests)
    .values({
      projectId,
      userId: user.id,
      message: data.message,
    })
    .onConflictDoNothing()
    .returning();

  if (!request) {
    throw new Error("You already have a pending request for this project.");
  }

  // Notify all project admins
  const adminMembers = await db.query.memberships.findMany({
    where: and(
      eq(memberships.projectId, projectId),
      eq(memberships.role, "admin")
    ),
  });

  if (adminMembers.length > 0) {
    await db.insert(notifications).values(
      adminMembers.map((admin) => ({
        userId: admin.userId,
        type: "join_request_received" as const,
        title: "New Join Request",
        message: `${user.name ?? user.email} has requested to join your project.`,
        link: `/dashboard/${projectId}`,
        metadata: { projectId, joinRequestId: request.id },
      }))
    );
  }

  revalidatePath("/dashboard");
  return request;
}

export async function approveJoinRequest(
  requestId: string,
  role: MembershipRole = "researcher"
) {
  // Look up the request
  const [request] = await db
    .select()
    .from(joinRequests)
    .where(eq(joinRequests.id, requestId))
    .limit(1);

  if (!request) throw new Error("Join request not found.");
  if (request.status !== "pending") {
    throw new Error("This request has already been processed.");
  }

  const { user } = await requireProjectAccess(request.projectId, "admin");

  // Create the membership
  await db
    .insert(memberships)
    .values({
      userId: request.userId,
      projectId: request.projectId,
      role,
    })
    .onConflictDoNothing();

  // Update request status
  await db
    .update(joinRequests)
    .set({
      status: "approved",
      reviewedBy: user.id,
      updatedAt: new Date(),
    })
    .where(eq(joinRequests.id, requestId));

  // Notify the requester
  await db.insert(notifications).values({
    userId: request.userId,
    type: "join_request_approved",
    title: "Join Request Approved",
    message: `Your request to join the project has been approved. You have been assigned the ${role} role.`,
    link: `/dashboard/${request.projectId}`,
    metadata: { projectId: request.projectId },
  });

  revalidatePath(`/dashboard/${request.projectId}`);
  return request.projectId;
}

export async function rejectJoinRequest(requestId: string) {
  const [request] = await db
    .select()
    .from(joinRequests)
    .where(eq(joinRequests.id, requestId))
    .limit(1);

  if (!request) throw new Error("Join request not found.");
  if (request.status !== "pending") {
    throw new Error("This request has already been processed.");
  }

  const { user } = await requireProjectAccess(request.projectId, "admin");

  await db
    .update(joinRequests)
    .set({
      status: "rejected",
      reviewedBy: user.id,
      updatedAt: new Date(),
    })
    .where(eq(joinRequests.id, requestId));

  // Notify the requester
  await db.insert(notifications).values({
    userId: request.userId,
    type: "join_request_rejected",
    title: "Join Request Declined",
    message: "Your request to join the project was not approved.",
    link: "/dashboard",
    metadata: { projectId: request.projectId },
  });

  revalidatePath(`/dashboard/${request.projectId}`);
}

export async function getProjectJoinRequests(projectId: string) {
  await requireProjectAccess(projectId, "admin");

  return db.query.joinRequests.findMany({
    where: and(
      eq(joinRequests.projectId, projectId),
      eq(joinRequests.status, "pending")
    ),
    with: {
      user: {
        columns: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: (joinRequests, { desc }) => [desc(joinRequests.createdAt)],
  });
}
