"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { createTaskAction, toggleTaskDoneAction } from "@/actions/task";
import { EditTaskType, editTaskSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import EditTaskEditor from "./EditTaskEditor";
import { Checkbox } from "./ui/checkbox";

export default function EditTaskForm({ task }: { task: EditTaskType }) {
  const [focus, setFocus] = useState(false);
  const form = useForm<EditTaskType>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      ...task,
    },
  });

  async function onSubmit(values: EditTaskType) {
    await createTaskAction(values);
    form.reset();
  }

  return (
    <div
      className={cn("flex ml-2", focus ? "items-start gap-2" : "items-center")}
    >
      <Checkbox
        disabled={focus}
        checked={task.done}
        onCheckedChange={async (checked) => {
          await toggleTaskDoneAction({
            id: task.id,
            done: Boolean(checked),
          });
        }}
        className={cn("size-6", focus ? "mt-2" : "")}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "flex flex-col w-full overflow-hidden relative",
            focus ? "border shadow-md rounded-sm" : ""
          )}
        >
          <input type="hidden" {...form.register("id")} value={task.id} />
          <input type="hidden" {...form.register("html")} value={task.html} />

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="max-w-full relative flex flex-wrap items-center space-y-0 [&>*:nth-child(1)]:grow [&>*:nth-child(1)]:md:min-w-[600px]">
                <FormControl>
                  <EditTaskEditor
                    setValue={form.setValue}
                    control={form.control}
                    hasFocus={focus}
                    setHasFocus={setFocus}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
