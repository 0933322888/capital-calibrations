import { NextResponse } from "next/server";
import {
  SLOT_HOURS,
  getOttawaNow,
  isPastDate,
  isSlotInPast,
  isSunday,
  toIsoDate,
} from "@/lib/booking";
import { ensureBookingsSchema, getPool, type RowDataPacket } from "@/lib/db";

type BookedRow = RowDataPacket & {
  booking_date: string;
  slot_hour: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = getOttawaNow();
  const year = Number(searchParams.get("year") || now.year);
  const month = Number(searchParams.get("month") || now.month);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    year < now.year - 1 ||
    year > now.year + 2
  ) {
    return NextResponse.json({ error: "Invalid year or month." }, { status: 400 });
  }

  try {
    await ensureBookingsSchema();
    const db = getPool();
    const start = toIsoDate(year, month, 1);
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = toIsoDate(endYear, endMonth, 1);

    const [rows] = await db.query<BookedRow[]>(
      `SELECT booking_date, slot_hour
       FROM bookings
       WHERE booking_date >= ? AND booking_date < ?
         AND status <> 'cancelled'`,
      [start, end]
    );

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

    return NextResponse.json({
      year,
      month,
      timeZone: "America/Toronto",
      slotHours: SLOT_HOURS,
      days,
    });
  } catch (error) {
    console.error("[Bookings availability]", error);
    return NextResponse.json(
      { error: "Unable to load availability. Please try again shortly." },
      { status: 500 }
    );
  }
}
