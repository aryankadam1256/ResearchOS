"use server";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { and, eq, desc } from "drizzle-orm";

export async function getUserNotifications() {
  const user = await requireAuth();

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function getUnreadNotificationCount() {
  const user = await requireAuth();

  const unread = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, user.id),
        eq(notifications.isRead, false)
      )
    );

  return unread.length;
}

export async function markNotificationAsRead(notificationId: string) {
  const user = await requireAuth();

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, user.id)
      )
    );

  revalidatePath("/dashboard");
}

export async function markAllNotificationsAsRead() {
  const user = await requireAuth();

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, user.id),
        eq(notifications.isRead, false)
      )
    );

  revalidatePath("/dashboard");
}
