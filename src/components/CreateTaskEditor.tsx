import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { SquarePlusIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
  Control,
  UseFormSetValue,
  useFormState,
  useWatch,
} from "react-hook-form";

import { CreateTaskType } from "@/lib/schemas";
import { cn, extensions } from "@/lib/utils";
import EditorActions from "./EditorActions";

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

export default function CreateTaskEditor({
  setValue,
  control,
  hasFocus,
  setHasFocus,
}: {
  setValue: UseFormSetValue<CreateTaskType>;
  control: Control<CreateTaskType>;
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
        extensions={extensions}
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
