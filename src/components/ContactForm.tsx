"use client";

import { useState, type FormEvent } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      shop: formData.get("shop"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send message."
      );
    }
  }

  return (
    <form
      id="book"
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <h2 className="text-xl font-semibold text-foreground">Book a Calibration</h2>
      <p className="mt-2 text-sm text-muted">
        Tell us about your vehicle and shop. We&apos;ll respond promptly during
        business hours.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-muted">Your name *</span>
          <input
            required
            name="name"
            type="text"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Shop name</span>
          <input
            name="shop"
            type="text"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Email *</span>
          <input
            required
            name="email"
            type="email"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Phone *</span>
          <input
            required
            name="phone"
            type="tel"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm text-muted">Service needed</span>
        <select
          name="service"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
        >
          <option value="">Select a service</option>
          <option value="forward-radar-camera">Forward Radar & Camera</option>
          <option value="blind-spot-monitoring">Blind Spot Monitoring</option>
          <option value="parking-sensors">Parking Sensors</option>
          <option value="diagnostics">Diagnostics & Pre/Post Scan</option>
          <option value="multiple">Multiple services</option>
          <option value="other">Other / Not sure</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-muted">Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Vehicle year/make/model, repair details, preferred date..."
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent resize-y"
        />
      </label>

      {state === "success" && (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Thank you! Your request has been received. We&apos;ll be in touch shortly.
        </p>
      )}

      {state === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-6 w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending..." : "Submit Request"}
      </button>
    </form>
  );
}
