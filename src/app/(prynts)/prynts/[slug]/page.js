import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ImageGrid } from "./components/image-grid";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: prynt } = await supabase.from("prynts").select("album_id, title, description").eq("album_id", slug).single();

    return {
        title: `${prynt?.album_id} - ${prynt?.title}` || "Prynts Album",
        description: prynt?.description || "A collection of designs available for printing."
    };
}

export default async function PryntAlbumPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: prynt } = await supabase
    .from("prynts")
    .select()
    .eq("album_id", slug)
    .eq("isPublished", true)
    .single();

  if (!prynt) {
    notFound();
  }

  const { data: images } = await supabase
    .from("prynts_images_join")
    .select("images(*)")
    .eq("prynt_id", prynt.id)
    .eq("images.isPublished", true);

  const albumImages = images.map(item => ({
      ...item.images,
      publicUrl: supabase.storage.from("prynts").getPublicUrl(item.images.image_url).data.publicUrl,
  }));

  return (
    <div className="container mx-auto px-4 lg:px-18 pb-4 flex flex-col gap-16 min-h-screen pt-16">
      <section className="py-4 flex flex-col items-center text-center flex-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {prynt.album_id} - {prynt.title}
        </h1>
      </section>

      <main className="flex-1 flex flex-col gap-16">
        <ImageGrid images={albumImages} />
      </main>
    </div>
  );
}