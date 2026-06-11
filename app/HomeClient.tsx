"use client";

import Image from "next/image";
import { type MouseEventHandler, useEffect, useRef, useState } from "react";
import { ALBUM_COVER_SRC, CURSOR_VIDEOS } from "../lib/media";
import { doublePivot, wireOne } from "./fonts";

const videos = [...CURSOR_VIDEOS];
const navItemBaseClass =
  "z-[60] items-center px-1 py-1 text-[28px] uppercase tracking-[0.03em] text-[#0222A0] no-underline transition-opacity duration-200 hover:opacity-80 hover:line-through min-[2000px]:text-[36px]";

const overlayHeaderClass =
  "text-[14px] uppercase tracking-[0.08em] text-[#0222A0] leading-relaxed md:text-base min-[2000px]:text-lg";

const overlayMobileActionClass =
  "text-[14px] uppercase tracking-[0.08em] text-[#0222A0] leading-relaxed hover:opacity-70 hover:line-through min-[2000px]:text-lg";

const overlayBodyClass =
  "w-full space-y-3 pb-[max(6rem,calc(5rem+env(safe-area-inset-bottom)))] text-[14px] leading-relaxed md:space-y-4 md:pb-0 md:text-base min-[2000px]:space-y-5 min-[2000px]:text-lg";

const largeScreenNavInsetClass = "min-[2000px]:left-8 min-[2000px]:top-3";
const largeScreenNavInsetRightClass = "min-[2000px]:right-8 min-[2000px]:top-3";
const largeScreenNavInsetBottomClass = "min-[2000px]:bottom-3";

const followLinks = [
  { label: "Batu", href: "https://www.instagram.com/batu_timedance/" },
  { label: "Dials", href: "https://www.instagram.com/dials.music" },
  { label: "Timedance", href: "https://timedance.music/" },
] as const;

const BANDCAMP_URL = "https://batutimedance.bandcamp.com/";

type CollaborationEntry = {
  title: string;
  href?: string;
};

type CollaborationYear = {
  year: string;
  items: CollaborationEntry[];
};

const collaborationYears: CollaborationYear[] = [
  {
    year: "2026",
    items: [
      {
        title: "Batu & Donato Dozzy - Exhale",
        href: "https://batutimedance.bandcamp.com/album/exhale-2",
      },
      {
        title: "Mirage ft. Art School Girlfriend (Batu Remix)",
        href: "https://scalerband.bandcamp.com/track/mirage-ft-art-school-girlfriend-batu-remix",
      },
      {
        title: "Groovedeep - Funk Solo (Batu Remix)",
        href: "https://turborecordings.bandcamp.com/track/funk-solo-batu-remix",
      },
      {
        title: "Jamie Woon - Ghost (Batu Remix)",
        href: "https://jamiewoon.bandcamp.com/track/ghost-batu-remix",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        title: "FKA twigs & Pinkpanteress - Wild & Alone prod. Batu",
        href: "https://youtu.be/kvswW4Ys-08?si=tUle8YUJcXqqlRfQ",
      },
      {
        title: "Batu - Question Mark EP",
        href: "https://batutimedance.bandcamp.com/album/question-mark",
      },
      {
        title: "Tricky (Theis Thaw) - Where Are You Lately (Batu Remix)",
        href: "https://www.youtube.com/watch?v=BxuYUNLvnvc",
      },
      {
        title: "Tikiman - Free Your Mind prod. Batu",
        href: "https://kynantrecords.bandcamp.com/track/c1-paul-st-hilaire-batu-free-your-mind",
      },
      {
        title: "FKA twigs - Perfectly prod. Batu",
        href: "https://peacerussie.bandcamp.com/track/perfectly",
      },
      {
        title: "Stepney Western - dir. Harry Lawson. Music by Omar McCutcheon",
        href: "https://djmag.com/news/batu-soundtracks-documentary-young-inner-city-horse-riders-newcastle-stepney-western",
      },
      {
        title: "Mixmag cover feature",
        href: "https://mixmag.net/feature/the-cover-mix-batu",
      },
    ],
  },
];

const worksLinks: CollaborationEntry[] = [
  {
    title: "NTS",
    href: "https://www.nts.live/shows/a-long-strange-dream-w-batu",
  },
  {
    title: "Mixes",
    href: "https://m.soundcloud.com/batuuk/sets/mixes",
  },
];

type OverlayPanel = "info" | "projects";

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
  const [overlayPanel, setOverlayPanel] = useState<OverlayPanel | null>(null);
  const [isOverlayMounted, setIsOverlayMounted] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isOverlayClosing, setIsOverlayClosing] = useState(false);
  const [isFollowOpen, setIsFollowOpen] = useState(false);
  const [isListenOpen, setIsListenOpen] = useState(false);
  const newsletterZoneRef = useRef<HTMLDivElement>(null);
  const followMenuRef = useRef<HTMLDivElement>(null);
  const listenMenuRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim());

  useEffect(() => {
    for (const src of randomImages) {
      const img = new window.Image();
      img.src = src;
    }

    for (const src of videos) {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = src;
      video.load();
    }
  }, [randomImages]);

  useEffect(() => {
    if (!activeVideo) return;

    for (const src of videos) {
      const video = videoRefs.current[src];
      if (!video) continue;
      if (src === activeVideo) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [activeVideo]);

  useEffect(() => {
    if (!overlayPanel) return;
    setIsOverlayMounted(true);
    setIsOverlayClosing(false);
    setIsOverlayVisible(false);

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setIsOverlayVisible(true));
    });
    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [overlayPanel]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const html = document.documentElement;
    const body = document.body;

    const apply = () => {
      html.style.overflowX = "hidden";
      body.style.overflowX = "hidden";

      if (isOverlayMounted) {
        html.style.overflowY = "hidden";
        body.style.overflowY = "hidden";
        return;
      }

      if (!mq.matches) {
        html.style.overflowY = "";
        body.style.overflowY = "";
        return;
      }

      html.style.overflowY = "hidden";
      body.style.overflowY = "hidden";
    };

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      html.style.overflowX = "";
      html.style.overflowY = "";
      body.style.overflowX = "";
      body.style.overflowY = "";
    };
  }, [isOverlayMounted]);

  useEffect(() => {
    if (!isFollowOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (followMenuRef.current && !followMenuRef.current.contains(target)) {
        setIsFollowOpen(false);
      }
    };

    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, [isFollowOpen]);

  useEffect(() => {
    if (!isListenOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (listenMenuRef.current && !listenMenuRef.current.contains(target)) {
        setIsListenOpen(false);
      }
    };

    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, [isListenOpen]);

  const closeOverlay = () => {
    setIsOverlayClosing(true);
    setIsOverlayVisible(false);
    window.setTimeout(() => {
      setOverlayPanel(null);
      setIsOverlayMounted(false);
      setIsOverlayClosing(false);
    }, 200);
  };

  const openOverlay = (panel: OverlayPanel) => {
    setIsFollowOpen(false);
    setIsListenOpen(false);
    setOverlayPanel(panel);
  };

  useEffect(() => {
    if (!overlayPanel) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverlay();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [overlayPanel]);

  const openProjects = () => {
    setIsListenOpen(false);
    openOverlay("projects");
  };

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
      <h1 className="sr-only">Batu — DJ and Producer</h1>
      <header className="pointer-events-none select-none">
        <nav className={`${wireOne.className} z-40`} aria-label="Primary">
          <button
            type="button"
            onClick={() => openOverlay("info")}
            className={`${navItemBaseClass} pointer-events-auto fixed left-4 top-1 hidden md:inline-flex ${largeScreenNavInsetClass}`}
          >
            Info
          </button>
          <a
            href="https://ra.co/dj/batu-uk"
            target="_blank"
            rel="noopener noreferrer"
            className={`${navItemBaseClass} pointer-events-auto fixed right-4 top-1 hidden md:inline-flex ${largeScreenNavInsetRightClass}`}
          >
            Tour
          </a>
          <div
            className={`${wireOne.className} pointer-events-auto group fixed bottom-1 left-4 z-[60] hidden md:flex md:items-center ${largeScreenNavInsetBottomClass} min-[2000px]:left-8`}
          >
            <span className={`${navItemBaseClass} inline-flex cursor-default whitespace-nowrap`}>
              Projects
            </span>
            <div className="pointer-events-none flex items-center gap-1 pl-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <a
                href={BANDCAMP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${navItemBaseClass} inline-flex whitespace-nowrap`}
              >
                Bandcamp
              </a>
              <button
                type="button"
                onClick={openProjects}
                className={`${navItemBaseClass} inline-flex whitespace-nowrap`}
              >
                Projects
              </button>
            </div>
          </div>
          <div
            className={`${wireOne.className} pointer-events-auto group fixed bottom-1 right-4 z-[60] hidden md:flex md:items-center ${largeScreenNavInsetBottomClass} min-[2000px]:right-8`}
          >
            <div className="pointer-events-none flex items-center gap-1 pr-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              {followLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${navItemBaseClass} inline-flex whitespace-nowrap`}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <span className={`${navItemBaseClass} inline-flex cursor-default whitespace-nowrap`}>
              Follow
            </span>
          </div>

          {!isOverlayMounted && (
          <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-[90] flex items-center justify-center gap-4 bg-[#A74814] px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
            <button type="button" onClick={() => openOverlay("info")} className={`inline-flex ${navItemBaseClass}`}>
              Info
            </button>
            <a href="https://ra.co/dj/batu-uk" target="_blank" rel="noopener noreferrer" className={`inline-flex ${navItemBaseClass}`}>
              Tour
            </a>
            <div ref={listenMenuRef} className="relative inline-flex">
              <button
                type="button"
                aria-expanded={isListenOpen}
                aria-haspopup="true"
                aria-controls="projects-submenu-mobile"
                onClick={() => setIsListenOpen((open) => !open)}
                className={`inline-flex ${navItemBaseClass} ${isListenOpen ? "opacity-80 line-through" : ""}`}
              >
                Projects
              </button>
              {isListenOpen && (
                <div
                  id="projects-submenu-mobile"
                  role="menu"
                  className="fixed inset-x-0 bottom-[max(3.25rem,calc(2.75rem+env(safe-area-inset-bottom)))] z-[95] flex items-center justify-center gap-3 px-4"
                >
                  <a
                    href={BANDCAMP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setIsListenOpen(false)}
                    className={`inline-flex ${navItemBaseClass}`}
                  >
                    Bandcamp
                  </a>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={openProjects}
                    className={`inline-flex ${navItemBaseClass}`}
                  >
                    Projects
                  </button>
                </div>
              )}
            </div>
            <div ref={followMenuRef} className="relative inline-flex">
              <button
                type="button"
                aria-expanded={isFollowOpen}
                aria-haspopup="true"
                aria-controls="follow-submenu-mobile"
                onClick={() => setIsFollowOpen((open) => !open)}
                className={`inline-flex ${navItemBaseClass} ${isFollowOpen ? "opacity-80 line-through" : ""}`}
              >
                Follow
              </button>
              {isFollowOpen && (
                <div
                  id="follow-submenu-mobile"
                  role="menu"
                  className="fixed inset-x-0 bottom-[max(3.25rem,calc(2.75rem+env(safe-area-inset-bottom)))] z-[95] flex items-center justify-center gap-3 px-4"
                >
                  {followLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setIsFollowOpen(false)}
                      className={`inline-flex ${navItemBaseClass}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}
        </nav>
        <div
          aria-hidden="true"
          className={`${doublePivot.className} fixed left-1/2 top-3 z-40 -translate-x-1/2 text-[28px] leading-none tracking-wide text-[#0222A0] opacity-60 md:text-[36px] min-[2000px]:top-5 min-[2000px]:text-[48px]`}
        >
          BATU
        </div>
      </header>

      {isOverlayMounted && overlayPanel === "info" && (
        <a
          href="https://stellamathioudakis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto fixed bottom-1 right-4 z-[110] hidden text-sm text-[#0222A0]/75 hover:line-through pb-[max(0.5rem,env(safe-area-inset-bottom))] md:block min-[2000px]:text-sm"
        >
          Site by stella mathioudakis
        </a>
      )}

      {isOverlayMounted && (
        <div
          className={[
            "fixed inset-0 z-[100] flex items-center justify-center bg-[#A74814] p-0 transition-opacity duration-300 md:p-8 min-[2000px]:p-12",
            overlayPanel === "info" ? "md:items-start md:pt-6 min-[2000px]:pt-10" : "",
            isOverlayVisible && !isOverlayClosing ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <div
            className={[
              "hide-scrollbar relative h-full max-h-[100svh] w-full max-w-full overflow-y-auto bg-[#A74814] px-4 pb-6 text-[#0222A0] transition-transform duration-200 md:h-auto md:max-h-[85vh] md:max-w-3xl md:p-8 min-[2000px]:max-w-5xl min-[2000px]:p-12",
              isOverlayVisible && !isOverlayClosing ? "translate-y-0" : "translate-y-0",
            ].join(" ")}
          >
            <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center justify-between bg-[#A74814] px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] md:-mx-8 md:mb-2 md:px-8 md:pt-10">
              <p className={overlayHeaderClass}>
                {overlayPanel === "projects" ? "Works" : "Info"}
              </p>
              <button
                type="button"
                onClick={closeOverlay}
                className={`${overlayHeaderClass} hidden hover:opacity-70 hover:line-through md:inline-flex`}
              >
                Close
              </button>
            </div>

            {overlayPanel === "info" ? (
              <div className={`${overlayBodyClass} md:mt-5 md:pr-8 min-[2000px]:mt-10`}>
                <p>
                  Known for his distinctive slant on modernist techno and leftfield
                  club music, Batu has built a sound defined by bold shapes,
                  percussive rhythms and meticulous sonic detail.
                </p>

                <p>
                  Recent years have marked a series of landmarks for Batu. He
                  celebrated a double milestone: 10 years of his future-facing
                  Timedance label and five years of En Masse Festival, a project he
                  founded, rooted in Bristol&apos;s innovative electronic music
                  scene. This period also saw production work for FKA twigs and
                  PinkPantheress, Shantie Celeste, collaborations with Tikiman and
                  Nick León and a remix for Tricky. He closed 2025 with a Mixmag
                  cover feature and named on their list of &ldquo;DJs Who Defined
                  2025&rdquo;.
                </p>

                <p>
                  2026 continues that momentum. Batu has delivered three new remixes
                  and launched DIALS, a band project rooted in smokey, lowslung pop
                  music that marks a new dimension to his creative output. Most
                  significantly, he released a collaborative album with the techno
                  great Donato Dozzy, a meeting of two of electronic music&apos;s
                  most distinctive voices.
                </p>

                <p>
                  As a DJ, Batu moves fluidly between the intimacy of underground
                  spaces and major international stages. Recent highlights include
                  sets at Draaimolen, Glastonbury and Drumsheds, alongside tours
                  across the US, Asia and South America.
                </p>

                <p>
                  His creative practice also extends into soundtrack work,
                  including scoring the short film Stepney Western, directed by
                  Harry Lawson.
                </p>

                <div className="space-y-3 pt-1 md:space-y-0 md:leading-snug">
                  <p className="md:pt-0">
                    Contact:{" "}
                    <a
                      href="mailto:batu@giantartistmanagement.com"
                      className="hover:line-through"
                    >
                      batu@giantartistmanagement.com
                    </a>
                  </p>
                  <p className="md:pt-1">
                    Bookings:{" "}
                    <a
                      href="mailto:matt@octopus-agents.com"
                      className="hover:line-through"
                    >
                      matt@octopus-agents.com
                    </a>
                    {" / "}
                    <a
                      href="mailto:flip@octopus-agents.com"
                      className="hover:line-through"
                    >
                      flip@octopus-agents.com
                    </a>
                  </p>
                  <p className="md:pt-1">
                    North/South America bookings:{" "}
                    <a
                      href="mailto:ricky@visionarytalentgroup.com"
                      className="hover:line-through"
                    >
                      ricky@visionarytalentgroup.com
                    </a>
                  </p>
                </div>

                <p className="pt-3 md:hidden">
                  Site by{" "}
                  <a
                    href="https://stellamathioudakis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:line-through"
                  >
                    stella mathioudakis
                  </a>
                </p>
              </div>
            ) : (
              <div className={`${overlayBodyClass} space-y-6 md:space-y-2 md:mt-5 md:pr-8 min-[2000px]:mt-20 min-[2000px]:space-y-10`}>
                <p className="flex flex-wrap items-center">
                  {worksLinks.map((item, index) => (
                    <span key={item.title} className="inline-flex items-center">
                      {index > 0 && <span className="px-1">/</span>}
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:line-through"
                      >
                        {item.title}
                      </a>
                    </span>
                  ))}
                </p>
                {collaborationYears.map((section) => (
                  <div key={section.year} className="space-y-3 md:space-y-4">
                    <p className="uppercase tracking-[0.08em]">{section.year}</p>
                    <ul className="space-y-3 md:space-y-4">
                      {section.items.map((item) => (
                        <li key={item.title}>
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:line-through"
                            >
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex justify-center bg-[#A74814] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
            <button
              type="button"
              onClick={closeOverlay}
              className={`pointer-events-auto ${overlayMobileActionClass} min-h-12 min-w-[8rem]`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none fixed z-40 hidden w-[140px] overflow-hidden shadow-2xl md:block"
        style={{
          left: `${imagePosition.x}px`,
          top: `${imagePosition.y}px`,
          opacity: activeImage ? 1 : 0,
          visibility: activeImage ? "visible" : "hidden",
        }}
      >
        {randomImages.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            decoding="async"
            className={`h-auto w-full object-cover ${activeImage === src ? "block" : "hidden"}`}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed z-30 hidden h-[180px] w-[210px] overflow-hidden bg-white/40 shadow-2xl md:block"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          opacity: activeVideo ? 1 : 0,
          visibility: activeVideo ? "visible" : "hidden",
        }}
      >
        {videos.map((src) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[src] = el;
            }}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`h-full w-full object-cover ${activeVideo === src ? "block" : "hidden"}`}
          />
        ))}
      </div>

      <section className="relative z-20 flex min-h-[100svh] items-center justify-center px-4 pb-[max(5rem,calc(4.5rem+env(safe-area-inset-bottom)))] pt-[max(0.75rem,env(safe-area-inset-top))] md:p-6 md:pb-16 min-[2000px]:p-10">
        <div className="flex w-full flex-col items-center gap-0 min-[2000px]:max-w-[640px]">
          <a
            href="https://k7.lnk.to/exhale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to Batu & Donato Dozzy — Exhale"
            className="block md:mt-16 lg:mt-12 min-[2000px]:mt-16"
          >
            <Image
              src={ALBUM_COVER_SRC}
              alt="Batu & Donato Dozzy — Exhale (album cover)"
              width={960}
              height={960}
              priority
              sizes="(max-width: 768px) 82vw, (max-width: 1024px) 380px, 350px"
              className="mb-2 h-auto w-[82vw] max-w-[82vw] object-contain md:w-[380px] md:max-w-none lg:w-[350px] min-[2000px]:w-[480px]"
            />
          </a>
          <a
            href="https://k7.lnk.to/exhale"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center font-light text-[13px] capitalize tracking-[0.1em] text-[#0222A0]/90 hover:line-through md:mt-3 md:text-lg min-[2000px]:text-2xl"
          >
            Batu & Donato Dozzy - 'Exhale'
          </a>
          <p className="text-center font-light text-[13px] lowercase tracking-[0rem] text-[#0222A0]/90 md:text-lg min-[2000px]:text-2xl">
            out 30/6, single 'Drift' out now
          </p>
          <div ref={newsletterZoneRef} className="mt-10 flex w-full max-w-[300px] flex-col items-center md:-mt-2 min-[2000px]:max-w-[420px]">
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
            <p className="pt-3 pb-2 text-center font-light text-[12px] uppercase leading-tight tracking-[0.08em] text-[#0222A0]/80 md:mb-4 md:mt-4 md:pt-10 md:pb-6 md:text-[18px] min-[2000px]:text-[22px]">
              subscribe to the newsletter
            </p>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            {newsletterSubmitted ? (
              <p className="w-full border-0 border-b border-[#0222A0]/90 bg-transparent px-1 pb-1 text-center text-[13px] uppercase tracking-[0.07em] text-[#0222A0] min-[2000px]:text-base">
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
                className="w-full border-0 border-b border-[#0222A0]/90 bg-transparent px-1 pb-1 text-center text-[13px] uppercase tracking-[0.07em] text-[#0222A0] placeholder:text-[#0222A0]/60 focus:outline-none min-[2000px]:text-base"
              />
            )}
            {newsletterError && (
              <p className="mt-2 text-center text-[11px] uppercase tracking-[0.06em] text-[#0222A0]/80 min-[2000px]:text-sm">
                {newsletterError}
              </p>
            )}
            {!newsletterSubmitted && hasValidEmail && (
              <button
                type="submit"
                className="mt-1 text-center text-[11px] uppercase tracking-[0.08em] text-[#0222A0] hover:opacity-70 min-[2000px]:text-sm"
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
