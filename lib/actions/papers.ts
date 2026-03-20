"use server";

import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { requireProjectAccess } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createPaper(
  projectId: string,
  data: {
    title: string;
    authors?: string[];
    abstract?: string;
    fileUrl?: string;
    tags?: string[];
  }
) {
  const { user } = await requireProjectAccess(projectId, "researcher");

  const [paper] = await db
    .insert(papers)
    .values({
      projectId,
      uploadedBy: user.id,
      title: data.title,
      authors: data.authors ?? [],
      abstract: data.abstract,
      fileUrl: data.fileUrl,
      tags: data.tags ?? [],
    })
    .returning();

  revalidatePath(`/dashboard/${projectId}/papers`);
  return paper;
}

export async function getProjectPapers(projectId: string) {
  await requireProjectAccess(projectId, "observer");

  return db.query.papers.findMany({
    where: eq(papers.projectId, projectId),
    with: {
      uploader: {
        columns: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: [desc(papers.createdAt)],
  });
}
