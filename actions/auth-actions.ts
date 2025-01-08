"use server";

import { createAuthSession, destroyAuthSession } from "@/lib/auth";
import {
  LoginForm,
  LoginFormSchema,
  SignupForm,
  SignupFormSchema,
} from "@/lib/definitions";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user-dao";
import { redirect } from "next/navigation";

export type AuthMode = "signup" | "login";

export type SignupFormState =
  | { errors?: { [key in keyof SignupForm]?: string[] } }
  | undefined;

export type LoginFormState =
  | { errors?: { [key in keyof LoginForm]?: string[] } }
  | undefined;

export const signup = async (
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> => {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

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
      return { errors: { email: ["Email already exists!"] } };
    }
    throw error;
  }
};

export const login = async (
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> => {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  const existingUser = getUserByEmail(email);
  const authError =
    "Couldn't authenticate user, please check your credentials.";
  if (!existingUser) {
    // User not found by email
    return {
      errors: {
        email: [authError],
      },
    };
  }

  if (!verifyPassword(existingUser.password, password)) {
    // Password is incorrect
    return { errors: { password: [authError] } };
  }

  await createAuthSession(existingUser.id.toString());
  redirect("/training");
};

export const auth = async (
  mode: AuthMode,
  prevState: SignupFormState | LoginFormState,
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
