import { Button } from "@/components/ui/button";
import Link from "next/link";

export const PryntsFooter = () => {
  return (
    <footer className="w-full z-40 flex flex-col items-center px-6 md:px-12 py-4 md:py-10">
      <div className="h-16 w-full max-w-[1440px] flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">RYN.</p>
          <small>© 2025</small>
        </div>
        <div>
          <div>
            <Button variant="link" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/blog">Blog</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="mailto:ryn161923@gmail.com">Contacts</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};