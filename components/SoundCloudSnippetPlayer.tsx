"use client";

import { useEffect, useRef, useState } from "react";

const SNIPPET_MS = 30_000;
const PLAYER_COLOR_HEX = "1b3a4b";
const WIDGET_SDK_SRC = "https://w.soundcloud.com/player/api.js";

type ScWidgetApi = {
  bind: (evt: string | number, cb: (...args: unknown[]) => void) => void;
  unbind?: (evt: string | number) => void;
  pause: () => void;
  seekTo: (ms: number) => void;
  getPosition: (cb: (ms: number) => void) => void;
};

type ScWidgetCtor = ((el: HTMLIFrameElement) => ScWidgetApi) & {
  Events?: { READY?: string | number; PLAY_PROGRESS?: string | number; PLAY?: string | number };
};

type WindowWithSC = Window & { SC?: { Widget?: ScWidgetCtor } };

/** HTTPS-normalize SoundCloud page URLs. */
export function widgetTrackEmbedUrl(trackPageHref: string): string {
  try {
    const u = new URL(trackPageHref);
    if (u.hostname.replace(/^www\./, "") !== "soundcloud.com") return trackPageHref;
    u.protocol = "https:";
    return u.toString();
  } catch {
    return trackPageHref;
  }
}

/**
 * URL passed to w.soundcloud.com/player `url=` — must NOT be soundcloud.com/track/:digits only
 * (widget shows “not a valid SoundCloud URL”). Use api.soundcloud.com/tracks/:id or /user/slug.
 */
export function embedUrlForWidget(trackPageHref: string): string {
  const u = widgetTrackEmbedUrl(trackPageHref);
  try {
    const parsed = new URL(u);
    if (parsed.hostname.replace(/^www\./, "") !== "soundcloud.com") return u;
    const m = /^\/track\/(\d+)\/?$/i.exec(parsed.pathname);
    if (m) return `https://api.soundcloud.com/tracks/${m[1]}`;
    return parsed.toString();
  } catch {
    return trackPageHref;
  }
}

function buildIframeSrc(embedUrl: string): string | null {
  const trimmed = embedUrl.trim();
  if (!trimmed) return null;
  const p = new URLSearchParams({
    url: trimmed,
    color: PLAYER_COLOR_HEX,
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    sharing: "false",
    buying: "false",
    downloading: "false",
    visual: "false",
    show_teaser: "false",
  });
  return `https://w.soundcloud.com/player/?${p}`;
}

let sdkPromise: Promise<void> | null = null;

function scResolved(): boolean {
  const Widget = (typeof window !== "undefined" ? (window as WindowWithSC).SC?.Widget : null) ?? null;
  return Boolean(Widget && typeof Widget === "function" && Widget.Events?.PLAY_PROGRESS);
}

function ensureWidgetSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (scResolved()) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SDK_SRC}"]`);
    if (existing) {
      if (scResolved()) {
        resolve();
        return;
      }
      existing.addEventListener(
        "load",
        () => {
          scResolved()
            ? resolve()
            : reject(new Error("SoundCloud Widget API unavailable"));
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => reject(new Error("SoundCloud sdk failed")),
        { once: true },
      );
      return;
    }

    const s = document.createElement("script");
    s.async = true;
    s.src = WIDGET_SDK_SRC;
    s.onload = () => {
      scResolved()
        ? resolve()
        : reject(new Error("SoundCloud Widget API unavailable"));
    };
    s.onerror = () => reject(new Error("SoundCloud sdk network error"));
    document.body.appendChild(s);
  });

  return sdkPromise;
}

type Props = {
  title: string;
  pageHref: string;
  onDismiss: () => void;
  variant?: "card" | "inline";
};

function resourceResponseStatus(entry: PerformanceResourceTiming): number | undefined {
  const r = entry as PerformanceResourceTiming & { responseStatus?: number };
  return typeof r.responseStatus === "number" ? r.responseStatus : undefined;
}

export function SoundCloudSnippetPlayer({
  title,
  pageHref,
  onDismiss,
  variant = "card",
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const streamEpochRef = useRef(0);
  const [playbackUrl, setPlaybackUrl] = useState(() => embedUrlForWidget(pageHref));
  const [widgetSrc, setWidgetSrc] = useState<string | null>(() => buildIframeSrc(embedUrlForWidget(pageHref)));
  const [iframeRemount, setIframeRemount] = useState(0);
  const [streamUnavailable, setStreamUnavailable] = useState(false);

  useEffect(() => {
    setPlaybackUrl(embedUrlForWidget(pageHref));
  }, [pageHref]);

  useEffect(() => {
    let cancelled = false;
    const m = pageHref.match(/soundcloud\.com\/track\/(\d+)/i);
    if (!m) return;

    fetch(`/api/soundcloud-resolve?id=${encodeURIComponent(m[1])}`)
      .then((r) => r.json())
      .then((d: { permalinkUrl?: string | null }) => {
        if (cancelled || !d?.permalinkUrl) return;
        setPlaybackUrl(widgetTrackEmbedUrl(d.permalinkUrl));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [pageHref]);

  useEffect(() => {
    const manual = buildIframeSrc(playbackUrl);
    setWidgetSrc(manual);

    let cancelled = false;
    fetch(`/api/soundcloud-oembed-player?resource=${encodeURIComponent(playbackUrl)}`)
      .then((r) => r.json())
      .then((d: { playerSrc?: string | null }) => {
        if (cancelled || !d?.playerSrc) return;
        setWidgetSrc(d.playerSrc);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [playbackUrl]);

  useEffect(() => {
    streamEpochRef.current = performance.now();
    setStreamUnavailable(false);
  }, [widgetSrc, pageHref, iframeRemount]);

  useEffect(() => {
    if (!widgetSrc) return;

    const looksLikeWidgetStream = (url: string) =>
      url.includes("api-widget.soundcloud.com") && url.includes("/stream/");

    const scanForStreamFailure = () => {
      const epoch = streamEpochRef.current;
      try {
        const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
        for (const e of entries) {
          if (!looksLikeWidgetStream(e.name)) continue;
          if (e.startTime < epoch) continue;
          const status = resourceResponseStatus(e);
          if (status === 404 || status === 403) {
            setStreamUnavailable(true);
            return;
          }
        }
      } catch {
        /* ignore */
      }
    };

    const t1 = window.setTimeout(scanForStreamFailure, 1800);
    const t2 = window.setTimeout(scanForStreamFailure, 4500);

    let obs: PerformanceObserver | null = null;
    try {
      obs = new PerformanceObserver(() => scanForStreamFailure());
      obs.observe({ type: "resource", buffered: true } as PerformanceObserverInit);
    } catch {
      try {
        obs = new PerformanceObserver(() => scanForStreamFailure());
        obs.observe({ entryTypes: ["resource"] });
      } catch {
        /* ignore */
      }
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      obs?.disconnect();
    };
  }, [widgetSrc, iframeRemount]);

  useEffect(() => {
    let cancelled = false;
    const iframe = iframeRef.current;
    if (!iframe) return;

    let widget: ScWidgetApi | null = null;

    const teardown = () => {
      try {
        const WidgetCtor = (typeof window !== "undefined" ? (window as WindowWithSC).SC?.Widget : null) ?? null;
        const Events = WidgetCtor?.Events ?? {};
        if (widget) {
          for (const k of ["PLAY_PROGRESS", "READY", "PLAY"] as const) {
            const ev = Events[k];
            if (ev !== undefined) widget.unbind?.(ev as string | number);
          }
        }
      } catch {
        /* ignore */
      }
      try {
        widget?.pause();
      } catch {
        /* ignore */
      }
    };

    void (async () => {
      try {
        await ensureWidgetSdk();
      } catch {
        return;
      }
      if (cancelled || !iframeRef.current) return;

      const WidgetCtor = (window as WindowWithSC).SC?.Widget;
      const READY = WidgetCtor?.Events?.READY;
      const PLAY_PROGRESS = WidgetCtor?.Events?.PLAY_PROGRESS;
      const PLAY = WidgetCtor?.Events?.PLAY;

      if (typeof WidgetCtor !== "function" || !PLAY_PROGRESS) return;

      widget = WidgetCtor(iframeRef.current);

      let capped = false;

      const onProgress = () => {
        widget?.getPosition((ms: number) => {
          if (cancelled) return;
          if (ms >= SNIPPET_MS && !capped) {
            capped = true;
            widget?.pause();
            widget?.seekTo(0);
          }
        });
      };

      const onReady = () => {
        capped = false;
      };

      const onPlay = () => {
        capped = false;
      };

      if (typeof PLAY === "string" || typeof PLAY === "number") {
        widget.bind(PLAY, onPlay);
      }
      if (typeof READY === "string" || typeof READY === "number") {
        widget.bind(READY, onReady);
      }
      widget.bind(PLAY_PROGRESS, onProgress);
    })();

    return () => {
      cancelled = true;
      teardown();
    };
  }, [widgetSrc, iframeRemount]);

  const iframeEl = widgetSrc ? (
    <iframe
      key={`${widgetSrc}__${iframeRemount}`}
      ref={iframeRef}
      title={`SoundCloud preview: ${title}`}
      src={widgetSrc}
      width="100%"
      height={variant === "inline" ? 88 : 120}
      className={
        variant === "inline"
          ? "mt-2 block rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_25%,transparent)] bg-[var(--color-shell)]"
          : "mt-3 rounded-lg bg-black/[0.04]"
      }
      allow="autoplay"
      referrerPolicy="no-referrer"
    />
  ) : (
    <p className="mt-2 text-[11px] text-[color:color-mix(in_srgb,var(--color-ink)_55%,transparent)]">
      Missing track URL — open on SoundCloud instead.
    </p>
  );

  if (variant === "inline") {
    return (
      <div className="border-t border-[color:color-mix(in_srgb,var(--color-sand)_38%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-tide)_55%,transparent),color-mix(in_srgb,var(--color-shell)_92%,transparent))] px-4 pb-3 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow !text-[var(--color-deep-sea)]">Sample · 30 seconds</p>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-full border border-black/15 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-ink)_72%,transparent)] transition hover:border-black/35"
          >
            Close
          </button>
        </div>
        {iframeEl}
        {streamUnavailable ? (
          <p className="mt-2 rounded-md border border-amber-700/25 bg-amber-500/10 px-2 py-1.5 text-[11px] leading-snug text-[color:color-mix(in_srgb,var(--color-ink)_78%,transparent)]">
            SoundCloud couldn&apos;t deliver a stream for this embed (often geo, rights, or an expired
            link on their side).&nbsp;
            <button
              type="button"
              className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px] hover:decoration-[var(--color-lagoon)]"
              onClick={() => setIframeRemount((n) => n + 1)}
            >
              Retry preview
            </button>
            &nbsp;·&nbsp;
            <a
              href={pageHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
            >
              Open on SoundCloud →
            </a>
          </p>
        ) : null}
        <p className="mt-2 text-[11px] leading-snug text-[color:color-mix(in_srgb,var(--color-ink)_48%,transparent)]">
          Streams via SoundCloud&apos;s player.&nbsp;
          <a
            href={pageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-deep-sea)] underline decoration-[color:color-mix(in_srgb,var(--color-deep-sea)_35%,transparent)] underline-offset-[2px] hover:decoration-[var(--color-lagoon)]"
          >
            Full track →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-sand)_30%,transparent)] bg-[var(--color-shell)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="eyebrow !text-[var(--color-deep-sea)]">30 sec preview</p>
          <p className="mt-1 font-heading text-base text-[var(--color-deep-sea)]">{title}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-full border border-black/15 px-3 py-1 text-[11px] text-[color:color-mix(in_srgb,var(--color-ink)_75%,transparent)] transition hover:border-black/35"
        >
          Close
        </button>
      </div>
      {iframeEl}
      {streamUnavailable ? (
        <p className="mt-2 rounded-md border border-amber-700/25 bg-amber-500/10 px-2 py-1.5 text-[11px] text-[color:color-mix(in_srgb,var(--color-ink)_78%,transparent)]">
          No stream from SoundCloud for this track in the embed.&nbsp;
          <button
            type="button"
            className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
            onClick={() => setIframeRemount((n) => n + 1)}
          >
            Retry
          </button>
          &nbsp;·&nbsp;
          <a
            href={pageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
          >
            Open on SoundCloud →
          </a>
        </p>
      ) : null}
      <p className="mt-2 text-[11px] text-[color:color-mix(in_srgb,var(--color-ink)_48%,transparent)]">
        Audio streams from SoundCloud (same geo / rights as there).{" "}
        <a
          href={pageHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
        >
          Open full track →
        </a>
      </p>
    </div>
  );
}
