import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProjects } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { invitations, notifications } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function GlobalPortal() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userProjects = await getUserProjects(session.user.id);

  // Fetch pending invitations for this user's email
  const pendingInvites = session.user.email
    ? await db
        .select()
        .from(invitations)
        .where(
          and(
            eq(invitations.email, session.user.email),
            eq(invitations.status, "pending")
          )
        )
        .orderBy(desc(invitations.createdAt))
    : [];

  // Fetch unread notifications
  const unreadNotifications = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(10);

  const roleColors: Record<string, string> = {
    admin:
      "bg-teal-500/20 text-teal-300 border-teal-500/30",
    researcher:
      "bg-violet-500/20 text-violet-300 border-violet-500/30",
    observer:
      "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session.user.name ?? "Researcher"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Your research projects and activity at a glance.
        </p>
      </div>

      {/* Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Notifications ({unreadNotifications.length})
          </h2>
          <div className="grid gap-2">
            {unreadNotifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.link ?? "/dashboard"}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {notif.title}
                  </p>
                  {notif.message && (
                    <p className="text-xs text-muted-foreground truncate">
                      {notif.message}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Pending Invitations
          </h2>
          <div className="grid gap-2">
            {pendingInvites.map((invite) => (
              <Link
                key={invite.id}
                href={`/invite/${invite.token}`}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">
                    Project Invitation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role: {invite.role} &middot; Expires{" "}
                    {invite.expiresAt.toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-medium text-primary">
                  View &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your Projects ({userProjects.length})
          </h2>
        </div>

        {userProjects.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card">
            <p className="text-muted-foreground">
              You are not part of any projects yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new project or accept an invitation to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userProjects.map((membership) => (
              <Link
                key={membership.project.id}
                href={`/dashboard/${membership.project.id}`}
                className="group block p-5 rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">
                    {membership.project.title}
                  </h3>
                  <span
                    className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleColors[membership.role] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {membership.role}
                  </span>
                </div>
                {membership.project.researchField && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {membership.project.researchField}
                  </p>
                )}
                {membership.project.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {membership.project.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      membership.project.status === "active"
                        ? "bg-green-400"
                        : membership.project.status === "completed"
                          ? "bg-blue-400"
                          : "bg-gray-400"
                    }`}
                  />
                  {membership.project.status}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
