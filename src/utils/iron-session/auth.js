import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions = {
  password: process.env.IRON_SESSION_SECRET,
  cookieName: "guest-session",
  cookieOptions: {
    secure: process.env.NODE_ENV == "production",
    maxAge: 60 * 60 * 24 * 30
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return await getIronSession(cookieStore, sessionOptions);
}

// Common maxAge examples:
// 60 * 15         -> 15 minutes
// 60 * 60         -> 1 hour
// 60 * 60 * 24    -> 24 hours
// 60 * 60 * 24 * 7 -> 1 week
// 60 seconds * 60 minutes * 24 hours * 30 days