"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PublicProjectList({ projects = [] }) {
  const pathname = usePathname(); 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {projects.map((project) => (
        <Link href={`/design/projects/${project.slug}`} key={project.id}>
          <div className="flex flex-col gap-2">
            <div className="relative w-full aspect-[3/2]">
              <Image
                src={`${project.publicUrl}?updated_at=${project.updated_at}` || "/placeholder.jpg"}
                alt={project.title}
                fill
                priority
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                {project.subtitle}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {pathname === "/design" && (
        <Link href={"/design/all-projects"}>
          <Card className="aspect-[3/2] flex items-center justify-center hover:border-muted-foreground transition-colors">
            <CardContent className="p-0">
                <div className="flex space-x-3 items-center text-muted-foreground ">
                  <ExternalLink className="w-4 h-4" />
                  <p>See all projects</p>
                </div>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
