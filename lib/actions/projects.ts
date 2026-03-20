"use server";

import { db } from "@/lib/db";
import { projects, memberships } from "@/lib/db/schema";
import { requireAuth, requireProjectAccess } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createProject(data: {
  title: string;
  description?: string;
  researchField?: string;
}) {
  const user = await requireAuth();

  const [project] = await db
    .insert(projects)
    .values({
      title: data.title,
      description: data.description,
      researchField: data.researchField,
    })
    .returning();

  // Creator automatically becomes admin
  await db.insert(memberships).values({
    userId: user.id,
    projectId: project.id,
    role: "admin",
  });

  revalidatePath("/dashboard");
  return project;
}

export async function updateProject(
  projectId: string,
  data: {
    title?: string;
    description?: string;
    researchField?: string;
    status?: "active" | "archived" | "completed";
  }
) {
  await requireProjectAccess(projectId, "admin");

  const [updated] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, projectId))
    .returning();

  revalidatePath(`/dashboard/${projectId}`);
  return updated;
}

export async function getProject(projectId: string) {
  await requireProjectAccess(projectId, "observer");

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  return project ?? null;
}
