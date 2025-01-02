import db from "@/initdb.mjs";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { type Cookie, Lucia } from "lucia";
import { cookies } from "next/headers";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const createAuthSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});

  await setSessionCookie(lucia.createSessionCookie(session.id));

  return session;
};

export const verifyAuthSession = async () => {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionId = sessionCookie.value;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  const { session } = result;

  // Prolong session if it's fresh
  try {
    if (session !== null && session.fresh) {
      await setSessionCookie(lucia.createSessionCookie(session.id));
    }

    // Clear invalid session cookie
    if (session === null) {
      await setSessionCookie(lucia.createBlankSessionCookie());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // NextJS not allow to set cookies during page rendering,
    // so as lucia docs suggested we swallow that error here
  }

  return result;
};

const setSessionCookie = async ({ name, value, attributes }: Cookie) => {
  (await cookies()).set(name, value, attributes);
};
