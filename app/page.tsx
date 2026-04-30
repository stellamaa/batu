import { HomeClient } from "./HomeClient";
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
      .map((item) => item.url as string) ?? [];

  const randomImages = pickRandom(allImageUrls, 3);

  return <HomeClient randomImages={randomImages} />;
}