import { tasks } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const editTaskSchema = createSelectSchema(tasks);
export const createTaskSchema = editTaskSchema.omit({ id: true, done: true });

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type EditTaskType = z.infer<typeof editTaskSchema>;
