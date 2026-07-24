import { NextResponse } from "next/server";
import { isValidBookingSlot } from "@/lib/booking";
import {
  ensureBookingsSchema,
  getMysqlDebugInfo,
  getPool,
  logMysqlDebug,
  serializeError,
  type ResultSetHeader,
} from "@/lib/db";
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
  const requestId = `book-${Date.now().toString(36)}`;
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

  console.info(`[Booking create] ${requestId} start`, {
    bookingDate,
    slotHour,
    hasName: Boolean(fullName),
    hasEmail: Boolean(email),
    hasPhone: Boolean(phone),
    mysql: getMysqlDebugInfo(),
  });

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
    console.warn(`[Booking create] ${requestId} invalid slot`, {
      bookingDate,
      slotHour,
    });
    return NextResponse.json(
      {
        error: "That date or time slot is not available.",
        debug: { requestId, bookingDate, slotHour },
      },
      { status: 400 }
    );
  }

  let bookingId: number | null = null;

  try {
    logMysqlDebug(`${requestId} before ensureBookingsSchema`);
    await ensureBookingsSchema();
    logMysqlDebug(`${requestId} after ensureBookingsSchema`);

    const db = getPool();

    console.info(`[Booking create] ${requestId} inserting`, {
      bookingDate,
      slotHour,
    });

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO bookings (full_name, email, phone, booking_date, slot_hour, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [fullName, email, phone || null, bookingDate, slotHour]
    );

    bookingId = result.insertId;
    console.info(`[Booking create] ${requestId} insert ok`, { bookingId });
  } catch (error) {
    const serialized = serializeError(error);
    console.error(`[Booking create] ${requestId} insert failed`, {
      error: serialized,
      mysql: getMysqlDebugInfo(),
    });

    if (serialized.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          error: "That time slot was just booked. Please choose another.",
          debug: { requestId, error: serialized },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Unable to save your booking. Please try again shortly.",
        code: serialized.code,
        debug: {
          requestId,
          stage: "insert",
          mysql: getMysqlDebugInfo(),
          error: serialized,
          bookingDate,
          slotHour,
        },
      },
      { status: 500 }
    );
  }

  // Email must not fail the booking once it is persisted.
  let emailSent = false;
  let emailNote: string | undefined;

  try {
    console.info(`[Booking create] ${requestId} sending emails`);
    const emailResult = await sendBookingEmails({
      fullName,
      email,
      phone: phone || null,
      bookingDate,
      slotHour,
    });
    emailSent = emailResult.sent;
    emailNote = emailResult.reason;
    console.info(`[Booking create] ${requestId} email result`, emailResult);
  } catch (error) {
    const serialized = serializeError(error);
    console.error(`[Booking create] ${requestId} email failed`, {
      error: serialized,
      bookingId,
    });
    emailNote = `Booking saved, but email failed: ${serialized.message}`;
  }

  return NextResponse.json({
    success: true,
    bookingId,
    emailSent,
    emailNote,
    debug: { requestId },
  });
}
