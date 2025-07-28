"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  deleteProject,
  toggleProjectHighlightStatus,
  togglePublishStatus,
} from "@/app/(admin)/action";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const handleDelete = async (project) => {
  if (
    window.confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    )
  ) {
    const result = await deleteProject(project.id, project.cover_image);
    if (!result.success) {
      alert(`Error: ${result.message}`);
    }
  }
};

function StatusToggle({ project }) {
  const [isPublished, setIsPublished] = React.useState(project.isPublished);
  const handleToggle = async () => {
    setIsPublished(!isPublished);
    await togglePublishStatus(project.id, project.isPublished);
  };
  return <Switch checked={isPublished} onCheckedChange={handleToggle} />;
}

function HighlightToggle({ project }) {
  const [isHighlighted, setIsHighlighted] = useState(project.is_highlighted);

  const handleToggle = async (e) => {
    e.stopPropagation(); // Prevent dropdown from opening if inside one
    setIsHighlighted(!isHighlighted);
    await toggleProjectHighlightStatus(project.id, project.is_highlighted);
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
          isHighlighted
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    </Button>
  );
}

export const columns = [
  {
    accessorKey: "publicUrl",
    header: "Cover Image",
    meta: {
      className: "w-[150px]",
    },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Image
          src={project.publicUrl}
          alt={project.title}
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
      const project = row.original;
      return (
        <div>
          <Link
            href={`/admin/01-design-portfolio/edit-design-project/${project.slug}`}
            className="hover:underline"
          >
            <div className="font-medium">{project.title}</div>
            <div className="text-sm text-muted-foreground">
              {project.subtitle}
            </div>
          </Link>

          {project.stack && project.stack.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {project.stack.map((tech) => (
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
    accessorKey: "isPublished",
    header: () => <div className="text-right">Status</div>,
    meta: {
      className: "w-[120px]",
    },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="text-right">
          <StatusToggle project={project} />
        </div>
      );
    },
  },

  {
    id: "highlight",
    header: () => <div className="text-center">Highlight</div>,
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="text-center">
          <HighlightToggle project={project} />
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
      const project = row.original;
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
              href={`/design/projects/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Preview project</span>
            </Link>
          </Button>

          {/* The existing Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(project)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete project</span>
          </Button>
        </div>
      );
    },
  },
];
