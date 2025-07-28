import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CreateBlogPost from "../components/create-blog-post";

export default async function CreateBlogPostPage() {
  const supabase = await createClient();
  const { data: userName, error } = await supabase.auth.getUser();

  if (error || !userName?.user) {
    redirect("/admin-login");
  }
  return <CreateBlogPost />;
}
