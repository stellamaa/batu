'use client';

import { useEffect, useMemo, useState } from 'react';

export type BackgroundMediaItem = {
  id: string;
  title?: string;
  type: 'image' | 'video';
  url?: string;
  linkUrl?: string | null;
};

export function BackgroundMediaLoop({ items }: { items: BackgroundMediaItem[] }) {
  const mediaItems = useMemo(
    () => items.filter((item) => item.type === 'video' && item.url),
    [items]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (mediaItems.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % mediaItems.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [mediaItems.length]);

  const current = mediaItems[index];
  if (!current?.url) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {current.type === 'video' ? (
        <video
          key={current.id}
          src={current.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          key={current.id}
          src={current.url}
          alt={current.title || 'Background media'}
          className="h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}

