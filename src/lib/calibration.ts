export type EquipmentItem = {
  title: string;
  description: string;
  icon: "scan" | "targets" | "alignment" | "programming" | "documentation" | "mobile";
};

export const onSiteEquipment: EquipmentItem[] = [
  {
    title: "Diagnostic Scan Tools",
    description: "Pre-scan and post-scan capability with full DTC documentation.",
    icon: "scan",
  },
  {
    title: "Calibration Targets",
    description: "OEM-compliant static and dynamic targets for camera and radar systems.",
    icon: "targets",
  },
  {
    title: "Alignment Pre-Check",
    description: "Four-wheel alignment verification before ADAS calibration begins.",
    icon: "alignment",
  },
  {
    title: "OEM Programming",
    description: "Module updates and programming to restore factory ADAS functionality.",
    icon: "programming",
  },
  {
    title: "Calibration Reports",
    description: "Insurer-ready documentation for your shop files and customer delivery.",
    icon: "documentation",
  },
  {
    title: "Fully Mobile Unit",
    description: "Complete setup delivered to your bay — no vehicle transport required.",
    icon: "mobile",
  },
];

export type CalibrationTrigger = {
  repair: string;
  systems: string[];
  detail: string;
};

export const calibrationTriggers: CalibrationTrigger[] = [
  {
    repair: "Windshield replacement",
    systems: ["Forward camera", "Rain/light sensor"],
    detail: "Camera aim and ADAS feature verification after glass work.",
  },
  {
    repair: "Front bumper or grille repair",
    systems: ["Front radar", "Forward camera", "Parking sensors"],
    detail: "Common after collision damage to the front end.",
  },
  {
    repair: "Rear bumper or quarter panel",
    systems: ["Blind spot radar", "Rear cross-traffic", "Park assist"],
    detail: "Side and rear radar modules often require alignment.",
  },
  {
    repair: "Mirror replacement",
    systems: ["Blind spot monitoring", "Surround view"],
    detail: "Camera and radar housed in mirrors need calibration.",
  },
  {
    repair: "Structural / frame repair",
    systems: ["Multiple ADAS sensors"],
    detail: "Geometry changes can affect radar and camera alignment.",
  },
  {
    repair: "Wheel alignment or suspension work",
    systems: ["Steering angle", "Lane assist", "Forward ADAS"],
    detail: "Alignment pre-check and ADAS verification recommended.",
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  text: string;
  icon: "book" | "van" | "calibrate" | "report";
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Book",
    text: "Call, email, or submit the contact form with vehicle and repair details.",
    icon: "book",
  },
  {
    step: "02",
    title: "On-site visit",
    text: "Our mobile unit arrives at your shop with targets, tools, and scan equipment.",
    icon: "van",
  },
  {
    step: "03",
    title: "Calibrate & verify",
    text: "Pre/post scans, calibrations, and system checks per OEM requirements.",
    icon: "calibrate",
  },
  {
    step: "04",
    title: "Document & deliver",
    text: "Receive professional documentation for your files and customer delivery.",
    icon: "report",
  },
];
