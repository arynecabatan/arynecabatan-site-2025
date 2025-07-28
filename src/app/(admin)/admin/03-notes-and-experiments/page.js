import { createClient } from "@/utils/supabase/server";
import { BlogDataTable } from "./components/blog-data-table";
import { blog_columns } from "./components/blog-column";

export default async function NotesAndExperimentPage() {
  const supabase = await createClient();

  const { data: no_cover_image } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "blog_no_cover")
    .single();

  const no_cover_image_path = no_cover_image?.value;

  const { data: rawBlog } = await supabase
    .from("blog_post")
    .select()
    .order("created_at", { ascending: false });

  const blogs =
    (rawBlog ?? []).map((blog) => {
      if (blog.cover_image === "NO COVER IMAGE") {
        return {
          ...blog,
          publicUrl: no_cover_image_path,
        };
      } else {
        const fullPath = `cover/${blog.cover_image}`;
        const {
          data: { publicUrl },
        } = supabase.storage.from("blog-post").getPublicUrl(fullPath);
        return { ...blog, publicUrl };
      }
    }) || [];

  return <BlogDataTable columns={blog_columns} data={blogs} />;
}
