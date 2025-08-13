import { createClient } from "@/utils/supabase/server";
import { PryntsAlbumGrid } from "./components/album-grid";

export const metadata = {
  title: "Prynts",
};

export default async function PryntsPage() {
  const supabase = await createClient();

  const { data: rawPrynts } = await supabase
    .from("prynts")
    .select()
    .eq("isPublished", true)
    .order("created_at", { ascending: false });

  const pryntsWithUrls = rawPrynts.map((prynt) => ({
    ...prynt,
    publicUrl: supabase.storage
      .from("prynts")
      .getPublicUrl(`covers/${prynt.album_cover}`).data.publicUrl,
  }));

  return (
    <div className="container mx-auto px-4 lg:px-18 pb-4 flex flex-col gap-16 min-h-screen pt-16">
      <section className="py-4 flex flex-col items-center text-center flex-0">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Prynts Gallery
        </h1>
      </section>

      <main className="flex-1 flex flex-col gap-16">
        {pryntsWithUrls && pryntsWithUrls.length > 0 ? (
          <PryntsAlbumGrid albums={pryntsWithUrls} />
        ) : (
          <div className="w-full grid place-items-center">
            <p className="text-center text-muted-foreground font-mono items-center ">
              No albums have been published yet. Come back soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}