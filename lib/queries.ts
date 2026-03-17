import { groq } from 'next-sanity';

export const mediaGlobeQuery = groq`
*[_type == "mediaGlobe"] | order(_createdAt desc)[0]{
  title,
  items[]{
    "id": _key,
    "title": caption,
    type,
    "url": select(
      type == "image" => image.asset->url,
      type == "video" => coalesce(videoFile.asset->url, videoUrl)
    ),
    "linkUrl": externalLink
  }
}
`;

export type MediaGlobeQueryResult = {
  title?: string;
  items?: {
    id?: string;
    title?: string;
    type?: 'image' | 'video';
    url?: string;
    linkUrl?: string | null;
  }[];
} | null;
