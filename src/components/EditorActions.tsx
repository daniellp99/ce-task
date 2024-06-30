import {
  CalendarIcon,
  CircleDotIcon,
  LockOpenIcon,
  MoveDiagonalIcon,
  SunIcon,
} from "lucide-react";
import { UseFormReset } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { TaskType } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export default function EditorActions({
  hasChanges,
  pending,
  showActions,
  resetForm,
}: {
  hasChanges: boolean;
  pending: boolean;
  showActions: boolean;
  resetForm: UseFormReset<TaskType>;
}) {
  return (
    <fieldset
      id="actions"
      className={cn(
        " items-center justify-between gap-8 text-sm bg-gray-50 h-14 p-2",
        showActions ? "flex" : "hidden"
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
          type="button"
          variant="secondary"
          disabled={pending}
          className="bg-slate-100 hover:bg-slate-100"
          onClick={() => resetForm()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="bg-blue-700 hover:bg-blue-700"
        >
          {hasChanges ? "Add" : "Ok"}
        </Button>
      </div>
    </fieldset>
  );
}
