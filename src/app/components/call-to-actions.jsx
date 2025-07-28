"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CallToActions = ({ctaButtons}) => {

  return (
    <section className=" w-full pt-8 p-4 space-y-2">
      {ctaButtons.map((button) => (
        <Button
          key={button.id}
          variant={button.variant}
          className="rounded-lg w-full"
          asChild
        >
          <Link href={button.href} target="_blank" rel="noopener noreferrer">
            {button.title}
          </Link>
        </Button>
      ))}
    </section>
  );
};