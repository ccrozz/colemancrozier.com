import { NextResponse } from "next/server";

const PLAYER_COLOR = "1b3a4b";

function isAllowedResourceUrl(candidate: string): boolean {
  try {
    const u = new URL(candidate);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "soundcloud.com") return true;
    if (host === "api.soundcloud.com" && u.pathname.startsWith("/tracks/")) return true;
    return false;
  } catch {
    return false;
  }
}

function extractIframeSrc(html: string): string | null {
  const m = html.match(/\bsrc="([^"]+)"/);
  if (!m) return null;
  return m[1].replace(/&amp;/g, "&").replace(/&#038;/g, "&");
}

/** Keeps SoundCloud’s inner `url=` resource; applies our compact chrome + autoplay. */
function mergeWidgetParams(playerSrc: string): string {
  try {
    const u = new URL(playerSrc);
    if (u.hostname !== "w.soundcloud.com") return playerSrc;

    u.searchParams.set("visual", "false");
    u.searchParams.set("color", PLAYER_COLOR);
    u.searchParams.set("auto_play", "true");
    u.searchParams.set("hide_related", "true");
    u.searchParams.set("show_comments", "false");
    u.searchParams.set("show_user", "true");
    u.searchParams.set("sharing", "false");
    u.searchParams.set("buying", "false");
    u.searchParams.set("downloading", "false");
    u.searchParams.set("show_teaser", "false");

    return u.toString();
  } catch {
    return playerSrc;
  }
}

/**
 * Returns the widget iframe URL SoundCloud serves via oEmbed (same chain as their embed dialog).
 * Helps avoid mismatches between hand-built query strings and their player expectations.
 */
export async function GET(request: Request) {
  const resource = new URL(request.url).searchParams.get("resource");
  if (!resource || !isAllowedResourceUrl(resource)) {
    return NextResponse.json({ error: "Invalid resource" }, { status: 400 });
  }

  const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(resource)}`;
  const res = await fetch(oembedUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/oembed-player/1.0)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ playerSrc: null }, { status: 200 });
  }

  const data = (await res.json()) as { html?: string };
  const html = typeof data.html === "string" ? data.html : "";
  const raw = extractIframeSrc(html);
  if (!raw) {
    return NextResponse.json({ playerSrc: null }, { status: 200 });
  }

  return NextResponse.json({ playerSrc: mergeWidgetParams(raw) });
}
