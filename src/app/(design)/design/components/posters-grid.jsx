"use client";
import Image from "next/image";
import { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Captions, Thumbnails } from "yet-another-react-lightbox/plugins";


function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
}) {
  return (
    <Image
      fill
      src={photo.src}
      alt={alt}
      title={title}
      sizes={sizes}
      onClick={onClick}
      className={className}
    />
  );
}

export function PostersGrid({ posters = [] }) {
  const [index, setIndex] = useState(-1);

  const photos = posters.map((poster) => ({
    src: poster.thumbnailUrl,
    width: poster.thumbWidth,
    height: poster.thumbHeight,
    fullSrc: poster.fullUrl,
  }));

   const slides = posters.map(poster => ({
    src: poster.fullUrl,
    description: poster.title,
    thumbnail: poster.thumbnailUrl,
  }));


  return (
    <>
      <PhotoAlbum
        photos={photos}
        layout="rows"
        targetRowHeight={250}
        rowConstraints={{ singleRowMaxHeight: 250 }}
        onClick={({ index }) => setIndex(index)}
        renderPhoto={NextJsImage}
        sizes={{
          size: "calc(100vw - 40px)",
          sizes: [
            { viewport: "(max-width: 599px)", size: "calc(100vw - 40px)" },
            { viewport: "(max-width: 959px)", size: "calc(50vw - 50px)" },
            { viewport: "(max-width: 1279px)", size: "calc(33vw - 50px)" },
          ],
        }}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions, Thumbnails]}
     captions={{
            position: "bottom",
            descriptionTextAlign: "center",
        }}
        thumbnails={{
            border: 0,
            gap: 8,
        }}
      />
    </>
  );
}
