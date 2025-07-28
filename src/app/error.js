"use client";

import { useEffect } from "react";
import { AnimatedBackdrop } from "./components/animated-backdrop";
import { Navigation } from "@/components/shared/Navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "@/components/shared/Footer";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
<div className="">
  <AnimatedBackdrop />
  <Navigation />
  <div className="min-h-screen flex flex-col items-center ">
    <main className="flex-1 pt-16 h-full flex container max-w-full w-[480px]">
      <div className="container p-8 h-auto grid place-items-center w-full">
        <div className="text-center flex flex-col items-center w-full">
          <h1 className="text-8xl font-mono font-bold text-primary">Error</h1>
          <p className="text-lg line-clamp-2">
            Something went wrong!
          </p>
          <div className="my-6 flex flex-col gap-2">
            <Button onClick={() => reset()} variant="outline">Try again</Button>
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</div>

  );
}

