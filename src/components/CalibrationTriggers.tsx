import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import type { CalibrationTrigger } from "@/lib/calibration";

type CalibrationTriggersProps = {
  triggers: CalibrationTrigger[];
  showCta?: boolean;
  className?: string;
};

export function CalibrationTriggers({
  triggers,
  showCta = true,
  className = "",
}: CalibrationTriggersProps) {
  return (
    <section className={className}>
      <SectionHeading
        eyebrow="When is calibration required?"
        title="Common repair triggers"
        description="ADAS requirements vary by vehicle and OEM. These are the most frequent repair scenarios that require calibration or verification."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {triggers.map((trigger) => (
          <article
            key={trigger.repair}
            className="carbon-weave carbon-panel rounded-xl p-5 sm:p-6"
          >
            <h3 className="font-semibold text-foreground">{trigger.repair}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {trigger.systems.map((system) => (
                <li
                  key={system}
                  className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
                >
                  {system}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">{trigger.detail}</p>
          </article>
        ))}
      </div>
      {showCta && (
        <p className="mt-8 text-sm text-muted">
          Not sure what your vehicle needs?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Send us the VIN and repair order
          </Link>{" "}
          — we&apos;ll confirm the required procedures.
        </p>
      )}
    </section>
  );
}
