import { NextResponse } from "next/server";
import { isValidBookingSlot } from "@/lib/booking";
import { ensureBookingsSchema, getPool, type ResultSetHeader } from "@/lib/db";
import { sendBookingEmails } from "@/lib/email";

type BookingPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  bookingDate?: string;
  slotHour?: number;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: BookingPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  const phone = body.phone?.trim() || "";
  const bookingDate = body.bookingDate?.trim() || "";
  const slotHour = Number(body.slotHour);

  if (!fullName || !email || !bookingDate || !Number.isInteger(slotHour)) {
    return NextResponse.json(
      { error: "Full name, email, date, and time slot are required." },
      { status: 400 }
    );
  }

  if (fullName.length > 120) {
    return NextResponse.json({ error: "Full name is too long." }, { status: 400 });
  }

  if (!isValidEmail(email) || email.length > 190) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (phone && phone.length > 40) {
    return NextResponse.json({ error: "Phone number is too long." }, { status: 400 });
  }

  if (!isValidBookingSlot(bookingDate, slotHour)) {
    return NextResponse.json(
      { error: "That date or time slot is not available." },
      { status: 400 }
    );
  }

  let bookingId: number | null = null;

  try {
    await ensureBookingsSchema();
    const db = getPool();

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO bookings (full_name, email, phone, booking_date, slot_hour, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [fullName, email, phone || null, bookingDate, slotHour]
    );

    bookingId = result.insertId;
  } catch (error) {
    const mysqlError = error as { code?: string };
    if (mysqlError.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "That time slot was just booked. Please choose another." },
        { status: 409 }
      );
    }

    console.error("[Booking create]", error);
    return NextResponse.json(
      { error: "Unable to save your booking. Please try again shortly." },
      { status: 500 }
    );
  }

  let emailSent = false;
  let emailNote: string | undefined;

  try {
    const emailResult = await sendBookingEmails({
      fullName,
      email,
      phone: phone || null,
      bookingDate,
      slotHour,
    });
    emailSent = emailResult.sent;
    emailNote = emailResult.reason;
  } catch (error) {
    console.error("[Booking email]", error);
    emailNote = "Booking saved, but confirmation email could not be sent.";
  }

  return NextResponse.json({
    success: true,
    bookingId,
    emailSent,
    emailNote,
  });
}
