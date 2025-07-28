import Link from "next/link";

export function ShimmerButton({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Resume"
      className="text-xs shimmer-button inline-flex items-center justify-center px-4 py-2 font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
    >
      {children}
    </Link>
  );
}
