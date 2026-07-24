export const siteConfig = {
  name: "Capital Calibrations",
  tagline: "Mobile ADAS Calibrations",
  description:
    "Professional mobile ADAS calibration services for collision repair shops, dealerships, and mechanical shops in Ottawa and surrounding areas.",
  url: "https://capitalcalibrations.ca",
  locale: "en_CA",
  contact: {
    email: "capitalcalibrations.inc@gmail.com",
    phone: "(613) 700-0191",
    phoneHref: "tel:+16137000191",
    emailHref: "mailto:capitalcalibrations.inc@gmail.com",
  },
  hours: {
    label: "Monday – Saturday",
    time: "8:00 AM – 6:00 PM",
  },
  serviceArea: [
    "Ottawa",
    "Kanata",
    "Nepean",
    "Orleans",
    "Gloucester",
    "Barrhaven",
    "Stittsville",
    "Gatineau",
    "Carleton Place",
    "Smiths Falls",
  ],
  certifications: [
    {
      title: "OEM-Compliant Procedures",
      description: "Calibrations performed to manufacturer specifications and documentation standards.",
    },
    {
      title: "Professional Documentation",
      description: "Detailed pre/post-scan reports and calibration records for your shop files.",
    },
    {
      title: "Mobile On-Site Service",
      description: "Fully equipped mobile unit — we come to your bay, minimizing vehicle downtime.",
    },
  ],
} as const;

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  benefits: string[];
  keywords: string[];
  icon: "radar" | "blindspot" | "parking" | "diagnostics";
};

export const services: Service[] = [
  {
    slug: "forward-radar-camera",
    title: "Forward Radar & Camera Calibration",
    shortDescription:
      "Restore adaptive cruise, forward collision warning, and lane assist after windshield or front-end repairs.",
    description:
      "Modern vehicles rely on forward-facing radar and camera systems for adaptive cruise control, automatic emergency braking, lane keeping assist, and traffic sign recognition. After windshield replacement, bumper repair, or structural alignment work, these systems require precise static or dynamic calibration to OEM standards. Capital Calibrations brings the targets, scan tools, and expertise directly to your shop.",
    features: [
      "Static and dynamic forward camera calibration",
      "Front radar sensor alignment and verification",
      "ADAS system health checks after collision repair",
      "Integration with pre-scan and post-scan workflows",
    ],
    benefits: [
      "Reduce comebacks from misaligned ADAS systems",
      "Meet insurer and OEM documentation requirements",
      "Keep vehicles in your shop instead of subletting",
      "Fast mobile response across the Ottawa region",
    ],
    keywords: [
      "forward camera calibration Ottawa",
      "radar calibration collision repair",
      "ADAS calibration mobile",
      "windshield replacement camera calibration",
    ],
    icon: "radar",
  },
  {
    slug: "blind-spot-monitoring",
    title: "Blind Spot Monitoring Calibration",
    shortDescription:
      "Calibrate side radar sensors for blind spot detection and rear cross-traffic alert systems.",
    description:
      "Blind spot monitoring and rear cross-traffic alert systems use rear corner radar modules that must be aimed and verified after body work, bumper replacement, or quarter panel repair. Improper calibration can cause false warnings or — worse — missed detections. Our mobile service ensures side radar systems are restored to factory specifications without transporting the vehicle off-site.",
    features: [
      "Rear corner radar calibration",
      "Blind spot detection system verification",
      "Rear cross-traffic alert alignment",
      "Post-repair functional testing",
    ],
    benefits: [
      "Accurate detection after structural repairs",
      "Documented calibration for liability protection",
      "On-site service at your collision or mechanical shop",
      "Compatible with major OEM ADAS platforms",
    ],
    keywords: [
      "blind spot calibration Ottawa",
      "side radar calibration",
      "rear cross traffic alert calibration",
      "BMS calibration collision shop",
    ],
    icon: "blindspot",
  },
  {
    slug: "parking-sensors",
    title: "Parking Sensors & Driver Assistance",
    shortDescription:
      "Ultrasonic sensor calibration and verification for parking assist and low-speed driver aids.",
    description:
      "Parking assistance systems use ultrasonic sensors integrated in bumpers and fascias. After paint work, bumper replacement, or sensor replacement, these systems need calibration and validation to avoid false alerts and ensure reliable obstacle detection. We verify sensor communication, alignment, and system functionality as part of a complete ADAS service.",
    features: [
      "Ultrasonic parking sensor calibration",
      "Park assist and surround view verification",
      "Sensor replacement programming",
      "Low-speed driver assistance checks",
    ],
    benefits: [
      "Eliminate false parking sensor warnings",
      "Complete repairs with confidence",
      "Single vendor for multiple ADAS services",
      "Mobile service reduces cycle time",
    ],
    keywords: [
      "parking sensor calibration Ottawa",
      "ultrasonic sensor calibration",
      "park assist calibration",
      "driver assistance calibration",
    ],
    icon: "parking",
  },
  {
    slug: "diagnostics",
    title: "ADAS Diagnostics & Pre/Post Scans",
    shortDescription:
      "Pre-scan and post-scan documentation, fault clearing, OEM programming, and alignment pre-checks.",
    description:
      "Complete ADAS workflows start with a thorough pre-scan to document system status before disassembly, and end with a post-scan confirming all modules and driver assistance features are functioning correctly. Capital Calibrations supports collision repair facilities with diagnostic scans, DTC clearing, OEM programming, and four-wheel alignment pre-checks — all from our mobile unit.",
    features: [
      "Pre-scan and post-scan reporting",
      "Fault code clearing and verification",
      "OEM module programming and updates",
      "Four-wheel alignment pre-check",
    ],
    benefits: [
      "Insurer-ready documentation",
      "Catch ADAS issues before delivery",
      "Streamline repair planning",
      "One mobile visit for scan + calibration",
    ],
    keywords: [
      "ADAS pre scan post scan Ottawa",
      "collision repair diagnostic scan",
      "OEM programming mobile",
      "wheel alignment pre-check ADAS",
    ],
    icon: "diagnostics",
  },
];

export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
