"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { adminNavData } from "./admin-nav-config";


export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Find the current page's title from our config data
  let currentPageTitle = "Admin Panel"; // Default title
  for (const group of adminNavData.navMain) {
    const foundItem = group.items.find((item) => item.url === pathname);
    if (foundItem) {
      currentPageTitle = foundItem.title;
      break;
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          {currentPageTitle}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}