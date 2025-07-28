"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { createProjectAction } from "@/app/(admin)/action";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  spellChecker: false,
  maxHeight: "400px",
});

export default function CreateNewProject() {
  const [project, setProject] = useState({
    title: "",
    slug: "",
    subtitle: "",
    url: "",
    content: "",
    isPublished: false,
    tags: "",
    stack: "",
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCoverImageFile(file);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "image/*": [".jpeg", ".jpg", ".png"] },
      maxSize: 1024 * 1024,
      multiple: false,
    });

  const rejectionError = fileRejections[0]?.errors[0];

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemoveImage = (e) => {
    e.stopPropagation();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCoverImageFile(null);
    setPreviewUrl(null);
  };

  const onContentChange = useCallback((value) => {
    setProject((prev) => ({ ...prev, content: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImageFile) {
      setError("A cover image is required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();

    Object.keys(project).forEach((key) => {
      formData.append(key, project[key]);
    });
    formData.append("coverImage", coverImageFile);

    const result = await createProjectAction(formData);
    if (result && !result.success) {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  const handlePublishChange = (isChecked) => {
    setProject((prev) => ({ ...prev, isPublished: isChecked }));
  };

  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
    };
  }, []);

  return (
    <div className="w-full">
      <main className="w-full flex flex-col sm:flex-row gap-6">
        <aside className="max-w-full sm:max-w-[320px] w-full gap-6 flex flex-col">
          <form
            id="project-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="coverImage" className="text-xs">
                Cover Image
              </Label>
              <div
                {...getRootProps()}
                className={`
                  relative aspect-video w-full cursor-pointer rounded-lg border-1
                  border-muted-foreground/20 flex items-center justify-center text-center
                  text-muted-foreground p-4 transition-colors hover:bg-ring/20 ${
                    isDragActive ? "bg-muted/20 border-muted-foreground" : ""
                  }
                `}
              >
                <input {...getInputProps()} name="coverImage" />
                {previewUrl ? (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Cover preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute bottom-2 right-2 h-7 w-7 rounded-full z-10"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8" />
                    <p className="text-sm">
                      {isDragActive
                        ? "Drop the image here..."
                        : "Drag & drop or click to upload"}
                    </p>
                    {rejectionError &&
                      rejectionError.code === "file-too-large" && (
                        <p className="text-sm font-medium text-destructive mt-1">
                          File is too large. Please upload an image under 1MB.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                name="title"
                type="text"
                placeholder="Project Title"
                value={project.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="subtitle" className="text-xs">
                Subtitle
              </Label>
              <Input
                name="subtitle"
                type="text"
                placeholder="Subtitle"
                value={project.subtitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="slug" className="text-xs">
                Slug
              </Label>
              <Input
                name="slug"
                type="text"
                placeholder="Slug"
                value={project.slug}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="url" className="text-xs">
                URL
              </Label>
              <Input
                name="url"
                type="text"
                placeholder="Link URL"
                value={project.url}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="tags" className="text-xs">
                Tags (comma-separated)
              </Label>
              <Input
                name="tags"
                type="text"
                placeholder="e.g. web design, branding"
                value={project.tags}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="stack" className="text-xs">
                Tech Stack (comma-separated)
              </Label>
              <Input
                name="stack"
                type="text"
                placeholder="e.g. Next.js, Supabase"
                value={project.stack}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="isPublished">Publish Project</Label>
              </div>
              <Switch
                id="isPublished"
                checked={project.isPublished}
                onCheckedChange={handlePublishChange}
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
          <Button type="submit" form="project-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Project"}
          </Button>
        </aside>
        <section className="flex-1 flex flex-col gap-1 flex-grow">
          <Label htmlFor="content" className="text-xs">
            Content
          </Label>
          <div className="prose prose-invert max-w-none ">
            <SimpleMdeReact
              value={project.content}
              options={autofocusNoSpellcheckerOptions}
              onChange={onContentChange}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
