import type { ProcessStep } from "@/lib/calibration";

const stepIcons: Record<ProcessStep["icon"], React.ReactNode> = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 5h14v14H5zM8 9h8M8 13h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  van: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M2 12h12l2 3h6V9h-5l-2 3H2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="17" r="1.5" fill="currentColor" />
      <circle cx="18" cy="17" r="1.5" fill="currentColor" />
    </svg>
  ),
  calibrate: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  report: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 4h7l4 4v12H7V4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 4v4h4M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

type ProcessStepsProps = {
  steps: readonly ProcessStep[];
  activeIndex?: number;
  onStepRef?: (index: number, el: HTMLLIElement | null) => void;
};

export function ProcessSteps({ steps, activeIndex = -1, onStepRef }: ProcessStepsProps) {
  return (
    <ol className="space-y-4">
      {steps.map((item, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;

        return (
          <li
            key={item.step}
            ref={(el) => onStepRef?.(index, el)}
            className={`carbon-weave carbon-panel flex gap-4 rounded-xl p-5 transition-opacity duration-300 ${
              isActive
                ? "border-accent/50 opacity-100 ring-1 ring-accent/30"
                : isComplete
                  ? "opacity-70"
                  : "opacity-45"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className={`font-mono text-sm transition-colors duration-300 ${
                  isActive || isComplete ? "text-accent" : "text-muted"
                }`}
              >
                {item.step}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-300 ${
                  isActive
                    ? "border-accent/60 bg-accent/20 text-accent"
                    : isComplete
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border bg-surface-elevated text-muted"
                }`}
              >
                {stepIcons[item.icon]}
              </div>
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold transition-colors duration-300 ${
                  isActive ? "text-accent" : "text-foreground"
                }`}
              >
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
