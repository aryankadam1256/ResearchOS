import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects } from "./projects";
import { memberships } from "./memberships";
import { invitations } from "./invitations";
import { joinRequests } from "./join-requests";
import { notifications } from "./notifications";
import { checkins } from "./checkins";
import { experimentLogs } from "./experiment-logs";
import { papers } from "./papers";

// ── User Relations ──
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  checkins: many(checkins),
  experiments: many(experimentLogs),
  papers: many(papers),
  invitationsSent: many(invitations),
  joinRequests: many(joinRequests),
  notifications: many(notifications),
}));

// ── Project Relations ──
export const projectsRelations = relations(projects, ({ many }) => ({
  memberships: many(memberships),
  invitations: many(invitations),
  joinRequests: many(joinRequests),
  checkins: many(checkins),
  experimentLogs: many(experimentLogs),
  papers: many(papers),
}));

// ── Membership Relations ──
export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [memberships.projectId],
    references: [projects.id],
  }),
}));

// ── Invitation Relations ──
export const invitationsRelations = relations(invitations, ({ one }) => ({
  project: one(projects, {
    fields: [invitations.projectId],
    references: [projects.id],
  }),
  inviter: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

// ── Join Request Relations ──
export const joinRequestsRelations = relations(joinRequests, ({ one }) => ({
  project: one(projects, {
    fields: [joinRequests.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [joinRequests.userId],
    references: [users.id],
  }),
}));

// ── Notification Relations ──
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ── Checkin Relations ──
export const checkinsRelations = relations(checkins, ({ one }) => ({
  project: one(projects, {
    fields: [checkins.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [checkins.userId],
    references: [users.id],
  }),
}));

// ── Experiment Log Relations ──
export const experimentLogsRelations = relations(
  experimentLogs,
  ({ one }) => ({
    project: one(projects, {
      fields: [experimentLogs.projectId],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [experimentLogs.userId],
      references: [users.id],
    }),
  })
);

// ── Paper Relations ──
export const papersRelations = relations(papers, ({ one }) => ({
  project: one(projects, {
    fields: [papers.projectId],
    references: [projects.id],
  }),
  uploader: one(users, {
    fields: [papers.uploadedBy],
    references: [users.id],
  }),
}));
