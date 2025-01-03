"use client";

import Link from "next/link";

import { ActionState, auth, AuthMode } from "@/actions/auth-actions";
import Image from "next/image";
import { useActionState } from "react";

export const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [{ errors }, formAction] = useActionState<ActionState, FormData>(
    auth.bind(null, mode),
    {
      errors: { email: "", password: "" },
    }
  );

  return (
    <form id="auth-form" action={formAction}>
      <div>
        <Image
          src="/images/auth-icon.jpg"
          alt="A lock icon"
          width={200}
          height={200}
        />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {errors && (
        <ul id="form-errors">
          {Object.keys(errors).map((key) => (
            <li key={key}>{errors[key as keyof typeof errors]}</li>
          ))}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </p>
      <p>
        {mode === "login" && (
          <Link href="/?mode=signup">Create an account.</Link>
        )}
        {mode === "signup" && (
          <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
};
