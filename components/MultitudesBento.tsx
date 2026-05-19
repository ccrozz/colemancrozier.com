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

const landscapeLensImages: readonly LensImage[] = [
  { category: "Landscapes", src: "/images/lens/lens-landscapes-01.png", caption: "Rocky summit with lingering snow above a dense evergreen forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-02.png", caption: "Turquoise river valley seen over a mossy concrete bridge railing." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-03.png", caption: "Jagged rocky peak with snow bands rising above dark green forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-04.png", caption: "Sunburst piercing dense forest canopy with lens flare on bark." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-05.png", caption: "Snow-dusted peaks under storm clouds behind silhouetted firs and wildflowers." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-06.png", caption: "Turquoise lake glowing between layered blue mountains beneath a bright sun." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-07.png", caption: "Glacial lake in a mountain valley framed by silhouetted cliffside evergreens." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-08.png", caption: "Turquoise lake winding through forested peaks past dark foreground branches." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-09.png", caption: "Golf course fairway running beside a sandy coastal path and ocean." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-10.png", caption: "Snowy mountain ridge seen through evergreens and soft white foreground flowers." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-11.png", caption: "Turquoise river glimpsed through foliage toward a distant forested mountain." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-12.png", caption: "Mossy snag overlooking blue mountain ridges fading into distant haze." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-13.png", caption: "Craggy peak under heavy clouds above green scrub and scattered firs." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-14.png", caption: "Green meadow before farm buildings and layered forested mountain ridges." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-15.png", caption: "Thin stream cascading down a green alpine slope framed by evergreens." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-16.png", caption: "Alpine peaks above a valley with evergreens and a winding mountain road." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-17.png", caption: "Twilight glow behind jagged peaks in a deep shadowed mountain valley." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-18.png", caption: "Dark evergreen forest opening onto a grey rocky cliff face." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-19.png", caption: "Green pasture at dusk before forested mountains and distant farm buildings." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-20.png", caption: "Orange sunset behind layered peaks under heavy purple twilight clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-21.png", caption: "Jagged granite peaks with snow patches framed by dark evergreen trees." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-22.png", caption: "Turquoise glacial lake from a rocky overlook toward snow-capped peaks." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-23.png", caption: "Herd of cattle scattered across a wide green pasture under wispy clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-24.png", caption: "Evergreen-covered slopes converging under bright blue sky with scattered clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-25.png", caption: "Sunlit rocky cliff rising above shadowed conifers on a steep mountainside." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-26.png", caption: "Dead snags and evergreens before jagged peaks under a cloudy sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-27.png", caption: "Golden light on jagged peaks while lower slopes fall into shadow." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-28.png", caption: "Craggy peak glimpsed through tall evergreens above a mossy forest floor." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-29.png", caption: "White wildflowers before evergreens and jagged peaks under grey overcast sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-30.png", caption: "Sunset sky over dark field and treeline beside a roadside white line." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-31.png", caption: "Sunburst above silhouetted rolling forested hills under deep blue sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-32.png", caption: "Sunlit granite spires framed by shadowed evergreens in the forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-33.png", caption: "Overgrown meadow clearing walled by dense dark evergreen trees." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-34.png", caption: "Hazy sun shining over rolling green golf course fairways and trees." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-35.png", caption: "Brown cows standing in pasture behind a wire fence under puffy clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-36.png", caption: "Forest meadow with white wildflowers before a wall of dark evergreens." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-37.png", caption: "White-flowered stalks rising from lush meadow before dense conifer forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-38.png", caption: "Orange sunset reflected on calm bay water beside a blue dock wall." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-39.png", caption: "Dry grassy slope overlooking river and flat mesa under bright sun." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-40.png", caption: "Clear alpine lake with submerged logs and waterfall on green mountainside." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-41.png", caption: "Rolling forested hills beyond a roadside guardrail under clear blue sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-42.png", caption: "Blue sky filled with parallel rippling altocumulus undulatus cloud bands." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-43.png", caption: "Black smoke plume rising over harvested cornfield and bare winter trees." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-44.png", caption: "Orange sunset reflected in pond beside silhouetted palms and trees." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-45.png", caption: "Golfer silhouette on fairway at sunset beside pin flags on the green." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-46.png", caption: "Orange glow on horizon reflecting across rippling water under wispy clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-47.png", caption: "Golden wheat field under blue sky with distant mountains on horizon." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-48.png", caption: "Three horses grazing in patchy field under heavy grey overcast clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-49.png", caption: "Snowy peaks through evergreens, dead snag, and blurred white foreground flowers." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-50.png", caption: "Dense tree on marshy water beneath power lines and puffy clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-51.png", caption: "Fiery sunset gradient above silhouetted cornfield stretching toward horizon." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-52.png", caption: "Long pier leading to covered boathouse at golden sunset over rippling water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-53.png", caption: "Orange sunset over rippling lake behind dark shoreline silhouettes." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-54.png", caption: "Bare swamp trees reflecting colorful dusk clouds on still dark water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-55.png", caption: "White egret standing in bright marsh grass beside rippling water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-56.png", caption: "Small sun dipping below flat horizon over dry harvested field." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-57.png", caption: "Still alpine lake mirroring steep green slopes and jagged rocky peaks." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-58.png", caption: "Great egret standing among marsh reeds beside lily pads and water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-59.png", caption: "Thin waterfall plunging down steep grey cliff with scattered evergreens." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-60.png", caption: "Bare winter trees silhouetted against soft orange glow on the horizon." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-61.png", caption: "Multiple waterfalls threading down forested cliff beneath snowy jagged peaks." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-62.png", caption: "Wide river through sagebrush valley toward tan hills under clear sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-63.png", caption: "Jagged peaks beyond evergreen forest with white wildflowers in foreground." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-64.png", caption: "Parallel citrus rows heavy with fruit under blue sky and puffy clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-65.png", caption: "Palm-lined shore at sunset with sun half-set over orange reflecting water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-66.png", caption: "Low view across clear alpine lake toward waterfalls on cirque walls." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-67.png", caption: "Filtered light through dense shadowed evergreen trunks in a dark forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-68.png", caption: "Catamaran centered on horizon with mast reflected in orange sunset water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-69.png", caption: "Misty evergreen clearing framed by silhouetted trunks and bright undergrowth." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-70.png", caption: "Layered garden greenery with columnar trees under cloudless bright blue sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-71.png", caption: "Alligator in murky ditch beside rows of low orchard bushes." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-72.png", caption: "White-barked leaning birch over ferns and mossy log in shaded forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-73.png", caption: "Sunrise over beach path with posts, dunes, and distant walkers." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-74.png", caption: "Catamaran at sunset framed by silhouetted palm fronds and pier gazebo." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-75.png", caption: "Wooden gazebo on calm pond edged by manicured garden hedges." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-76.png", caption: "Person in black standing on log over lily-pad-covered forest pond." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-77.png", caption: "Tiered waterfall through bare forest above wooden viewing platform." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-78.png", caption: "Highland cattle on grassy slope before dense evergreen forest and fence." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-79.png", caption: "Five silhouetted figures facing sunset across water toward distant city skyline." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-80.png", caption: "Man hugging massive ivy-clad tree among leafless winter forest trunks." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-81.png", caption: "Hillside orchard rows under blue sky with sign reading The Orchard." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-82.png", caption: "Pinto horse standing in dry grass before rolling sunlit hills." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-83.png", caption: "Black cow on grassy bank overlooking wide pasture under puffy clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-84.png", caption: "Weathered snags before rugged rocky peaks under soft overcast clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-85.png", caption: "Layered tropical foliage with screw pines, red buds, and feathery leaves." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-86.png", caption: "Orange sunset over bay pier framed by silhouetted overhead branches." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-87.png", caption: "Yellow lab on shore beside wooden pier gazebo and swimming ducks." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-88.png", caption: "City skyline at sunset glimpsed through silhouetted leaves over calm water." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-89.png", caption: "Sandy path between cabbage palms and weathered fence through tropical woods." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-90.png", caption: "Tea-colored creek with fallen log through lush wetland under overcast sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-91.png", caption: "Steel truss railway bridge spanning trail through bright spring forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-92.png", caption: "Sunlit dirt path winding into dense green woodland under clear sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-93.png", caption: "Spring forest opening onto blue pond glimpsed through blossoming greenery." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-94.png", caption: "Rope-rail boardwalk over calm water lined with mangroves at golden hour." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-95.png", caption: "Mangrove prop roots framing open view across blue water toward shoreline." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-96.png", caption: "Sun-dappled subtropical forest floor thick with palmettos and saplings." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-97.png", caption: "Grassy forest trail between tall pines and bright deciduous trees." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-98.png", caption: "Dense ferns and palm fronds carpeting subtropical forest under clear sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-99.png", caption: "Straight cypress trunk rising from palm-fringed leaf-strewn forest floor." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-100.png", caption: "Leafy arching branches tunneling over sandy trail strewn with palmettos." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-101.png", caption: "Quiet residential street framed by palms, moss, and dense greenery." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-102.png", caption: "Spreading live oak branches draped with Spanish moss against pale sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-103.png", caption: "Stone-walled Eaton graveyard with weathered headstones in spring woodland." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-104.png", caption: "Golden grain mound in trailer above harvested field under blue sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-105.png", caption: "Cypress knees rising from duckweed-covered still water in sunlit swamp." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-106.png", caption: "Spanish moss and yellow flowers lit by sun through dense forest." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-107.png", caption: "Lone figure walking distant rows through dry corn under cumulus clouds." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-108.png", caption: "Moss-hung branches framing dark evergreen forest lit by overhead sun." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-109.png", caption: "Tall meadow grasses with yellow wildflowers before scattered trees and sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-110.png", caption: "Grapevines on fence posts before steep evergreen-covered hillside." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-111.png", caption: "Mossy branches and leaves framing dense conifer forest toward pale sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-112.png", caption: "Turquoise river flowing through dense evergreen valley past foreground ferns." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-113.png", caption: "Grapevine rows on trellises below forested mountain under clear blue sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-114.png", caption: "Distant rocky peak framed by silhouetted trees under deep blue sky." },
  { category: "Landscapes", src: "/images/lens/lens-landscapes-115.png", caption: "Turquoise river through forested valley past shadowed ferns and tree frame." },
];


const lensImages: readonly LensImage[] = [
  ...birdLensImages,
  ...landscapeLensImages,
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
  { src: "/images/kitchen/kitchen-01.png", alt: "Tuna carpaccio — avocado ring, red onion, capers on a glass stovetop." },
  { src: "/images/kitchen/kitchen-02.png", alt: "Carbonara with pancetta and Parmesan — mixed green salad on the side." },
  { src: "/images/kitchen/kitchen-03.png", alt: "Pancake breakfast — scrambled eggs and four link sausages on a square plate." },
  { src: "/images/kitchen/kitchen-04.png", alt: "Skillet jambalaya — chicken, smoked sausage, shrimp, peppers, scallions." },
  { src: "/images/kitchen/kitchen-05.png", alt: "Medium-rare steak slices with rosemary mashed potatoes and toasted baguette." },
  { src: "/images/kitchen/kitchen-06.png", alt: "Grilled sandwich halves — melted cheese filling with a side of potato chips." },
  { src: "/images/kitchen/kitchen-07.png", alt: "Cheesy toast, sunny-side eggs, mandarin halves, and sausage on marble counter." },
  { src: "/images/kitchen/kitchen-08.png", alt: "Ground beef, herb rice, diced avocado, and pickled red onions on one plate." },
  { src: "/images/kitchen/kitchen-09.png", alt: "Steak over fried rice — seared slices, eggy seasoned rice, herb flakes." },
  { src: "/images/kitchen/kitchen-10.png", alt: "Sliced rib roast resting on a rack — pink centers, dark crust." },
  { src: "/images/kitchen/kitchen-11.png", alt: "Homemade bagels — plain and herb-salt tops on a sheet pan." },
  { src: "/images/kitchen/kitchen-12.png", alt: "Prime rib dinner — roast beef, green beans, scalloped potatoes, checkered cloth." },
  { src: "/images/kitchen/kitchen-13.png", alt: "Whole roasted turkey on a rack in a roasting pan on the stove." },
  { src: "/images/kitchen/kitchen-14.png", alt: "Carved turkey platter — breast slices, legs, rosemary, grapes." },
  { src: "/images/kitchen/kitchen-15.png", alt: "Party starters — charcuterie board, tuna and avocado plates, guacamole." },
  { src: "/images/kitchen/kitchen-16.png", alt: "Charcuterie — salami, prosciutto, cheeses, grapes, olives, foil-wrapped wedges." },
  { src: "/images/kitchen/kitchen-17.png", alt: "Fish carpaccio — avocado center, capers, red onion, herbs on a red plate." },
  { src: "/images/kitchen/kitchen-18.png", alt: "Lodge skillet — chicken thighs on caramelized onions, mushrooms, and rice." },
  { src: "/images/kitchen/kitchen-19.png", alt: "Herb-crusted prime rib — slices on a juice-lined cutting board." },
  { src: "/images/kitchen/kitchen-20.png", alt: "Seafood paella — shrimp, mussels, chorizo, peppers, peas; pineapple garnish." },
  { src: "/images/kitchen/kitchen-21.png", alt: "Lasagna — layers of pasta, meat ragù, melted cheese." },
  { src: "/images/kitchen/kitchen-22.png", alt: "Pan-seared chicken with mushroom gravy over skin-on mashed potatoes." },
  { src: "/images/kitchen/kitchen-23.png", alt: "Everything bagel sandwich — fried egg, melted cheese, pastrami-style meat." },
  { src: "/images/kitchen/kitchen-24.png", alt: "Chicken piccata — lemon-caper sauce, linguine, sautéed squash and beans." },
];

const garageImages: readonly { src: string; alt: string }[] = [
  { src: "/images/garage/garage-01.png", alt: "White Ford F-250 towing a center-console boat — sunset, grass paver lot." },
  { src: "/images/garage/garage-02.png", alt: "Lifted black Toyota Tacoma TRD — aftermarket bumper, wheels, golden-hour light." },
  { src: "/images/garage/garage-03.png", alt: "Lifted white Ford F-250 Super Duty at dusk — black wheels, palm-lined street." },
  { src: "/images/garage/garage-04.png", alt: "Lifted white Ford pickup towing a fishing boat — rods upright, golden-hour light." },
];

/** Stills from the lagoon, inlet, and beach — paths match `/public/images/waterfront/waterfront-NN.png` (copy order). */
const waterfrontImages: readonly { src: string; alt: string }[] = [
  { src: "/images/waterfront/waterfront-01.png", alt: "Silhouetted surfer on a longboard carving a backlit breaking wave at dawn or dusk" },
  { src: "/images/waterfront/waterfront-02.png", alt: "Surfer in a wetsuit crouched on a light board riding a large turquoise breaking wave" },
  { src: "/images/waterfront/waterfront-03.png", alt: "Surfer in a black wetsuit riding a small green wave under a clear coastal sky" },
  { src: "/images/waterfront/waterfront-04.png", alt: "Vertical shot of a surfer in a wetsuit riding a small green wave with foreground foam" },
  { src: "/images/waterfront/waterfront-05.png", alt: "Surfer in a black wetsuit standing on a white board on a peeling coastal wave" },
  { src: "/images/waterfront/waterfront-06.png", alt: "Wide view of a wetsuited surfer crouched on a white board across a green peeling wave" },
  { src: "/images/waterfront/waterfront-07.png", alt: "Surfer in a dark wetsuit rides a breaking wave—another waits on a board offshore" },
  { src: "/images/waterfront/waterfront-08.png", alt: "Wetsuited surfer crouched on the green face of a wave ahead of breaking white foam" },
  { src: "/images/waterfront/waterfront-09.png", alt: "Surfer rides a breaking wave while a second paddler sits waiting on a board behind" },
  { src: "/images/waterfront/waterfront-10.png", alt: "Lone surfer in a dark wetsuit crouched on a white board riding a breaking ocean wave" },
  { src: "/images/waterfront/waterfront-11.png", alt: "Shirtless surfer in camo board shorts riding a small wave on an overcast coastal day" },
  { src: "/images/waterfront/waterfront-12.png", alt: "Center console boat lit with blue LEDs on a calm Florida waterway at night" },
  { src: "/images/waterfront/waterfront-13.png", alt: "Two men with a Florida-registered center console in shallow coastal water, giving shakas" },
  { src: "/images/waterfront/waterfront-14.png", alt: "Three people aboard a white center console fishing boat on a calm marsh-lined canal" },
  { src: "/images/waterfront/waterfront-15.png", alt: "Man on a boat bow proudly holding a large jack crevalle against a coastal skyline" },
  { src: "/images/waterfront/waterfront-16.png", alt: "Shirtless angler holds a large black drum with mangroves and pale coastal trees behind" },
  { src: "/images/waterfront/waterfront-17.png", alt: "Boater holds a freshly caught snook with Florida mangroves and blue sky behind him" },
  { src: "/images/waterfront/waterfront-18.png", alt: "Two wetsuited surfers on wet sand with boards—one flashes a shaka at the shoreline" },
  { src: "/images/waterfront/waterfront-19.png", alt: "Man in a black Billabong wetsuit holding a Quiet Flight surfboard on a sandy beach" },
  { src: "/images/waterfront/waterfront-20.png", alt: "Sunset wake ride behind a Yamaha 90 outboard—two towed riders on either side of the wake" },
  { src: "/images/waterfront/waterfront-21.png", alt: "Boat wake at sunset toward a long bridge, with a green channel marker in the water" },
  { src: "/images/waterfront/waterfront-22.png", alt: "From the helm at sunset—a chartplotter, T-top frame, and bow on calm reflective water" },
  { src: "/images/waterfront/waterfront-23.png", alt: "Fiery orange sunset over rippled coastal water with a silhouetted treeline on the horizon" },
  { src: "/images/waterfront/waterfront-24.png", alt: "Man at the helm at sunset—compass glowing as orange sky reflects on calm coastal water" },
  { src: "/images/waterfront/waterfront-25.png", alt: "Three men on a center console fishing boat on blue water off a coastal neighborhood" },
  { src: "/images/waterfront/waterfront-26.png", alt: "Center console with blue deck LEDs moored at dusk—warm sunset glow on the horizon" },
  { src: "/images/waterfront/waterfront-27.png", alt: "Headstand on a shell-strewn beach at golden hour as sunset light breaks through the clouds" },
];

const GARDEN_ALTS: readonly string[] = [
  "Rows of trellised apple trees heavy with red apples along a sunny dirt orchard path",
  "Red-and-yellow Indian blanket wildflowers scattered among grass, mulch, and stone pavers",
  "Bright red hibiscus bloom with yellow stamens and a green bud on a mulched shrub",
  "Variegated shell ginger with creamy shell-shaped flowers and striped green leaves",
  "Honeybee in flight approaching a fuzzy pink puffball flower in a sunny lawn",
  "Creamy white gardenia flower and an unopened green bud among glossy leaves",
  "Yellow and white plumeria blossoms on a woody branch with palm trees behind",
  "Clusters of bright red tubular coral bean flowers on dark stems with green leaves",
  "Small yellow composite flowers on a green wetland plant near blurred water",
  "Fuzzy bumblebee on a pale pink speckled azalea flower among many blooms",
  "Light purple dwarf crested iris blooming on a bed of dry fallen leaves",
  "Large silvery olive tree in a lawn with a mulch ring and potted plants",
  "Young staked tree in a grassy yard with a wooden fence and greenhouse",
  "Small papaya seedling with lobed leaves in a circular mulch bed on grass",
  "Young tree with bright yellow new growth in a paver-bordered mulch bed",
  "Young leafy tree in a stone-edged circular mulch bed on a green lawn",
  "Small citrus tree in a paver-bordered mulch bed near a shed and tools",
  "Mulched raised garden bed with corn, marigolds, trellises, and a white shed",
  "Young banana plant in thick mulch with bamboo fence and nursery pots",
  "Young dragon fruit cactus tied to a wooden post in a black nursery pot",
  "Dense lantana covered in small clusters of yellow and orange flowers",
  "Backyard mulch garden with fruit tree, corn, pineapples, shed, and bamboo fence",
  "Person in a salmon shirt walking across a lawn toward a large tree",
  "Long pale yellow pepper on a plant with a hand behind it for scale",
  "Pink peach or nectarine blossoms on a branch against a clear blue sky",
  "Pink and white blossoms on a young fruit tree branch against blue sky",
  "Peach-colored double hibiscus with ruffled petals among dark green leaves",
  "Large red hibiscus bloom with a smaller pink flower on the same bush",
  "Tight cluster of bright yellow chrysanthemum flowers with one green bud",
  "Apple orchard rows laden with yellow-green apples under a bright blue sky",
  "View down an apple orchard row with red apples on wooden trellis posts",
  "Grassy path between orchard rows strewn with fallen fruit and dry leaves",
  "Bumblebee on a red and orange marigold among other marigolds and foliage",
  "Urban community garden with yarrow, zinnias, and sunflowers before a stone building",
  "Pepper plant bearing long dark purple peppers and small purple flowers",
  "Small purple-and-white striped eggplants hanging from staked plants in a garden",
  "Man in a blue hoodie touching a tall red okra plant in an urban garden",
  "Cluster of fuzzy tan loquat buds among large ribbed green leaves",
  "Pink-and-white striped crinum lily flowers with long stamens and strap-like leaves",
  "Leafless pruned fruit orchard rows with pink buds along a grassy spring path",
  "Fruit tree branch with pink blossoms and new green leaves against blue sky",
  "Trailer heaped with harvested green and yellow citrus in an orchard grove",
  "Citrus branch holding a ripe yellow-orange fruit and a white blossom",
  "Wide field of broad green leaves on sandy soil with farm buildings distant",
  "Rows of dried brown tobacco leaves hanging from rails in a dim curing barn",
  "Mature yellow ear of corn with peeled-back husks still on the stalk",
  "Hand peeling dried husks from a yellow ear of corn still on the stalk",
  "Low view down a harvested corn path between dried brown stalks",
  "Bearded man in an orange shirt with arms raised in a tall green cornfield",
  "Apple orchard aisle tunnel of trees laden with red apples along a path",
  "Close red apples on a branch with orchard rows and a white frost fan",
  "Symmetrical rows of tall hop vines on trellises along a path under blue sky",
  "Apple orchard path between laden trees with a white wind machine ahead",
  "Pink Japanese anemones in a garden with lime-green and purple-leaved shrubs",
  "Apple orchard row with reflective silver plastic mulch covering the ground",
  "Golden ripe grain field with a person's head visible, mountains and blue sky",
  "Dried brown cornstalks in foreground with farm silos on a hazy horizon",
  "Grain silos and elevator with loading spouts overlooking patchwork farmland",
  "Green cotton field with pale yellow bell-shaped flowers under a blue sky",
  "Vast dried golden cornfield under a blue sky with clouds and a distant figure",
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

function LightboxCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="absolute right-3 top-3 z-[2] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl font-light leading-none text-white backdrop-blur-sm transition hover:bg-white/20 sm:hidden"
      aria-label="Close"
      onClick={onClose}
    >
      <span aria-hidden>×</span>
    </button>
  );
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
    title: "Night Rider",
    href: `${soundcloudProfile}/sets/night-rider`,
  },
  {
    title: "Cold Start",
    href: `${soundcloudProfile}/sets/never-be-the-same`,
  },
  {
    title: "Drift Theory",
    href: `${soundcloudProfile}/sets/i-went-to-horny-jail`,
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
          <p className="eyebrow !text-[var(--color-deep-sea)]">Not a single lane</p>
          <h2 className="font-heading text-5xl text-[var(--color-ink)]">Where the days actually go.</h2>
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
                  My most recent playlists on{' '}
                  <a
                    href={`${soundcloudProfile}/sets`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-deep-sea)] underline decoration-[color:color-mix(in_srgb,var(--color-deep-sea)_35%,transparent)] underline-offset-[3px] transition hover:decoration-[var(--color-lagoon)]"
                  >
                    SoundCloud
                  </a>
                  — sunrise-to-midnight always something to match the mood.
                  Sample the vibe here: tap a row for a 30-second teaser, tap again to fold it shut. Ready for the whole track? {" "}
                  <span className="font-mono text-[10px]" aria-hidden>
                    ↗
                  </span>{" "}
                  on the edge opens it on SoundCloud.
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
            <LightboxCloseButton onClose={() => setKitchenLightboxIndex(null)} />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="kitchen-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {kitchenLightboxIndex + 1} of {kitchenImages.length}
                  </span>
                  <button
                    type="button"
                    className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:inline-flex"
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
            <LightboxCloseButton onClose={() => setGarageLightboxIndex(null)} />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="garage-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {garageLightboxIndex + 1} of {garageImages.length}
                  </span>
                  <button
                    type="button"
                    className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:inline-flex"
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
            <LightboxCloseButton onClose={() => setWaterfrontLightboxIndex(null)} />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="waterfront-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {waterfrontLightboxIndex + 1} of {waterfrontGallery.length}
                  </span>
                  <button
                    type="button"
                    className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:inline-flex"
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
            <LightboxCloseButton onClose={() => setGardenLightboxIndex(null)} />
            <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-8">
              <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4 text-white/90">
                  <span id="garden-lightbox-label" className="text-xs tabular-nums sm:text-sm">
                    Photo {gardenLightboxIndex + 1} of {gardenGallery.length}
                  </span>
                  <button
                    type="button"
                    className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:inline-flex"
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
