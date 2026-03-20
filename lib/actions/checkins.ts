"use server";

import { db } from "@/lib/db";
import { checkins } from "@/lib/db/schema";
import { requireProjectAccess } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createCheckin(
  projectId: string,
  data: { content: string; mood?: string }
) {
  const { user } = await requireProjectAccess(projectId, "researcher");

  const [checkin] = await db
    .insert(checkins)
    .values({
      projectId,
      userId: user.id,
      content: data.content,
      mood: data.mood,
    })
    .returning();

  revalidatePath(`/dashboard/${projectId}/checkins`);
  return checkin;
}

export async function getProjectCheckins(projectId: string) {
  await requireProjectAccess(projectId, "observer");

  return db.query.checkins.findMany({
    where: eq(checkins.projectId, projectId),
    with: {
      user: {
        columns: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: [desc(checkins.createdAt)],
  });
}
