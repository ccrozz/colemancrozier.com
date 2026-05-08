"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const entries = [
  {
    date: "Present",
    title: "Evergreen Solutions FL",
    role: "Founder & CEO",
    detail:
      "Leading ecological restoration work across Florida with a field-first approach: native restoration, land management, species assessment, habitat consulting, and invasive species management focused on measurable habitat outcomes.",
  },
  {
    date: "Present",
    title: "Gray Bay Solutions",
    role: "Co-Founder / Full-Stack Developer",
    detail:
      "Builds web presence and AI-powered tools for local Florida businesses with Next.js, Vercel, Cursor, Tailwind, and Supabase.",
  },
  {
    date: "Present",
    title: "Parkview Advance Financial Services",
    role: "Funding Specialist",
    detail:
      "Detailed records across 30+ active client files, compliance tracking end to end; coordination across internal teams under competing deadlines; Excel pipeline monitoring that surfaces what needs action; clear translation of regulatory requirements for clients.",
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
      "Currently studying for a Master’s in Agronomy with a concentration in Agroecology. B.S. concentration: Food & Agribusiness Marketing and Management · GPA 3.21 · SEC Academic Honor Roll (2020, 2021, 2022). Balanced 40+ hours per week of team obligations with coursework; earned playing time by junior season; routinely helped train younger DBs on technique and assignments.",
  },
];

export default function EcosystemTimeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" className="bg-[var(--color-deep-sea)] py-24">
      <div className="section-wrap">
        <Reveal>
          <p className="eyebrow">The Ecosystem</p>
          <h2 className="font-heading text-5xl text-[var(--color-shell)]">Interactive Resume</h2>
        </Reveal>

        <div ref={ref} className="relative mt-10">
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
