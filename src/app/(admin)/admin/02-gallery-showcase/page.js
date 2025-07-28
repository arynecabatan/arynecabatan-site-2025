import { createClient } from "@/utils/supabase/server";
import { GalleryAdminView } from "./component/admin-view";

export default async function GalleryShowcasePage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("gallery")
    .select("*")
    .order("is_highlighted", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery items:", error.message);
  }

  const galleryItemsWithUrls = (items ?? []).map((item) => {
    if (item.image) {
      const fullPath = `full/${item.image}`;
      const thumbPath = `thumbnails/${item.image}`;
      const {
        data: { publicUrl: fullUrl },
      } = supabase.storage.from("gallery").getPublicUrl(fullPath);
      const {
        data: { publicUrl: thumbnailUrl },
      } = supabase.storage.from("gallery").getPublicUrl(thumbPath);
      return { ...item, fullUrl, thumbnailUrl };
    }
    return { ...item, fullUrl: "", thumbnailUrl: "" };
  });

  return <GalleryAdminView initialItems={galleryItemsWithUrls} />;
}
