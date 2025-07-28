"use client";
import { useState } from "react";
import { GalleryItemCard } from "./gallery-item-card";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function GalleryGrid({ items = [], onDeleteSuccess }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const slides = items.map((item) => ({
    src: item.fullUrl,
    width: item.width,
    height: item.height,
  }));

  return (
    <>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <GalleryItemCard
              key={item.id}
              item={item}
              onDeleteSuccess={onDeleteSuccess}
              onPreview={() => openLightbox(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="font-semibold">No items match your filter.</h3>
        </div>
      )}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </>
  );
}
