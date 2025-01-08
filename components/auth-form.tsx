"use client";

import Link from "next/link";

import { auth, AuthMode } from "@/actions/auth-actions";
import Image from "next/image";
import { useActionState } from "react";

export const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [state, formAction, pending] = useActionState(
    auth.bind(null, mode),
    undefined
  );

  const renderErrors = (errors: string[] | undefined) => {
    if (!errors) return null;
    return (
      <ul id="form-errors">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    );
  };

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
      {renderErrors(state?.errors?.email)}
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {renderErrors(state?.errors?.password)}
      <p>
        <button type="submit" disabled={pending}>
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
