import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  shop?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  // Log submission for development. Wire to email provider (Resend, SendGrid, etc.) in production.
  console.info("[Contact form submission]", {
    name,
    shop: body.shop?.trim() || "",
    email,
    phone,
    service: body.service || "",
    message: body.message?.trim() || "",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
