import db from "@/initdb.mjs";
import { Training } from "@/lib/types";

export const getTrainings = () => {
  const stmt = db.prepare("SELECT * FROM trainings");
  return stmt.all() as Training[];
};
