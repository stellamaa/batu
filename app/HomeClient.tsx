"use client";

import { type MouseEventHandler, useRef, useState } from "react";
import { doublePivot, wireOne } from "./fonts";

const videos = ["/batuvideo.mov", "/batuvideo2.mov", "/batuvideo3.mov"];
const navItemBaseClass =
  "z-[60] items-center px-1 py-1 text-[28px] uppercase tracking-[0.03em] text-[#0222A0] no-underline transition-opacity duration-200 hover:opacity-80";

/** Padding around the newsletter zone where hover previews stay hidden */
const NEWSLETTER_NEAR_PADDING_PX = 96;

export function HomeClient({ randomImages }: { randomImages: string[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 24, y: 24 });
  const [imagePosition, setImagePosition] = useState({ x: 24, y: 24 });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const newsletterZoneRef = useRef<HTMLDivElement>(null);
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim());

  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (!width || !height) return;

    const zone = newsletterZoneRef.current;
    if (zone) {
      const r = zone.getBoundingClientRect();
      const p = NEWSLETTER_NEAR_PADDING_PX;
      const nearNewsletter =
        event.clientX >= r.left - p &&
        event.clientX <= r.right + p &&
        event.clientY >= r.top - p &&
        event.clientY <= r.bottom + p;
      if (nearNewsletter) {
        setActiveVideo(null);
        setActiveImage(null);
        setActiveIndex(null);
        return;
      }
    }

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
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            className={`${navItemBaseClass} pointer-events-auto fixed left-4 top-4 hidden md:inline-flex`}
          >
            Info
          </button>
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
            <button type="button" onClick={() => setIsInfoOpen(true)} className={`inline-flex ${navItemBaseClass}`}>
              Info
            </button>
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

      {isInfoOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#A74814] p-4 md:p-8">
          <div className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto bg-[#A74814] p-6 text-[#0222A0] md:p-8">
            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className="absolute right-4 top-0 text-sm uppercase tracking-[0.08em] text-[#0222A0] hover:opacity-70"
            >
              Close
            </button>

            <div className="space-y-6 pr-8 text-sm leading-relaxed md:text-base">
             
              <p>
                Bridging the sound of two distinctive auteurs within modern electronic music, Exhale is the natural convergence of Batu and Donato Dozzy's revered, distinctive sonic signatures. With techno in the broadest sense as a framework, the pair have created an immersive listening experience that celebrates the flashpoint of inspiration and thrives on experimentation.
              </p>

              <p>
                As Batu, Omar McCutcheon has made a huge impression on modern club music by channeling the soundsystem-rooted principles of dubstep into inventive mutations that defy easy categorisation. Donato Dozzy has been a leading figure in European techno since the mid 00s, helping pioneer a culture of deeply immersive, subtle dance music charged with ambient atmospheres. The pair first connected in Japan in 2019, discovering a mutual appreciation for each others' work and a curiosity about how their distinct sounds might intersect. The first opportunity to collaborate came through DJing together, relishing the spirit of improvisation to play a surprise B2B set at Draaimolen Festival in the Netherlands in 2023 that went viral shortly after.
              </p>

        
            </div>
          </div>
        </div>
      )}

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
          <div ref={newsletterZoneRef} className="mt-12 flex w-full max-w-[300px] flex-col items-center">
          <form
            className="flex w-full flex-col items-center"
            onSubmit={async (event) => {
              event.preventDefault();
            
              if (!newsletterEmail.trim()) return;
              setNewsletterError(null);
            
              try {
                const res = await fetch("/api/subscribe", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email: newsletterEmail }),
                });
            
                if (res.ok) {
                  setNewsletterSubmitted(true);
                  setNewsletterEmail("");
                } else {
                  const data = await res.json().catch(() => null);
                  const rawError =
                    data && typeof data === "object" && "error" in data
                      ? (data.error as unknown)
                      : "Failed to subscribe";
                  const errorMessage =
                    typeof rawError === "string" ? rawError : JSON.stringify(rawError);
                  setNewsletterError(errorMessage);
                }
              } catch (err) {
                setNewsletterError("Network error while subscribing");
              }
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
            {newsletterError && (
              <p className="mt-2 text-center text-[11px] uppercase tracking-[0.06em] text-[#0222A0]/80">
                {newsletterError}
              </p>
            )}
            {!newsletterSubmitted && hasValidEmail && (
              <button
                type="submit"
                className="mt-2 text-center text-[12px] uppercase tracking-[0.08em] text-[#0222A0] hover:opacity-70"
              >
                sumbit
              </button>
            )}
          </form>
          </div>
        </div>
      </section>
    </main>
  );
}
