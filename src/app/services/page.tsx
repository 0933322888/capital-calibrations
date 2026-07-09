import type { Metadata } from "next";
import Link from "next/link";
import { CalibrationTriggers } from "@/components/CalibrationTriggers";
import { CTA } from "@/components/CTA";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { ServicesBanner } from "@/components/ServicesBanner";
import { calibrationTriggers } from "@/lib/calibration";
import { createMetadata } from "@/lib/metadata";
import { services } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "ADAS Calibration Services",
  description:
    "Mobile ADAS calibration services in Ottawa: forward radar & camera, blind spot monitoring, parking sensors, pre/post scans, and OEM programming.",
  path: "/services",
  keywords: [
    "ADAS services Ottawa",
    "mobile calibration services",
    "collision repair calibrations",
  ],
});

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <ServicesBanner />

      <div className="mt-16">
        <SectionHeading
          eyebrow="Services"
          title="Mobile ADAS calibration & diagnostic services"
          description="Each service is performed on-site at your shop with OEM-compliant procedures and full documentation. Select a service to learn more."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>

      <div className="mt-20">
        <CalibrationTriggers triggers={calibrationTriggers} showCta={false} />
      </div>

      <section className="mt-16 carbon-weave carbon-panel rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          Not sure which calibration you need?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          ADAS requirements vary by vehicle, repair type, and OEM. A windshield
          replacement may need forward camera calibration; a rear bumper repair
          may require blind spot radar alignment. Contact us with the VIN and
          repair order — we&apos;ll confirm the required procedures.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          Get in touch →
        </Link>
      </section>

      <div className="mt-16">
        <CTA />
      </div>
    </div>
  );
}
