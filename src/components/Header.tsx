import Link from "next/link";
import { Logo } from "./Logo";
import { navLinks } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 carbon-weave backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo size="header" />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/contact#book"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Book Appointment
          </Link>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-border/40 px-4 py-2 md:hidden"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-md px-3 py-1.5 text-xs text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="carbon-accent-bar" aria-hidden="true" />
    </header>
  );
}
