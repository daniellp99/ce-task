"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { PluginKey } from "@tiptap/pm/state";
import {
  EditorContent,
  ReactRenderer,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { SquarePlusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ControllerRenderProps, useForm, useWatch } from "react-hook-form";
import tippy, { GetReferenceClientRect, Instance, Props } from "tippy.js";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { createTaskAction } from "@/actions/task";
import { TaskType, taskSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import EditorActions from "./EditorActions";
import SuggestionList from "./SuggestionList";

function suggestionRender() {
  let component: ReactRenderer;
  let popup: Instance<Props>[];

  return {
    onStart: (props: SuggestionProps<any>) => {
      component = new ReactRenderer(SuggestionList, {
        props,
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

function Editor({
  field,
  setShowActions,
}: {
  field: ControllerRenderProps<TaskType>;
  setShowActions: Dispatch<SetStateAction<boolean>>;
}) {
  const [hasFocus, setHasFocus] = useState(false);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "text-md min-h-10 max-w-full flex bg-background px-3 py-2 outline-none",
      },
    },
    extensions: [
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
          items: ({ query }) => {
            // TODO: fetch from database
            return [
              "Lea Thompson",
              "Cyndi Lauper",
              "Tom Cruise",
              "Madonna",
              "Jerry Hall",
              "Joan Collins",
              "Winona Ryder",
              "Christina Applegate",
              "Alyssa Milano",
              "Molly Ringwald",
              "Ally Sheedy",
              "Debbie Harry",
              "Olivia Newton-John",
              "Elton John",
              "Michael J. Fox",
              "Axl Rose",
              "Emilio Estevez",
              "Ralph Macchio",
              "Rob Lowe",
              "Jennifer Grey",
              "Mickey Rourke",
              "John Cusack",
              "Matthew Broderick",
              "Justine Bateman",
              "Lisa Bonet",
            ]
              .filter((item) =>
                item.toLowerCase().startsWith(query.toLowerCase())
              )
              .slice(0, 5);
          },
          render: () => suggestionRender(),
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
          items: ({ query }) => {
            // TODO: fetch from database
            return [
              "#tag1",
              "#tag2",
              "#tag3",
              "#tag4",
              "#tag5",
              "#tag6",
              "#tag7",
              "#tag8",
              "#tag9",
              "#tag10",
              "#tag11",
              "#tag12",
              "#tag13",
              "#tag14",
              "#tag15",
              "#tag16",
              "#tag17",
              "#tag18",
              "#tag19",
              "#tag20",
            ]
              .filter((item) =>
                item.toLowerCase().startsWith(query.toLowerCase())
              )
              .slice(0, 5);
          },
          render: () => suggestionRender(),
        },
      }),
    ],
    content: field.value,
    onUpdate: ({ editor }) => {
      field.onChange(editor.getText());
    },
    onFocus: () => {
      setShowActions(true);
      setHasFocus(true);
    },
    onBlur: ({ editor }) => {
      // 500 ms delay to prevent editor from being blurred when clicking on the submit button
      setTimeout(() => {
        setShowActions(false);
        setHasFocus(false);
        editor.commands.clearContent();
        field.onChange(editor.getText());
      }, 500);
    },
  });
  return (
    <>
      <SquarePlusIcon
        className={cn(
          "size-6 stroke-blue-500",
          hasFocus ? "cursor-text" : "cursor-pointer"
        )}
        onClick={() => {
          if (!hasFocus) {
            editor?.commands.focus();
            setHasFocus(true);
          }
        }}
      />
      <EditorContent editor={editor} />
    </>
  );
}

export default function TaskInput() {
  const [showActions, setShowActions] = useState(false);
  const form = useForm<TaskType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      input: "",
    },
  });

  async function onSubmit(values: TaskType) {
    const res = await createTaskAction(values.input);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col w-full overflow-hidden",
          showActions && "border shadow-md divide-y rounded-sm"
        )}
      >
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="ml-4 max-w-full grow flex items-center space-y-0">
              <FormControl>
                <Editor field={field} setShowActions={setShowActions} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <EditorActions
          resetForm={form.reset}
          hasChanges={form.formState.isDirty}
          pending={form.formState.isSubmitting || form.formState.isLoading}
          showActions={showActions}
        />
      </form>
    </Form>
  );
}
