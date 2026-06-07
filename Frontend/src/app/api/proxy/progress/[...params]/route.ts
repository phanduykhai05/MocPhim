import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://moc-phim-api.duckdns.org";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const { params: segments } = await params;
  // segments = [userId, movieId, episodeNumber]
  const path = segments.join("/");

  const token = req.headers.get("authorization") ?? "";
  const body = await req.text();

  try {
    const res = await fetch(`${BACKEND}/api/v1/progress/${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ status: false, message: "Proxy error" }, { status: 500 });
  }
}
