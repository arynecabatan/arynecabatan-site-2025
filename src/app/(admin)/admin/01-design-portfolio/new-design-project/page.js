import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CreateNewProject from "./components/new-design";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userName, error } = await supabase.auth.getUser();

  if (error || !userName?.user) {
    redirect("/admin-login");
  }
  return (
    <CreateNewProject/>
  );
}
