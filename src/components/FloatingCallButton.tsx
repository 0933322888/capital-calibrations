import { siteConfig } from "@/lib/site";

export function FloatingCallButton() {
  return (
    <a
      href={siteConfig.contact.phoneHref}
      aria-label={`Call ${siteConfig.name} at ${siteConfig.contact.phone}`}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-accent/30 transition-transform hover:scale-105 hover:bg-accent-hover active:scale-95 md:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
