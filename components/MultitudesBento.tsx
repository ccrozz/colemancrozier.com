"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { SoundCloudSnippetPlayer } from "./SoundCloudSnippetPlayer";

type LensImage = {
  category: "Birds" | "Landscapes" | "Waterways" | "Old Florida";
  src: string;
  caption: string;
};

const birdLensImages: readonly LensImage[] = [
  { category: "Birds", src: "/images/lens/lens-birds-01.png", caption: "Male cardinal tucked in the oak canopy." },
  { category: "Birds", src: "/images/lens/lens-birds-02.png", caption: "Cardinal silhouette through crossing limbs." },
  { category: "Birds", src: "/images/lens/lens-birds-03.png", caption: "Sandhill crane stretching wings in open grass." },
  { category: "Birds", src: "/images/lens/lens-birds-04.png", caption: "White ibis feeding in shallow water." },
  { category: "Birds", src: "/images/lens/lens-birds-05.png", caption: "Cardinal perched under mottled afternoon light." },
  { category: "Birds", src: "/images/lens/lens-birds-06.png", caption: "Close cardinal portrait on a sunlit branch." },
  { category: "Birds", src: "/images/lens/lens-birds-07.png", caption: "Cardinal resting on bare branches at overcast dawn." },
  { category: "Birds", src: "/images/lens/lens-birds-08.png", caption: "Cardinal framed by Spanish moss and bokeh." },
  { category: "Birds", src: "/images/lens/lens-birds-09.png", caption: "Bright cardinal with clean feather detail." },
  { category: "Birds", src: "/images/lens/lens-birds-10.png", caption: "Ibis standing still in mangrove shallows." },
  { category: "Birds", src: "/images/lens/lens-birds-11.png", caption: "Cardinal hidden in dense green foliage." },
  { category: "Birds", src: "/images/lens/lens-birds-12.png", caption: "Cardinal profile behind lichen-covered bark." },
  { category: "Birds", src: "/images/lens/lens-birds-13.png", caption: "Cardinal in motion between thin branches." },
  { category: "Birds", src: "/images/lens/lens-birds-14.png", caption: "Burrowing owl portrait with bright yellow eyes." },
  { category: "Birds", src: "/images/lens/lens-birds-15.png", caption: "Hummingbird hovering at a red feeder." },
  { category: "Birds", src: "/images/lens/lens-birds-16.png", caption: "Yellow-crowned night heron perched after rain." },
  { category: "Birds", src: "/images/lens/lens-birds-17.png", caption: "Pair of sandhill cranes preening by marsh grass." },
  { category: "Birds", src: "/images/lens/lens-birds-18.png", caption: "Cardinal portrait in warm directional light." },
  { category: "Birds", src: "/images/lens/lens-birds-19.png", caption: "Black-bellied whistling duck close-up at waterline." },
  { category: "Birds", src: "/images/lens/lens-birds-20.png", caption: "Shorebird pausing on soft beach sand." },
  { category: "Birds", src: "/images/lens/lens-birds-21.png", caption: "Great egret lifting off at dusk." },
  { category: "Birds", src: "/images/lens/lens-birds-22.png", caption: "Mockingbird balanced on a utility line." },
  { category: "Birds", src: "/images/lens/lens-birds-23.png", caption: "Bald eagle guarding a high nest." },
  { category: "Birds", src: "/images/lens/lens-birds-24.png", caption: "Red-bellied woodpecker against deep blue sky." },
  { category: "Birds", src: "/images/lens/lens-birds-25.png", caption: "Ring-billed gull lit by late sun on the beach." },
  { category: "Birds", src: "/images/lens/lens-birds-26.png", caption: "Woodpecker perched along a weathered branch." },
  { category: "Birds", src: "/images/lens/lens-birds-27.png", caption: "Cardinal peeking through thick mangrove layers." },
  { category: "Birds", src: "/images/lens/lens-birds-28.png", caption: "Red-shouldered hawk posted on fence rail." },
  { category: "Birds", src: "/images/lens/lens-birds-29.png", caption: "Cardinal silhouette in winter-like branch pattern." },
  { category: "Birds", src: "/images/lens/lens-birds-30.png", caption: "Red-shouldered hawk close portrait mid-call." },
];

const lensImages: readonly LensImage[] = [
  ...birdLensImages,
  {
    category: "Landscapes",
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    caption: "Low tide textures, old Florida light.",
  },
  {
    category: "Waterways",
    src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    caption: "Incoming swell, Atlantic side.",
  },
  {
    category: "Old Florida",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    caption: "Mangrove lines and long horizons.",
  },
];

const kitchenImages: readonly { src: string; alt: string }[] = [
  { src: "/images/kitchen/kitchen-01.png", alt: "One-pan skillet dinner — seared protein with veg or starch." },
  { src: "/images/kitchen/kitchen-02.png", alt: "Sheet-pan bake cooling on the stove." },
  { src: "/images/kitchen/kitchen-03.png", alt: "Plated supper — protein, veg, and starch." },
  { src: "/images/kitchen/kitchen-04.png", alt: "Ingredients and mise on the counter." },
  { src: "/images/kitchen/kitchen-05.png", alt: "Casserole or bake straight from the oven." },
  { src: "/images/kitchen/kitchen-06.png", alt: "Weeknight plate — sauce, starch, veg." },
  { src: "/images/kitchen/kitchen-07.png", alt: "Holiday roast spread." },
  { src: "/images/kitchen/kitchen-08.png", alt: "Finger food and snacks for a gathering." },
  { src: "/images/kitchen/kitchen-09.png", alt: "Steak over fried rice — seared slices, eggy seasoned rice." },
  { src: "/images/kitchen/kitchen-10.png", alt: "Sliced rib roast resting on a rack — pink centers, dark crust." },
  { src: "/images/kitchen/kitchen-11.png", alt: "Homemade bagels — plain and herb-salt tops on a sheet pan." },
  { src: "/images/kitchen/kitchen-12.png", alt: "Prime rib dinner — roast beef, green beans, scalloped potatoes, checkered cloth." },
  { src: "/images/kitchen/kitchen-13.png", alt: "Whole roast turkey in the roasting pan." },
  { src: "/images/kitchen/kitchen-14.png", alt: "Carved turkey platter — breast slices, legs, rosemary, grapes." },
  { src: "/images/kitchen/kitchen-15.png", alt: "Party starters — charcuterie board, tuna & avocado plates, guacamole." },
  { src: "/images/kitchen/kitchen-16.png", alt: "Charcuterie — salami, prosciutto, cheeses, grapes, olives, foil-wrapped wedges." },
  { src: "/images/kitchen/kitchen-17.png", alt: "Fish carpaccio — avocado center, capers, red onion, herbs." },
  { src: "/images/kitchen/kitchen-18.png", alt: "Lodge skillet — chicken thighs on caramelized onions, mushrooms, and rice." },
  { src: "/images/kitchen/kitchen-19.png", alt: "Herb-crusted prime rib — slices on a juice-lined cutting board." },
  { src: "/images/kitchen/kitchen-20.png", alt: "Seafood paella — shrimp, mussels, chorizo, peppers, peas; pineapple garnish." },
  { src: "/images/kitchen/kitchen-21.png", alt: "Lasagna — layers of pasta, meat ragù, melted cheese." },
  { src: "/images/kitchen/kitchen-22.png", alt: "Chicken over skin-on mashed potatoes with mushroom gravy." },
  { src: "/images/kitchen/kitchen-23.png", alt: "Everything bagel sandwich — fried egg, melted cheese, pastrami-style meat." },
  { src: "/images/kitchen/kitchen-24.png", alt: "Chicken piccata — lemon-caper sauce, linguine, sautéed squash and beans." },
];

const garageImages: readonly { src: string; alt: string }[] = [
  {
    src: "/images/garage/garage-01.png",
    alt: "White Ford F-250 Super Duty towing a center-console boat — lifted 4×4, mesh grille, paver lot at sunset.",
  },
  {
    src: "/images/garage/garage-02.png",
    alt: "Black Toyota Tacoma double cab — lift, off-road tires, aftermarket front bumper, golden hour on the driveway.",
  },
  {
    src: "/images/garage/garage-03.png",
    alt: "White Ford F-250 Super Duty 4×4 — side profile at dusk, orange horizon behind palms and oaks.",
  },
  {
    src: "/images/garage/garage-04.png",
    alt: "Ford Super Duty towing a T-top center-console — knobbies, custom grille, rods in the rocket launcher, low sun.",
  },
];

/** Stills from the lagoon, inlet, and beach — paths match `/public/images/waterfront/waterfront-NN.png` (copy order). */
const waterfrontImages: readonly { src: string; alt: string }[] = [
  { src: "/images/waterfront/waterfront-01.png", alt: "Lagoon morning — calm sheet of water under a clear sky." },
  { src: "/images/waterfront/waterfront-02.png", alt: "Skinny water run — spoil island edge and moving tide." },
  { src: "/images/waterfront/waterfront-03.png", alt: "Atlantic side — wind texture where swell meets sandbar." },
  { src: "/images/waterfront/waterfront-04.png", alt: "Mangrove shadow line — green wall along the bank." },
  { src: "/images/waterfront/waterfront-05.png", alt: "Grass flat — stingray track in skinny gin." },
  { src: "/images/waterfront/waterfront-06.png", alt: "Oyster rake at low tide — exposed shell and current line." },
  { src: "/images/waterfront/waterfront-07.png", alt: "Passing flight — pelicans over the Indian River." },
  { src: "/images/waterfront/waterfront-08.png", alt: "Blue hour at the dock — nav light and still reflection." },
  { src: "/images/waterfront/waterfront-09.png", alt: "Runout tide — mud tail draining off the flat." },
  { src: "/images/waterfront/waterfront-10.png", alt: "Skiff track through the marsh — bow wake in grass." },
  { src: "/images/waterfront/waterfront-11.png", alt: "Bridge span — last color in the cirrus." },
  { src: "/images/waterfront/waterfront-12.png", alt: "T-top skiff at night — blue deck lights on mirror water, shoreline windows." },
  { src: "/images/waterfront/waterfront-13.png", alt: "Shallow float — FL 3249 PM on the hull, bow line and shaka in the glare." },
  { src: "/images/waterfront/waterfront-14.png", alt: "Three-up on the center-console — marsh backdrop, rods in the rocket launcher." },
  { src: "/images/waterfront/waterfront-15.png", alt: "Jack Crevalle at the bow — silver slab and open Atlantic blue." },
  { src: "/images/waterfront/waterfront-16.png", alt: "Black drum — heavy fish in front of mangrove tangle." },
  { src: "/images/waterfront/waterfront-17.png", alt: "Snook at the rail — lateral line chrome, Yamaha 90 on the transom." },
  { src: "/images/waterfront/waterfront-18.png", alt: "Two surfers on wet sand — Cabo longboard, O’Neill suit, shaka and shorebreak." },
  { src: "/images/waterfront/waterfront-19.png", alt: "Quiet Flight log — center stripe, yellow fins, Billabong suit." },
  { src: "/images/waterfront/waterfront-20.png", alt: "Double tow at sunset — Yamaha 90 and two riders working the wake." },
  { src: "/images/waterfront/waterfront-21.png", alt: "Sunset run home — V-wake toward a low bridge and pink sky." },
  { src: "/images/waterfront/waterfront-22.png", alt: "At the helm — chartplotter glow, compass, T-top legs framing the dusk." },
  { src: "/images/waterfront/waterfront-23.png", alt: "Disk on the horizon — fire sky bleeding into ripple field." },
  { src: "/images/waterfront/waterfront-24.png", alt: "Golden-hour drive — wheel, gauges, glass water ahead." },
  { src: "/images/waterfront/waterfront-25.png", alt: "Crew day — white houses along the tree line, puffy trade cumulus." },
  { src: "/images/waterfront/waterfront-26.png", alt: "Blue-lit T-top at civil dusk — still reflection, orange band on the rim." },
  { src: "/images/waterfront/waterfront-27.png", alt: "Headstand on shell sand — long shadows, low sun over the break." },
];

const GARDEN_ALTS: readonly string[] = [
  "Sheet mulch edge — cardboard brown layer under wood chips.",
  "Hugel mound base — oak laid in before soil cap.",
  "Compost windrow — thermophilic steam on a cool morning.",
  "Worm bin harvest — vermicast in the finishing tray.",
  "Three sisters mound — corn pole for climbing beans.",
  "Rain barrel overflow — swale catch below the downspout.",
  "Electronet paddock — hens ahead of the fall bed prep.",
  "Mason bee hotel — morning sun on drilled blocks.",
  "Crimson clover cover — pollinator band along the path.",
  "Biochar soak — steam lift at the quench barrel.",
  "Raspberry trellis — floricanes tied for summer fruit.",
  "Citrus mulch ring — pulled back from the trunk flare.",
  "Shiitake log stack — waxed spawn after the soak.",
  "Keyhole bed radius — one-foot reach to the center pole.",
  "Banana circle berm — greywater mulch basin ring.",
  "Harvest basket — tomatoes still warm from the row.",
  "Broadfork lift — aeration slice without inversion.",
  "Orchard understory — clover sod between young trees.",
  "Pawpaw tubes — shade for first-year whips.",
  "Elderflower harvest — umbels over the steam kettle.",
  "Garlic braid — curing slings on the porch.",
  "Sweet potato ridge — sandy hilling for tuber set.",
  "Okra pick — shears under the pod, spine clear.",
  "Ferment crock — weight holding mash below brine.",
  "Pepper row color — ripe bells after the heat spike.",
  "Corn ear check — kernel milk line through the husk window.",
  "Combine stubble — residue left for winter cover mix.",
  "Contour berm — swale stake line with hand level.",
  "Plasticulture berry — drip tape under reflective mulch.",
  "High tunnel crack — manual sidewall vent for breeze.",
  "Propagation bench — heat mat grid under humidity domes.",
  "Graft union — parafilm wrap over the whip graft.",
  "Bare-root wash — roots trimmed over the barrow.",
  "Sector sketch — sun path and wind arrows on the plan.",
  "Swale flags — on-contour stakes for the rip line.",
  "Corn rows to sky — harvested alley through dry stalks.",
  "Sweet corn peel — husks back from plump yellow rows.",
  "Harvest path — corn litter strip between standing rows.",
  "Apple orchard aisle — red fruit load in paired rows.",
  "Frost fan tower — white machine mid orchard block.",
  "Hop yard corridor — twin bine rows on twine trellis.",
  "Apple block perspective — grassy lane to frost machine.",
  "Cottage border — Japanese anemone and dogwood color wash.",
  "Reflective orchard floor — silver mulch strip mirroring sky.",
  "Winter wheat sea — only a head showing above gold straw.",
  "Corn horizon and silos — brown field under pale haze.",
  "Grain complex — GSI bins, elevator leg, auger spans.",
  "Summer row crop — bloom and canopy in high light.",
  "Dry corn and clouds — tan stalk ocean, sky stacked white.",
  "Air-curing barn — tobacco leaf hung to dry (not a food crop).",
  "Ripe ear on stalk — yellow kernel wall, dry husk curled.",
  "Cornfield pose — arms straight up, tall green corn behind.",
  "Apple load on the limb — crew day under puffy cumulus.",
  "Hop alley depth — green tunnel toward blue sky.",
  "Orchard tour stop — fruit-heavy branches, fan on the skyline.",
  "Research plots — flags and replicated bed ends.",
  "Valve and ditch check — irrigation run on schedule.",
  "Soil ribbon test — sand–silt–clay by feel on the knife.",
  "Roller crimper rye — terminated cover ahead of plant-in.",
  "Last light on the tree line — sunset gloss on leaves.",
];

const gardenImages: readonly { src: string; alt: string }[] = GARDEN_ALTS.map((alt, i) => ({
  src: `/images/garden/garden-${String(i + 1).padStart(2, "0")}.png`,
  alt,
}));

function shuffledCopy<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a;
}

const soundcloudProfile = "https://soundcloud.com/colecrozier";

type SoundPlaylist = {
  title: string;
  href: string;
  subtitle?: string;
  vibe?: string;
};

type StereoTrackRow = {
  title: string;
  href: string;
  artist: string | null;
};

type StereoPlaylistPayload = {
  playlistTitle: string;
  playlistUrl: string;
  trackCount: number;
  tracks: StereoTrackRow[];
};

type StereoPreviewState = {
  title: string;
  pageHref: string;
};

function playlistSlugFromHref(href: string): string | null {
  const m = href.match(/\/sets\/([^/?#]+)/);
  return m?.[1] ?? null;
}

/** Public playlists — https://soundcloud.com/colecrozier/sets */
const soundcloudPlaylists: readonly SoundPlaylist[] = [
  {
    title: "Drift Theory",
    href: `${soundcloudProfile}/sets/i-went-to-horny-jail`,
  },
  {
    title: "Cold Start",
    href: `${soundcloudProfile}/sets/never-be-the-same`,
  },
  {
    title: "Night Rider",
    href: `${soundcloudProfile}/sets/night-rider`,
  },
  {
    title: "Iron & Velvet",
    href: `${soundcloudProfile}/sets/rad-ass-bitch`,
  },
];

function BentoCard({
  title,
  eyebrow,
  body,
  className,
  children,
}: {
  title: string;
  eyebrow: string;
  body: string;
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <article className={`relative overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-sand)_20%,transparent)] bg-[var(--color-shell)] p-6 ${className}`}>
      <p className="eyebrow !text-[var(--color-deep-sea)]">{eyebrow}</p>
      <h3 className="mt-2 font-heading text-4xl text-[var(--color-ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-ink)_85%,transparent)]">{body}</p>
      {children}
    </article>
  );
}

export default function MultitudesBento() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("Birds");
  const [lensGallery, setLensGallery] = useState<LensImage[]>(() => [...lensImages]);
  const [lensImageIndex, setLensImageIndex] = useState(0);
  const [kitchenLightboxIndex, setKitchenLightboxIndex] = useState<number | null>(null);
  const [garageLightboxIndex, setGarageLightboxIndex] = useState<number | null>(null);
  const [waterfrontLightboxIndex, setWaterfrontLightboxIndex] = useState<number | null>(null);
  const [waterfrontGallery, setWaterfrontGallery] = useState(() => [...waterfrontImages]);
  const [gardenLightboxIndex, setGardenLightboxIndex] = useState<number | null>(null);
  const [gardenGallery, setGardenGallery] = useState(() => [...gardenImages]);
  const [stereoPlaylistIndex, setStereoPlaylistIndex] = useState(0);
  const stereoPlaylist =
    soundcloudPlaylists[stereoPlaylistIndex] ?? soundcloudPlaylists[0];
  const [stereoPayload, setStereoPayload] = useState<StereoPlaylistPayload | null>(null);
  const [stereoLoading, setStereoLoading] = useState(true);
  const [stereoFetchError, setStereoFetchError] = useState(false);
  const [stereoPreview, setStereoPreview] = useState<StereoPreviewState | null>(null);

  useEffect(() => {
    const slug = playlistSlugFromHref(stereoPlaylist.href);
    if (!slug) {
      setStereoFetchError(true);
      setStereoLoading(false);
      return;
    }

    let cancelled = false;
    setStereoLoading(true);
    setStereoFetchError(false);

    fetch(`/api/soundcloud-playlist/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: StereoPlaylistPayload) => {
        if (!cancelled) setStereoPayload(data);
      })
      .catch(() => {
        if (!cancelled) {
          setStereoFetchError(true);
          setStereoPayload(null);
        }
      })
      .finally(() => {
        if (!cancelled) setStereoLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stereoPlaylist.href]);

  useEffect(() => {
    setStereoPreview(null);
  }, [stereoPlaylist.href]);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Random order only after hydration — `shuffledCopy` uses Math.random() and must not run during SSR. */
  useEffect(() => {
    setWaterfrontGallery(shuffledCopy(waterfrontImages));
    setGardenGallery(shuffledCopy(gardenImages));
  }, []);

  useEffect(() => {
    if (
      kitchenLightboxIndex === null &&
      garageLightboxIndex === null &&
      waterfrontLightboxIndex === null &&
      gardenLightboxIndex === null
    )
      return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setKitchenLightboxIndex(null);
        setGarageLightboxIndex(null);
        setWaterfrontLightboxIndex(null);
        setGardenLightboxIndex(null);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (kitchenLightboxIndex !== null) {
          setKitchenLightboxIndex((i) =>
            i === null ? null : (i - 1 + kitchenImages.length) % kitchenImages.length,
          );
        } else if (garageLightboxIndex !== null) {
          setGarageLightboxIndex((i) =>
            i === null ? null : (i - 1 + garageImages.length) % garageImages.length,
          );
        } else if (waterfrontLightboxIndex !== null) {
          setWaterfrontLightboxIndex((i) =>
            i === null ? null : (i - 1 + waterfrontGallery.length) % waterfrontGallery.length,
          );
        } else if (gardenLightboxIndex !== null) {
          setGardenLightboxIndex((i) =>
            i === null ? null : (i - 1 + gardenGallery.length) % gardenGallery.length,
          );
        }
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (kitchenLightboxIndex !== null) {
          setKitchenLightboxIndex((i) => (i === null ? null : (i + 1) % kitchenImages.length));
        } else if (garageLightboxIndex !== null) {
          setGarageLightboxIndex((i) => (i === null ? null : (i + 1) % garageImages.length));
        } else if (waterfrontLightboxIndex !== null) {
          setWaterfrontLightboxIndex((i) => (i === null ? null : (i + 1) % waterfrontGallery.length));
        } else if (gardenLightboxIndex !== null) {
          setGardenLightboxIndex((i) => (i === null ? null : (i + 1) % gardenGallery.length));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    kitchenLightboxIndex,
    garageLightboxIndex,
    waterfrontLightboxIndex,
    gardenLightboxIndex,
    waterfrontGallery.length,
    gardenGallery.length,
  ]);

  useEffect(() => {
    if (
      kitchenLightboxIndex === null &&
      garageLightboxIndex === null &&
      waterfrontLightboxIndex === null &&
      gardenLightboxIndex === null
    )
      return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [kitchenLightboxIndex, garageLightboxIndex, waterfrontLightboxIndex, gardenLightboxIndex]);

  const lensCategories = useMemo(
    () => [...new Set(lensImages.map((item) => item.category))],
    [],
  );
  const filteredLensImages = useMemo(
    () => lensGallery.filter((item) => item.category === filter),
    [filter, lensGallery],
  );
  const image = useMemo(
    () => filteredLensImages[lensImageIndex] ?? filteredLensImages[0] ?? lensImages[0],
    [filteredLensImages, lensImageIndex],
  );
  const canNavigateLens = filteredLensImages.length > 1;

  useEffect(() => {
    setLensImageIndex(0);
  }, [filter]);

  const showPrevLensImage = () => {
    if (!canNavigateLens) return;
    setLensImageIndex((current) => (current - 1 + filteredLensImages.length) % filteredLensImages.length);
  };

  const showNextLensImage = () => {
    if (!canNavigateLens) return;
    setLensImageIndex((current) => (current + 1) % filteredLensImages.length);
  };

  const shuffleLensPhotos = () => {
    setLensGallery((currentGallery) => {
      const matching = currentGallery.filter((item) => item.category === filter);
      if (matching.length < 2) return currentGallery;
      const shuffled = shuffledCopy(matching);
      let categoryIndex = 0;
      return currentGallery.map((item) =>
        item.category === filter ? shuffled[categoryIndex++]! : item,
      );
    });
    setLensImageIndex(0);
  };

  return (
    <section className="bg-[var(--color-shell)] py-24">
      <div className="section-wrap">
        <Reveal>
          <p className="eyebrow !text-[var(--color-deep-sea)]">The Multitudes</p>
          <h2 className="font-heading text-5xl text-[var(--color-ink)]">A living bento field journal</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-6">
            <BentoCard
              className="flex min-h-0 flex-col bg-[linear-gradient(155deg,color-mix(in_srgb,var(--color-lagoon)_10%,var(--color-shell)),color-mix(in_srgb,var(--color-tide)_35%,var(--color-shell)))]"
              title="The Waterfront"
              eyebrow="Saltwater · Surf"
              body="The Indian River Lagoon and Sebastian Inlet are home base. Chasing redfish on spoil islands, reading tide charts, and paddling out when swell cooperates."
            >
              <div className="mt-4 flex min-h-0 flex-col">
                <div className="mb-2 flex shrink-0 items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWaterfrontGallery(shuffledCopy(waterfrontImages));
                      setWaterfrontLightboxIndex(null);
                    }}
                    className="rounded-full border border-[color:color-mix(in_srgb,var(--color-sand)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_65%,transparent)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-ink)_75%,transparent)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_40%,var(--color-sand))]"
                  >
                    Shuffle photos
                  </button>
                </div>
                <div className="max-h-[min(48vh,420px)] min-h-[160px] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
                    {waterfrontGallery.map((shot, index) => (
                      <button
                        key={shot.src}
                        type="button"
                        onClick={() => {
                          setWaterfrontLightboxIndex(index);
                          setKitchenLightboxIndex(null);
                          setGarageLightboxIndex(null);
                          setGardenLightboxIndex(null);
                        }}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_22%,transparent)] text-left outline-none ring-[var(--color-lagoon)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_45%,var(--color-sand))] focus-visible:ring-2"
                        aria-label={`Open photo: ${shot.alt}`}
                      >
                        <Image
                          src={shot.src}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 24vw, 130px"
                          className="object-cover transition duration-300 group-hover:scale-[1.04]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>

          <Reveal className="lg:col-span-6">
            <BentoCard
              className="flex min-h-0 flex-col"
              title="The Garden"
              eyebrow="Permaculture · Soil Health"
              body="My agriculture degree is where a serious love of the natural world clicked into place. I get energy from building something with my hands, helping others grow their ideas, and stopping to admire careful work—especially when it celebrates native Florida."
            >
              <p className="mt-4 font-mono text-xs text-[var(--color-moss)]">Native Florida · build · help · admire</p>
              <div className="mt-4 flex min-h-0 flex-col">
                <div className="mb-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGardenGallery(shuffledCopy(gardenImages));
                      setGardenLightboxIndex(null);
                    }}
                    className="rounded-full border border-[color:color-mix(in_srgb,var(--color-sand)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_65%,transparent)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-ink)_75%,transparent)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_40%,var(--color-sand))]"
                  >
                    Shuffle photos
                  </button>
                </div>
                <div className="max-h-[min(48vh,420px)] min-h-[160px] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
                    {gardenGallery.map((shot, index) => (
                      <button
                        key={shot.src}
                        type="button"
                        onClick={() => {
                          setGardenLightboxIndex(index);
                          setKitchenLightboxIndex(null);
                          setGarageLightboxIndex(null);
                          setWaterfrontLightboxIndex(null);
                        }}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_25%,transparent)] text-left outline-none ring-[var(--color-lagoon)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_45%,var(--color-sand))] focus-visible:ring-2"
                        aria-label={`Open photo: ${shot.alt}`}
                      >
                        <Image
                          src={shot.src}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 140px"
                          className="object-cover transition duration-300 group-hover:scale-[1.04]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>

          <Reveal className="lg:col-span-6">
            <BentoCard
              className="bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-tide)_65%,transparent),var(--color-shell))]"
              title="The Kitchen"
              eyebrow="Culinary Science"
              body="Snapshots from the table—good ingredients, sharp heat, and the kind of meal worth lingering over."
            >
              <div className="mt-4 max-h-[min(48vh,420px)] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
                  {kitchenImages.map((shot, index) => (
                    <button
                      key={shot.src}
                      type="button"
                      onClick={() => {
                        setKitchenLightboxIndex(index);
                        setGarageLightboxIndex(null);
                        setWaterfrontLightboxIndex(null);
                        setGardenLightboxIndex(null);
                      }}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_25%,transparent)] text-left outline-none ring-[var(--color-lagoon)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_45%,var(--color-sand))] focus-visible:ring-2"
                      aria-label={`Open photo: ${shot.alt}`}
                    >
                      <Image
                        src={shot.src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 140px"
                        className="object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </BentoCard>
          </Reveal>

          <Reveal className="lg:col-span-6">
            <BentoCard
              className=""
              title="The Garage"
              eyebrow="Mechanics · Build Log"
              body="I drive a 2004 6.0L Power Stroke and love digging into how it works—reading, tinkering, and turning wrenches on it whenever I can find the time."
            >
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
                {garageImages.map((shot, index) => (
                  <button
                    key={shot.src}
                    type="button"
                    onClick={() => {
                      setGarageLightboxIndex(index);
                      setKitchenLightboxIndex(null);
                      setWaterfrontLightboxIndex(null);
                      setGardenLightboxIndex(null);
                    }}
                    className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_25%,transparent)] text-left outline-none ring-[var(--color-lagoon)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_45%,var(--color-sand))] focus-visible:ring-2"
                    aria-label={`Open photo: ${shot.alt}`}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                ))}
              </div>
            </BentoCard>
          </Reveal>

          <Reveal className="lg:col-span-12">
            <article className="overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-sand)_20%,transparent)] bg-[var(--color-shell)] p-6">
              <p className="eyebrow !text-[var(--color-deep-sea)]">Photography · Old Florida</p>
              <h3 className="mt-2 font-heading text-4xl text-[var(--color-ink)]">The Lens</h3>
              <p className="mt-2 text-sm">
                Documenting what remains. Birds, coastlines, and waterways that still feel untamed.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {lensCategories.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setFilter(chip)}
                      className={`rounded-full border px-2.5 py-1 text-xs ${filter === chip ? "border-[var(--color-lagoon)] bg-[var(--color-lagoon)]/10" : "border-black/20"}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={shuffleLensPhotos}
                  className="rounded-full border border-[color:color-mix(in_srgb,var(--color-sand)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_65%,transparent)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:color-mix(in_srgb,var(--color-ink)_75%,transparent)] transition hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_40%,var(--color-sand))]"
                >
                  Shuffle photos
                </button>
              </div>
              <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] lg:gap-4">
                <div>
                  <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_30%,transparent)] bg-black/5">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={image.src}
                        alt={image.caption}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 92vw, 640px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {canNavigateLens && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={showPrevLensImage}
                        className="rounded-full border border-black/20 px-3 py-1 text-xs transition hover:border-[var(--color-lagoon)]"
                        aria-label="Show previous lens photo"
                      >
                        Prev
                      </button>
                      <p className="text-xs text-[color:color-mix(in_srgb,var(--color-ink)_65%,transparent)]">
                        {lensImageIndex + 1} / {filteredLensImages.length}
                      </p>
                      <button
                        type="button"
                        onClick={showNextLensImage}
                        className="rounded-full border border-black/20 px-3 py-1 text-xs transition hover:border-[var(--color-lagoon)]"
                        aria-label="Show next lens photo"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              {canNavigateLens && (
                <div className="mt-4 max-h-[420px] overflow-y-auto pr-1 lg:mt-0">
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-2">
                    {filteredLensImages.map((shot, idx) => (
                      <button
                        key={shot.src}
                        type="button"
                        onClick={() => setLensImageIndex(idx)}
                        className={`group relative aspect-[4/3] overflow-hidden rounded-md border transition ${
                          idx === lensImageIndex
                            ? "border-[var(--color-lagoon)] ring-1 ring-[var(--color-lagoon)]"
                            : "border-[color:color-mix(in_srgb,var(--color-sand)_35%,transparent)] hover:border-[color:color-mix(in_srgb,var(--color-lagoon)_45%,var(--color-sand))]"
                        }`}
                        aria-label={`View lens photo: ${shot.caption}`}
                      >
                        <Image src={shot.src} alt="" fill sizes="(max-width: 1024px) 20vw, 180px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>
              <p className="mt-2 text-sm italic text-[var(--color-lagoon)]">{image.caption}</p>
            </article>
          </Reveal>

          <Reveal className="lg:col-span-12">
            <article className="overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-sand)_22%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-tide)_85%,transparent),var(--color-shell)_40%)] p-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:p-8">
              <div className="lg:col-span-4 lg:border-r lg:border-[color:color-mix(in_srgb,var(--color-sand)_25%,transparent)] lg:pr-8">
                <p className="eyebrow !text-[var(--color-deep-sea)]">Public playlists</p>
                <h3 className="mt-2 font-heading text-4xl text-[var(--color-ink)]">The Stereo</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-ink)_85%,transparent)]">
                  Playlists I&apos;ve been listening to lately on{' '}
                  <a
                    href={`${soundcloudProfile}/sets`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-deep-sea)] underline decoration-[color:color-mix(in_srgb,var(--color-deep-sea)_35%,transparent)] underline-offset-[3px] transition hover:decoration-[var(--color-lagoon)]"
                  >
                    SoundCloud
                  </a>
                  .
                  Tap a row to open a 30-second sample under that track, tap again to close it, and use{" "}
                  <span className="font-mono text-[10px]" aria-hidden>
                    ↗
                  </span>{" "}
                  on the edge to open the full track on SoundCloud.
                </p>
              </div>
              <div className="mt-6 lg:col-span-8 lg:mt-0">
                <p className="text-xs font-medium text-[color:color-mix(in_srgb,var(--color-ink)_60%,transparent)]">Playlist</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Choose playlist">
                  {soundcloudPlaylists.map((pick, idx) => (
                    <button
                      key={pick.href}
                      type="button"
                      onClick={() => setStereoPlaylistIndex(idx)}
                      className={`max-w-full rounded-full border px-3 py-1.5 text-left text-xs transition ${
                        idx === stereoPlaylistIndex
                          ? "border-[var(--color-lagoon)] bg-[var(--color-lagoon)]/10 text-[var(--color-deep-sea)]"
                          : "border-black/15 text-[color:color-mix(in_srgb,var(--color-ink)_88%,transparent)] hover:border-black/35"
                      }`}
                    >
                      {pick.title}
                    </button>
                  ))}
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-sand)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_75%,transparent)]">
                  {stereoLoading ? (
                    <div className="flex min-h-[200px] items-center justify-center px-4 py-16 text-sm text-[color:color-mix(in_srgb,var(--color-ink)_45%,transparent)]">
                      Loading tracks…
                    </div>
                  ) : stereoFetchError || !stereoPayload ? (
                    <div className="px-5 py-10 text-center text-sm text-[color:color-mix(in_srgb,var(--color-ink)_65%,transparent)]">
                      Couldn&apos;t load the track list.&nbsp;
                      <a
                        href={stereoPlaylist.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
                      >
                        Open playlist on SoundCloud →
                      </a>
                    </div>
                  ) : stereoPayload.tracks.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-[color:color-mix(in_srgb,var(--color-ink)_65%,transparent)]">
                      No track rows returned.&nbsp;
                      <a
                        href={stereoPayload.playlistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
                      >
                        View on SoundCloud →
                      </a>
                    </div>
                  ) : (
                    <ol className="max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
                      {stereoPayload.tracks.map((row, i) => {
                        const previewActive = stereoPreview?.pageHref === row.href;
                        return (
                          <li
                            key={`${row.href}-${i}`}
                            className="border-b border-[color:color-mix(in_srgb,var(--color-sand)_35%,transparent)] last:border-b-0"
                          >
                            <div className="flex items-stretch">
                              <button
                                type="button"
                                className={`flex min-w-0 flex-1 items-start gap-3 px-4 py-3 text-left transition hover:bg-[color:color-mix(in_srgb,var(--color-shell)_90%,var(--color-tide))] ${
                                  previewActive
                                    ? "bg-[color:color-mix(in_srgb,var(--color-lagoon)_14%,transparent)]"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (stereoPreview?.pageHref === row.href) {
                                    setStereoPreview(null);
                                  } else {
                                    setStereoPreview({
                                      title: row.title,
                                      pageHref: row.href,
                                    });
                                  }
                                }}
                              >
                                <span className="mt-0.5 w-7 shrink-0 font-mono text-[10px] tabular-nums text-[color:color-mix(in_srgb,var(--color-ink)_45%,transparent)]">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block font-heading text-sm leading-snug text-[var(--color-deep-sea)]">
                                    {row.title}
                                  </span>
                                  {row.artist ? (
                                    <span className="mt-0.5 block text-xs text-[color:color-mix(in_srgb,var(--color-ink)_52%,transparent)]">
                                      {row.artist}
                                    </span>
                                  ) : null}
                                </span>
                              </button>
                              <a
                                href={row.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open track on SoundCloud"
                                aria-label={`Open “${row.title}” on SoundCloud`}
                                className="flex w-11 shrink-0 items-center justify-center border-l border-[color:color-mix(in_srgb,var(--color-sand)_35%,transparent)] text-[10px] font-medium uppercase tracking-wider text-[var(--color-canopy)] transition hover:bg-[color:color-mix(in_srgb,var(--color-shell)_90%,var(--color-tide))]"
                              >
                                ↗
                              </a>
                            </div>
                            {previewActive && stereoPreview ? (
                              <SoundCloudSnippetPlayer
                                variant="inline"
                                title={stereoPreview.title}
                                pageHref={stereoPreview.pageHref}
                                onDismiss={() => setStereoPreview(null)}
                              />
                            ) : null}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>

                {!stereoLoading && stereoPayload ? (
                  <p className="mt-3 text-[11px] text-[color:color-mix(in_srgb,var(--color-ink)_48%,transparent)]">
                    {stereoPayload.tracks.length} tracks ·{' '}
                    <a
                      href={stereoPayload.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-deep-sea)] underline underline-offset-[2px]"
                    >
                      Open full playlist →
                    </a>
                  </p>
                ) : null}
              </div>
            </article>
          </Reveal>
        </div>
      </div>

      {mounted &&
        kitchenLightboxIndex !== null &&
        createPortal(
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="kitchen-lightbox-label">
            <button
              type="button"
              className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--color-ink)_72%,black)] backdrop-blur-[3px]"
              aria-label="Close photo"
              onClick={() => setKitchenLightboxIndex(null)}
            />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="kitchen-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {kitchenLightboxIndex + 1} of {kitchenImages.length}
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                    onClick={() => setKitchenLightboxIndex(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="flex w-full min-w-0 items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Previous photo"
                    onClick={() =>
                      setKitchenLightboxIndex(
                        (i) =>
                          i === null ? null : (i - 1 + kitchenImages.length) % kitchenImages.length,
                      )
                    }
                  >
                    ‹
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="relative mx-auto h-[min(72vh,640px)] w-full max-w-4xl">
                      <Image
                        src={kitchenImages[kitchenLightboxIndex].src}
                        alt={kitchenImages[kitchenLightboxIndex].alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 896px"
                        priority
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Next photo"
                    onClick={() =>
                      setKitchenLightboxIndex((i) => (i === null ? null : (i + 1) % kitchenImages.length))
                    }
                  >
                    ›
                  </button>
                </div>

                <p className="max-w-prose px-1 text-center text-sm leading-relaxed text-white/88">
                  {kitchenImages[kitchenLightboxIndex].alt}
                </p>
                <p className="text-[11px] text-white/40">← → arrow keys · Esc to close</p>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {mounted &&
        garageLightboxIndex !== null &&
        createPortal(
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="garage-lightbox-label">
            <button
              type="button"
              className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--color-ink)_72%,black)] backdrop-blur-[3px]"
              aria-label="Close photo"
              onClick={() => setGarageLightboxIndex(null)}
            />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="garage-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {garageLightboxIndex + 1} of {garageImages.length}
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                    onClick={() => setGarageLightboxIndex(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="flex w-full min-w-0 items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Previous photo"
                    onClick={() =>
                      setGarageLightboxIndex(
                        (i) =>
                          i === null ? null : (i - 1 + garageImages.length) % garageImages.length,
                      )
                    }
                  >
                    ‹
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="relative mx-auto h-[min(72vh,640px)] w-full max-w-4xl">
                      <Image
                        src={garageImages[garageLightboxIndex].src}
                        alt={garageImages[garageLightboxIndex].alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 896px"
                        priority
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Next photo"
                    onClick={() =>
                      setGarageLightboxIndex((i) => (i === null ? null : (i + 1) % garageImages.length))
                    }
                  >
                    ›
                  </button>
                </div>

                <p className="max-w-prose px-1 text-center text-sm leading-relaxed text-white/88">
                  {garageImages[garageLightboxIndex].alt}
                </p>
                <p className="text-[11px] text-white/40">← → arrow keys · Esc to close</p>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {mounted &&
        waterfrontLightboxIndex !== null &&
        createPortal(
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="waterfront-lightbox-label">
            <button
              type="button"
              className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--color-ink)_72%,black)] backdrop-blur-[3px]"
              aria-label="Close photo"
              onClick={() => setWaterfrontLightboxIndex(null)}
            />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="waterfront-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {waterfrontLightboxIndex + 1} of {waterfrontGallery.length}
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                    onClick={() => setWaterfrontLightboxIndex(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="flex w-full min-w-0 items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Previous photo"
                    onClick={() =>
                      setWaterfrontLightboxIndex(
                        (i) =>
                          i === null
                            ? null
                            : (i - 1 + waterfrontGallery.length) % waterfrontGallery.length,
                      )
                    }
                  >
                    ‹
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="relative mx-auto h-[min(72vh,640px)] w-full max-w-4xl">
                      <Image
                        src={waterfrontGallery[waterfrontLightboxIndex].src}
                        alt={waterfrontGallery[waterfrontLightboxIndex].alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 896px"
                        priority
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Next photo"
                    onClick={() =>
                      setWaterfrontLightboxIndex((i) =>
                        i === null ? null : (i + 1) % waterfrontGallery.length,
                      )
                    }
                  >
                    ›
                  </button>
                </div>

                <p className="max-w-prose px-1 text-center text-sm leading-relaxed text-white/88">
                  {waterfrontGallery[waterfrontLightboxIndex].alt}
                </p>
                <p className="text-[11px] text-white/40">← → arrow keys · Esc to close</p>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {mounted &&
        gardenLightboxIndex !== null &&
        createPortal(
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="garden-lightbox-label">
            <button
              type="button"
              className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--color-ink)_72%,black)] backdrop-blur-[3px]"
              aria-label="Close photo"
              onClick={() => setGardenLightboxIndex(null)}
            />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="garden-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {gardenLightboxIndex + 1} of {gardenGallery.length}
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                    onClick={() => setGardenLightboxIndex(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="flex w-full min-w-0 items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Previous photo"
                    onClick={() =>
                      setGardenLightboxIndex(
                        (i) =>
                          i === null ? null : (i - 1 + gardenGallery.length) % gardenGallery.length,
                      )
                    }
                  >
                    ‹
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="relative mx-auto h-[min(72vh,640px)] w-full max-w-4xl">
                      <Image
                        src={gardenGallery[gardenLightboxIndex].src}
                        alt={gardenGallery[gardenLightboxIndex].alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 896px"
                        priority
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                    aria-label="Next photo"
                    onClick={() =>
                      setGardenLightboxIndex((i) =>
                        i === null ? null : (i + 1) % gardenGallery.length,
                      )
                    }
                  >
                    ›
                  </button>
                </div>

                <p className="max-w-prose px-1 text-center text-sm leading-relaxed text-white/88">
                  {gardenGallery[gardenLightboxIndex].alt}
                </p>
                <p className="text-[11px] text-white/40">← → arrow keys · Esc to close</p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
