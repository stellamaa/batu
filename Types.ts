export type MediaGlobeItem = {
  _key: string;
  caption: string;
  kind: 'image' | 'video';
  assetUrl: string;
  linkUrl?: string | null;
};