"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateBlogAction } from "@/app/(admin)/action";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" form="edit-blog-post" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function EditBlogPost({ blog }) {
  const initialState = { success: false, message: null };
  const [state, formAction] = useActionState(
    updateBlogAction.bind(null, blog.id),
    initialState
  );

  const [content, setContent] = useState(blog.content || "");
  const [previewUrl, setPreviewUrl] = useState(blog.publicUrl);
  const [isPublished, setIsPublished] = useState(blog.is_published);
  const [isHighlighted, setIsHighlighted] = useState(blog.is_highlighted);
  const [coverImage, setCoverImage] = useState(blog.cover_image);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (previewUrl && previewUrl.startsWith("blob:")) {
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
      multiple: false,
    });

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setCoverImage("NO COVER IMAGE");
    const fileInput = document.querySelector('input[name="cover_image"]');
    if (fileInput) fileInput.value = "";
  };

  const handlePublishChange = (isChecked) => {
    setIsPublished((prev) => ({ ...prev, is_published: isChecked }));
  };

  const handleHighlightChange = (isChecked) => {
    setIsHighlighted((prev) => ({ ...prev, is_highlighted: isChecked }));
  };

  const onContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const editorOptions = useMemo(() => ({ spellChecker: false }), []);

  return (
    <div className="w-full">
      <main className="w-full flex flex-col sm:flex-row gap-6">
        <aside className="max-w-full sm:max-w-[320px] w-full gap-6 flex flex-col">
          <form
            id="edit-blog-post"
            action={formAction}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="content" value={content} />
            <input
              type="hidden"
              name="currentImagePath"
              value={coverImage}
            />
            <input type="hidden" name="is_published" value={isPublished} />
            <input type="hidden" name="is_highlighted" value={isHighlighted} />
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
                  }`}
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
                      className="absolute bottom-2 right-2 h-7 w-7 rounded-full z-10 cursor-copy"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8" />
                    <p className="text-sm">Change cover image</p>
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
                defaultValue={blog.title}
                required
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="summary" className="text-xs">
                Summary
              </Label>
              <Input
                name="summary"
                type="text"
                defaultValue={blog.summary}
                required
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="tags" className="text-xs">
                Tags
              </Label>
              <Input
                name="tags"
                type="text"
                defaultValue={blog.tags?.join(", ") || ""}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="category" className="text-xs">
                Category
              </Label>
              <Input
                name="category"
                type="text"
                defaultValue={blog.category?.join(", ") || ""}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="reading_time" className="text-xs">
                Reading Time
              </Label>
              <Input
                name="reading_time"
                type="text"
                defaultValue={blog.reading_time}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label htmlFor="is_published">Publish</Label>
              <Switch
                name="is_published"
                defaultChecked={blog.is_published}
                onCheckedChange={handlePublishChange}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label htmlFor="is_highlighted">Highlight</Label>
              <Switch
                name="is_highlighted"
                defaultChecked={blog.is_highlighted}
                onCheckedChange={handleHighlightChange}
              />
            </div>

            {state?.message && (
              <p className="text-red-500 text-sm mt-2">{state.message}</p>
            )}
          </form>
          <SubmitButton />
        </aside>

        <section className="flex-1 flex flex-col gap-1 flex-grow">
          <Label htmlFor="content" className="text-xs">
            Content
          </Label>
          <div className="prose prose-invert max-w-none">
            <SimpleMdeReact
              value={content}
              options={editorOptions}
              onChange={onContentChange}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
