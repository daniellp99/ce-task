"use server";

import { TaskType } from "@/lib/schemas";
import { db } from "@/server/db";
import {
  tags,
  tasks,
  tasksToTags,
  tasksToUsers,
  users,
} from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export async function createTaskAction(values: TaskType) {
  const words = values.input.split(" ").filter((word) => word !== "");
  const task = await db
    .insert(tasks)
    .values({ text: values.input, html: values.html })
    .returning();

  words.forEach(async (word, index, arr) => {
    if (arr.slice(0, index).some((w) => w === word)) {
      return;
    } else {
      if (word.startsWith("#")) {
        const tag = await db.query.tags
          .findFirst({
            where: (tags, { eq }) => eq(tags.name, word.slice(1)),
          })
          .execute();
        if (tag) {
          await db
            .insert(tasksToTags)
            .values({ taskId: task[0].id, tagId: tag.id })
            .execute();
        } else {
          const newTag = await db
            .insert(tags)
            .values({ name: word.slice(1) })
            .returning({ id: tags.id });
          await db
            .insert(tasksToTags)
            .values({ taskId: task[0].id, tagId: newTag[0].id })
            .execute();
        }
      }
      if (word.startsWith("@")) {
        const user = await db.query.users
          .findFirst({
            where: (users, { eq }) => eq(users.name, word.slice(1)),
          })
          .execute();
        if (user) {
          await db
            .insert(tasksToUsers)
            .values({ taskId: task[0].id, userId: user.id })
            .execute();
        } else {
          const newUser = await db
            .insert(users)
            .values({ name: word.slice(1) })
            .returning({ id: users.id });
          await db
            .insert(tasksToUsers)
            .values({ taskId: task[0].id, userId: newUser[0].id })
            .execute();
        }
      }
    }
  });

  revalidatePath("/");
  return task[0];
}
