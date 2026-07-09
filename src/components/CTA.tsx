import Link from "next/link";
import { siteConfig } from "@/lib/site";

type CTAProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function CTA({
  title = "Ready to schedule a calibration?",
  description = "Contact us for fast mobile ADAS service at your shop. Same-week availability across Ottawa and surrounding areas.",
  className = "",
}: CTAProps) {
  return (
    <section
      className={`carbon-weave carbon-panel relative overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-12 ${className}`}
    >
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-muted leading-relaxed">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact#book"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover glow-accent"
          >
            Book Appointment
          </Link>
          <a
            href={siteConfig.contact.phoneHref}
            className="carbon-btn rounded-lg px-6 py-3 text-sm font-medium text-foreground"
          >
            Call {siteConfig.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
