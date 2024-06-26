import { z } from "zod";

export const taskSchema = z.object({
  input: z.string(),
});
export type TaskType = z.infer<typeof taskSchema>;
