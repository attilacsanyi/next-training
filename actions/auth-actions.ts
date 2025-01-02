"use server";

import { createAuthSession, destroyAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user-dao";
import { redirect } from "next/navigation";

export type AuthMode = "signup" | "login";

export type ActionState = {
  errors?: {
    email?: string;
    password?: string;
  };
};

export const signup = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
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
  try {
    const newUserId = createUser(email, hashedPassword);
    await createAuthSession(newUserId.toString());
    redirect("/training");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return { errors: { email: "Email already exists!" } };
    }
    throw error;
  }
};

export const login = async (prevState: ActionState, formData: FormData) => {
  const givenEmail = formData.get("email") as string;
  const givenPassword = formData.get("password") as string;

  const existingUser = getUserByEmail(givenEmail);
  const authError =
    "Couldn't authenticate user, please check your credentials.";
  if (!existingUser) {
    // User not found by email
    return {
      errors: {
        email: authError,
      },
    };
  }

  if (!verifyPassword(existingUser.password, givenPassword)) {
    // Password is incorrect
    return { errors: { password: authError } };
  }

  await createAuthSession(existingUser.id.toString());
  redirect("/training");
};

export const auth = async (
  mode: AuthMode,
  prevState: ActionState,
  formData: FormData
) => {
  if (mode === "signup") {
    return signup(prevState, formData);
  }
  return login(prevState, formData);
};

export const logout = async () => {
  await destroyAuthSession();
  redirect("/");
};
