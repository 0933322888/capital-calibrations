export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "When does a vehicle need ADAS calibration?",
    answer:
      "Calibration is typically required after windshield replacement, bumper or radar bracket repairs, structural/frame work, suspension or alignment changes that affect ride height, camera or sensor replacement, and whenever a scan shows ADAS-related faults. If OEM procedures call for static or dynamic calibration after a repair, it should be completed before the vehicle is returned to the customer.",
  },
  {
    question: "Do you come to our shop, or do we bring the vehicle to you?",
    answer:
      "Capital Calibrations is a mobile service. We bring scan tools, targets, and documentation equipment to your collision, mechanical, or dealership bay across Ottawa and surrounding areas — so you avoid transport delays and keep the vehicle in your workflow.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Ottawa and nearby communities including Kanata, Nepean, Orleans, Gloucester, Barrhaven, Stittsville, Gatineau, Carleton Place, and Smiths Falls. If your shop is outside this list, contact us — we often cover additional locations in the region.",
  },
  {
    question: "What documentation do we receive after a calibration?",
    answer:
      "Every visit includes professional documentation suitable for shop files and insurer requirements, including pre-scan and post-scan records where applicable, and calibration reports confirming the work performed to OEM procedures.",
  },
  {
    question: "How do I book a mobile calibration?",
    answer:
      "You can book online through our contact page calendar, call (613) 700-0191, or email capitalcalibrations.inc@gmail.com. We are available Monday–Saturday, 8:00 AM–6:00 PM.",
  },
  {
    question: "Which ADAS systems can you calibrate?",
    answer:
      "We perform forward radar and camera calibration, blind spot monitoring / side radar calibration, parking sensor and driver-assistance verification, plus ADAS diagnostics with pre/post scans, fault clearing, and alignment pre-checks as needed for the repair.",
  },
];
