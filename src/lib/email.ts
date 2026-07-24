import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site";
import { formatDateLabel, formatSlotLabel } from "@/lib/booking";

export type BookingEmailPayload = {
  fullName: string;
  email: string;
  phone?: string | null;
  bookingDate: string;
  slotHour: number;
};

function maskSecret(value: string | undefined): string {
  if (!value) return "(empty)";
  if (value.length <= 2) return "*".repeat(value.length);
  return `${value.slice(0, 1)}${"*".repeat(Math.min(value.length - 2, 8))}${value.slice(-1)}`;
}

function getSmtpDebugInfo() {
  const host = process.env.SMTP_HOST?.trim() || "(missing)";
  const port = process.env.SMTP_PORT?.trim() || "(default: 587)";
  const user = process.env.SMTP_USER?.trim() || "(missing)";
  const pass = process.env.SMTP_PASS?.trim();
  const notifyTo =
    process.env.BOOKING_NOTIFY_EMAIL?.trim() || siteConfig.contact.email;

  return {
    host,
    port,
    user,
    passwordSet: Boolean(pass),
    passwordMasked: maskSecret(pass),
    notifyTo,
    configured: Boolean(
      process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim()
    ),
  };
}

function smtpConfigured(): boolean {
  return getSmtpDebugInfo().configured;
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function bookingSummary(payload: BookingEmailPayload): string {
  const phone = payload.phone?.trim() || "Not provided";
  return [
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${phone}`,
    `Date: ${formatDateLabel(payload.bookingDate)}`,
    `Time: ${formatSlotLabel(payload.slotHour)}`,
  ].join("\n");
}

export async function sendBookingEmails(payload: BookingEmailPayload): Promise<{
  sent: boolean;
  reason?: string;
  customerMessageId?: string;
  ownerMessageId?: string;
  smtp?: ReturnType<typeof getSmtpDebugInfo>;
}> {
  const smtp = getSmtpDebugInfo();
  console.info("[Booking email] start", {
    toCustomer: payload.email,
    smtp,
    booking: {
      date: payload.bookingDate,
      slotHour: payload.slotHour,
      fullName: payload.fullName,
    },
  });

  if (!smtpConfigured()) {
    console.warn("[Booking email] SKIPPED — SMTP not fully configured", {
      missing: [
        !process.env.SMTP_HOST?.trim() && "SMTP_HOST",
        !process.env.SMTP_USER?.trim() && "SMTP_USER",
        !process.env.SMTP_PASS?.trim() && "SMTP_PASS",
      ].filter(Boolean),
      smtp,
      summary: bookingSummary(payload),
    });
    return {
      sent: false,
      reason: "SMTP is not configured yet. Booking was saved successfully.",
      smtp,
    };
  }

  const transporter = getTransporter();
  const fromAddress = process.env.SMTP_USER!;
  const notifyTo = smtp.notifyTo;
  const when = `${formatDateLabel(payload.bookingDate)} at ${formatSlotLabel(payload.slotHour)}`;

  console.info("[Booking email] sending customer confirmation", {
    from: fromAddress,
    to: payload.email,
    subject: `Booking confirmation — ${siteConfig.name}`,
  });

  const customerResult = await transporter.sendMail({
    from: `"${siteConfig.name}" <${fromAddress}>`,
    to: payload.email,
    subject: `Booking confirmation — ${siteConfig.name}`,
    text: [
      `Hi ${payload.fullName},`,
      "",
      `Thanks for booking with ${siteConfig.name}.`,
      `Your requested appointment is:`,
      "",
      when,
      "",
      "We will confirm this booking shortly. If you need to make changes, reply to this email or call us.",
      "",
      `Phone: ${siteConfig.contact.phone}`,
      `Email: ${siteConfig.contact.email}`,
      "",
      `— ${siteConfig.name}`,
    ].join("\n"),
  });

  console.info("[Booking email] customer confirmation SENT", {
    to: payload.email,
    messageId: customerResult.messageId,
    response: customerResult.response,
    accepted: customerResult.accepted,
    rejected: customerResult.rejected,
  });

  console.info("[Booking email] sending owner notification", {
    from: fromAddress,
    to: notifyTo,
    subject: `New booking request — ${when}`,
  });

  const ownerResult = await transporter.sendMail({
    from: `"${siteConfig.name} Bookings" <${fromAddress}>`,
    to: notifyTo,
    replyTo: payload.email,
    subject: `New booking request — ${when}`,
    text: [
      "A new calibration booking was submitted:",
      "",
      bookingSummary(payload),
      "",
      "Please follow up to confirm the appointment.",
    ].join("\n"),
  });

  console.info("[Booking email] owner notification SENT", {
    to: notifyTo,
    messageId: ownerResult.messageId,
    response: ownerResult.response,
    accepted: ownerResult.accepted,
    rejected: ownerResult.rejected,
  });

  console.info("[Booking email] BOTH emails sent successfully", {
    customerMessageId: customerResult.messageId,
    ownerMessageId: ownerResult.messageId,
  });

  return {
    sent: true,
    customerMessageId: customerResult.messageId,
    ownerMessageId: ownerResult.messageId,
    smtp,
  };
}
