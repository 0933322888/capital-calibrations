"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteImages } from "@/lib/images";
import { siteConfig } from "@/lib/site";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setIntensity(0.75);
      return;
    }

    let rafId = 0;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollIntoHero = Math.max(0, -rect.top);
      const range = Math.max(section.offsetHeight * 0.42, 280);
      const raw = clamp(scrollIntoHero / range, 0, 1);
      setIntensity(easeOutCubic(raw));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const glow = intensity;
  const beamOpacity = glow * 0.9;
  const scanOpacity = clamp((intensity - 0.35) / 0.65, 0, 1);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border"
    >
      <Image
        src={siteImages.heroBackground}
        alt="Mobile ADAS calibration van and equipment ready for on-site shop service"
        fill
        priority
        className="object-cover object-right"
        sizes="100vw"
      />

      <div
        className="headlight-layer absolute inset-0 z-[1] mix-blend-screen"
        aria-hidden="true"
        style={{ opacity: glow > 0.02 ? 1 : 0 }}
      >
        <div
          className="headlight-beam headlight-beam-primary absolute origin-right"
          style={{
            width: "min(82vw, 1040px)",
            height: "clamp(140px, 26vh, 300px)",
            opacity: beamOpacity,
          }}
        />
        <div
          className="headlight-beam headlight-beam-secondary absolute origin-right"
          style={{
            width: "min(62vw, 760px)",
            height: "clamp(100px, 18vh, 190px)",
            opacity: beamOpacity * 0.75,
          }}
        />
        <div
          className="headlight-beam headlight-beam-tertiary absolute origin-right"
          style={{
            width: "min(40vw, 520px)",
            height: "clamp(60px, 10vh, 120px)",
            opacity: beamOpacity * 0.5,
          }}
        />

        <div
          className={`headlight-halo headlight-halo-ellipse absolute ${glow > 0.5 ? "headlight-flicker" : ""}`}
          style={{
            width: "clamp(72px, 8vw, 110px)",
            height: "clamp(28px, 3.2vw, 44px)",
            opacity: glow,
          }}
        />
        <div
          className={`headlight-core headlight-core-ellipse absolute ${glow > 0.5 ? "headlight-flicker" : ""}`}
          style={{
            width: "clamp(28px, 3vw, 42px)",
            height: "clamp(14px, 1.6vw, 20px)",
            opacity: glow,
          }}
        />

        <div
          className="headlight-ambient absolute inset-y-0 right-0 w-3/5"
          style={{ opacity: glow * 0.65 }}
        />

        {scanOpacity > 0 && (
          <div
            className="adas-scan adas-scan-pos absolute"
            style={{ opacity: scanOpacity }}
          />
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-background via-background/92 to-background/20 transition-[opacity] duration-300"
        style={{ opacity: 1 - glow * 0.38 }}
      />
      <div className="pointer-events-none absolute inset-0 z-[2] grid-pattern opacity-10" />

      <div className="relative z-[3] mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Ottawa &amp; Surrounding Areas
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Mobile ADAS Calibrations — Precision On-Site, Faster Turnaround
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Capital Calibrations delivers OEM-compliant ADAS calibrations and
          diagnostics directly to collision repair facilities, dealerships, and
          mechanical shops. Professional documentation. Fast response. No
          subletting.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact#book"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover glow-accent"
          >
            Book Your Calibration
          </Link>
          <Link
            href="/services"
            className="carbon-btn rounded-lg px-6 py-3 text-sm font-medium text-foreground"
          >
            View Services
          </Link>
        </div>
        <dl className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Service model", value: "Fully mobile — we come to your bay" },
            { label: "Coverage", value: "Ottawa & 9+ surrounding communities" },
            { label: "Hours", value: `${siteConfig.hours.label}, ${siteConfig.hours.time}` },
          ].map((item) => (
            <div
              key={item.label}
              className="carbon-weave carbon-panel rounded-xl p-5 backdrop-blur-sm"
            >
              <dt className="text-xs uppercase tracking-wider text-muted">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm font-medium text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <p
          className="mt-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted transition-opacity duration-500 sm:text-xs"
          style={{ opacity: intensity < 0.1 ? 0.7 : 0 }}
          aria-hidden={intensity >= 0.1}
        >
          <span className="inline-block h-px w-6 bg-accent/50" />
          Scroll to illuminate
          <span className="headlight-scroll-cue inline-block">↓</span>
        </p>
      </div>
    </section>
  );
}
