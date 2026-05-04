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
    let body: { email?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email : undefined;
    const rawKey =
      process.env.SENDER_API_KEY ?? process.env.SENDER_NET_API_KEY ?? "";
    const apiKey = normalizeSenderApiKey(rawKey);
    const groupId = process.env.SENDER_GROUP_ID?.trim();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            MESSAGE:
              "Server is missing SENDER_API_KEY. In Vercel: Project → Settings → Environment Variables → add SENDER_API_KEY (same value as .env.local), then redeploy.",
          },
        },
        { status: 503 }
      );
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
    let data: unknown;
    try {
      data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      data = { MESSAGE: "Unexpected response from Sender" };
    }

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error: {
          MESSAGE:
            "Subscribe request failed unexpectedly. Check server logs or confirm SENDER_API_KEY is set on your host.",
        },
      },
      { status: 500 }
    );
  }
}
