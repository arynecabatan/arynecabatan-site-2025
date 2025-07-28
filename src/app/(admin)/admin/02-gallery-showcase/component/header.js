"use client";

import { GalleryUploadForm } from "./gallery-upload-form";
import { GalleryFilterControls } from "./gallery-filter-controls"; // We'll create this next

export function GalleryShowcaseHeader({ currentFilter, onFilterChange }) {
  return (
    <div className="flex justify-between">
      <GalleryUploadForm />
      <GalleryFilterControls
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
