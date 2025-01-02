import db from "@/initdb.mjs";
import { User } from "@/lib/types";

export const createUser = (email: string, password: string) => {
  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  const result = stmt.run(email, password);

  return result.lastInsertRowid;
};

export const getUserByEmail = (email: string) => {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const result = stmt.get(email);
  return result as User | undefined;
};
