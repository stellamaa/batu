import { NextResponse } from "next/server";

/** Normalize token from .env (quotes/Bearer prefix often break JWT auth). */
function normalizeSenderApiKey(raw: string): string {
  let key = raw.trim().replace(/^Bearer\s+/i, "");
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  return key.replace(/^\uFEFF/, "");
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const rawKey =
      process.env.SENDER_API_KEY ?? process.env.SENDER_NET_API_KEY ?? "";
    const apiKey = normalizeSenderApiKey(rawKey);
    const groupId = process.env.SENDER_GROUP_ID?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: "Missing SENDER_API_KEY" }, { status: 500 });
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[api/subscribe] SENDER_API_KEY length:",
        apiKey.length,
        "(expect ~800+ for a full JWT)"
      );
    }

    const payload: { email: string; groups?: string[] } = { email };
    if (groupId) {
      payload.groups = [groupId];
    }

    const response = await fetch("https://api.sender.net/v2/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
