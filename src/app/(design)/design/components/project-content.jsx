"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ListCollapse } from "lucide-react";
import remarkBreaks from "remark-breaks";

const TableOfContentsLinks = ({ headings, activeIds, onLinkClick }) => {
  return (
    <ul className="space-y-2">
      {headings.map((heading) => {
        const indentationClass =
          heading.level === 3 ? "ml-4" : heading.level === 4 ? "ml-8" : "";

        const isDirectlyActive = activeIds.has(heading.id) && heading.level > 2;
        const isParentActive = activeIds.has(heading.id) && !isDirectlyActive;

        let linkClass = "text-muted-foreground hover:text-primary";
        if (isDirectlyActive) {
          linkClass = "text-primary";
        } else if (isParentActive) {
          linkClass = "text-primary font-semibold ";
        }

        return (
          <li key={heading.id} className={indentationClass}>
            <Link
              href={`#${heading.id}`}
              className={`text-xs block transition-colors truncate ${linkClass}`}
              onClick={onLinkClick} // Used to close the drawer on mobile
            >
              {heading.text}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export function ProjectContent({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeIds, setActiveIds] = useState(new Set());
  const headingElementsRef = useRef(new Map());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const headingElements = document.querySelectorAll(".prose h2"); //".prose h2, .prose h3, .prose h4"

    let lastH2Id = null;
    let lastH3Id = null;

    const extractedHeadings = Array.from(headingElements).map((heading) => {
      const level = Number(heading.tagName.replace("H", ""));
      let parentId = null;

      if (level === 2) {
        lastH2Id = heading.id;
        lastH3Id = null;
      } else if (level === 3) {
        parentId = lastH2Id;
        lastH3Id = heading.id;
      } else if (level === 4) {
        parentId = lastH3Id || lastH2Id;
      }

      headingElementsRef.current.set(heading.id, heading);

      return {
        id: heading.id,
        text: heading.innerText,
        level: level,
        parentId: parentId,
      };
    });
    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observerCallback = (entries) => {
      let topMostVisibleHeadingId = null;
      let minTopValue = Infinity;

      for (const entry of entries) {
        if (entry.isIntersecting) {
          const element = headingElementsRef.current.get(entry.target.id);
          if (!element) continue;
          const top = element.getBoundingClientRect().top;

          if (top < minTopValue) {
            minTopValue = top;
            topMostVisibleHeadingId = entry.target.id;
          }
        }
      }

      if (topMostVisibleHeadingId) {
        const newActiveIds = new Set();
        newActiveIds.add(topMostVisibleHeadingId);

        let currentId = topMostVisibleHeadingId;
        while (currentId) {
          const currentHeading = headings.find((h) => h.id === currentId);
          if (currentHeading && currentHeading.parentId) {
            newActiveIds.add(currentHeading.parentId);
            currentId = currentHeading.parentId;
          } else {
            break;
          }
        }
        setActiveIds(newActiveIds);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -70% 0px",
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const elements = Array.from(headingElementsRef.current.values());
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  return (
    <>
      <div className="">
        <aside className="hidden right-0 top-0 fixed h-full lg:grid justify-end px-2 items-center w-48">
          <div className="sticky top-24 h-fit text-right">
            <TableOfContentsLinks headings={headings} activeIds={activeIds} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <article className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                img: function ({ ...props }) {
                  return (
                    <Image
                      className={`rounded-xl object-cover w-full max-w-[960px]`}
                      src={props.src}
                      alt={props.alt ? props.alt : "arynecabatan.com image"}
                      width="960"
                      height="640"
                    />
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      <div className="lg:hidden z-50">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild className="fixed bottom-16 right-0 ">
            <Button variant="outline" aria-label="Open table of contents" className="rounded-l-full rounded-r-none">
              <ListCollapse className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <DrawerHeader>
              <DrawerTitle>On this page</DrawerTitle>
            </DrawerHeader>
            <div className="text-center text-base pb-8 overflow-y-auto">
              <TableOfContentsLinks
                headings={headings}
                activeIds={activeIds}
                onLinkClick={() => setIsDrawerOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
