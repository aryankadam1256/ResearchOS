import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/shared/SignOutButton";

export default async function DashboardPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b flex items-center justify-between px-6 bg-card shrink-0 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 font-semibold">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center text-[10px]">
            S
          </div>
          ScholarFlow
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {session.user.name ?? session.user.email}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
