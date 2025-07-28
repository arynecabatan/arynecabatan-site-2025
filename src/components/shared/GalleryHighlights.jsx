"use client";
import Image from "next/image";
import { useState } from "react";

export const GalleryCarousel = ({ itemsList }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <div className="flex gap-2">
      {itemsList &&
        itemsList
          .slice(0, 4)
          .map((posterName, index) => (
            <div className="cursor-pointer" key={index}>
              <Image
                src={posterName.cover}
                alt={posterName.title}
                width={180}
                height={180}
                className={`aspect-square object-cover ${
                  isLoading
                    ? "scale-110 blur-2xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                }`}
                onLoad={() => setLoading(false)}
              />
            </div>
          ))}
    </div>
  );
};
