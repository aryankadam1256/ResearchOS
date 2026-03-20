import { requireProjectAccess } from "@/lib/auth/helpers";
import DashboardClient from "@/components/discipline/DashboardClient";
import { type UserRole } from "@/lib/constants";

export default async function ProjectCommandCenter({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { user, membership } = await requireProjectAccess(projectId);

  // Map membership role to a display-friendly UserRole for the existing DashboardClient
  const roleMap: Record<string, UserRole> = {
    admin: "coordinator",
    researcher: "experimenter",
    observer: "lit_reviewer",
  };

  return (
    <DashboardClient
      user={{
        name: user.name ?? "Team Member",
        role: roleMap[membership.role] ?? "coordinator",
      }}
    />
  );
}
