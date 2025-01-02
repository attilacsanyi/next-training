"use client";

import Link from "next/link";

import { signup, SignupActionState } from "@/actions/auth-actions";
import { useActionState } from "react";

export const AuthForm = () => {
  const [{ errors }, formAction] = useActionState<SignupActionState, FormData>(
    signup,
    {
      errors: { email: "", password: "" },
    }
  );

  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
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
        <button type="submit">Create Account</button>
      </p>
      <p>
        <Link href="/">Login with existing account.</Link>
      </p>
    </form>
  );
};
