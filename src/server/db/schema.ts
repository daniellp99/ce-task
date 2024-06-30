// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";

import {
  index,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `ce_task_${name}`);

export const tasks = createTable(
  "task",
  {
    id: integer("id").primaryKey(),
    text: text("text", { length: 2000 }).notNull(),
    done: integer("done", { mode: "boolean" }).notNull().default(false),
  },
  (example) => ({
    textIndex: index("text_idx").on(example.text),
  })
);

export const tasksRelations = relations(tasks, ({ many }) => ({
  users: many(users),
  tasksToTags: many(tasksToTags),
}));

export const users = createTable(
  "user",
  {
    id: integer("id").primaryKey(),
    name: text("name", { length: 256 }).notNull(),
    taskId: integer("task_id"),
  },
  (example) => ({
    userNameIndex: index("user_name_idx").on(example.name),
  })
);

export const usersRelations = relations(users, ({ one }) => ({
  task: one(tasks, {
    fields: [users.taskId],
    references: [tasks.id],
  }),
}));

export const tags = createTable(
  "tag",
  {
    id: integer("id").primaryKey(),
    name: text("name", { length: 256 }).notNull(),
  },
  (example) => ({
    tagNameIndex: index("tag_name_idx").on(example.name),
  })
);

export const tagsRelations = relations(tags, ({ many }) => ({
  tasksToTags: many(tasksToTags),
}));

export const tasksToTags = createTable(
  "task_to_tag",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.tagId] }),
  })
);

export const taskToTagsRelations = relations(tasksToTags, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [tasksToTags.tagId],
    references: [tags.id],
  }),
}));
