import Link from "next/link";
import { Logo } from "./Logo";
import { navLinks, services, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="carbon-weave mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="footer" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            {siteConfig.description}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Services
          </h3>
          <ul className="mt-4 space-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a
                href={siteConfig.contact.phoneHref}
                className="transition-colors hover:text-accent"
              >
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.contact.emailHref}
                className="transition-colors hover:text-accent"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              {siteConfig.hours.label}
              <br />
              {siteConfig.hours.time}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <nav className="flex gap-4" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
