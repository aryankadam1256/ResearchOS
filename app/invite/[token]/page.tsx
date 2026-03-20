import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { invitations, projects, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { acceptInvitation } from "@/lib/actions/invitations";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/invite/${token}`);

  // Look up the invitation
  const [invitation] = await db
    .select({
      id: invitations.id,
      projectId: invitations.projectId,
      email: invitations.email,
      role: invitations.role,
      status: invitations.status,
      expiresAt: invitations.expiresAt,
      projectTitle: projects.title,
      projectField: projects.researchField,
      inviterName: users.name,
    })
    .from(invitations)
    .innerJoin(projects, eq(invitations.projectId, projects.id))
    .innerJoin(users, eq(invitations.invitedBy, users.id))
    .where(eq(invitations.token, token))
    .limit(1);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Invalid Invitation</h1>
          <p className="text-muted-foreground">
            This invitation link is invalid or has been revoked.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Invitation {invitation.status}</h1>
          <p className="text-muted-foreground">
            This invitation has already been {invitation.status}.
          </p>
        </div>
      </div>
    );
  }

  if (new Date() > invitation.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Invitation Expired</h1>
          <p className="text-muted-foreground">
            This invitation expired on{" "}
            {invitation.expiresAt.toLocaleDateString()}.
          </p>
        </div>
      </div>
    );
  }

  // Check email restriction
  if (invitation.email && invitation.email !== session.user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Wrong Email</h1>
          <p className="text-muted-foreground">
            This invitation was sent to a different email address.
          </p>
        </div>
      </div>
    );
  }

  async function handleAccept() {
    "use server";
    const projectId = await acceptInvitation(token);
    redirect(`/dashboard/${projectId}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 space-y-6 border rounded-lg bg-card">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Project Invitation</h1>
          <p className="text-muted-foreground text-sm">
            {invitation.inviterName} invited you to join:
          </p>
        </div>

        <div className="space-y-1 p-4 rounded-lg bg-muted/50">
          <h2 className="font-semibold">{invitation.projectTitle}</h2>
          {invitation.projectField && (
            <p className="text-sm text-muted-foreground">
              {invitation.projectField}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Role:{" "}
            <span className="font-medium capitalize">{invitation.role}</span>
          </p>
        </div>

        <form action={handleAccept}>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Accept Invitation
          </button>
        </form>
      </div>
    </div>
  );
}
