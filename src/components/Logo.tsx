import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/images";
import { siteConfig } from "@/lib/site";

type LogoProps = {
  className?: string;
  showText?: boolean;
  size?: "header" | "footer";
};

const sizeStyles = {
  header: {
    image: "h-14 w-14 sm:h-16 sm:w-16",
    imagePx: 64,
    name: "text-base sm:text-lg",
    tagline: "text-xs sm:text-sm",
    gap: "gap-3 sm:gap-4",
  },
  footer: {
    image: "h-16 w-16 sm:h-20 sm:w-20",
    imagePx: 80,
    name: "text-lg sm:text-xl",
    tagline: "text-sm sm:text-base",
    gap: "gap-4",
  },
} as const;

export function Logo({
  className = "",
  showText = true,
  size = "header",
}: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <Link
      href="/"
      className={`group flex items-center ${styles.gap} ${className}`}
    >
      <Image
        src={siteImages.logoEmblem}
        alt={`${siteConfig.name} logo`}
        width={styles.imagePx}
        height={styles.imagePx}
        className={`${styles.image} object-contain transition-transform group-hover:scale-105`}
        priority={size === "header"}
      />
      {showText && (
        <div className="leading-tight">
          <span
            className={`block font-semibold tracking-wide text-foreground ${styles.name}`}
          >
            {siteConfig.name}
          </span>
          <span className={`block text-muted ${styles.tagline}`}>
            {siteConfig.tagline}
          </span>
        </div>
      )}
    </Link>
  );
}
