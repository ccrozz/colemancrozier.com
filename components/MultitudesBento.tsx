"use client";

import { Reveal } from "./Reveal";

const cards = [
  {
    title: "Restoration Ecology",
    description:
      "Wetland, dune, and coastal projects centered on resilience, biodiversity, and long-term ecosystem health.",
  },
  {
    title: "Agronomy",
    description:
      "Field-scale thinking for healthy soils, efficient inputs, and practical systems that perform in real conditions.",
  },
  {
    title: "Full-Stack Development",
    description:
      "Human-first digital experiences built with modern web tooling, clear architecture, and measurable outcomes.",
  },
  {
    title: "Creative Practice",
    description:
      "Photography, storytelling, and visual systems that connect place, process, and people.",
  },
];

export default function MultitudesBento() {
  return (
    <section id="multitudes" className="bg-[var(--color-shell)] py-24 text-[var(--color-deep-sea)]">
      <div className="section-wrap space-y-10">
        <Reveal className="space-y-3">
          <p className="eyebrow">Multitudes</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Ecosystems, code, and craft.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-deep-sea)_74%,white)]">
            A cross-disciplinary lens that blends field work, technical systems, and storytelling into
            practical, grounded outcomes.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Reveal
              key={card.title}
              className="rounded-lg border border-[color:color-mix(in_srgb,var(--color-deep-sea)_16%,white)] bg-white/60 p-6"
            >
              <h3 className="font-display text-2xl">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-deep-sea)_70%,white)]">
                {card.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
