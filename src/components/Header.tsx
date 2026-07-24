"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { navLinks } from "@/lib/site";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 carbon-weave backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo size="header" />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative text-sm transition-colors",
                  active
                    ? "font-medium text-accent"
                    : "text-muted hover:text-accent",
                ].join(" ")}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-accent"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
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
        {navLinks.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={[
                "shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors",
                active
                  ? "bg-accent/15 font-medium text-accent"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="carbon-accent-bar" aria-hidden="true" />
    </header>
  );
}
