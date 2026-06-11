export const CURSOR_VIDEOS = ["/batuvideo.mp4", "/batuvideo2.mp4", "/batuvideo3.mp4"] as const;

export const ALBUM_COVER_SRC = "/K7466-Album-Main-optimized.jpg";

/** Sanity CDN resize for small hover previews (~140px wide). */
export function optimizeHoverImageUrl(url: string, width = 280): string {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("cdn.sanity.io")) return url;
    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("q", "80");
    return parsed.toString();
  } catch {
    return url;
  }
}
