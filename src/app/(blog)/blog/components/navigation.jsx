"use client";

import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlogCommandMenu } from "./blog-command-menu";

export const NotesAndExperimentNavigation = () => {
  const pathname = usePathname();

  return (
    <nav
      className={`w-full z-[999] fixed flex flex-col justify-start h-fit items-center`}
    >
      <div className="h-16 max-w-[1440px] w-full flex justify-between items-center gap-2">
        <div>
          {pathname !== "/blog" && (
            <Button
              variant="ghost"
              asChild
              className="rounded-full aspect-square w-10 h-10"
              aria-label="Back to All Projects"
            >
              <Link href="/blog">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </Button>
          )}
        </div>
        <div className="space-x-3 flex items-center">
          <BlogCommandMenu />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};
