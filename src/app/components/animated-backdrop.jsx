"use client";
import { useEffect } from "react";
import Script from "next/script";

export const AnimatedBackdrop = () => {
  const dynamicLoad = async () => {};
  useEffect(() => {
    if (window) {
      dynamicLoad();
    }
  }, []);
  return (
    <main className="relative -z-10 opacity-40 dark:opacity-20">
      <Script
        src="/js/shift.js"
        strategy="lazyOnload"
      />
      <div className="content--canvas"></div>
    </main>
  );
};
