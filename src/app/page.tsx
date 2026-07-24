import { CalibrationTriggers } from "@/components/CalibrationTriggers";
import { CTA } from "@/components/CTA";
import { EquipmentStrip } from "@/components/EquipmentStrip";
import { FaqSection } from "@/components/FaqSection";
import { HomeHero } from "@/components/HomeHero";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Certifications, ServiceArea } from "@/components/TrustSections";
import {
  calibrationTriggers,
  onSiteEquipment,
  processSteps,
} from "@/lib/calibration";
import { services } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Services"
          title="Complete mobile ADAS calibration & diagnostics"
          description="From forward radar and camera alignment to blind spot systems and pre/post scans — one mobile visit keeps your shop moving."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="carbon-weave border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="On-site capability"
            title="What we bring to your bay"
            description="A fully equipped mobile ADAS unit — scan tools, targets, alignment checks, and documentation included in every visit."
          />
          <EquipmentStrip items={onSiteEquipment} className="mt-12" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <CalibrationTriggers triggers={calibrationTriggers} />
      </section>

      <section className="carbon-weave border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Why Capital Calibrations"
            title="Built for shops that can't afford ADAS comebacks"
            description="Every calibration is documented. Every system is verified. Your customers leave with confidence — and your shop stays in control of the repair."
          />
          <div className="mt-12">
            <Certifications />
          </div>
        </div>
      </section>

      <HowItWorksSection steps={processSteps} />

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <ServiceArea />
      </section>

      <FaqSection />

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <CTA />
      </section>
    </>
  );
}
