"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { PluginKey } from "@tiptap/pm/state";
import {
  EditorProvider,
  ReactRenderer,
  mergeAttributes,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { SquarePlusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Control,
  ControllerRenderProps,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import tippy, { GetReferenceClientRect, Instance, Props } from "tippy.js";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { getTagsNameAction } from "@/actions/tag";
import { createTaskAction } from "@/actions/task";
import { getUsersNameAction } from "@/actions/user";
import { TaskType, taskSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import EditorActions from "./EditorActions";
import SuggestionList from "./SuggestionList";

function suggestionRender({ instance }: { instance: "users" | "tags" }) {
  let component: ReactRenderer;
  let popup: Instance<Props>[];

  return {
    onStart: (props: SuggestionProps<any>) => {
      component = new ReactRenderer(SuggestionList, {
        props: { ...props, instance },
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }
      popup = tippy("body", {
        getReferenceClientRect:
          props.clientRect as GetReferenceClientRect | null,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },

    onUpdate(props: SuggestionProps<any>) {
      component.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup[0].setProps({
        getReferenceClientRect:
          props.clientRect as GetReferenceClientRect | null,
      });
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === "Escape") {
        popup[0].hide();

        return true;
      }
      // @ts-ignore
      return component.ref?.onKeyDown(props);
    },

    onExit() {
      popup[0].destroy();
      component.destroy();
    },
  };
}

function EditorButton({ hasFocus }: { hasFocus: boolean }) {
  const { editor } = useCurrentEditor();
  return (
    <SquarePlusIcon
      className={cn(
        "size-6 stroke-blue-500 order-first ml-4",
        hasFocus ? "cursor-text" : "cursor-pointer"
      )}
      onClick={() => {
        if (!editor?.isFocused) {
          editor?.commands.focus();
        }
      }}
    />
  );
}

function Editor({
  field,
  control,
  hasFocus,
  setHasFocus,
}: {
  field: ControllerRenderProps<TaskType>;
  control: Control<TaskType>;
  hasFocus: boolean;
  setHasFocus: Dispatch<SetStateAction<boolean>>;
}) {
  const inputValue = useWatch({
    control,
    name: "input",
  });
  const { isDirty, isSubmitting, isLoading, defaultValues } = useFormState({
    control,
  });
  return (
    <>
      <EditorProvider
        editorProps={{
          attributes: {
            class:
              "text-md min-h-10 flex flex-col bg-background px-3 py-2 outline-none",
          },
        }}
        extensions={[
          StarterKit,
          Placeholder.configure({
            placeholder: "Type to add new task",
            showOnlyWhenEditable: false,
          }),
          Link.configure({
            HTMLAttributes: {
              class: "links",
            },
            openOnClick: false,
            autolink: true,
            linkOnPaste: true,
          }),
          Mention.extend({
            name: "users",
          }).configure({
            HTMLAttributes: {
              class: "users",
            },
            renderHTML({ options, node }) {
              return [
                "span",
                mergeAttributes(options.HTMLAttributes),
                `${node.attrs.label ?? node.attrs.id}`,
              ];
            },
            deleteTriggerWithBackspace: true,
            suggestion: {
              char: "@",
              pluginKey: new PluginKey("users"),
              items: async ({ query }) => {
                const users = await getUsersNameAction();
                return users
                  .filter((item) =>
                    item.toLowerCase().startsWith(query.toLowerCase())
                  )
                  .slice(0, 5);
              },
              render: () => suggestionRender({ instance: "users" }),
            },
          }),

          Mention.extend({
            name: "labels",
          }).configure({
            HTMLAttributes: {
              class: "labels",
            },
            renderHTML({ options, node }) {
              return [
                "span",
                mergeAttributes(options.HTMLAttributes),
                `${node.attrs.label ?? node.attrs.id}`,
              ];
            },
            deleteTriggerWithBackspace: true,
            suggestion: {
              char: "#",
              pluginKey: new PluginKey("labels"),
              items: async ({ query }) => {
                const tags = await getTagsNameAction();

                return tags
                  .filter((item) =>
                    item.toLowerCase().startsWith(query.toLowerCase())
                  )
                  .slice(0, 5);
              },
              render: () => suggestionRender({ instance: "tags" }),
            },
          }),
        ]}
        content={inputValue}
        onUpdate={({ editor }) => {
          field.onChange(editor.getText());
        }}
        onFocus={() => {
          setHasFocus(true);
        }}
        onBlur={() => {
          setHasFocus(false);
        }}
        slotAfter={
          <EditorActions
            hasChanges={isDirty}
            pending={isSubmitting || isLoading}
            hasFocus={hasFocus}
            setHasFocus={setHasFocus}
            defaultValue={defaultValues?.input}
          />
        }
      >
        <EditorButton hasFocus={hasFocus} />
      </EditorProvider>
    </>
  );
}

export default function TaskInput({ value }: { value: string }) {
  const [focus, setFocus] = useState(false);
  const form = useForm<TaskType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      input: value,
    },
  });

  async function onSubmit(values: TaskType) {
    form.reset();
    await createTaskAction(values.input);
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
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="max-w-full flex flex-wrap items-center space-y-0 [&>*:nth-child(1)]:grow [&>*:nth-child(1)]:md:min-w-[600px]">
              <FormControl>
                <Editor
                  field={field}
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
