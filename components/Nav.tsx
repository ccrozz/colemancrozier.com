"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const borderOpacity = useTransform(scrollY, [60, 120], [0.25, 0.55]);
  const navBg = useTransform(
    scrollY,
    [0, 200],
    [
      "linear-gradient(180deg, rgba(11,24,33,0.72) 0%, rgba(11,24,33,0.32) 100%)",
      "linear-gradient(180deg, rgba(11,24,33,0.92) 0%, rgba(11,24,33,0.72) 100%)",
    ],
  );
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-[var(--color-lagoon)]"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.nav
        className="fixed left-0 right-0 top-0 z-40 border-b border-transparent backdrop-blur-md"
        style={{
          backgroundImage: navBg,
          borderBottomColor: "color-mix(in srgb, var(--color-sand) 34%, transparent)",
        }}
      >
        <div className="section-wrap flex items-center justify-between py-4">
          <a href="#home" className="font-heading text-xl text-[var(--color-shell)]">
            Coleman Crozier
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="eyebrow text-[color:color-mix(in_srgb,var(--color-shell)_84%,var(--color-sand)_16%)] transition hover:text-[var(--color-canopy)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            className="eyebrow text-[color:color-mix(in_srgb,var(--color-shell)_84%,var(--color-sand)_16%)] md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
        <motion.div
          className="h-px bg-[color:color-mix(in_srgb,var(--color-sand)_75%,var(--color-shell)_25%)]"
          style={{ opacity: borderOpacity }}
        />
      </motion.nav>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[var(--color-moss)] md:hidden"
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-shell)_35%,transparent)] text-3xl font-light leading-none text-[var(--color-shell)] transition hover:bg-[color:color-mix(in_srgb,var(--color-shell)_12%,transparent)]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden>×</span>
          </button>
          {links.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setOpen(false)}
              className="font-heading text-4xl text-[var(--color-shell)]"
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </>
  );
}
