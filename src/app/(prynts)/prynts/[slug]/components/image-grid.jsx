"use client";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function ImageGrid({ images = [] }) {
  const [index, setIndex] = useState(-1);

  const slides = images.map((image) => ({
    src: image.publicUrl,
    width: 1200,
    height: 1200,
  }));

  return (
    <>
      <div className="columns-3 sm:columns-4 md:columns-5 lg:columns-6 xl:columns-8 gap-4 space-y-4">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="break-inside-avoid"
            onClick={() => setIndex(idx)}
          >
            <Image
              src={image.publicUrl}
              alt={image.title}
              width={500}
              height={500}
              className="w-full h-auto rounded-md cursor-pointer"
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}
