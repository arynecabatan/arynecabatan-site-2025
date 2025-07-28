import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditBlogPost from "../../components/edit-blog-post";

export default async function EditBlogPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blog_post")
    .select()
    .eq("slug", slug)
    .single();

  const { data: no_cover_image } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "blog_no_cover")
    .single();

  const no_cover_image_path = no_cover_image?.value;

  if (!blog) {
    notFound();
  }

  if (blog.cover_image === "NO COVER IMAGE") {
    blog.publicUrl = no_cover_image_path;
  } else {
    const fullPath = `cover/${blog.cover_image}`;
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-post").getPublicUrl(fullPath);
    blog.publicUrl = publicUrl;
  }


  return <EditBlogPost blog={blog} />;
}
