import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditProject from "./components/edit-design";


export default async function EditProjectPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin-login");
  }

  const { data: project } = await supabase
    .from("projects")
    .select()
    .eq("slug", slug)
    .single();

  if (!project) {
    notFound();
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("projects").getPublicUrl(project.cover_image);
 
  project.publicUrl = publicUrl;

  return <EditProject project={project} />;
}
