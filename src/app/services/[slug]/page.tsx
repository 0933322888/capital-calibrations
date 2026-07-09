import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTA } from "@/components/CTA";
import { createMetadata } from "@/lib/metadata";
import { getServiceBySlug, services } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return createMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/services" className="hover:text-accent">
          Services
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{service.title}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Mobile ADAS Service
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {service.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {service.shortDescription}
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-foreground">Overview</h2>
            <p className="mt-4 leading-relaxed text-muted">{service.description}</p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-foreground">
              What&apos;s included
            </h2>
            <ul className="mt-4 space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Benefits for your shop
            </h2>
            <ul className="mt-4 space-y-3">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 rounded-xl border border-accent/30 bg-surface-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Schedule this service
            </h2>
            <p className="mt-2 text-sm text-muted">
              Mobile service available Monday–Saturday across Ottawa and
              surrounding areas.
            </p>
            <Link
              href="/contact#book"
              className="mt-5 block rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              Book Appointment
            </Link>
            <Link
              href="/contact"
              className="mt-3 block text-center text-sm text-accent hover:underline"
            >
              Contact us
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Other services
            </h3>
            <ul className="mt-4 space-y-2">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <CTA
          title={`Need ${service.title.toLowerCase()}?`}
          description="Get a fast response and on-site service at your shop. Call or submit a booking request today."
        />
      </div>
    </article>
  );
}
