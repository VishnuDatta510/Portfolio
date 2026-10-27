"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/motion";

interface PreloaderProps {
  /** Fires as the blinds start closing, so the hero can draw in behind them. */
  onReveal: () => void;
}

const ROWS = 7;
const HOT = 3;
// Brake point of the rows; everything after it is the hand-off to the hero.
const STOP = 2.5;

export default function Preloader({ onReveal }: PreloaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      if (reducedMotion()) {
        onReveal();
        setGone(true);
        return;
      }

      document.body.style.overflow = "hidden";
      const count = root.querySelector<HTMLElement>(".loader-count")!;
      const progress = { v: 0 };

      const tl = gsap.timeline({ paused: true, onComplete: () => setGone(true) });

      // Rows whip past in alternating directions, braking hard, while the count runs.
      root.querySelectorAll<HTMLElement>(".loader-row").forEach((row, i) => {
        const right = i % 2;
        tl.fromTo(row, { xPercent: right ? -55 : 0 }, { xPercent: right ? -5 : -50, duration: 2.6, ease: "expo.out" }, 0);
      });
      tl.from(".loader-strip", { opacity: 0, duration: 0.5, stagger: 0.05 }, 0)
        .to(
          progress,
          {
            v: 100,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              count.textContent = String(Math.round(progress.v)).padStart(3, "0");
            },
          },
          0.2,
        )
        .to(".loader-corner", { opacity: 0, duration: 0.3 }, STOP)
        // Blinds snap shut to the right, one after another, opening the hero behind.
        .call(onReveal, [], STOP + 0.2)
        // Negative top/bottom insets keep the orange row's glow from being cut to a hard box.
        .fromTo(
          ".loader-strip",
          { clipPath: "inset(-80px 0% -80px 0%)" },
          {
            clipPath: "inset(-80px 0% -80px 100%)",
            duration: 0.9,
            ease: "expo.inOut",
            stagger: { each: 0.09, from: "start" },
          },
          STOP + 0.2,
        )
        .call(() => {
          document.body.style.overflow = "";
        });

      // Hydration shares this task; start on a fresh frame so nothing skips.
      const frame = requestAnimationFrame(() => tl.play());
      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = "";
      };
    },
    { scope: ref },
  );

  if (gone) return null;

  return (
    <div ref={ref} className="loader" role="status" aria-label="Loading">
      <div className="loader-wall" aria-hidden="true">
        {Array.from({ length: ROWS }, (_, i) => {
          const d = Math.abs(i - HOT);
          const style = { "--a1": (0.34 - d * 0.07).toFixed(2), "--a2": (0.1 - d * 0.02).toFixed(2) } as React.CSSProperties;
          return (
            <div key={i} className={`loader-strip${i === HOT ? " loader-strip--hot" : ""}`}>
              <div className="loader-row" style={style}>
                {"Vishnu Datta — ".repeat(9)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="loader-corner loader-corner--tl mono" aria-hidden="true">
        Loading <span className="loader-count">000</span>
      </div>
      <div className="loader-corner loader-corner--br mono" aria-hidden="true">
        VD / 2026
      </div>
    </div>
  );
}
