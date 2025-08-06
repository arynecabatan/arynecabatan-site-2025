"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { EditAlbumSheet } from "./edit-album-sheet"; // Import our new component

export function AlbumGrid({ albums = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <EditAlbumSheet key={album.id} album={album}>
          {/* This is the content that will trigger the sheet */}
          <div className="group relative cursor-pointer h-48 w-48">
            <div className="aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={album.publicUrl}
                alt={album.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="mt-2">
              <h3 className="font-semibold text-sm truncate">{album.title}</h3>
              <p className="text-xs text-muted-foreground">{album.category}</p>
            </div>
            {!album.isPublished && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                Draft
              </Badge>
            )}
          </div>
        </EditAlbumSheet>
      ))}
    </div>
  );
}