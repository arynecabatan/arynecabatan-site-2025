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
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>Edit Album Details</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          id={`edit-album-form-${album.id}`}
          className="flex-1 overflow-y-auto px-6"
        >
          <div className="flex flex-col gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="album_cover">Album Cover</Label>
              <div
                {...getCoverRootProps()}
                className="relative aspect-video w-full cursor-pointer rounded-lg border-2 border-dashed flex items-center justify-center p-4 border-muted-foreground/20"
              >
                <input {...getCoverInputProps()} />
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    <UploadCloud className="h-8 w-8 mx-auto" />
                    <p>Drop new cover here</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={album.title || ""}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="album_id">Album ID (slug)</Label>
              <Input
                id="album_id"
                name="album_id"
                type="text"
                defaultValue={album.album_id}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                defaultValue={album.description}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                type="text"
                defaultValue={album.category || ""}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                defaultValue={album.tags?.join(", ") || ""}
              />
            </div>
            <div className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Publish Album</Label>
                <Switch
                  id="isPublished"
                  name="isPublished"
                  defaultChecked={album.isPublished}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isOriginal">Original Design</Label>
                <Switch
                  id="isOriginal"
                  name="isOriginal"
                  defaultChecked={album.isOriginal}
                />
              </div>
            </div>
            {error && <p className="text-destructive text-sm pb-4">{error}</p>}
          </div>
        </form>

        <SheetFooter className="p-6 pt-4 mt-auto border-t">
          <Button variant="outline" asChild>
            <Link
              href={`/admin/05-prynts/edit-prynts-album/${album.album_id}/manage-images`}
            >
              Manage Images
            </Link>
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
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
