"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  SLOT_HOURS,
  buildMonthGrid,
  formatDateLabel,
  formatSlotLabel,
  getOttawaNow,
  toIsoDate,
} from "@/lib/booking";

type DayAvailability = {
  date: string;
  available: boolean;
  reason?: "sunday" | "past" | "full";
  slots: Array<{ hour: number; available: boolean }>;
};

type AvailabilityResponse = {
  year: number;
  month: number;
  days: DayAvailability[];
  error?: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function BookingForm() {
  const initial = getOttawaNow();
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState("");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState<{
    date: string;
    hour: number;
  } | null>(null);

  const dayMap = useMemo(() => {
    const map = new Map<string, DayAvailability>();
    for (const day of days) map.set(day.date, day);
    return map;
  }, [days]);

  const selectedDay = selectedDate ? dayMap.get(selectedDate) : undefined;
  const grid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const todayIso = toIsoDate(initial.year, initial.month, initial.day);

  const loadAvailability = useCallback(async (year: number, month: number) => {
    setLoadingCalendar(true);
    setCalendarError("");
    try {
      const response = await fetch(
        `/api/bookings/availability?year=${year}&month=${month}`
      );
      const data = (await response.json()) as AvailabilityResponse;
      if (!response.ok) {
        throw new Error(data.error || "Unable to load calendar.");
      }
      setDays(data.days);
    } catch (error) {
      setDays([]);
      setCalendarError(
        error instanceof Error ? error.message : "Unable to load calendar."
      );
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  useEffect(() => {
    void loadAvailability(viewYear, viewMonth);
  }, [viewYear, viewMonth, loadAvailability]);

  function shiftMonth(delta: number) {
    let nextMonth = viewMonth + delta;
    let nextYear = viewYear;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    } else if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    const now = getOttawaNow();
    const earliest = now.year * 12 + now.month;
    const target = nextYear * 12 + nextMonth;
    if (target < earliest) return;
    if (target > earliest + 6) return;

    setViewYear(nextYear);
    setViewMonth(nextMonth);
  }

  function selectDate(date: string) {
    const day = dayMap.get(date);
    if (!day?.available) return;
    setSelectedDate(date);
    setSelectedHour(null);
    setState("idle");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDate || selectedHour === null) {
      setState("error");
      setErrorMessage("Please select a day and time slot.");
      return;
    }

    setState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          bookingDate: selectedDate,
          slotHour: selectedHour,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccessDetails({ date: selectedDate, hour: selectedHour });
      setState("success");
      setFullName("");
      setEmail("");
      setPhone("");
      setSelectedDate(null);
      setSelectedHour(null);
      await loadAvailability(viewYear, viewMonth);
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to complete booking."
      );
      await loadAvailability(viewYear, viewMonth);
    }
  }

  if (state === "success" && successDetails) {
    return (
      <div
        id="book"
        className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="rounded-lg border border-accent/30 bg-accent/10 px-5 py-6">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Booking confirmed
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            Thank you — your request is in.
          </h2>
          <p className="mt-3 text-sm text-muted">
            We received your booking for{" "}
            <span className="text-foreground">
              {formatDateLabel(successDetails.date)} at{" "}
              {formatSlotLabel(successDetails.hour)}
            </span>
            . A confirmation email will be sent to your inbox. We&apos;ll
            follow up shortly to finalize.
          </p>
          <button
            type="button"
            onClick={() => {
              setState("idle");
              setSuccessDetails(null);
            }}
            className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Book another appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="book"
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <h2 className="text-xl font-semibold text-foreground">Book a Calibration</h2>
      <p className="mt-2 text-sm text-muted">
        Choose an available day and time (Monday–Saturday, 8:00 AM–4:00 PM),
        then enter your details. Sundays are closed.
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-foreground">
            {monthLabel(viewYear, viewMonth)}
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted">
          {WEEKDAYS.map((label) => (
            <div key={label} className="py-1 font-medium">
              {label}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const day = dayMap.get(date);
            const dayNum = Number(date.slice(-2));
            const isSelected = selectedDate === date;
            const isToday = date === todayIso;
            const unavailable = loadingCalendar || !day?.available;
            const isSundayClosed = day?.reason === "sunday";

            return (
              <button
                key={date}
                type="button"
                disabled={unavailable}
                onClick={() => selectDate(date)}
                title={
                  isSundayClosed
                    ? "Closed on Sundays"
                    : day?.reason === "past"
                      ? "Date unavailable"
                      : day?.reason === "full"
                        ? "No open slots"
                        : undefined
                }
                className={[
                  "aspect-square rounded-lg text-sm transition-colors",
                  isSelected
                    ? "bg-accent font-semibold text-background"
                    : unavailable
                      ? "cursor-not-allowed text-muted/40"
                      : "text-foreground hover:bg-accent/15",
                  isToday && !isSelected ? "ring-1 ring-accent/50" : "",
                  isSundayClosed ? "line-through" : "",
                ].join(" ")}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {loadingCalendar && (
          <p className="mt-3 text-xs text-muted">Loading availability…</p>
        )}
        {calendarError && (
          <p className="mt-3 text-xs text-red-400">{calendarError}</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-foreground">Time slot</h3>
        {!selectedDate ? (
          <p className="mt-2 text-sm text-muted">Select a day to see open times.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(selectedDay?.slots || SLOT_HOURS.map((hour) => ({ hour, available: false }))).map(
              (slot) => {
                const isSelected = selectedHour === slot.hour;
                return (
                  <button
                    key={slot.hour}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => {
                      setSelectedHour(slot.hour);
                      setState("idle");
                      setErrorMessage("");
                    }}
                    className={[
                      "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "border-accent bg-accent/15 text-accent"
                        : slot.available
                          ? "border-border text-foreground hover:border-accent"
                          : "cursor-not-allowed border-border/50 text-muted/40",
                    ].join(" ")}
                  >
                    {formatSlotLabel(slot.hour)}
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm text-muted">Full name *</span>
          <input
            required
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Email *</span>
          <input
            required
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Phone (optional)</span>
          <input
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
      </div>

      {selectedDate && selectedHour !== null && (
        <p className="mt-4 text-sm text-muted">
          Selected:{" "}
          <span className="text-foreground">
            {formatDateLabel(selectedDate)} · {formatSlotLabel(selectedHour)}
          </span>
        </p>
      )}

      {state === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting" || !selectedDate || selectedHour === null}
        className="mt-6 w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Confirming…" : "Confirm booking"}
      </button>
    </form>
  );
}
