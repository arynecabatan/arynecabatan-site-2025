import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditPryntImages from "./components/edit-prynts-images";

export default async function ManageImagesPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin-login");
  }

  const { data: prynt } = await supabase
    .from("prynts")
    .select("id, album_id, title")
    .eq("album_id", slug)
    .single();

  if (!prynt) {
    notFound();
  }

  const { data: images } = await supabase
    .from("prynts_images_join")
    .select("images(*)")
    .eq("prynt_id", prynt.id);

  const albumImages = images.map(item => ({
      ...item.images,
      publicUrl: supabase.storage.from("prynts").getPublicUrl(item.images.image_url).data.publicUrl,
  }));

  return <EditPryntImages prynt={prynt} initialImages={albumImages} />;
}