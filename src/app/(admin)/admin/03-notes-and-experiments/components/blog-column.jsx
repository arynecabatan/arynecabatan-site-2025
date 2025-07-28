"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  deleteBlog,
  toggleBlogHighlightStatus,
  toggleBlogPublishStatus,
} from "@/app/(admin)/action";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

const handleDelete = async (blog) => {
  if (
    window.confirm(
      `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`
    )
  ) {
    const result = await deleteBlog(blog.id, blog.cover_image);
    if (!result.success) {
      alert(`Error: ${result.message}`);
    }
  }
};

function StatusToggle({ blog }) {
  const [is_published, set_is_published] = React.useState(blog.is_published);
  const handleToggle = async () => {
    set_is_published(!is_published);
    await toggleBlogPublishStatus(blog.id, blog.is_published);
  };
  return <Switch checked={is_published} onCheckedChange={handleToggle} />;
}

function HighlightToggle({ blog }) {
  const [is_highlighted, set_is_highlighted] = useState(blog.is_highlighted);

  const handleToggle = async (e) => {
    e.stopPropagation();
    set_is_highlighted(!is_highlighted);
    await toggleBlogHighlightStatus(blog.id, blog.is_highlighted);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-8 w-8"
    >
      <Star
        className={`h-4 w-4 transition-colors ${
          is_highlighted
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    </Button>
  );
}

export const blog_columns = [
  {
    accessorKey: "publicUrl",
    header: "Cover Image",
    meta: {
      className: "w-[150px]",
    },
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <Image
          src={blog.publicUrl}
          alt={blog.title}
          width={128}
          height={128}
          className="rounded-md object-cover"
        />
      );
    },
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div>
          <Link
            href={`/admin/03-notes-and-experiments/edit-blog-post/${blog.slug}`}
            className="hover:underline"
          >
            <div className="font-medium">{blog.title}</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(blog.updated_at)}
            </div>
          </Link>

          {blog.category && blog.category.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {blog.category.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "is_published",
    header: () => <div className="text-right">Status</div>,
    meta: {
      className: "w-[120px]",
    },
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div className="text-right">
          <StatusToggle blog={blog} />
        </div>
      );
    },
  },

  {
    id: "is_highlighted",
    header: () => <div className="text-center">Highlight</div>,
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div className="text-center">
          <HighlightToggle blog={blog} />
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    meta: {
      className: "w-[100px]",
    },
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          {/* 2. Add the new Preview button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link
              href={`/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Preview blog</span>
            </Link>
          </Button>

          {/* The existing Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(blog)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete project</span>
          </Button>
        </div>
      );
    },
  },
];
