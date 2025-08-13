"use client";
import Image from "next/image";
import Link from "next/link";

export function PryntsAlbumGrid({ albums = [] }) {
  return (
    <div className="flex flex-wrap gap-4 max-w-52">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={`/prynts/${album.album_id}`}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg border h-52 w-52">
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
        </Link>
      ))}
    </div>
  );
}