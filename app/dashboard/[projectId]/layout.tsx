import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { requireProjectAccess } from "@/lib/auth/helpers";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { eq } from "drizzle-orm";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { user, membership } = await requireProjectAccess(projectId);

  // Fetch project details for sidebar
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) redirect("/dashboard");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar
          user={{ name: user.name ?? "Team Member", role: membership.role }}
          projectId={projectId}
          projectTitle={project.title}
        />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b flex items-center px-6 bg-card shrink-0 shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center text-[10px]">
                S
              </div>
              ScholarFlow
            </div>
            <span className="ml-4 text-sm text-muted-foreground truncate">
              {project.title}
            </span>
          </header>
          <div className="flex-1 p-6 overflow-auto bg-muted/20">
            <div className="max-w-6xl mx-auto h-full w-full">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
