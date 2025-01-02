"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user-dao";

export type SignupActionState = {
  errors?: { email?: string; password?: string };
};

export const signup = async (
  prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: typeof prevState.errors = {};

  if (!email || !password) {
    errors.email = "Email and password are required";
  }

  if (!email.includes("@")) {
    errors.email = "Email must contain an @ symbol";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);

  createUser(email, hashedPassword);

  return { errors: undefined };
};
