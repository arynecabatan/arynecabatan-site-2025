"use client";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UploadCloud, X } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { createBlogAction } from "@/app/(admin)/action";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  spellChecker: false,
  maxHeight: "400px",
});

export default function CreateBlogPost() {
  const [blog, setBlog] = useState({
    title: "",
    summary: "",
    content: "",
    is_published: false,
    is_highlighted: false,
    tags: "",
    category: "",
    reading_time: "",
  });

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlog((prev) => ({
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
      maxSize: 1024 * 1024 * 1024,
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
    setBlog((prev) => ({ ...prev, content: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!coverImageFile) {
    //   setError("A cover image is required.");
    //   return;
    // }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();

    Object.keys(blog).forEach((key) => {
      formData.append(key, blog[key]);
    });
    formData.append("cover_image", coverImageFile);

    const result = await createBlogAction(formData);
    if (result && !result.success) {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  const handlePublishChange = (isChecked) => {
    setBlog((prev) => ({ ...prev, is_published: isChecked }));
  };

  const handleHighlightChange = (isChecked) => {
    setBlog((prev) => ({ ...prev, is_highlighted: isChecked }));
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
            id="blog-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Cover Image */}
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="cover_image" className="text-xs">
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
                <input {...getInputProps()} name="cover_image" />
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

            {/* Title */}
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                name="title"
                type="text"
                placeholder="Blog Title"
                value={blog.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Summary */}
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="summary" className="text-xs">
                Summary
              </Label>
              <Input
                name="summary"
                type="text"
                placeholder="Summary"
                value={blog.summary}
                onChange={handleInputChange}
                required
              />
            </div>

            {/*Tags */}
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="tags" className="text-xs">
                Tags
              </Label>
              <Input
                name="tags"
                type="text"
                placeholder="Tags (comma-separated)"
                value={blog.tags}
                onChange={handleInputChange}
              />
            </div>

            {/*Category */}
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="category" className="text-xs">
                Category
              </Label>
              <Input
                name="category"
                type="text"
                placeholder="Category (comma-separated)"
                value={blog.category}
                onChange={handleInputChange}
              />
            </div>

            {/* Reading Time */}
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="reading_time" className="text-xs">
                Reading Time
              </Label>
              <Input
                name="reading_time"
                type="text"
                placeholder="Reading Time"
                value={blog.reading_time}
                onChange={handleInputChange}
              />
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="is_published">Publish</Label>
              </div>
              <Switch
                id="is_published"
                checked={blog.is_published}
                onCheckedChange={handlePublishChange}
              />
            </div>

            {/* Highlight */}
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="is_highlighted">Highlight</Label>
              </div>
              <Switch
                id="is_highlighted"
                checked={blog.is_highlighted}
                onCheckedChange={handleHighlightChange}
              />
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
          {/* Submit Button */}
          <Button type="submit" form="blog-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Blog"}
          </Button>
        </aside>
        <section className="flex-1 flex flex-col gap-1 flex-grow">
          <Label htmlFor="content" className="text-xs">
            Content
          </Label>
          <div className="prose prose-invert max-w-none ">
            <SimpleMdeReact
              value={blog.content}
              options={autofocusNoSpellcheckerOptions}
              onChange={onContentChange}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
