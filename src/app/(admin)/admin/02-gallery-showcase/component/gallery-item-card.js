"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Star } from "lucide-react";
import {
  deleteGalleryItem,
  toggleGalleryStatus,
  toggleHighlightStatus,
} from "@/app/(admin)/action";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function GalleryItemCard({ item, onDeleteSuccess, onPreview }) {
  const [status, setStatus] = useState(item.status);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(item.is_highlighted);

  const handleDelete = async () => {
    const result = await deleteGalleryItem(item.id, item.image);
    if (result.success) {
      onDeleteSuccess(item.id);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  const handleToggleStatus = async (isChecked) => {
    setStatus(isChecked);
    const result = await toggleGalleryStatus(item.id, isChecked);
    if (!result.success) {
      setStatus(!isChecked);
      alert(`Error updating status: ${result.message}`);
    } else if (result.updatedItem) {
      setStatus(result.updatedItem.status);
    }
  };

  const handleToggleHighlight = async () => {
    const newHighlightState = !isHighlighted;
    setIsHighlighted(newHighlightState);
    await toggleHighlightStatus(item.id, item.is_highlighted);
  };

  return (
    <Card className="p-0">
      <CardContent className="p-0 space-y-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl rounded-b-none">
          {item.thumbnailUrl && (
            <Image
              src={item.thumbnailUrl}
              alt={item.title || "Gallery image"}
              fill
              className="object-contain"
            />
          )}
          <div className="absolute top-2 right-2 space-x-1">
            
            <Button
              variant="secondary"
              size="icon"
              className={`h-7 w-7 transition-colors ${
                isHighlighted
                  ? "text-amber-500 hover:text-amber-500 "
                  : " hover:text-primary"
              }`}
              onClick={handleToggleHighlight}
            >
              <Star className={isHighlighted ? "fill-current" : ""} />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7"
              onClick={onPreview}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Preview item</span>
            </Button>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className=" h-7 w-7"
                  aria-label="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the item titled "{item.title}" from your storage and
                    database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex justify-between px-3 pb-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold truncate">{item.title}</h3>
            <p className="text-xs">{item.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={status} onCheckedChange={handleToggleStatus} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
