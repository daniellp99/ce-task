import { EditorProvider } from "@tiptap/react";
import { Dispatch, SetStateAction } from "react";
import {
  Control,
  UseFormSetValue,
  useFormState,
  useWatch,
} from "react-hook-form";

import { EditTaskType } from "@/lib/schemas";
import { extensions } from "@/lib/utils";
import EditorActions from "./EditorActions";

export default function EditTaskEditor({
  setValue,
  control,
  hasFocus,
  setHasFocus,
}: {
  setValue: UseFormSetValue<EditTaskType>;
  control: Control<EditTaskType>;
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
              "text-md min-h-10 flex flex-col bg-background px-3 py-2 outline-none",
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
      ></EditorProvider>
    </>
  );
}
