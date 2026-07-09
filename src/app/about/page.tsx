import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { EquipmentStrip } from "@/components/EquipmentStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { Certifications, ServiceArea } from "@/components/TrustSections";
import { createMetadata } from "@/lib/metadata";
import { onSiteEquipment } from "@/lib/calibration";
import { siteImages } from "@/lib/images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Capital Calibrations provides mobile ADAS calibration services to collision repair shops, dealerships, and mechanical shops in Ottawa, Ontario.",
  path: "/about",
  keywords: ["about Capital Calibrations", "mobile ADAS Ottawa", "ADAS technician"],
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow="About"
        title="Precision calibrations, delivered to your shop"
        description="Capital Calibrations was built for one purpose: help Ottawa-area repair facilities complete ADAS-equipped vehicles correctly, quickly, and with full documentation — without subletting or transport delays."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="carbon-frame lg:col-span-1">
          <div className="carbon-frame-inner">
            <Image
              src={siteImages.calibrationSetup}
              alt="ADAS calibration target setup with laser alignment"
              width={900}
              height={600}
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border lg:col-span-1">
          <Image
            src={siteImages.carMotion}
            alt="Modern vehicle representing advanced driver assistance technology"
            width={900}
            height={600}
            className="h-64 w-full object-cover object-left sm:h-80"
          />
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Mobile equipment"
          title="Fully equipped for on-site ADAS work"
          description="Our mobile unit carries everything needed to scan, calibrate, verify, and document ADAS systems at your facility."
        />
        <EquipmentStrip items={onSiteEquipment} className="mt-10" />
      </section>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Our mission</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Advanced Driver Assistance Systems are no longer optional on modern
            vehicles — they&apos;re integral to safety, insurance compliance, and
            customer satisfaction. When a calibration is missed or done incorrectly,
            shops face comebacks, liability exposure, and lost trust.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            We bring OEM-compliant calibration capability directly to your bay.
            That means faster cycle times, documented results, and a partner who
            understands the pressure collision and mechanical shops operate under.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Who we serve</h2>
          <ul className="mt-4 space-y-3">
            {[
              "Collision repair facilities",
              "Automotive dealerships",
              "Mechanical repair shops",
              "Fleet maintenance operations",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted">
                <span className="text-accent">→</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Whether you need a single calibration after a windshield replacement or
            ongoing support for ADAS-heavy repair volume, we scale to your needs.
          </p>
        </section>
      </div>

      <div className="mt-16">
        <Certifications />
      </div>

      <section className="mt-16 rounded-xl border border-border bg-surface-elevated p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          Ready to work together?
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Reach out to discuss your shop&apos;s ADAS workflow, typical repair
          volume, or a specific vehicle. We&apos;re available{" "}
          {siteConfig.hours.label.toLowerCase()}, {siteConfig.hours.time.toLowerCase()}.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact#book"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Book Appointment
          </Link>
          <a
            href={siteConfig.contact.phoneHref}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
          >
            {siteConfig.contact.phone}
          </a>
        </div>
      </section>

      <div className="mt-16">
        <ServiceArea />
      </div>

      <div className="mt-16">
        <CTA />
      </div>
    </div>
  );
}
