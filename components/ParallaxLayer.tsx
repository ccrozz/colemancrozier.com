"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxLayer() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 3000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 3000], [0, 360]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.svg
        style={{ y: y1 }}
        className="absolute -left-24 top-0 h-[120vh] w-[50vw] opacity-[0.05]"
        viewBox="0 0 400 1200"
        fill="none"
      >
        <path
          d="M80 1180 C90 900 40 700 100 500 C150 330 100 150 160 20"
          stroke="#F2EDE4"
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          d="M160 1180 C175 940 140 700 210 530 C260 380 220 170 280 0"
          stroke="#F2EDE4"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </motion.svg>

      <motion.svg
        style={{ y: y2 }}
        className="absolute right-0 top-20 h-[120vh] w-[45vw] opacity-[0.08]"
        viewBox="0 0 380 1200"
        fill="none"
      >
        <path
          d="M340 1180 C300 980 340 760 290 560 C250 410 290 210 240 40"
          stroke="#4A5C3F"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M300 1180 C270 1020 290 800 240 610 C210 500 220 260 180 80"
          stroke="#4A5C3F"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </motion.svg>

      <div className="grain-overlay" />
    </div>
  );
}
