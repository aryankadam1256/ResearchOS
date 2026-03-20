import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getProjectMembership } from "@/lib/auth/helpers";
import { createJoinRequest } from "@/lib/actions/join-requests";

export default async function JoinProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/project/${projectId}/join`);
  }

  // Check if already a member
  const existingMembership = await getProjectMembership(
    projectId,
    session.user.id
  );
  if (existingMembership) {
    redirect(`/dashboard/${projectId}`);
  }

  // Get project info
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Project Not Found</h1>
          <p className="text-muted-foreground">
            This project does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  async function handleRequest(formData: FormData) {
    "use server";
    const message = formData.get("message") as string;
    await createJoinRequest(projectId, { message: message || undefined });
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 space-y-6 border rounded-lg bg-card">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Request to Join</h1>
          <p className="text-muted-foreground text-sm">
            Submit a request to join this project. An admin will review your
            request.
          </p>
        </div>

        <div className="space-y-1 p-4 rounded-lg bg-muted/50">
          <h2 className="font-semibold">{project.title}</h2>
          {project.researchField && (
            <p className="text-sm text-muted-foreground">
              {project.researchField}
            </p>
          )}
        </div>

        <form action={handleRequest} className="space-y-4">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1"
            >
              Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell the admins why you'd like to join..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Send Join Request
          </button>
        </form>
      </div>
    </div>
  );
}
