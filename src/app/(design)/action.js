"use server";
import { getSession } from "@/utils/iron-session/auth";
import { redirect } from "next/navigation";

export async function guestLogin(formData) {
  const password = formData.get("password");
  if (password === process.env.IRON_SESSION_PASSWORD) {
    const session = await getSession();
    session.isAuthenticated = true;
    await session.save();
    return redirect("/design");
  }

  return redirect("/design-login?error=Invalid Password");
}

export async function guestLogout() {
  const session = await getSession();
  session.destroy();
  redirect("/design-login");
}