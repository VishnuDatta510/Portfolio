"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/motion";

const ITEMS = ["Next.js", "FastAPI", "PostgreSQL", "Redis", "gRPC", "Celery", "AWS", "Docker", "FFmpeg", "Whisper", "Socket.IO", "TypeScript"];

/** A tech strip that idles left and rides the scroll: speed and direction
    follow scroll velocity, and fast flicks shear it. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reducedMotion()) return;

      const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      const track = root.querySelector(".marquee-track");
      let direction = 1;
      // Eases speed and shear back to idle once the scroll stops feeding it.
      const settle = gsap.to(loop, { timeScale: () => direction, duration: 1.2, ease: "power2.out", paused: true });
      const unskew = gsap.to(track, { skewX: 0, duration: 0.8, ease: "power3.out", paused: true });

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (Math.abs(v) > 20) direction = Math.sign(v);
          loop.timeScale(direction * (1 + Math.min(Math.abs(v) / 300, 6)));
          gsap.set(track, { skewX: gsap.utils.clamp(-8, 8, v / -200) });
          settle.invalidate().restart();
          unskew.invalidate().restart();
        },
      });
    },
    { scope: ref },
  );

  // Two identical halves so -50% lands exactly on the seam.
  const half = ITEMS.map((item) => (
    <span key={item} className="marquee-item">
      {item}
      <span className="marquee-sep" aria-hidden="true">+</span>
    </span>
  ));

  return (
    <div ref={ref} className="marquee mono" aria-label={`Tools: ${ITEMS.join(", ")}`}>
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-half">{half}</div>
        <div className="marquee-half">{half}</div>
      </div>
    </div>
  );
}
