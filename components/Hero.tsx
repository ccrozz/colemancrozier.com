"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      void video.play().catch(() => {});
    };

    syncPlayback();
    video.addEventListener("loadeddata", syncPlayback);
    return () => video.removeEventListener("loadeddata", syncPlayback);
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[var(--color-deep-sea)]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/videos/old-florida-flyover-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/old-florida-flyover.mp4" type="video/mp4" />
        <source src="/videos/old-florida-flyover.mov" type="video/quicktime" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,20,28,0.82)_8%,rgba(9,20,28,0.56)_48%,rgba(9,20,28,0.8)_100%)]" />
      <div className="grain-overlay" />

      <div className="section-wrap relative z-10 flex min-h-screen items-center justify-center py-28">
        <Reveal className="space-y-6 text-center">
          <p className="eyebrow">Melbourne Beach, Florida</p>
          <h1 className="font-display text-5xl leading-[0.95] text-[var(--color-shell)] md:text-7xl">
            Living at the
            <br />
            intersection of
            <br />
            <em className="italic text-[var(--color-sand)]">land, sea &amp; data.</em>
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-[color:color-mix(in_srgb,var(--color-sand)_82%,white)]">
          UF Alumni. Restoration Ecologist. Agronomist. Full-stack developer.
            Angler. Surfer. Photographer. Coleman Crozier.
          </p>
          <a
            href="#about"
            className="inline-block rounded-sm bg-[var(--color-moss)] px-5 py-3 text-sm text-[var(--color-shell)] transition hover:bg-[var(--color-lagoon)]"
          >
            Explore the Ecosystem →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
