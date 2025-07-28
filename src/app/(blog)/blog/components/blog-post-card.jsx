import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function BlogPostCard({ blog }) {

  return (
    <Link href={`/blog/${blog.slug}`} className="space-y-6">
      <Card className="p-2 w-full">
        <CardContent className="flex flex-col-reverse sm:flex-row gap-4 p-2 sm:justify-between sm:items-center">
          <div className="flex flex-col gap-2 flex-3/4">
            <h2 className="text-xl font-semibold line-clamp-2">
              {blog.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {formatDate(blog.updated_at)}
              {blog.reading_time && <span>·</span>}
              {blog.reading_time && <span>{blog.reading_time} min read</span>}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {blog.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>


          {blog.publicUrl && (
            <div className="flex-1/4 relative aspect-video overflow-hidden rounded-md w-full h-full sm:w-48">
              <Image
                src={blog.publicUrl}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}


        </CardContent>
      </Card>
    </Link>
  );
}
