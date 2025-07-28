"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GalleryFilterControls({ currentFilter, onFilterChange }) {
  return (
    <Select
      value={currentFilter}
      onValueChange={(value) => {
        if (value) onFilterChange(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by type..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="poster">Posters</SelectItem>
        <SelectItem value="logo">Logos</SelectItem>
      </SelectContent>
    </Select>
  );
}
