"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createGalleryItem } from "@/app/(admin)/action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Uploading..." : "Add to Gallery"}
    </Button>
  );
}

export function GalleryUploadForm() {
  const initialState = { success: false, message: null };
  const [state, formAction] = useActionState(createGalleryItem, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/svg+xml": [".svg"],
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      },
      multiple: false,
      maxSize: 10 * 1024 * 1024,
    });

  useEffect(() => {
    if (state.success === false && state.message === null) {
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <p className="text-sm">Add image</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Gallery Item</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          <div
            {...getRootProps()}
            className={`relative aspect-3/2 cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center text-center text-muted-foreground transition-colors hover:bg-muted/20 ${
              isDragActive ? "bg-muted/20 border-muted-foreground" : ""
            }`}
          >
            <input {...getInputProps()} name="image" />
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Image preview"
                fill
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-4">
                <UploadCloud className="h-8 w-8" />
                <p className="text-sm">Click or drag to upload</p>
              </div>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="title" className="text-xs">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Image Title"
              required
            />
          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="grid w-full items-center gap-2 flex-1">
              <Label htmlFor="type" className="text-xs">
                Type
              </Label>
              <Select name="type" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poster">Poster</SelectItem>
                  <SelectItem value="logo">Logo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-start gap-1">
              <Label htmlFor="status" className="text-xs">
                Status
              </Label>
              <div className="flex-1 grid place-items-center">
                <Switch id="status" name="status" />
              </div>
            </div>
          </div>

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
