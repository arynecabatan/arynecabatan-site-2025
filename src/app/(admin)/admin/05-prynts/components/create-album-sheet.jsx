"use client";
import { useState, useCallback, useRef } from "react";
import { createPryntAction } from "@/app/(admin)/action";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

// Updated ImageUploader with a button-based flow
function ImageUploader({ files, setFiles }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      // Add new images to the beginning of the list
      setFiles((prev) => [...newFiles, ...prev]);
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="flex-1 overflow-y-auto rounded-lg border p-2 min-h-[100px] max-h-48">
      <div className="grid grid-cols-4 gap-2">
        {/* Button to add images */}
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/20 hover:border-primary transition-colors"
        >
          <Plus className="h-6 w-6 text-muted-foreground" />
        </button>

        {/* Display uploaded images */}
        {files.map((file, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={file.preview}
              alt={file.name}
              fill
              className="object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 rounded-full z-10"
              onClick={() => removeFile(file)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateAlbumSheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);
  const [albumCoverFile, setAlbumCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleOpenChange = (open) => {
    if (!open) {
      setAlbumImages([]);
      setAlbumCoverFile(null);
      setPreviewUrl(null);
      setError(null);
      setIsSubmitting(false);
    }
    setIsOpen(open);
  };

  const onCoverDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setAlbumCoverFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [previewUrl]
  );

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } =
    useDropzone({
      onDrop: onCoverDrop,
      accept: { "image/*": [".jpeg", ".jpg", ".png"] },
      maxSize: 1024 * 1024,
      multiple: false,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target);
    if (albumCoverFile) formData.append("album_cover", albumCoverFile);
    albumImages.forEach((file) => formData.append("images", file));

    const result = await createPryntAction(formData);

    if (result && !result.success) {
      setError(result.message);
      setIsSubmitting(false);
    } else {
      handleOpenChange(false);
      router.refresh();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Create New Album</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0">
        <SheetHeader>
          <SheetTitle>Create a New Prynt Album</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={handleSubmit}
          id="create-album-form"
          className="flex-1 overflow-y-auto p-4"
        >
          <div className="flex flex-col gap-4">
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="album_cover" className="text-xs">
                Album Cover
              </Label>
              <div
                {...getCoverRootProps()}
                className="h-48 relative w-full cursor-pointer rounded-lg border-2 border-dashed flex items-center justify-center border-muted-foreground/20"
              >
                <input {...getCoverInputProps()} />
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Cover preview"
                    width={180}
                    height={180}
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    <p>Add cover image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-1">
              <Label htmlFor="album_id" className="text-xs">
                Album ID
              </Label>
              <Input
                id="album_id"
                name="album_id"
                type="text"
                placeholder="RD0001"
                required
              />
            </div>

            <div className="grid w-full items-center gap-1">
              <Label htmlFor="title" className="text-xs">
                Album title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Album title"
                required
              />
            </div>

            <div className="grid w-full items-center gap-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                type="text"
                placeholder="A short description"
              />
            </div>
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="category" className="text-xs">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                type="text"
                placeholder="Illustrations"
              />
            </div>
            <div className="grid w-full items-center gap-1">
              <Label htmlFor="tags" className="text-xs">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="e.g., abstract, minimalist"
              />
            </div>

            <div className="rounded-lg border p-3 space-y-4">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="isPublished">Publish Album</Label>
                <Switch id="isPublished" name="isPublished" />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="isOriginal">Original Design</Label>
                <Switch id="isOriginal" name="isOriginal" />
              </div>
            </div>

            <div className="grid w-full items-center gap-1">
              <Label className="text-xs">Album Images</Label>
              <ImageUploader files={albumImages} setFiles={setAlbumImages} />
            </div>

            {error && <p className="text-destructive text-sm pb-4">{error}</p>}
          </div>
        </form>

        <SheetFooter className="p-4 mt-auto border-t flex flex-row">
          <SheetClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="flex-1"
            form="create-album-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Album"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
