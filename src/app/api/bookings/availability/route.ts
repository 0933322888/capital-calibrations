import { NextResponse } from "next/server";
import {
  SLOT_HOURS,
  getOttawaNow,
  isPastDate,
  isSlotInPast,
  isSunday,
  toIsoDate,
} from "@/lib/booking";
import {
  ensureBookingsSchema,
  getMysqlDebugInfo,
  getPool,
  logMysqlDebug,
  serializeError,
  type RowDataPacket,
} from "@/lib/db";

type BookedRow = RowDataPacket & {
  booking_date: string;
  slot_hour: number;
};

export async function GET(request: Request) {
  const requestId = `avail-${Date.now().toString(36)}`;
  const { searchParams } = new URL(request.url);
  const now = getOttawaNow();
  const year = Number(searchParams.get("year") || now.year);
  const month = Number(searchParams.get("month") || now.month);

  console.info(`[Bookings availability] ${requestId} start`, {
    url: request.url,
    year,
    month,
    ottawaNow: now,
    mysql: getMysqlDebugInfo(),
  });

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    year < now.year - 1 ||
    year > now.year + 2
  ) {
    console.warn(`[Bookings availability] ${requestId} invalid range`, { year, month });
    return NextResponse.json({ error: "Invalid year or month." }, { status: 400 });
  }

  try {
    logMysqlDebug(`${requestId} before ensureBookingsSchema`);
    await ensureBookingsSchema();
    logMysqlDebug(`${requestId} after ensureBookingsSchema`);

    const db = getPool();
    const start = toIsoDate(year, month, 1);
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = toIsoDate(endYear, endMonth, 1);

    console.info(`[Bookings availability] ${requestId} querying booked slots`, {
      start,
      end,
    });

    const [rows] = await db.query<BookedRow[]>(
      `SELECT booking_date, slot_hour
       FROM bookings
       WHERE booking_date >= ? AND booking_date < ?
         AND status <> 'cancelled'`,
      [start, end]
    );

    console.info(`[Bookings availability] ${requestId} query ok`, {
      bookedCount: rows.length,
      rows: rows.slice(0, 20),
    });

    const bookedByDate: Record<string, number[]> = {};
    for (const row of rows) {
      const dateKey =
        typeof row.booking_date === "string"
          ? row.booking_date.slice(0, 10)
          : String(row.booking_date).slice(0, 10);
      if (!bookedByDate[dateKey]) bookedByDate[dateKey] = [];
      bookedByDate[dateKey].push(Number(row.slot_hour));
    }

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const days: Array<{
      date: string;
      available: boolean;
      reason?: "sunday" | "past" | "full";
      slots: Array<{ hour: number; available: boolean }>;
    }> = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = toIsoDate(year, month, day);
      const booked = new Set(bookedByDate[date] || []);

      if (isSunday(date)) {
        days.push({
          date,
          available: false,
          reason: "sunday",
          slots: SLOT_HOURS.map((hour) => ({ hour, available: false })),
        });
        continue;
      }

      if (isPastDate(date, now)) {
        days.push({
          date,
          available: false,
          reason: "past",
          slots: SLOT_HOURS.map((hour) => ({ hour, available: false })),
        });
        continue;
      }

      const slots = SLOT_HOURS.map((hour) => ({
        hour,
        available: !booked.has(hour) && !isSlotInPast(date, hour, now),
      }));

      const hasOpenSlot = slots.some((slot) => slot.available);
      days.push({
        date,
        available: hasOpenSlot,
        reason: hasOpenSlot ? undefined : "full",
        slots,
      });
    }

    const availableDays = days.filter((day) => day.available).length;
    console.info(`[Bookings availability] ${requestId} success`, {
      daysInMonth,
      availableDays,
      bookedDates: Object.keys(bookedByDate).length,
    });

    return NextResponse.json({
      year,
      month,
      timeZone: "America/Toronto",
      slotHours: SLOT_HOURS,
      days,
      debug: {
        requestId,
        mysql: getMysqlDebugInfo(),
        bookedCount: rows.length,
        availableDays,
      },
    });
  } catch (error) {
    const serialized = serializeError(error);
    console.error(`[Bookings availability] ${requestId} failed`, {
      error: serialized,
      mysql: getMysqlDebugInfo(),
    });

    const code = serialized.code || "";
    const detail = serialized.message || "Unknown database error";

    let message =
      "Unable to load availability. Please try again shortly or call us at (613) 700-0191 to book your appointment.";

    if (code === "MISSING_ENV" || detail.includes("Missing required environment variable")) {
      message =
        "Booking database is not configured on the server. Add MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD in Hostinger environment variables, then restart the app.";
    } else if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT") {
      message =
        "Cannot connect to MySQL. On Hostinger, set MYSQL_HOST=127.0.0.1 (not localhost), confirm the database exists, and restart the Node app.";
    } else if (code === "ER_ACCESS_DENIED_ERROR") {
      message =
        "MySQL login failed. Set MYSQL_HOST=127.0.0.1 (avoids IPv6 ::1), and verify MYSQL_USER / MYSQL_PASSWORD in Hostinger env vars, then restart the app.";
    } else if (code === "ER_BAD_DB_ERROR") {
      message =
        "MySQL database not found. Check MYSQL_DATABASE in Hostinger environment variables.";
    }

    return NextResponse.json(
      {
        error: message,
        code: code || undefined,
        // Temporary diagnostics for Hostinger troubleshooting (no raw password)
        debug: {
          requestId,
          mysql: getMysqlDebugInfo(),
          error: serialized,
        },
      },
      { status: 500 }
    );
  }
}
