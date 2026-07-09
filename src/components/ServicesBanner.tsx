import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/images";

type ServicesBannerProps = {
  title?: string;
  description?: string;
};

export function ServicesBanner({
  title = "On-site ADAS calibration at your shop",
  description = "Targets, scan tools, and OEM-compliant procedures — fully mobile across Ottawa and surrounding areas.",
}: ServicesBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border">
      <Image
        src={siteImages.calibrationSetup}
        alt="ADAS calibration equipment with laser alignment at a repair shop"
        width={1200}
        height={500}
        className="h-56 w-full object-cover sm:h-72"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Mobile capability
        </p>
        <h2 className="mt-2 max-w-lg text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
        <Link
          href="/contact#book"
          className="mt-6 inline-flex w-fit rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Book a calibration
        </Link>
      </div>
    </section>
  );
}
