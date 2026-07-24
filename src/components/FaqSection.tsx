import { faqs } from "@/lib/faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";

export function FaqSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FaqJsonLd />
      <SectionHeading
        eyebrow="FAQ"
        title="ADAS calibration questions shops ask"
        description="Quick answers about when calibration is required, how mobile service works, and what documentation you receive."
      />
      <div className="mt-10 space-y-3">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-border bg-surface px-5 py-4 open:border-accent/40"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                <span>{item.question}</span>
                <span
                  className="mt-0.5 shrink-0 text-accent transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
