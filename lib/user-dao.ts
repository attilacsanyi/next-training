import db from "@/initdb.mjs";

export const createUser = (email: string, password: string) => {
  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  const result = stmt.run(email, password);

  return result.lastInsertRowid;
};
