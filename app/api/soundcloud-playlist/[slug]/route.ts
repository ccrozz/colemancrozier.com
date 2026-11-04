import { NextResponse } from "next/server";

/** Playlist index can batch many track lookups; allow long enough on serverless. */
export const maxDuration = 60;

const PROFILE = "https://soundcloud.com/colecrozier";

/** Only playlists we surface on the site: prevents open proxy fetches. */
const ALLOWED_SLUGS = new Set([
  "dnb",
  "i-went-to-horny-jail",
  "never-be-the-same",
  "night-rider",
  "old-school",
  "rad-ass-bitch",
]);

const OEMBED_API_TRACK = "https://api.soundcloud.com/tracks";
const OEMBED_BATCH_DELAY_MS = 100;
const OEMBED_BATCH_SIZE = 12;
const API_V2_TRACK_CHUNK = 50;

type TrackOut = { title: string; href: string; artist: string | null };

function extractTopLevelJsonArray(html: string): unknown[] | null {
  const needle = "__sc_hydration = ";
  const idx = html.indexOf(needle);
  if (idx === -1) return null;
  let i = idx + needle.length;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (html[i] !== "[") return null;
  let depth = 0;
  let inStr = false;
  let escape = false;
  const start = i;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === "\"") inStr = false;
      continue;
    }
    if (c === "\"") {
      inStr = true;
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1)) as unknown[];
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function splitOEmbedTitle(raw: string): { title: string; artist: string | null } {
  const trimmed = raw.replace(/\.\s*$/, "").trim();
  const marker = " by ";
  const idx = trimmed.lastIndexOf(marker);
  if (idx === -1) return { title: trimmed, artist: null };
  return {
    title: trimmed.slice(0, idx).trim(),
    artist: trimmed.slice(idx + marker.length).trim() || null,
  };
}

async function discoverClientId(): Promise<string | null> {
  try {
    const pageRes = await fetch("https://soundcloud.com", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/playlist-index/1.0)",
        Accept: "text/html",
      },
      next: { revalidate: 86_400 },
    });
    if (!pageRes.ok) return null;
    const html = await pageRes.text();
    const srcs = [...html.matchAll(/<script[^>]+src="(https:\/\/[^"]+sndcdn[^"]+\.js)"/g)].map(
      (m) => m[1],
    );

    for (const src of srcs.slice().reverse()) {
      try {
        const jsRes = await fetch(src, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/playlist-index/1.0)",
          },
          next: { revalidate: 86_400 },
        });
        if (!jsRes.ok) continue;
        const body = await jsRes.text();
        const match =
          body.match(/client_id:"([A-Za-z0-9]{16,40})"/) ??
          body.match(/client_id=([A-Za-z0-9]{16,40})/);
        if (match?.[1]) return match[1];
      } catch {
        /* try next asset */
      }
    }
  } catch {
    /* fall through */
  }
  return null;
}

type ApiV2Track = {
  id?: number;
  title?: string;
  permalink_url?: string;
  user?: { username?: string };
};

type ApiV2Playlist = {
  title?: string;
  permalink_url?: string;
  track_count?: number;
  tracks?: ApiV2Track[];
};

async function fetchPlaylistViaApiV2(setUrl: string): Promise<{
  playlistTitle: string;
  playlistUrl: string;
  trackCount: number;
  tracks: TrackOut[];
} | null> {
  const clientId = await discoverClientId();
  if (!clientId) return null;

  const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(setUrl)}&client_id=${clientId}`;
  const resolveRes = await fetch(resolveUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/playlist-index/1.0)",
    },
    // Playlist membership changes when songs are added: keep this fresh.
    cache: "no-store",
  });
  if (!resolveRes.ok) return null;

  const playlist = (await resolveRes.json()) as ApiV2Playlist;
  const stubs = Array.isArray(playlist.tracks) ? playlist.tracks : [];
  const ids = stubs
    .map((t) => (typeof t?.id === "number" ? t.id : null))
    .filter((id): id is number => id !== null);
  if (ids.length === 0) return null;

  const byId = new Map<number, ApiV2Track>();

  for (const t of stubs) {
    if (typeof t?.id === "number" && typeof t.title === "string" && t.title && typeof t.permalink_url === "string") {
      byId.set(t.id, t);
    }
  }

  const missing = ids.filter((id) => !byId.has(id));
  for (let i = 0; i < missing.length; i += API_V2_TRACK_CHUNK) {
    const chunk = missing.slice(i, i + API_V2_TRACK_CHUNK);
    const tracksUrl = `https://api-v2.soundcloud.com/tracks?ids=${chunk.join(",")}&client_id=${clientId}`;
    try {
      const tracksRes = await fetch(tracksUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/playlist-index/1.0)",
        },
        next: { revalidate: 3600 },
      });
      if (!tracksRes.ok) continue;
      const batch = (await tracksRes.json()) as ApiV2Track[];
      if (!Array.isArray(batch)) continue;
      for (const t of batch) {
        if (typeof t?.id === "number") byId.set(t.id, t);
      }
    } catch {
      /* keep going; fall back per-id below */
    }
  }

  const tracks: TrackOut[] = ids.map((id) => {
    const t = byId.get(id);
    if (t && typeof t.title === "string" && t.title && typeof t.permalink_url === "string") {
      return {
        title: t.title,
        href: t.permalink_url,
        artist: typeof t.user?.username === "string" ? t.user.username : null,
      };
    }
    return {
      title: "Track",
      href: `https://soundcloud.com/track/${id}`,
      artist: null,
    };
  });

  const trackCount =
    typeof playlist.track_count === "number" ? playlist.track_count : tracks.length;

  return {
    playlistTitle: typeof playlist.title === "string" ? playlist.title : "Playlist",
    playlistUrl: typeof playlist.permalink_url === "string" ? playlist.permalink_url : setUrl,
    trackCount,
    tracks,
  };
}

type PlaylistHydration = {
  title?: string;
  permalink_url?: string;
  track_count?: number;
  tracks?: unknown[];
};

type PlaylistTrackSlot =
  | { kind: "full"; title: string; href: string; artist: string | null }
  | { kind: "stub"; id: number };

async function fetchTrackTitlesFromOEmbed(
  ids: readonly number[],
): Promise<Map<number, { title: string; artist: string | null }>> {
  const out = new Map<number, { title: string; artist: string | null }>();

  for (let b = 0; b < ids.length; b += OEMBED_BATCH_SIZE) {
    const chunk = ids.slice(b, b + OEMBED_BATCH_SIZE);
    await Promise.all(
      chunk.map(async (id) => {
        try {
          const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
            `${OEMBED_API_TRACK}/${id}`,
          )}`;
          const res = await fetch(oembedUrl, {
            headers: {
              Accept: "application/json",
              "User-Agent":
                "Mozilla/5.0 (compatible; colemancrozier.com/playlist-index/1.0)",
            },
            next: { revalidate: 86_400 },
          });
          if (!res.ok) return;

          const data = (await res.json()) as { title?: string };
          if (typeof data.title !== "string" || data.title.trim() === "") return;
          out.set(id, splitOEmbedTitle(data.title.trim()));
        } catch {
          /* skip */
        }
      }),
    );
    if (b + OEMBED_BATCH_SIZE < ids.length && OEMBED_BATCH_DELAY_MS > 0) {
      await new Promise((r) => setTimeout(r, OEMBED_BATCH_DELAY_MS));
    }
  }

  return out;
}

async function fetchPlaylistViaHtml(setUrl: string, slug: string): Promise<{
  playlistTitle: string;
  playlistUrl: string;
  trackCount: number;
  tracks: TrackOut[];
} | null> {
  const res = await fetch(setUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/1.0)",
      Accept: "text/html",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const html = await res.text();
  const hydrated = extractTopLevelJsonArray(html);
  if (!hydrated) return null;

  let playlist: PlaylistHydration | null = null;
  for (const entry of hydrated) {
    if (
      typeof entry === "object" &&
      entry !== null &&
      "hydratable" in entry &&
      (entry as { hydratable: string }).hydratable === "playlist" &&
      "data" in entry
    ) {
      playlist = (entry as { data: PlaylistHydration }).data;
      break;
    }
  }

  if (!playlist?.tracks || !Array.isArray(playlist.tracks)) return null;

  const slots: PlaylistTrackSlot[] = [];

  for (const t of playlist.tracks) {
    if (typeof t !== "object" || t === null) continue;
    const idRaw = "id" in t ? (t as { id: unknown }).id : null;
    const id = typeof idRaw === "number" ? idRaw : null;
    if (id === null) continue;

    const title = "title" in t ? (t as { title: unknown }).title : null;
    const permalink_url =
      "permalink_url" in t ? (t as { permalink_url: unknown }).permalink_url : null;

    if (
      typeof title === "string" &&
      title.length > 0 &&
      typeof permalink_url === "string" &&
      permalink_url.startsWith("http")
    ) {
      const user = "user" in t ? (t as { user?: { username?: string } }).user : undefined;
      const artist = typeof user?.username === "string" ? user.username : null;
      slots.push({ kind: "full", title, href: permalink_url, artist });
    } else {
      slots.push({ kind: "stub", id });
    }
  }

  const stubIds = slots
    .filter((s): s is { kind: "stub"; id: number } => s.kind === "stub")
    .map((s) => s.id);

  const stubMeta = stubIds.length > 0 ? await fetchTrackTitlesFromOEmbed(stubIds) : new Map();

  const tracks: TrackOut[] = [];
  for (const slot of slots) {
    if (slot.kind === "full") {
      tracks.push({ title: slot.title, href: slot.href, artist: slot.artist });
      continue;
    }
    const meta = stubMeta.get(slot.id);
    tracks.push({
      title: meta?.title ?? "Track",
      href: `https://soundcloud.com/track/${slot.id}`,
      artist: meta?.artist ?? null,
    });
  }

  return {
    playlistTitle: typeof playlist.title === "string" ? playlist.title : slug,
    playlistUrl: typeof playlist.permalink_url === "string" ? playlist.permalink_url : setUrl,
    trackCount: typeof playlist.track_count === "number" ? playlist.track_count : tracks.length,
    tracks,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!slug || !ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const setUrl = `${PROFILE}/sets/${slug}`;

  try {
    const viaApi = await fetchPlaylistViaApiV2(setUrl);
    if (viaApi && viaApi.tracks.length > 0) {
      return NextResponse.json(viaApi, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }
  } catch {
    /* fall back to HTML hydration */
  }

  try {
    const viaHtml = await fetchPlaylistViaHtml(setUrl, slug);
    if (viaHtml && viaHtml.tracks.length > 0) {
      return NextResponse.json(viaHtml, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }
  } catch {
    /* report failure below */
  }

  return NextResponse.json({ error: "SoundCloud unavailable" }, { status: 502 });
}
