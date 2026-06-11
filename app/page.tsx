import { HomeClient } from "./HomeClient";
import { ALBUM_COVER_SRC, CURSOR_VIDEOS, optimizeHoverImageUrl } from "../lib/media";
import { mediaGlobeQuery, type MediaGlobeQueryResult } from "../lib/queries";
import { sanityClient } from "../lib/sanity.client";

function pickRandom<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default async function Home() {
  const data = await sanityClient.fetch<MediaGlobeQueryResult>(mediaGlobeQuery);
  const allImageUrls =
    data?.items
      ?.filter((item) => item?.type === "image" && item?.url)
      .map((item) => optimizeHoverImageUrl(item.url as string)) ?? [];

  const randomImages = pickRandom(allImageUrls, 3);

  return (
    <>
      <link rel="preload" href={ALBUM_COVER_SRC} as="image" fetchPriority="high" />
      {CURSOR_VIDEOS.map((src) => (
        <link key={src} rel="preload" href={src} as="video" type="video/mp4" />
      ))}
      {randomImages.map((src) => (
        <link key={src} rel="preload" href={src} as="image" />
      ))}
      <HomeClient randomImages={randomImages} />
    </>
  );
}
