import { auth } from "@/auth";
import DashboardClient from "@/components/discipline/DashboardClient";
import { type UserRole } from "@/lib/constants";

export default async function DashboardPage() {
  const session = await auth();
  const user = {
    name: session?.user?.name ?? "Team Member",
    role: ((session?.user as any)?.role as UserRole) ?? "coordinator",
  };

  return <DashboardClient user={user} />;
}
