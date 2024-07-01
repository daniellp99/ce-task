"use server";

import { db } from "@/server/db";
import { tags } from "@/server/db/schema";

export async function createTagAction(input: string) {
  const tag = await db
    .insert(tags)
    .values({ name: input })
    .returning({ name: tags.name });

  return tag[0];
}

export async function getTagsNameAction() {
  const tag = await db.query.tags.findMany({
    columns: { name: true },
  });

  return Array.from(tag.map((t) => t.name));
}
