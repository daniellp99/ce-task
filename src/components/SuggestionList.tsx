import { SuggestionProps } from "@tiptap/suggestion";

import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { createUserAction } from "@/actions/user";
import { createTagAction } from "@/actions/tag";

const SuggestionList = forwardRef(
  (props: SuggestionProps & { instance: "users" | "tags" }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: item });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="border border-secondary shadow-lg flex flex-col gap-1 overflow-auto relative p-4 rounded-md  border-solid bg-gray-50">
        {props.items.length ? (
          props.items.map((item, index) => (
            <Button
              className={cn(
                "bg-transparent",
                index === selectedIndex ? "bg-secondary" : ""
              )}
              variant="secondary"
              size="sm"
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </Button>
          ))
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              let name = "";
              if (props.instance === "users") {
                name = (await createUserAction(props.query)).name;
              } else {
                name = (await createTagAction(props.query)).name;
              }
              props.command({ id: name });
            }}
          >
            <PlusIcon className="size-6 mr-4" />
            {props.query}
          </Button>
        )}
      </div>
    );
  }
);

SuggestionList.displayName = "SuggestionList";

export default SuggestionList;
