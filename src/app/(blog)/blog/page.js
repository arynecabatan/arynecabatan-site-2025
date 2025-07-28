import { createClient } from "@/utils/supabase/server";
import { BlogView } from "./components/blog-view";
import { BlogPostCard } from "./components/blog-post-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NotesAndExperiment() {
  const supabase = await createClient();

  const { data: rawBlog, error } = await supabase
    .from("blog_post")
    .select("*")
    .eq("is_published", true)
    .eq("is_highlighted", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching blog posts:", error.message);
  }

  const blogs =
    (rawBlog ?? []).map((blog) => {
      if (blog.cover_image === "NO COVER IMAGE") {
        return {
          ...blog,
          publicUrl: "",
        };
      } else {
        const fullPath = `cover/${blog.cover_image}`;
        const {
          data: { publicUrl },
        } = supabase.storage.from("blog-post").getPublicUrl(fullPath);
        return { ...blog, publicUrl };
      }
    }) || [];

  return (
    <div className="container mx-auto px-4 lg:px-18 pb-4 flex flex-col gap-12 min-h-screen pt-20 items-center">
      <section className="py-4 flex flex-col items-center text-center flex-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Notes & Experiments
        </h1>
        <p className="mt-2 text-md text-muted-foreground">
          A collection of thoughts, life hacks, technical explorations, and
          everything in between
        </p>
      </section>
      <main className="flex flex-col w-full items-center">
        {blogs.length > 0 ? (
          <div className="w-full max-w-[720px] flex flex-col gap-4">
            {blogs.map((blog) => (
              <BlogPostCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No posts found.</p>
        )}
      </main>

      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/blog/all">View All Posts</Link>
        </Button>
      </div>
    </div>
  );
}
