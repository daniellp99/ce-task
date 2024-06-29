import {
  CalendarIcon,
  CircleDotIcon,
  LockOpenIcon,
  MoveDiagonalIcon,
  SunIcon,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { TaskType } from "@/lib/schemas";

export default function EditorActions({
  form,
}: {
  form: UseFormReturn<TaskType>;
}) {
  const hasChanges = form.formState.isDirty;

  return (
    <fieldset
      id="actions"
      className="flex items-center justify-between gap-8 text-sm h-14 p-2 bg-gray-50"
    >
      <div>
        <Button
          variant="secondary"
          disabled={!hasChanges}
          className="hover:bg-secondary text-slate-900 disabled:text-slate-600"
        >
          <MoveDiagonalIcon className="mr-2 size-4 stroke-slate-600" /> Open
        </Button>
      </div>
      <div className="grow items-start flex gap-1">
        <Button variant="action" disabled={!hasChanges}>
          <CalendarIcon className="mr-2 size-4" /> Today
        </Button>
        <Button variant="action" disabled={!hasChanges}>
          <LockOpenIcon className="mr-2 size-4" /> Public
        </Button>
        <Button variant="action" disabled={!hasChanges}>
          <SunIcon className="mr-2 size-4" /> Highlight
        </Button>
        <Button variant="action" disabled={!hasChanges}>
          <CircleDotIcon className="mr-2 size-4" /> Estimation
        </Button>
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="secondary"
          className="bg-slate-100 hover:bg-slate-100"
          onClick={() => form.reset()}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-700 hover:bg-blue-700">
          {hasChanges ? "Add" : "Ok"}
        </Button>
      </div>
    </fieldset>
  );
}
