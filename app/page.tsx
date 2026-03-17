import Link from "next/link";
import { MediaGlobe, MediaItem } from "../components/MediaGlobe";
import { sanityClient } from "../lib/sanity.client";
import { mediaGlobeQuery, MediaGlobeQueryResult } from "../lib/queries";
import { doublePivot, wireOne } from "./layout";

async function getMediaGlobeItems(): Promise<MediaItem[]> {
  const doc = await sanityClient.fetch<MediaGlobeQueryResult>(mediaGlobeQuery);
  const items = doc?.items ?? [];

  return items
    .map((it, index) => {
      return {
        id: it.id ?? `idx${index}`,
        title: it.title ?? "",
        type: (it.type ?? "image") as MediaItem["type"],
        url: it.url ?? undefined,
        linkUrl: it.linkUrl ?? null,
      };
    })
    .filter((item) => item.url && (item.type === "image" || item.type === "video"));
}

export default async function Home() {
  const items = await getMediaGlobeItems();

  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      <header className="pointer-events-none select-none">
        <nav className="fixed left-4 top-4 z-50 pointer-events-auto">
          <div className={`${wireOne.className} flex flex-row flex-wrap gap-1 md:text-lg text-xs`}>
            <Link
              href="#about"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 pt-6 pr-10 text-[#cfcfcf] no-underline backdrop-blur-md hover:text-[#e5e5e5]"
            >
              Info
            </Link>
            <a
              href="https://example.com/tour"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 pt-6 pr-10 text-[#cfcfcf] no-underline backdrop-blur-md hover:text-[#e5e5e5]"
            >
              Tour
            </a>
            <a
              href="https://batutimedance.bandcamp.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 pt-6 pr-10 text-[#cfcfcf] no-underline backdrop-blur-md hover:text-[#e5e5e5]"
            >
              Bandcamp
            </a>
            <a
              href="https://www.instagram.com/batu_timedance/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 pt-6 pr-10 text-[#cfcfcf] no-underline backdrop-blur-md hover:text-[#e5e5e5]"
            >
              Instagram
            </a>
          </div>
        </nav>

        <div
          className={`${doublePivot.className} fixed bottom-5 right-6 z-50 pointer-events-none select-none text-[44px] leading-none tracking-wide text-[f5f5f5f5] opacity-0.6 md:text-[56px]`}
        >
          BATU
        </div>
      </header>

      <section className="flex flex-col items-center justify-center min-h-screen">
        <MediaGlobe items={items} />
      </section>
    </main>
  );
}