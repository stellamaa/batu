"use client";

import Link from "next/link";
import { type MouseEventHandler, useState } from "react";
import { doublePivot, wireOne } from "./fonts";

const videos = ["/batuvideo.mov", "/batuvideo2.mov", "/batuvideo3.mov"];
const navItemBaseClass =
  "z-[60] items-center px-1 py-1 text-[28px] uppercase tracking-[0.03em] text-[#0222A0] no-underline transition-opacity duration-200 hover:opacity-80";

export function HomeClient({ randomImages }: { randomImages: string[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 24, y: 24 });
  const [imagePosition, setImagePosition] = useState({ x: 24, y: 24 });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (!width || !height) return;

    const sectionWidth = width / 3;
    const nextIndex = Math.min(2, Math.floor(event.clientX / sectionWidth));
    const previewWidth = Math.min(220, width * 0.45);
    const previewHeight = previewWidth * (9 / 16);
    const offset = 18;
    const maxX = Math.max(0, width - previewWidth - 12);
    const maxY = Math.max(0, height - previewHeight - 12);
    const nextX = Math.min(maxX, event.clientX + offset);
    const nextY = Math.min(maxY, event.clientY + offset);
    setCursorPosition({ x: nextX, y: nextY });
    if (randomImages.length > 0) {
      const imageSectionWidth = width / randomImages.length;
      const nextImageIndex = Math.min(randomImages.length - 1, Math.floor(event.clientX / imageSectionWidth));
      const imagePreviewWidth = 140;
      const imagePreviewHeight = 105;
      const imageX = Math.max(0, Math.min(width - imagePreviewWidth - 12, event.clientX - imagePreviewWidth - 18));
      const imageY = Math.max(0, Math.min(height - imagePreviewHeight - 12, event.clientY - imagePreviewHeight - 12));
      setActiveImage(randomImages[nextImageIndex]);
      setImagePosition({ x: imageX, y: imageY });
    }

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
      setActiveVideo(videos[nextIndex]);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#A74814] text-[#0222A0]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setActiveIndex(null);
        setActiveVideo(null);
        setActiveImage(null);
        setCursorPosition({ x: 24, y: 24 });
        setImagePosition({ x: 24, y: 24 });
      }}
    >
      <header className="pointer-events-none select-none">
        <nav className={`${wireOne.className} z-40`}>
          <Link href="#about" className={`${navItemBaseClass} pointer-events-auto fixed left-4 top-4 hidden md:inline-flex`}>
            Info
          </Link>
          <a
            href="https://example.com/tour"
            target="_blank"
            rel="noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed right-4 top-4 hidden md:inline-flex`}
          >
            Tour
          </a>
          <a
            href="https://batutimedance.bandcamp.com/"
            target="_blank"
            rel="noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed left-4 bottom-4 hidden md:inline-flex`}
          >
            Bandcamp
          </a>
          <a
            href="https://www.instagram.com/batu_timedance/"
            target="_blank"
            rel="noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed bottom-4 right-4 hidden md:inline-flex`}
          >
            Instagram
          </a>

          <div className="pointer-events-auto fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 md:hidden">
            <Link href="#about" className={`inline-flex ${navItemBaseClass}`}>
              Info
            </Link>
            <a href="https://example.com/tour" target="_blank" rel="noreferrer" className={`inline-flex ${navItemBaseClass}`}>
              Tour
            </a>
            <a href="https://batutimedance.bandcamp.com/" target="_blank" rel="noreferrer" className={`inline-flex ${navItemBaseClass}`}>
              Bandcamp
            </a>
            <a href="https://www.instagram.com/batu_timedance/" target="_blank" rel="noreferrer" className={`inline-flex ${navItemBaseClass}`}>
              Instagram
            </a>
          </div>
        </nav>
        <div
          className={`${doublePivot.className} fixed left-1/2 top-3 z-40 -translate-x-1/2 text-[28px] leading-none tracking-wide text-[#0222A0] opacity-60 md:text-[36px]`}
        >
          BATU
        </div>
      </header>

      {activeImage && (
        <div
          className="pointer-events-none fixed z-40 hidden w-[140px] overflow-hidden shadow-2xl md:block"
          style={{
            left: `${imagePosition.x}px`,
            top: `${imagePosition.y}px`,
          }}
        >
          <img src={activeImage} alt="Sanity image preview" className="h-auto w-full object-cover" />
        </div>
      )}

      {activeVideo && (
        <div
          className="pointer-events-none fixed z-30 hidden h-[180px] w-[210px] overflow-hidden bg-white/40 shadow-2xl md:block"
          style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
        >
          <video
            key={activeVideo}
            src={activeVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <section className="relative z-20 flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Album cover" className="h-auto w-[260px] max-w-[70vw] object-cover shadow-2xl" />
          <p className="text-center text-base uppercase tracking-[0.2em] text-[#0222A0]/90 md:text-lg">release 5th of May</p>
          <form
            className="mt-12 flex w-full max-w-[300px] flex-col items-center"
            onSubmit={(event) => {
              // Provider hookup comes later; keep UI behavior local for now.
              event.preventDefault();
              if (!newsletterEmail.trim()) return;
              setNewsletterSubmitted(true);
              setNewsletterEmail("");
            }}
          >
            <p className="md:mb-5  md:mt-10 pt-20 pb-10 text-center text-[18px] uppercase leading-tight tracking-[0.08em] text-[#0222A0]/80">subscribe to the newsletter</p>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            {newsletterSubmitted ? (
              <p className="w-full border-0 border-b border-[#0222A0]/90 bg-transparent px-1 pb-1 text-center text-[13px] uppercase tracking-[0.07em] text-[#0222A0]">
                thanks for signing up!
              </p>
            ) : (
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="enter email address"
                className="w-full border-0 border-b border-[#0222A0]/90 bg-transparent px-1 pb-1 text-center text-[13px] uppercase tracking-[0.07em] text-[#0222A0] placeholder:text-[#0222A0]/60 focus:outline-none"
              />
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
