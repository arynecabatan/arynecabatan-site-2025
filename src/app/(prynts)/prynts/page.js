import { createClient } from "@/utils/supabase/server";
import { PostersGrid } from "@/app/(design)/design/components/posters-grid";

export const metadata = {
  title: "Prynts",
};

export default async function PryntsPage() {
  const supabase = await createClient();

  const { data: pryntsData, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("type", "prynt")
    .eq("status", true)
    .order("is_highlighted", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prynts:", error.message);
  }

  const prynts = (pryntsData ?? []).map((item) => {
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
        thumbWidth = 400;
        thumbHeight = 400 / aspectRatio;
      } else {
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
          Prynts
        </h1>
        <p className="mt-2 text-md text-muted-foreground">
          Designs available for printing.
        </p>
      </section>

      <main className="flex-1 flex flex-col gap-16">
        {prynts.length > 0 ? (
          <PostersGrid posters={prynts} />
        ) : (
          <p className="text-center text-muted-foreground">
            No designs have been published yet.
          </p>
        )}
      </main>
    </div>
  );
}