import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ProjectContent } from "../../components/project-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// export const metadata = {
//   title: "Portfolio",
// };

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select()
    .eq("slug", slug)
    .single();
    const {
    data: { publicUrl },
  } = supabase.storage.from("projects").getPublicUrl(project.cover_image);

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: [
        {
          url: publicUrl,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en-US",
      type: "website",
    },

   twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.subtitle,
      images: {
        default: publicUrl,
      },
    },

  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select()
    .eq("slug", slug)
    .single();

  if (!project) {
    notFound();
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("projects").getPublicUrl(project.cover_image);

  return (
    <main className="px-4 md:px-16 pb-4 flex flex-col min-h-screen pt-16 max-w-4xl container">
      <header className="container flex flex-col gap-4">
        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden">
          <Image
            src={publicUrl}
            alt={`Cover image for ${project.title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 1024px"
          />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground">{project.subtitle}</p>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4 mb-12">
          <div>
            <h3 className="text-sm font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack?.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {project.url && (
            <div>
              <Button asChild>
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <ProjectContent content={project.content} />
    </main>
  );
}
