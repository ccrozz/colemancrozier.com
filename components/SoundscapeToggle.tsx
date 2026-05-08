"use client";

import { useEffect, useRef, useState } from "react";
import type { Howl } from "howler";

type Mode = "off" | "ocean" | "forest";

const order: Mode[] = ["off", "ocean", "forest"];

export default function SoundscapeToggle() {
  const [mode, setMode] = useState<Mode>("off");
  const oceanRef = useRef<Howl | null>(null);
  const forestRef = useRef<Howl | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("soundscapeMode") as Mode | null) ?? "off";
    setMode(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("soundscapeMode", mode);
  }, [mode, ready]);

  async function ensurePlayers() {
    if (oceanRef.current && forestRef.current) return;
    const { Howl } = await import("howler");
    oceanRef.current = new Howl({ src: ["/sounds/ocean-ambient.mp3"], loop: true, volume: 0 });
    forestRef.current = new Howl({ src: ["/sounds/forest-ambient.mp3"], loop: true, volume: 0 });
  }

  async function cycle() {
    const next = order[(order.indexOf(mode) + 1) % order.length];
    await ensurePlayers();
    const ocean = oceanRef.current;
    const forest = forestRef.current;
    if (!ocean || !forest) return;

    if (next === "off") {
      ocean.fade(ocean.volume(), 0, 400);
      forest.fade(forest.volume(), 0, 400);
      setTimeout(() => {
        ocean.stop();
        forest.stop();
      }, 420);
    }
    if (next === "ocean") {
      forest.fade(forest.volume(), 0, 300);
      setTimeout(() => forest.stop(), 320);
      if (!ocean.playing()) ocean.play();
      ocean.fade(ocean.volume(), 0.18, 400);
    }
    if (next === "forest") {
      ocean.fade(ocean.volume(), 0, 300);
      setTimeout(() => ocean.stop(), 320);
      if (!forest.playing()) forest.play();
      forest.fade(forest.volume(), 0.18, 400);
    }
    setMode(next);
  }

  return (
    <button
      onClick={cycle}
      className="group inline-flex items-center gap-2 rounded border border-[color:color-mix(in_srgb,var(--color-sand)_44%,transparent)] bg-[color:color-mix(in_srgb,var(--color-deep-sea)_35%,transparent)] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[color:color-mix(in_srgb,var(--color-shell)_82%,var(--color-sand)_18%)]"
      title="Ambient sounds — toggle off anytime"
      aria-label="Toggle soundscape"
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          mode === "off"
            ? "border border-[color:color-mix(in_srgb,var(--color-shell)_60%,var(--color-sand)_40%)] bg-transparent"
            : "bg-[var(--color-canopy)]"
        }`}
      />
      {mode}
    </button>
  );
}
