export const siteImages = {
  logoEmblem: "/images/section-image.png",
  logoFull: "/images/secondary-image.png",
  heroBackground: "/images/about-hero.png",
  calibrationSetup: "/images/about-1.png",
  carMotion: "/images/about-2.png",
  patternBackground: "/images/logo.png",
  certifications: {
    hunterAdas: "/images/about-3.png",
    autel: "/images/about-4.png",
    icar: "/images/icar-certification.png",
  },
} as const;

export const certificationBadges = [
  {
    name: "Hunter ADAS Training Certified",
    image: siteImages.certifications.hunterAdas,
    alt: "Hunter Engineering Company Certified ADAS Training",
    lightBackground: false,
  },
  {
    name: "Autel Equipment",
    image: siteImages.certifications.autel,
    alt: "Autel diagnostic and calibration equipment",
    lightBackground: false,
  },
  {
    name: "I-CAR Training",
    image: siteImages.certifications.icar,
    alt: "I-CAR industry training certification",
    lightBackground: true,
  },
] as const;
