import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { PluginKey } from "@tiptap/pm/state";
import {
  EditorProvider,
  mergeAttributes,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SquarePlusIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
  Control,
  UseFormSetValue,
  useFormState,
  useWatch,
} from "react-hook-form";

import { getTagsNameAction } from "@/actions/tag";
import { getUsersNameAction } from "@/actions/user";
import { cn } from "@/lib/utils";
import EditorActions from "./EditorActions";
import suggestionRender from "./SuggestionRender";
import { CreateTaskType, EditTaskType } from "@/lib/schemas";

function EditorButton({ hasFocus }: { hasFocus: boolean }) {
  const { editor } = useCurrentEditor();
  return (
    <SquarePlusIcon
      className={cn(
        "size-6 stroke-blue-500 order-first absolute top-2 left-2",
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

export default function Editor({
  setValue,
  control,
  hasFocus,
  setHasFocus,
}: {
  setValue: UseFormSetValue<CreateTaskType | EditTaskType>;
  control: Control<CreateTaskType | EditTaskType>;
  hasFocus: boolean;
  setHasFocus: Dispatch<SetStateAction<boolean>>;
}) {
  const htmlString = useWatch({
    control,
    name: "html",
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
              "text-md min-h-10 flex flex-col bg-background px-3 py-2 outline-none ml-8",
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
        content={htmlString}
        onUpdate={({ editor }) => {
          setValue("html", editor.getHTML(), { shouldDirty: true });
          setValue("text", editor.getText(), { shouldDirty: true });
        }}
        onFocus={() => {
          setTimeout(() => {
            setHasFocus(true);
          }, 100);
        }}
        onBlur={() => {
          setTimeout(() => {
            setHasFocus(false);
          }, 100);
        }}
        slotAfter={
          <EditorActions
            hasChanges={isDirty}
            pending={isSubmitting || isLoading}
            hasFocus={hasFocus}
            setHasFocus={setHasFocus}
            defaultValue={defaultValues?.html}
          />
        }
      >
        <EditorButton hasFocus={hasFocus} />
      </EditorProvider>
    </>
  );
}
