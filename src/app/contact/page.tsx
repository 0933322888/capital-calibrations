import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactInfo, ServiceArea } from "@/components/TrustSections";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact & Book Appointment",
  description:
    "Contact Capital Calibrations for mobile ADAS calibration in Ottawa. Call (613) 700-0191 or book an available time online.",
  path: "/contact",
  keywords: [
    "book ADAS calibration Ottawa",
    "Capital Calibrations contact",
    "mobile calibration appointment",
  ],
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Book a calibration or ask a question"
        description="Pick an available day and time below, or call or email during business hours if you prefer to talk now."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BookingForm />
        </div>
        <div className="lg:col-span-2">
          <ContactInfo />
        </div>
      </div>

      <div className="mt-16">
        <ServiceArea />
      </div>
    </div>
  );
}
