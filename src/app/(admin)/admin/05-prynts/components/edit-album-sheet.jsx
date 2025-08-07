"use client";
import { useState, useCallback } from "react";
import { updatePryntDetailsAction } from "@/app/(admin)/action";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDropzone } from "react-dropzone"; // Import useDropzone
import { UploadCloud } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";

export function EditAlbumSheet({ album, children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State for the new cover photo
  const [albumCoverFile, setAlbumCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(album.publicUrl);

  const onCoverDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setAlbumCoverFile(file);
        if (previewUrl && previewUrl.startsWith("blob:"))
          URL.revokeObjectURL(previewUrl);
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
    if (albumCoverFile) {
      formData.append("album_cover", albumCoverFile);
    }
    formData.append("currentCoverName", album.album_cover);

    const result = await updatePryntDetailsAction(album.id, formData);

    if (result && !result.success) {
      setError(result.message);
      setIsSubmitting(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader>
          <SheetTitle>Edit Album Details</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          id={`edit-album-form-${album.id}`}
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
                defaultValue={album.album_id}
                placeholder="RD0001"
                required
              />
            </div>

            <div className="grid w-full items-center gap-1">
              <Label htmlFor="title" className="text-xs">
                Album Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={album.title || ""}
                placeholder="Album title"
                required
              />
            </div>

            <div className="grid w-full items-center gap-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                type="text"
                defaultValue={album.description}
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
                defaultValue={album.category || ""}
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
                defaultValue={album.tags?.join(", ") || ""}
                placeholder="e.g., abstract, minimalist"
              />
            </div>
            <div className="rounded-lg border p-3 space-y-4">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="isPublished">Publish Album</Label>
                <Switch
                  id="isPublished"
                  name="isPublished"
                  defaultChecked={album.isPublished}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="isOriginal">Original Design</Label>
                <Switch
                  id="isOriginal"
                  name="isOriginal"
                  defaultChecked={album.isOriginal}
                />
              </div>
            </div>

            <Button variant="outline" asChild>
              <Link
                href={`/admin/05-prynts/edit-prynts-album/${album.album_id}/manage-images`}
              >
                Manage Images
              </Link>
            </Button>

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
            form={`edit-album-form-${album.id}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
