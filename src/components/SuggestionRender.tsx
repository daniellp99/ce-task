import { ReactRenderer } from "@tiptap/react";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import tippy, { GetReferenceClientRect, Instance, Props } from "tippy.js";

import SuggestionList from "./SuggestionList";

export default function suggestionRender({
  instance,
}: {
  instance: "users" | "tags";
}) {
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
