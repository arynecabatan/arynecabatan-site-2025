import { createClient } from "@/utils/supabase/server";
import { CreateAlbumSheet } from "./components/create-album-sheet";
import { AlbumGrid } from "./components/album-grid";

export default async function PryntsAdminPage() {
  const supabase = await createClient();

  const { data: rawPrynts } = await supabase
    .from("prynts")
    .select()
    .order("created_at", { ascending: false });

  const pryntsWithUrls = rawPrynts.map((prynt) => ({
    ...prynt,
    publicUrl: supabase.storage
      .from("prynts")
      .getPublicUrl(`covers/${prynt.album_cover}`).data.publicUrl,
  }));

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prynts Albums</h1>
        <CreateAlbumSheet />
      </header>
      <section>
        {pryntsWithUrls && pryntsWithUrls.length > 0 ? (
          <AlbumGrid albums={pryntsWithUrls} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <h3 className="text-lg font-semibold">No albums yet</h3>
            <p className="text-sm text-muted-foreground">
              Click "Create New Album" to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
