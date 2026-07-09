import Image from "next/image";
import { certificationBadges } from "@/lib/images";
import { siteConfig } from "@/lib/site";

export function ServiceArea() {
  return (
    <section className="carbon-weave carbon-panel rounded-xl p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-foreground">Service Area</h3>
      <p className="mt-2 text-sm text-muted">
        Mobile ADAS calibrations throughout Ottawa and surrounding communities.
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {siteConfig.serviceArea.map((area) => (
          <li
            key={area}
            className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-muted backdrop-blur-sm"
          >
            {area}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CertificationBadges() {
  return (
    <section>
      <h3 className="text-lg font-semibold text-foreground">
        Certifications &amp; Equipment
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {certificationBadges.map((badge) => (
          <div
            key={badge.name}
            className={`relative h-32 overflow-hidden rounded-xl border border-border sm:h-36 ${
              badge.lightBackground ? "bg-white" : ""
            }`}
          >
            <Image
              src={badge.image}
              alt={badge.alt}
              fill
              className={
                badge.lightBackground ? "object-contain p-5" : "object-cover"
              }
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section className="space-y-10">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Why Shops Trust Us
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {siteConfig.certifications.map((cert) => (
            <div
              key={cert.title}
              className="carbon-weave carbon-panel rounded-xl p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M9 12l2 2 4-4M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="mt-4 text-sm font-semibold text-foreground">
                {cert.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <CertificationBadges />
    </section>
  );
}

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6 carbon-weave carbon-panel">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Phone
        </h3>
        <a
          href={siteConfig.contact.phoneHref}
          className="mt-2 block text-xl font-semibold text-foreground transition-colors hover:text-accent"
        >
          {siteConfig.contact.phone}
        </a>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 carbon-weave carbon-panel">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Email
        </h3>
        <a
          href={siteConfig.contact.emailHref}
          className="mt-2 block text-base text-foreground transition-colors hover:text-accent break-all"
        >
          {siteConfig.contact.email}
        </a>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 carbon-weave carbon-panel">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Hours
        </h3>
        <p className="mt-2 text-foreground">{siteConfig.hours.label}</p>
        <p className="text-muted">{siteConfig.hours.time}</p>
      </div>
    </div>
  );
}
