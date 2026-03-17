import { MediaItem } from '@/components/MediaGlobe';
import { groq } from 'next-sanity';

export const mediaGlobeQuery = groq`
*[_type == "mediaGlobe"][0]{
  items[]{
    "id": _key,
    "title": caption,
    "type": kind,
    "url": select(
      kind == "image" => image.asset->url,
      kind == "video" => coalesce(videoFile.asset->url, videoUrl)
    ),
    "linkUrl": linkUrl
  }
}
`;

export type MediaGlobeQueryResult = {
  items?: MediaItem[];
};
