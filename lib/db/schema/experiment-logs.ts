import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { projects } from "./projects";

export const experimentStatusEnum = pgEnum("experiment_status", [
  "planned",
  "running",
  "completed",
  "failed",
]);

export const experimentLogs = pgTable(
  "experiment_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    hypothesis: text("hypothesis"),
    methodology: text("methodology"),
    results: text("results"),
    status: experimentStatusEnum("status").default("planned").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("experiment_logs_project_idx").on(table.projectId),
    index("experiment_logs_status_idx").on(table.status),
  ]
);
