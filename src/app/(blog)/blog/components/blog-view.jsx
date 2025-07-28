"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogPostCard } from "./blog-post-card";

export function BlogView({ initialBlogs = [] }) {

  return (
    <div className="space-y-8 items-center flex flex-col">
      <main className="flex flex-col w-full items-center gap-2">
        {initialBlogs.length > 0 ? (
          <div className="w-full max-w-[720px]">
            {initialBlogs.map((blog) => (
              <BlogPostCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No posts found.</p>
        )}
      </main>



    </div>
  );
}
