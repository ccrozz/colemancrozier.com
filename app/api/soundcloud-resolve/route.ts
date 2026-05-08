import { NextResponse } from "next/server";

/**
 * Resolves `soundcloud.com/track/:numericId` to a canonical permalink for the embed widget.
 * Numeric-only URLs often yield flaky stream responses from api-widget.soundcloud.com (404 on media endpoints).
 */

function slugifyPermalinkSegment(title: string): string {
  return title
    .replace(/\s*\([^)]*feat[^)]*\)/gi, "")
    .replace(/\s*\[[^\]]*\]/g, "")
    .replace(/\s*(official|audio|video|lyrics)\s*$/gi, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractTrackIdFromOembedHtml(html: string): number | null {
  const decoded = html.replace(/&amp;/g, "&");
  const m =
    decoded.match(/api\.soundcloud\.com%2Ftracks%2F(\d+)/) ??
    decoded.match(/api\.soundcloud\.com\/tracks\/(\d+)/);
  return m ? Number(m[1]) : null;
}

async function fetchOembed(trackUrl: string) {
  const u = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trackUrl)}`;
  const res = await fetch(u, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/soundcloud-resolve/1.0)",
    },
    next: { revalidate: 604800 },
  });
  if (!res.ok) return null;
  return (await res.json()) as { html?: string; author_url?: string; title?: string };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("id");
  const id = rawId ? Number.parseInt(rawId, 10) : NaN;
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const apiTrackUrl = `https://api.soundcloud.com/tracks/${id}`;
  const meta = await fetchOembed(apiTrackUrl);
  if (!meta?.author_url || typeof meta.author_url !== "string") {
    return NextResponse.json({ permalinkUrl: null }, { status: 200 });
  }

  let userSlug: string;
  try {
    userSlug = new URL(meta.author_url).pathname.replace(/^\/+|\/+$/g, "").split("/")[0] ?? "";
  } catch {
    return NextResponse.json({ permalinkUrl: null }, { status: 200 });
  }
  if (!userSlug) {
    return NextResponse.json({ permalinkUrl: null }, { status: 200 });
  }

  const rawTitle = typeof meta.title === "string" ? meta.title.replace(/\.\s*$/, "").trim() : "";
  const byIdx = rawTitle.lastIndexOf(" by ");
  const trackTitle = byIdx === -1 ? rawTitle : rawTitle.slice(0, byIdx).trim();
  const base = slugifyPermalinkSegment(trackTitle);
  if (!base) {
    return NextResponse.json({ permalinkUrl: null }, { status: 200 });
  }

  const suffixes = [
    "",
    "-1",
    "-2",
    "-3",
    "-official",
    "-remix",
    "-radio-edit",
    "-extended",
    "-original-mix",
  ];
  for (const suf of suffixes) {
    const slug = base + suf;
    const candidate = `https://soundcloud.com/${userSlug}/${slug}`;
    const verify = await fetchOembed(candidate);
    if (!verify?.html) continue;
    const resolvedId = extractTrackIdFromOembedHtml(verify.html);
    if (resolvedId === id) {
      return NextResponse.json({ permalinkUrl: candidate });
    }
  }

  return NextResponse.json({ permalinkUrl: null }, { status: 200 });
}
