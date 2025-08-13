"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { EditAlbumSheet } from "./edit-album-sheet";
import { deletePrynt } from "@/app/(admin)/action";

export function AlbumGrid({ albums = [] }) {
  const router = useRouter();

  const handleDelete = async (album, e) => {
    e.stopPropagation();
    e.preventDefault();

    await deletePrynt(album.id); 
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-4">
      {albums.map((album) => (
        <div key={album.id} className="group relative">
          <EditAlbumSheet album={album}>
            <div className="relative cursor-pointer h-52 w-52">
              <div className="aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={album.publicUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2 space-y-1">
                <h3 className="font-semibold text-sm line-clamp-1">{`${album.album_id} - ${album.title}`}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{album.description}</p>
              </div>
              {!album.isPublished && (
                <Badge variant="secondary" className="absolute top-2 left-2">
                  Draft
                </Badge>
              )}
            </div>
          </EditAlbumSheet>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 transition-opacity"
                onClick={(e) => e.stopPropagation()} 
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the album "{album.title}" and all of its images from storage. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => handleDelete(album, e)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}