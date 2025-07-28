"use client";

import { useState, useMemo } from "react";
import { GalleryShowcaseHeader } from "./header";
import { GalleryGrid } from "./gallery-grid";
import { useRouter } from "next/navigation";

export function GalleryAdminView({ initialItems = [] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const handleItemDeleted = () => {
    router.refresh();
  };

  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return initialItems;
    }
    return initialItems.filter((item) => item.type === filter);
  }, [filter, initialItems]);

  return (
    <div className="space-y-8">
      <GalleryShowcaseHeader
        currentFilter={filter}
        onFilterChange={setFilter}
      />
      <main>
        <GalleryGrid
          items={filteredItems}
          onDeleteSuccess={handleItemDeleted}
        />
      </main>
    </div>
  );
}
