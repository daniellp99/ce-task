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

import { createTaskAction } from "@/actions/task";
import { CreateTaskType, createTaskSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import CreateTaskEditor from "./CreateTaskEditor";

export default function CreateTaskForm() {
  const [focus, setFocus] = useState(false);
  const form = useForm<CreateTaskType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      text: "",
      html: "",
    },
  });

  async function onSubmit(values: CreateTaskType) {
    await createTaskAction(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col w-full overflow-hidden",
          focus ? "border shadow-md rounded-sm" : ""
        )}
      >
        <input type="hidden" {...form.register("html")} />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="max-w-full relative flex flex-wrap items-center space-y-0 [&>*:nth-child(1)]:grow [&>*:nth-child(1)]:md:min-w-[600px]">
              <FormControl>
                <CreateTaskEditor
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
  );
}
