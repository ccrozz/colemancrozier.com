import { NextResponse } from "next/server";

/** Playlist index can batch many oEmbed calls; allow long enough on serverless. */
export const maxDuration = 60;

const PROFILE = "https://soundcloud.com/colecrozier";

/** Only playlists we surface on the site — prevents open proxy fetches. */
const ALLOWED_SLUGS = new Set([
  "i-went-to-horny-jail",
  "never-be-the-same",
  "night-rider",
  "rad-ass-bitch",
]);

const OEMBED_API_TRACK = "https://api.soundcloud.com/tracks";

/** Small pauses reduce the chance SoundCloud rate-limits oEmbed when resolving many stubs. */
const OEMBED_BATCH_DELAY_MS = 100;
const OEMBED_BATCH_SIZE = 12;

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

type PlaylistHydration = {
  title?: string;
  permalink_url?: string;
  track_count?: number;
  tracks?: unknown[];
};

type PlaylistTrackSlot =
  | { kind: "full"; title: string; href: string; artist: string | null }
  | { kind: "stub"; id: number };

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

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!slug || !ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const setUrl = `${PROFILE}/sets/${slug}`;
  const res = await fetch(setUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; colemancrozier.com/1.0)",
      Accept: "text/html",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "SoundCloud unavailable" }, { status: 502 });
  }

  const html = await res.text();
  const hydrated = extractTopLevelJsonArray(html);
  if (!hydrated) {
    return NextResponse.json({ error: "Parse failed" }, { status: 502 });
  }

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

  if (!playlist?.tracks || !Array.isArray(playlist.tracks)) {
    return NextResponse.json({ error: "No playlist data" }, { status: 502 });
  }

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

  const stubIds = slots.filter((s): s is { kind: "stub"; id: number } => s.kind === "stub").map((s) => s.id);

  const stubMeta = stubIds.length > 0 ? await fetchTrackTitlesFromOEmbed(stubIds) : new Map();

  const tracksOut: { title: string; href: string; artist: string | null }[] = [];

  for (const slot of slots) {
    if (slot.kind === "full") {
      tracksOut.push({ title: slot.title, href: slot.href, artist: slot.artist });
      continue;
    }

    const meta = stubMeta.get(slot.id);
    const title = meta?.title ?? `Track`;
    const artist = meta?.artist ?? null;
    /** Canonical-ish deep link SoundCloud resolves for playback (best effort without slug). */
    const href = `https://soundcloud.com/track/${slot.id}`;
    tracksOut.push({ title, href, artist });
  }

  const total =
    typeof playlist.track_count === "number" ? playlist.track_count : tracksOut.length;

  return NextResponse.json({
    playlistTitle: typeof playlist.title === "string" ? playlist.title : slug,
    playlistUrl: typeof playlist.permalink_url === "string" ? playlist.permalink_url : setUrl,
    trackCount: total,
    tracks: tracksOut,
  });
}
