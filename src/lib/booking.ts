export const TIME_ZONE = "America/Toronto";

/** Available start hours (local Ottawa time), every 2 hours from 8 AM to 4 PM. */
export const SLOT_HOURS = [8, 10, 12, 14, 16] as const;

export type SlotHour = (typeof SLOT_HOURS)[number];

export function isSlotHour(value: number): value is SlotHour {
  return (SLOT_HOURS as readonly number[]).includes(value);
}

export function formatSlotLabel(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

export function formatDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  weekday: number;
};

function partNumber(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
): number {
  const value = parts.find((part) => part.type === type)?.value;
  return value ? Number(value) : 0;
}

/** Current date/time parts in America/Toronto. weekday: 0 = Sunday … 6 = Saturday */
export function getOttawaNow(date = new Date()): DateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);

  const weekdayName = parts.find((part) => part.type === "weekday")?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  let hour = partNumber(parts, "hour");
  // Some engines emit "24" for midnight
  if (hour === 24) hour = 0;

  return {
    year: partNumber(parts, "year"),
    month: partNumber(parts, "month"),
    day: partNumber(parts, "day"),
    hour,
    weekday: weekdayMap[weekdayName] ?? 0,
  };
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseIsoDate(isoDate: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/** JS weekday for a calendar date (no timezone shift): 0 = Sunday */
export function weekdayForIsoDate(isoDate: string): number | null {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) return null;
  return new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)).getUTCDay();
}

export function isSunday(isoDate: string): boolean {
  return weekdayForIsoDate(isoDate) === 0;
}

export function isPastDate(isoDate: string, now = getOttawaNow()): boolean {
  const today = toIsoDate(now.year, now.month, now.day);
  return isoDate < today;
}

export function isSlotInPast(isoDate: string, slotHour: number, now = getOttawaNow()): boolean {
  const today = toIsoDate(now.year, now.month, now.day);
  if (isoDate < today) return true;
  if (isoDate > today) return false;
  return slotHour <= now.hour;
}

export function isValidBookingSlot(isoDate: string, slotHour: number): boolean {
  if (!parseIsoDate(isoDate)) return false;
  if (!isSlotHour(slotHour)) return false;
  if (isSunday(isoDate)) return false;
  if (isSlotInPast(isoDate, slotHour)) return false;
  return true;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function buildMonthGrid(year: number, month: number): Array<string | null> {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const totalDays = daysInMonth(year, month);
  const cells: Array<string | null> = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(toIsoDate(year, month, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}
