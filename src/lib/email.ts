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

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
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
}> {
  if (!smtpConfigured()) {
    return {
      sent: false,
      reason: "SMTP is not configured yet. Booking was saved successfully.",
    };
  }

  const transporter = getTransporter();
  const fromAddress = process.env.SMTP_USER!;
  const notifyTo =
    process.env.BOOKING_NOTIFY_EMAIL?.trim() || siteConfig.contact.email;
  const when = `${formatDateLabel(payload.bookingDate)} at ${formatSlotLabel(payload.slotHour)}`;

  await transporter.sendMail({
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

  await transporter.sendMail({
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

  return { sent: true };
}
