"use client";

import { type MouseEventHandler, useRef, useState } from "react";
import { doublePivot, wireOne } from "./fonts";

const videos = ["/batuvideo.mov", "/batuvideo2.mov", "/batuvideo3.mov"];
const navItemBaseClass =
  "z-[60] items-center px-1 py-1 text-[28px] uppercase tracking-[0.03em] text-[#0222A0] no-underline transition-opacity duration-200 hover:opacity-80 hover:line-through";

/** Padding around the newsletter zone where hover previews stay hidden */
const NEWSLETTER_NEAR_PADDING_PX = 96;
/** Padding around links/buttons where hover previews stay hidden */
const INTERACTIVE_NEAR_PADDING_PX = 42;

function formatSubscribeError(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const msg =
      typeof o.MESSAGE === "string"
        ? o.MESSAGE
        : typeof o.message === "string"
          ? o.message
          : typeof o.error === "string"
            ? o.error
            : null;
    if (msg) {
      if (/invalid or expired token/i.test(msg)) {
        return "Sender rejected this API key (invalid or expired). Create a new token in Sender → Settings → API access tokens. In Netlify: Key must be exactly SENDER_API_KEY and the JWT goes only in Value; set the Production value if you use “different value per context”; enable Functions + Runtime scopes; save and redeploy. Match the same token that works locally in .env.local.";
      }
      return msg;
    }
  }
  return "Could not subscribe. Please try again.";
}

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

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, form"
    );
    for (const element of interactiveElements) {
      const r = element.getBoundingClientRect();
      const p = INTERACTIVE_NEAR_PADDING_PX;
      const nearInteractive =
        event.clientX >= r.left - p &&
        event.clientX <= r.right + p &&
        event.clientY >= r.top - p &&
        event.clientY <= r.bottom + p;
      if (nearInteractive) {
        setActiveVideo(null);
        setActiveImage(null);
        setActiveIndex(null);
        return;
      }
    }

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
            className={`${navItemBaseClass} pointer-events-auto fixed left-4 top-1 hidden md:inline-flex`}
          >
            Info
          </button>
          <a
            href="https://ra.co/dj/batu-uk"
            target="_blank"
            rel="noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed right-4 top-1 hidden md:inline-flex`}
          >
            Tour
          </a>
          <a
            href="https://batutimedance.bandcamp.com/"
            target="_blank"
            rel="noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed left-4 bottom-1 hidden md:inline-flex`}
          >
            Bandcamp
          </a>
          <a
            href="https://www.instagram.com/batu_timedance/"
            target="_blank"
            rel="noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed bottom-1 right-4 hidden md:inline-flex`}
          >
            Instagram
          </a>

          <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-[90] flex items-center justify-center gap-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 md:hidden">
            <button type="button" onClick={() => setIsInfoOpen(true)} className={`inline-flex ${navItemBaseClass}`}>
              Info
            </button>
            <a href="https://ra.co/dj/batu-uk" target="_blank" rel="noreferrer" className={`inline-flex ${navItemBaseClass}`}>
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
          <div className="relative max-h-[85vh] w-full max-w-[92vw] overflow-y-auto bg-[#A74814] p-5 text-[#0222A0] md:max-w-3xl md:p-8">
            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className="absolute right-4 top-0 text-sm uppercase tracking-[0.08em] text-[#0222A0] hover:opacity-70 hover:line-through"
            >
              Close
            </button>

            <div className="space-y-5 pr-4 text-[12px] leading-relaxed md:space-y-6 md:pr-8 md:text-base">
              <p>
                As an artist, Batu continually strikes out on his own. Rightly
                hailed for his distinctive slant on modernist techno and
                experimental club music, he&apos;s also prolific beyond the
                dancefloor. His is a sound marked out by bold shapes and
                angular expressions, whether strapped to physical rhythms or
                not.
              </p>

              <p>
                His 2022 debut album Opal took his accomplished sound design
                into broader spheres of expression, while production work for
                serpentwithfeet saw him approaching pop sensibilities with his
                non-conformist sonic palette. As well as his production work,
                Batu&apos;s presence as a DJ on the international club and
                festival circuit touches on venerated events such as
                Glastonbury, Dekmantel Festival, Sonar and Unsound. The
                flexibility in his sound also translates to the intimacy of
                smaller underground events - an environment which remains
                inspiring even as he graces some of the biggest stages for
                electronic music globally.
              </p>

              <p>
                Beyond sonics, his interests expand into visual work too,
                having produced and directed the video to his own track
                &lsquo;Solace&rsquo; and collaborated on an A/V composition with
                Harry Butt for his Crack Magazine cover feature - one of
                multiple cover features he&apos;s been placed on.
              </p>

              <p>
                Taken alongside his music, Batu&apos;s holistic engagement with
                electronic music culture adds up to a considered spectrum of
                output and efforts with a shared aim - to push things forward.
              </p>

              <p className="pt-4">
                Contact:{" "}
                <a
                  href="mailto:raj@giantartistmanagement.com"
                  className="hover:line-through"
                >
                  raj@giantartistmanagement.com
                </a>
                {" / "}
                <a
                  href="mailto:hiroki@giantartistmanagement.com"
                  className="hover:line-through"
                >
                  hiroki@giantartistmanagement.com
                </a>
              </p>

              <p className="pt-6">
                Site by{" "}
                <a
                  href="https://stellamathioudakis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:line-through"
                >
                  stellamathioudakis.com
                </a>
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

      <section className="relative z-20 flex min-h-[100svh] items-center justify-center px-4 pb-10 pt-3 md:p-6">
        <div className="flex flex-col items-center gap-0">
          <a
            href="https://k7.lnk.to/exhale"
            target="_blank"
            rel="noreferrer"
            className="block md:mt-16 lg:mt-12"
          >
            <img
              src="/K7466-Album-Main.jpg"
              alt="Album cover"
              className="h-auto w-[78vw] max-w-[78vw] object-contain md:w-[380px] md:max-w-none lg:w-[350px]"
            />
          </a>
          <a
            href="https://k7.lnk.to/exhale"
            target="_blank"
            rel="noreferrer"
            className="text-center font-light text-[13px] uppercase tracking-[0.1em] text-[#0222A0]/90 hover:line-through md:mt-3 md:text-lg"
          >
            Batu & Donato Dozzy - 'Exhale'
          </a>
          <p className="text-center font-light text-[13px] lowercase tracking-[0rem] text-[#0222A0]/90 md:text-lg">
            out now on K7
          </p>
          <div ref={newsletterZoneRef} className="mt-1 flex w-full max-w-[300px] flex-col items-center md:mt-2">
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
                  const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
                  setNewsletterError(formatSubscribeError(data?.error));
                }
              } catch (err) {
                setNewsletterError("Network error while subscribing");
              }
            }}
          >
            <p className="pt-3 pb-2 text-center font-light text-[12px] uppercase leading-tight tracking-[0.08em] text-[#0222A0]/80 md:mb-5 md:mt-10 md:pt-20 md:pb-10 md:text-[18px]">
              subscribe to the newsletter
            </p>
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
                className="mt-1 text-center text-[11px] uppercase tracking-[0.08em] text-[#0222A0] hover:opacity-70"
              >
                submit
              </button>
            )}
          </form>
          </div>
        </div>
      </section>
    </main>
  );
}
