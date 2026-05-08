"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type WorkshopWebsite = {
  title: string;
  tag: string;
  chips: readonly string[];
  description: string;
  previewUrl: string;
  href: string;
};

/** Live sites — add entries here; `previewUrl` loads inside the scroll area. */
const websites: readonly WorkshopWebsite[] = [
  {
    title: "Evergreen Solutions FL",
    tag: "Founder & CEO · Ecological restoration",
    chips: [
      "Native restoration",
      "Land management",
      "Habitat consulting",
      "Invasive species control",
    ],
    description:
      "Field-led ecological restoration across Florida: native plantings, land management, assessments, and measurable habitat outcomes.",
    previewUrl: "https://www.evergreensolutionsfl.com/",
    href: "https://evergreensolutionsfl.com",
  },
  {
    title: "Pure Asset Group",
    tag: "Small & mid-market financing consultants",
    chips: ["Asset-backed loans", "Term financing", "RBF", "Lender placement"],
    description:
      "Consulting-led brand presence for SMEs raising $50K–$5M+ — asset-backed, term, and revenue-based financing with clear funnel to apply and explore solutions.",
    previewUrl: "https://www.pureassetgrp.com/",
    href: "https://www.pureassetgrp.com/",
  },
  {
    title: "Nice'n Tight Sportfishing",
    tag: "Costa Rica charter fleet · Playa Garza, Nosara",
    chips: ["Offshore charters", "Inshore roosterfish", "Bookings funnel"],
    description:
      "Premier Nosara sportfishing site for Captain Eduardo — trip positioning, imagery, and a path to charter booking with an emphasis on offshore and inshore programs.",
    previewUrl: "https://www.nicentightcr.com/",
    href: "https://www.nicentightcr.com/",
  },
  {
    title: "Beachside Beans",
    tag: "Coffee roastery e-commerce · Satellite Beach, FL",
    chips: ["Next.js", "Small-batch SKUs", "Merch & markets", "Vercel"],
    description:
      "Shop-forward roastery experience for fresh roasts out of Satellite Beach — product grids, roast notes, flip-card packaging detail, markets story, and clean CTAs.",
    previewUrl: "https://beachside-beans.vercel.app/",
    href: "https://beachside-beans.vercel.app/",
  },
  {
    title: "Eco Green Nosara",
    tag: "Eco-tourism · Nosara, Costa Rica",
    chips: ["Sustainable tours", "Bookings funnel", "Nature-first copy", "Expert guides"],
    description:
      "Immersive Nosara eco-adventure brand: sustainable tour positioning, biodiversity narrative, and streamlined explore / book paths aligned with responsible travel.",
    previewUrl: "https://ecogreen-six.vercel.app/",
    href: "https://ecogreen-six.vercel.app/",
  },
  {
    title: "Parkview Advance",
    tag: "SMB financing · Public platform",
    chips: ["SBA products", "Equipment financing", "Asset-based loans", "LOC & RBF"],
    description:
      "Lead-generation and education site for America’s small-business credit stack — products, Parkview advantage story, client proof, and multiple apply / inquire funnels.",
    previewUrl: "https://parkviewadvance.com/",
    href: "https://parkviewadvance.com/",
  },
];

/** Continuous horizontal drift speed (pixels per second). */
const AUTO_SCROLL_SPEED_PX_PER_SEC = 28;

/** Pause auto-scroll briefly after programmatic jump via dots or arrows. */
const PAUSE_AFTER_DOT_MS = 4_800;

function previewHostname(displayUrl: string) {
  try {
    const u = new URL(displayUrl);
    return u.hostname.replace(/^www\./, "") || displayUrl;
  } catch {
    return displayUrl;
  }
}

function WebsitePreviewSlide({
  site,
  index,
  slideIndex,
}: {
  site: WorkshopWebsite;
  index: number;
  slideIndex: number;
}) {
  const host = previewHostname(site.href);

  return (
    <div
      data-carousel-slide={slideIndex}
      className="group w-[min(calc(100vw-1.25rem),560px)] shrink-0 sm:w-[min(calc(100vw-2rem),740px)] lg:w-[min(calc(100vw-2.25rem),980px)] xl:w-[min(1120px,calc(100vw-2rem))]"
    >
      <Reveal className="h-full" delay={index * 0.04}>
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-deep-sea)_14%,transparent)] bg-[var(--color-shell)] shadow-[0_12px_40px_-18px_color-mix(in_srgb,var(--color-deep-sea)_50%,transparent)] transition-shadow duration-300 group-hover:shadow-[0_16px_44px_-14px_color-mix(in_srgb,var(--color-deep-sea)_55%,transparent)]">
          <div className="border-b border-[color:color-mix(in_srgb,var(--color-deep-sea)_10%,transparent)] px-4 py-3 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow text-[0.7rem] text-[var(--color-lagoon)] sm:text-[0.72rem]">{site.tag}</p>
                <h3 className="mt-1 font-heading text-xl leading-snug text-[var(--color-deep-sea)] sm:text-2xl lg:text-[1.65rem]">
                  {site.title}
                </h3>
              </div>
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-sm bg-[var(--color-deep-sea)] px-3 py-2 text-xs font-medium text-[var(--color-shell)] transition hover:bg-[var(--color-lagoon)] sm:px-4"
              >
                Open ↗
              </a>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5 sm:max-h-7 sm:overflow-hidden">
              {site.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[color:color-mix(in_srgb,var(--color-deep-sea)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--color-deep-sea)_4%,transparent)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--color-deep-sea)] sm:text-[10px]"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[color:color-mix(in_srgb,var(--color-ink)_72%,transparent)] sm:line-clamp-2 sm:text-sm">
              {site.description}
            </p>
          </div>

          <div className="border-b border-[color:color-mix(in_srgb,var(--color-deep-sea)_8%,transparent)] bg-[color:color-mix(in_srgb,var(--color-deep-sea)_5%,#f2ede4)] px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span className="flex shrink-0 gap-1" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#e08b88]" />
                <span className="h-2 w-2 rounded-full bg-[#e6c04a]" />
                <span className="h-2 w-2 rounded-full bg-[#7b9e6b]" />
              </span>
              <div className="min-w-0 flex-1 truncate rounded-md border border-[color:color-mix(in_srgb,var(--color-deep-sea)_10%,transparent)] bg-[var(--color-shell)] px-2 py-0.5 font-mono text-[10px] text-[color:color-mix(in_srgb,var(--color-ink)_55%,transparent)]">
                <span className="text-[var(--color-canopy)]">live</span> · {host}
              </div>
            </div>
          </div>

          <div className="relative min-h-[min(38vh,300px)] flex-1 bg-[color:color-mix(in_srgb,var(--color-deep-sea)_6%,white)] sm:min-h-[min(42vh,360px)] lg:min-h-[min(46vh,420px)]">
            <iframe
              title={`Live preview · ${site.title}`}
              src={site.previewUrl}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full min-h-[min(38vh,300px)] w-full border-0 sm:min-h-[min(42vh,360px)] lg:min-h-[min(46vh,420px)]"
              referrerPolicy="no-referrer-when-downgrade"
              allow="fullscreen; clipboard-write"
            />
          </div>

          <p className="border-t border-[color:color-mix(in_srgb,var(--color-deep-sea)_8%,transparent)] px-3 py-2 text-center text-[10px] text-[color:color-mix(in_srgb,var(--color-ink)_48%,transparent)] sm:text-[11px]">
            Scroll inside to interact · embed may limit some features
          </p>
        </article>
      </Reveal>
    </div>
  );
}

function WebsiteShowcaseCarousel({ sites }: { sites: readonly WorkshopWebsite[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const directionRef = useRef<1 | -1>(1);
  const resumeTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  const bumpActiveHighlight = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || sites.length <= 1) return;
    const slides = el.querySelectorAll<HTMLElement>("[data-carousel-slide]");
    if (!slides.length) return;
    const r = el.getBoundingClientRect();
    const mid = r.left + r.width / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide) => {
      const s = slide.getBoundingClientRect();
      const c = s.left + s.width / 2;
      const d = Math.abs(mid - c);
      if (d < bestDist) {
        bestDist = d;
        best = Number(slide.dataset.carouselSlide) || 0;
      }
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
    }
  }, [sites.length]);

  const pauseThenResumeMs = useCallback((ms: number) => {
    pausedRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, ms);
  }, []);

  const scrollToSlide = useCallback(
    (i: number, behavior: ScrollBehavior) => {
      const root = scrollerRef.current;
      const el = root?.querySelector<HTMLElement>(`[data-carousel-slide="${i}"]`);
      pauseThenResumeMs(PAUSE_AFTER_DOT_MS);
      el?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
      activeRef.current = i;
      setActive(i);
    },
    [pauseThenResumeMs],
  );

  const goRelative = useCallback(
    (delta: number) => {
      const n = sites.length;
      const i = (((activeRef.current + delta) % n) + n) % n;
      const reduce =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scrollToSlide(i, reduce ? "auto" : "smooth");
    },
    [sites.length, scrollToSlide],
  );

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || sites.length <= 1) return;

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let rafId = 0;
    let last = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.064, Math.max(0, (now - last) / 1000));
      last = now;

      const max = el.scrollWidth - el.clientWidth;
      if (max > 0 && !pausedRef.current && !document.hidden) {
        let nextScroll = el.scrollLeft + directionRef.current * AUTO_SCROLL_SPEED_PX_PER_SEC * dt;

        if (nextScroll >= max) {
          nextScroll = max;
          directionRef.current = -1;
        } else if (nextScroll <= 0) {
          nextScroll = 0;
          directionRef.current = 1;
        }

        el.scrollLeft = nextScroll;

        frame += 1;
        if (frame % 5 === 0) bumpActiveHighlight();
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [sites.length, bumpActiveHighlight]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || sites.length <= 1) return;

    let debounce: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => bumpActiveHighlight(), 90);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(debounce);
      el.removeEventListener("scroll", onScroll);
    };
  }, [sites.length, bumpActiveHighlight]);

  const reduceMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="mt-8 w-full">
      <div
        className="relative w-full rounded-2xl border border-[color:color-mix(in_srgb,var(--color-deep-sea)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_55%,var(--color-tide))] p-2 sm:p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-tide)]"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Live site previews — use arrow keys, buttons, or dots"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (sites.length > 1) goRelative(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            if (sites.length > 1) goRelative(1);
          }
        }}
      >
        {sites.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous site preview"
              onClick={() => goRelative(-1)}
              className="absolute left-2 top-[44%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-deep-sea)_15%,transparent)] bg-[var(--color-deep-sea)] text-[var(--color-shell)] shadow-md transition hover:bg-[var(--color-lagoon)] sm:left-3 sm:h-11 sm:w-11 lg:left-4"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next site preview"
              onClick={() => goRelative(1)}
              className="absolute right-2 top-[44%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-deep-sea)_15%,transparent)] bg-[var(--color-deep-sea)] text-[var(--color-shell)] shadow-md transition hover:bg-[var(--color-lagoon)] sm:right-3 sm:h-11 sm:w-11 lg:right-4"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}

        <div
          ref={scrollerRef}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocusCapture={() => {
            pausedRef.current = true;
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              pausedRef.current = false;
            }
          }}
          className={`hide-scrollbar mx-auto flex w-full overflow-x-auto overscroll-x-contain py-1 sm:gap-5 ${
            sites.length === 1
              ? "justify-center gap-3 px-2"
              : "justify-start gap-3 px-14 sm:gap-5 sm:px-16 md:px-20"
          }`}
          style={{ scrollPaddingInline: "max(20px, min(10vw, 96px))" }}
        >
          {sites.map((site, index) => (
            <WebsitePreviewSlide key={site.title} site={site} index={index} slideIndex={index} />
          ))}
        </div>
      </div>

      {sites.length > 1 ? (
        <div className="mt-3 flex flex-col items-center gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-ink)_40%,transparent)]">
            Preview {active + 1} / {sites.length}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Choose a site preview">
            {sites.map((site, i) => (
              <button
                key={site.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${site.title}`}
                onClick={() => scrollToSlide(i, reduceMotion ? "auto" : "smooth")}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === active
                    ? "w-7 bg-[var(--color-deep-sea)]"
                    : "w-2 bg-[color:color-mix(in_srgb,var(--color-deep-sea)_30%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--color-deep-sea)_48%,transparent)]"
                }`}
              />
            ))}
          </div>
          <p className="max-w-[28ch] text-center text-[11px] leading-snug text-[color:color-mix(in_srgb,var(--color-ink)_45%,transparent)]">
            {reduceMotion ? (
              <>Arrow keys · side buttons · drag — motion-safe mode skips drift.</>
            ) : (
              <>
                Gentle auto drift · hover to pause · <kbd className="rounded border px-1">←</kbd>{" "}
                <kbd className="rounded border px-1">→</kbd> when focused · tap inside the frame to scroll the site.
              </>
            )}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-center text-[11px] text-[color:color-mix(in_srgb,var(--color-ink)_45%,transparent)]">
          Scroll inside the preview to explore the live site.
        </p>
      )}
    </div>
  );
}

export default function Workshop() {
  return (
    <section id="work" className="bg-[var(--color-tide)] py-24">
      <div className="section-wrap">
        <Reveal>
          <p className="eyebrow !text-[var(--color-deep-sea)]">Recent Builds</p>
          <h2 className="font-heading text-5xl text-[var(--color-deep-sea)]">The Workshop</h2>
          <p className="mt-3 max-w-3xl text-[color:color-mix(in_srgb,var(--color-ink)_78%,transparent)]">
            Live previews across the builds — drift, arrows, dots, or keyboard when the carousel is focused. Hover to pause
            and scroll inside each embed like a miniature browser pane.
          </p>
        </Reveal>

        <WebsiteShowcaseCarousel sites={websites} />
      </div>
    </section>
  );
}
