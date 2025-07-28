import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BlogContent } from "../components/blog-content";

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blog_post")
    .select()
    .eq("slug", slug)
    .single();

  if (!blog) {
    notFound();
  }

  if (blog.cover_image === "NO COVER IMAGE") {
    blog.publicUrl = '';
  } else {
    const fullPath = `cover/${blog.cover_image}`;
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-post").getPublicUrl(fullPath);
    blog.publicUrl = publicUrl;
  }

  return (
    <main className="px-4 md:px-16 pb-4 flex flex-col min-h-screen pt-16 max-w-4xl container">
      <header className="container flex flex-col gap-4">
        {blog.publicUrl && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={blog.publicUrl}
              alt={`Cover image for ${blog.title}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 1024px"
            />
          </div>
        )}
        <div className="mt-4 space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {blog.title}
          </h1>
          <p className="text-base md:text-lg line-clamp-3 text-muted-foreground">
            {blog.summary}
          </p>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {blog.category?.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </header>
      <BlogContent content={blog.content} />
    </main>
  );
}
