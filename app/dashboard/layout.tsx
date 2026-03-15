import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/shared/AppSidebar";
import { type UserRole } from "@/lib/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name ?? "Team Member",
    email: session.user.email ?? "",
    role: ((session.user as any).role as UserRole) ?? "coordinator",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <AppSidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
