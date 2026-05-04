import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const apiKey = process.env.SENDER_API_KEY;
    const groupId = process.env.SENDER_GROUP_ID;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: "Missing SENDER_API_KEY" }, { status: 500 });
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
