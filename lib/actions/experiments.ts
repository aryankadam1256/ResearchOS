"use server";

import { db } from "@/lib/db";
import { experimentLogs } from "@/lib/db/schema";
import { requireProjectAccess } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createExperiment(
  projectId: string,
  data: {
    title: string;
    hypothesis?: string;
    methodology?: string;
  }
) {
  const { user } = await requireProjectAccess(projectId, "researcher");

  const [experiment] = await db
    .insert(experimentLogs)
    .values({
      projectId,
      userId: user.id,
      title: data.title,
      hypothesis: data.hypothesis,
      methodology: data.methodology,
    })
    .returning();

  revalidatePath(`/dashboard/${projectId}/experiments`);
  return experiment;
}

export async function updateExperiment(
  projectId: string,
  experimentId: string,
  data: {
    title?: string;
    hypothesis?: string;
    methodology?: string;
    results?: string;
    status?: "planned" | "running" | "completed" | "failed";
  }
) {
  await requireProjectAccess(projectId, "researcher");

  const [updated] = await db
    .update(experimentLogs)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(experimentLogs.id, experimentId))
    .returning();

  revalidatePath(`/dashboard/${projectId}/experiments`);
  return updated;
}

export async function getProjectExperiments(projectId: string) {
  await requireProjectAccess(projectId, "observer");

  return db.query.experimentLogs.findMany({
    where: eq(experimentLogs.projectId, projectId),
    with: {
      user: {
        columns: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: [desc(experimentLogs.createdAt)],
  });
}
