"use server";
import { getSession } from "@/utils/iron-session/auth";
import { redirect } from "next/navigation";

export async function guestLogin(formData) {
  const password = formData.get("password");
  // TODO: Implement a cron job to update this password every 3 days.
  // For now, it's hardcoded.
  if (password === process.env.IRON_SESSION_PASSWORD_PRYNTS) {
    const session = await getSession();
    session.isAuthenticated = true;
    await session.save();
    return redirect("/prynts");
  }

  return redirect("/prynts-login?error=Invalid Password");
}

export async function guestLogout() {
  const session = await getSession();
  session.destroy();
  redirect("/prynts-login");
}