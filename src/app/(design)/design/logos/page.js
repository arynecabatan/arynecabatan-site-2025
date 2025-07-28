import { designData } from "../components/design-config";
import { createClient } from "@/utils/supabase/server";
import { PostersGrid } from "../components/posters-grid";

export const metadata = {
  title: "Logos",
};

export default async function LogosPage() {
  const supabase = await createClient();
  const header = designData.galleryItems[1];

  const { data: logosData, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("type", "logo")
    .eq("status", true)
    .order("is_highlighted", { ascending: false }) // Highlighted items (true) come first
    .order("created_at", { ascending: false });   // Then, sort by newest

  if (error) {
    console.error("Error fetching posters:", error.message);
  }

  const logos = (logosData ?? []).map((item) => {
    if (item.image) {
      const fullPath = `full/${item.image}`;
      const thumbPath = `thumbnails/${item.image}`;
      const {
        data: { publicUrl: fullUrl },
      } = supabase.storage.from("gallery").getPublicUrl(fullPath);
      const {
        data: { publicUrl: thumbnailUrl },
      } = supabase.storage.from("gallery").getPublicUrl(thumbPath);

      const aspectRatio = item.width / item.height;
      let thumbWidth, thumbHeight;

      if (aspectRatio >= 1) {
        // Landscape or square image
        thumbWidth = 400;
        thumbHeight = 400 / aspectRatio;
      } else {
        // Portrait image
        thumbHeight = 400;
        thumbWidth = 400 * aspectRatio;
      }

      return {
        ...item,
        fullUrl,
        thumbnailUrl,
        thumbWidth: Math.round(thumbWidth),
        thumbHeight: Math.round(thumbHeight),
      };
    }
    return { ...item, fullUrl: "", thumbnailUrl: "" };
  });

  return (
    <div className="container mx-auto px-4 lg:px-18 pb-4 flex flex-col gap-16 min-h-screen pt-16">
      <section className="py-4 flex flex-col items-center text-center flex-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {header.title}
        </h1>
        <p className="mt-2 text-md text-muted-foreground">
          {header.description}
        </p>
      </section>

      <main className="flex-1 flex flex-col gap-16">
        {logos.length > 0 ? (
          <PostersGrid posters={logos} />
        ) : (
          <p className="text-center text-muted-foreground">
            No posters have been published yet.
          </p>
        )}
      </main>
    </div>
  );
}
