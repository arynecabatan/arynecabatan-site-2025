import { createClient } from "@/utils/supabase/server";
import { BlogPostCard } from "../components/blog-post-card";
import { PaginationControls } from "../components/pagination-controls";
import { Card } from "@/components/ui/card";

export default async function AllBlogsPage(props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const page = searchParams["page"] ?? "1";
  const perPage = 4;

  const start = (Number(page) - 1) * perPage;
  const end = start + perPage - 1;

  const {
    data: rawBlog,
    error,
    count,
  } = await supabase
    .from("blog_post")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Error fetching all blog posts:", error.message);
  }

  const blogs =
    (rawBlog ?? []).map((blog) => {
      if (blog.cover_image === "NO COVER IMAGE") {
        return {
          ...blog,
          publicUrl: '',
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
        <PaginationControls page={page} perPage={perPage} totalCount={count} />
      </main>
    </div>
  );
}
