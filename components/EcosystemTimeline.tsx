"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const entries = [
  {
    date: "Present",
    title: "Evergreen Solutions FL",
    role: "Founder & CEO",
    detail:
      "Field-led ecological restoration across Florida — native plantings, land management, habitat consulting, and invasive species control. Built NTR LVR (ntrlvr.com), a climate-aware garden planner and database for food forests, kitchen gardens, pollinator beds, and flower borders, from zone-matched plant lists to Evergreen pro installs.",
  },
  {
    date: "Present",
    title: "Gray Bay Solutions",
    role: "Co-Founder / Full-Stack Developer",
    detail:
      "Works with all kinds of businesses — mom-and-pop shops up through brokerages and everything in between. Build what keeps the lights on: landing pages, CRM and email follow-up, Stripe/Square/Plaid payments, booking flows, web and mobile apps, and AI when it actually saves time.",
  },
  {
    date: "Present",
    title: "Parkview Advance Financial Services",
    role: "Funding Specialist",
    detail:
      "Helps businessowners figure out what they actually need, whether that’s SBA, equipment financing, a line of credit, asset-based lending, or receivables funding, then walk them through the application with our lender partners. Day to day: 30+ active files, compliance paperwork, pipeline tracking in Excel, and turning lender jargon into plain English.",
  },
  {
    date: "June 2022 – June 2023",
    title: "Rain and Hail – A Chubb Company",
    role: "Insurance Specialist",
    detail:
      "Crop and field risk assessments with coverage tailored to farm operations and weather exposure; field-level policy reviews with audit-ready documentation; claims support and adjuster coordination; primary client contact for coverage education and ongoing support.",
  },
  {
    date: "Aug 2018 – May 2022",
    title: "University of Florida",
    role: "B.S. Food and Resource Economics · Defensive Back",
    detail:
      "Currently studying for a Master’s in Agronomy with a concentration in Agroecology. B.S. concentration: Food & Agribusiness Marketing and Management · GPA 3.21 · SEC Academic Honor Roll (2020, 2021, 2022).",
  },
];

export default function EcosystemTimeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" className="bg-[var(--color-deep-sea)] py-24">
      <div className="section-wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10 lg:gap-12">
          <Reveal className="max-w-xl">
            <p className="eyebrow">The Ecosystem</p>
            <h2 className="font-heading text-5xl text-[var(--color-shell)]">Resume</h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-sand)_82%,white)]">
              Field work, graduate study, and builds — one thread below.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="shrink-0 md:pb-1">
            <div className="relative mx-auto aspect-[3/4] w-44 overflow-hidden rounded-xl border border-[color:color-mix(in_srgb,var(--color-sand)_24%,transparent)] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.55)] sm:w-52 md:mx-0 md:w-56 lg:w-[15rem]">
              <Image
                src="/images/coleman-headshot.png"
                alt="Coleman Crozier"
                fill
                sizes="(max-width: 768px) 176px, 240px"
                className="object-cover object-[center_12%]"
                priority
              />
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-10 md:mt-12">
          <svg className="absolute left-[18px] top-2 hidden h-[calc(100%-1rem)] w-8 md:block" viewBox="0 0 32 900" fill="none">
            <motion.path
              d="M16 8 C16 200 16 350 16 890"
              stroke="#7B9E6B"
              strokeWidth="2"
              style={{ pathLength }}
            />
          </svg>

          <div className="space-y-7">
            {entries.map((entry, i) => (
              <Reveal key={`${entry.date}-${entry.title}-${entry.role}`} delay={i * 0.08}>
                <article className="grid gap-3 rounded-lg border border-[color:color-mix(in_srgb,var(--color-sand)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_6%,transparent)] p-5 md:grid-cols-[120px_1fr]">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-canopy)]">{entry.date}</p>
                  <div>
                    <h3 className="font-heading text-3xl text-[var(--color-shell)]">{entry.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-sand)]">{entry.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--color-sand)_82%,white)]">{entry.detail}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
