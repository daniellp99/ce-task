import {
  CalendarIcon,
  CircleDotIcon,
  LockOpenIcon,
  MoveDiagonalIcon,
  SunIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrentEditor } from "@tiptap/react";
import { EditorState } from "@tiptap/pm/state";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export default function EditorActions({
  hasChanges,
  pending,
  hasFocus,
  setHasFocus,
  defaultValue,
}: {
  hasChanges: boolean;
  pending: boolean;
  hasFocus: boolean;
  setHasFocus: Dispatch<SetStateAction<boolean>>;
  defaultValue: string | undefined;
}) {
  const { editor } = useCurrentEditor();

  function resetEditorContent() {
    editor?.commands.setContent(defaultValue || "", true);

    // The following code clears the history. Hopefully without side effects.
    const newEditorState = EditorState.create({
      doc: editor?.state.doc,
      plugins: editor?.state.plugins,
      schema: editor?.state.schema,
    });
    editor?.view.updateState(newEditorState);
    setHasFocus(false);
  }

  return (
    <fieldset
      id="actions"
      className={cn(
        "items-center justify-between gap-8 text-sm bg-gray-50 h-14 p-2",
        hasFocus ? "grow-[4] w-full flex-1 flex border-t" : "hidden"
      )}
    >
      <div>
        <Button
          variant="secondary"
          type="button"
          disabled={!hasChanges || pending}
          className="hover:bg-secondary text-slate-900 disabled:text-slate-600"
        >
          <MoveDiagonalIcon className="mr-2 size-4 stroke-slate-600" /> Open
        </Button>
      </div>
      <div className="grow items-start flex gap-1">
        <Button
          variant="action"
          type="button"
          disabled={!hasChanges || pending}
        >
          <CalendarIcon className="mr-2 size-4" /> Today
        </Button>
        <Button
          variant="action"
          type="button"
          disabled={!hasChanges || pending}
        >
          <LockOpenIcon className="mr-2 size-4" /> Public
        </Button>
        <Button
          variant="action"
          type="button"
          disabled={!hasChanges || pending}
        >
          <SunIcon className="mr-2 size-4" /> Highlight
        </Button>
        <Button
          variant="action"
          type="button"
          disabled={!hasChanges || pending}
        >
          <CircleDotIcon className="mr-2 size-4" /> Estimation
        </Button>
      </div>
      <div className="flex gap-1">
        <Button
          type="reset"
          variant="secondary"
          disabled={pending}
          className="bg-slate-100 hover:bg-slate-100"
          onClick={() => {
            console.log("reset");

            resetEditorContent();
          }}
        >
          Cancel
        </Button>
        <Button
          type={hasChanges ? "submit" : "button"}
          disabled={pending}
          onClick={() => {
            if (hasChanges) {
              // time out of 100 ms to reset form
              setTimeout(() => {
                resetEditorContent();
              }, 100);
            } else {
              setHasFocus(false);
            }
          }}
          className="bg-blue-700 hover:bg-blue-700"
        >
          {hasChanges ? "Add" : "Ok"}
        </Button>
      </div>
    </fieldset>
  );
}
