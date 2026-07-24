"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SectionHeading } from "@/components/SectionHeading";
import type { ProcessStep } from "@/lib/calibration";
import { siteImages } from "@/lib/images";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getInterpolatedPosition(centers: number[], progress: number) {
  if (centers.length === 0) return 0;
  if (centers.length === 1) return centers[0];

  const scaled = progress * (centers.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(lower + 1, centers.length - 1);
  const t = scaled - lower;
  return lerp(centers[lower], centers[upper], t);
}

function MovingCar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 32"
      className={`h-8 w-16 drop-shadow-[0_0_12px_rgba(0,180,216,0.6)] sm:h-10 sm:w-20 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M4 20h8l3-6h14l3 6h10v-4H42l-3-7H17l-3 7H4v4z"
        fill="currentColor"
        className="text-foreground"
      />
      <path
        d="M22 9h12l2 4H20l2-4z"
        fill="currentColor"
        className="text-accent"
        opacity="0.9"
      />
      <circle cx="14" cy="22" r="3.5" fill="#0a0d12" stroke="currentColor" strokeWidth="1.5" className="text-muted" />
      <circle cx="48" cy="22" r="3.5" fill="#0a0d12" stroke="currentColor" strokeWidth="1.5" className="text-muted" />
      <circle cx="14" cy="22" r="1.5" fill="currentColor" className="text-accent" />
      <circle cx="48" cy="22" r="1.5" fill="currentColor" className="text-accent" />
      <rect x="38" y="11" width="6" height="3" rx="0.5" fill="currentColor" className="text-accent/80" />
    </svg>
  );
}

type HowItWorksSectionProps = {
  steps: readonly ProcessStep[];
};

export function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stepCentersRef = useRef<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carTop, setCarTop] = useState(0);
  const [trackFill, setTrackFill] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const registerStepRef = useCallback((index: number, el: HTMLLIElement | null) => {
    stepRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const measureStepCenters = () => {
      const journey = journeyRef.current;
      const refs = stepRefs.current;
      if (!journey || refs.some((ref) => !ref)) return false;

      const journeyRect = journey.getBoundingClientRect();
      stepCentersRef.current = refs.map((ref) => {
        const rect = ref!.getBoundingClientRect();
        return rect.top + rect.height / 2 - journeyRect.top;
      });
      return true;
    };

    const applyProgress = (raw: number) => {
      if (!measureStepCenters()) return;

      const centers = stepCentersRef.current;
      const position = getInterpolatedPosition(centers, raw);
      const nearestIndex =
        steps.length > 1
          ? Math.round(raw * (steps.length - 1))
          : 0;

      setProgress(raw);
      setActiveIndex(nearestIndex);
      setCarTop(position - 20);
      setTrackFill(position);
    };

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      applyProgress(raw);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const journey = journeyRef.current;
    const resizeObserver =
      journey && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onScroll)
        : null;
    if (journey && resizeObserver) resizeObserver.observe(journey);

    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver?.disconnect();
    };
  }, [steps.length]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative mt-20 sm:mt-24"
      style={{ height: `${100 + steps.length * 40}vh` }}
      aria-label="How it works"
    >
      <div className="sticky top-20 mx-auto max-w-6xl px-4 sm:px-6 lg:top-24">
        <SectionHeading
          eyebrow="How it works"
          title="Simple process, minimal downtime"
          description="We integrate into your existing workflow — no need to transport vehicles off-site or wait on third-party scheduling."
        />

        <div className="relative mt-12 overflow-hidden rounded-2xl border border-border">
          <div className="how-it-works-road absolute inset-0" aria-hidden="true">
            <Image
              src={siteImages.carMotion}
              alt="Vehicle in motion representing on-site mobile ADAS calibration workflow"
              fill
              className="object-cover object-left opacity-[0.12]"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
            <div className="absolute inset-0 grid-pattern opacity-20" />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="relative mb-8 lg:hidden" aria-hidden="true">
              <div className="relative h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent will-change-[width]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 will-change-[left]"
                style={{
                  left: `clamp(0px, calc(${progress * 100}% - 24px), calc(100% - 48px))`,
                }}
              >
                <MovingCar className="h-6 w-12" />
              </div>
              <div className="mt-6 flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted">
                {steps.map((step, index) => (
                  <span
                    key={step.step}
                    className={index <= activeIndex ? "text-accent" : ""}
                  >
                    {step.step}
                  </span>
                ))}
              </div>
            </div>

            <div ref={journeyRef} className="relative flex gap-4 sm:gap-6">
              <div className="relative hidden w-14 shrink-0 lg:block" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded-full bg-border" />
                <div
                  className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 rounded-full bg-accent will-change-[height]"
                  style={{ height: trackFill }}
                />
                {!reducedMotion && (
                  <div
                    className="absolute left-1/2 z-10 -translate-x-1/2 will-change-[top]"
                    style={{ top: carTop }}
                  >
                    <MovingCar />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <ProcessSteps
                  steps={steps}
                  activeIndex={activeIndex}
                  onStepRef={registerStepRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
