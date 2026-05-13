import { NextResponse } from "next/server";

/** Normalize token from .env */
function normalizeSenderApiKey(raw: string): string {
  let key = raw.trim().replace(/^Bearer\s+/i, "");

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  return key.replace(/^\uFEFF/, "").replace(/\s+/g, "");
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let body: { email?: string };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const email =
      typeof body.email === "string" ? body.email.trim() : "";

    const rawKey =
      process.env.SENDER_API_KEY ??
      process.env.SENDER_NET_API_KEY ??
      "";

    const apiKey = normalizeSenderApiKey(rawKey);

    // TEMP: remove groups while debugging
    // const groupId = process.env.SENDER_GROUP_ID?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            MESSAGE:
              "Missing SENDER_API_KEY environment variable",
          },
        },
        { status: 503 }
      );
    }

    // DEBUG LOGS
    console.log("==== SENDER DEBUG ====");
    console.log("NODE_ENV:", process.env.NODE_ENV);

    console.log("KEY META:", {
      exists: !!apiKey,
      length: apiKey.length,
      startsWithEyJ: apiKey.startsWith("eyJ"),
      preview: apiKey.slice(0, 20) + "...",
    });

    console.log("EMAIL:", email);

    const payload = {
      email,
    };

    console.log("PAYLOAD:", payload);

    const response = await fetch(
      "https://api.sender.net/v2/subscribers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    let data: unknown;

    try {
      data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);

      data = {
        MESSAGE: "Could not parse Sender response",
      };
    }

    // DEBUG RESPONSE
    console.log("==== SENDER RESPONSE ====");
    console.log("STATUS:", response.status);

    console.log(
      "HEADERS:",
      Object.fromEntries(response.headers.entries())
    );

    console.log("DATA:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          senderStatus: response.status,
          senderResponse: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      senderResponse: data,
    });
  } catch (err) {
    console.error("==== SERVER ERROR ====");
    console.error(err);

    return NextResponse.json(
      {
        error: {
          MESSAGE:
            "Subscribe request failed unexpectedly",
        },
      },
      { status: 500 }
    );
  }
}