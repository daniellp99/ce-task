import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { PluginKey } from "@tiptap/pm/state";
import { mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { getTagsNameAction } from "@/actions/tag";
import { getUsersNameAction } from "@/actions/user";
import suggestionRender from "@/components/SuggestionRender";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extensions = [
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
          .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
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
          .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 5);
      },
      render: () => suggestionRender({ instance: "tags" }),
    },
  }),
];
