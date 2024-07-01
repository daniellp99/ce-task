"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function createUserAction(input: string) {
  const user = await db
    .insert(users)
    .values({ name: input })
    .returning({ name: users.name });

  return user[0];
}

export async function getUsersNameAction() {
  const user = await db.query.users.findMany({
    columns: { name: true },
  });

  return Array.from(user.map((u) => u.name));
}
