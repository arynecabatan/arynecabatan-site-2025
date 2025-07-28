"use client";
import * as React from "react";
import { ThemeProvider } from "next-themes";

export function Provider({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
