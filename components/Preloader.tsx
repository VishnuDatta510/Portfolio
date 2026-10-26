"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, scramble, reducedMotion } from "@/lib/motion";

interface PreloaderProps {
  /** Fires as the sheet starts lifting, so the hero can draw in under it. */
  onReveal: () => void;
}

const STAGES: [number, string][] = [
  [0, "Setting up grid"],
  [34, "Plotting layers"],
  [68, "Annotating"],
  [100, "Ready"],
];

const TITLE_BLOCK = [
  ["Drawn", "V. Datta"],
  ["Sheet", "01 of 07"],
  ["Scale", "1 : 1"],
  ["Rev.", "2026.10"],
];

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
      const count = root.querySelector<HTMLElement>(".loader-count-value")!;
      const status = root.querySelector<HTMLElement>(".loader-status-text")!;
      const progress = { v: 0 };
      let stage = 0;

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "expo.inOut" },
        onComplete: () => setGone(true),
      });

      tl.from(".loader-edge--h", { scaleX: 0, duration: 1.1, stagger: 0.1 })
        .from(".loader-edge--v", { scaleY: 0, duration: 1.1, stagger: 0.1 }, 0.1)
        .from(".loader-mark", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.06, ease: "back.out(2)" }, 0.4)
        .from(".loader-reveal", { yPercent: 110, duration: 0.8, stagger: 0.05, ease: "expo.out" }, 0.5)
        .to(
          progress,
          {
            v: 100,
            duration: 1.7,
            ease: "power2.inOut",
            onUpdate: () => {
              const v = Math.round(progress.v);
              count.textContent = String(v).padStart(3, "0");
              const next = STAGES.findLastIndex(([at]) => v >= at);
              if (next !== stage) {
                stage = next;
                status.textContent = STAGES[next][1];
                scramble(status, { duration: 0.45 });
              }
            },
          },
          0.6,
        )
        .fromTo(".loader-bar-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0.6)
        .to(".loader-reveal", { yPercent: -110, duration: 0.55, stagger: 0.03, ease: "power3.in" }, "+=0.15")
        .to(".loader-mark", { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" }, "<")
        .to(".loader-edge--h", { scaleX: 0, transformOrigin: "right center", duration: 0.6 }, "<0.1")
        .to(".loader-edge--v", { scaleY: 0, transformOrigin: "center bottom", duration: 0.6 }, "<")
        .addLabel("lift", "-=0.1")
        .call(
          () => {
            document.body.style.overflow = "";
            onReveal();
          },
          [],
          "lift",
        )
        .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "lift")
        .fromTo(".loader-scan", { yPercent: 0 }, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "lift");

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
      <div className="loader-frame" aria-hidden="true">
        <span className="loader-edge loader-edge--h loader-edge--t" />
        <span className="loader-edge loader-edge--h loader-edge--b" />
        <span className="loader-edge loader-edge--v loader-edge--l" />
        <span className="loader-edge loader-edge--v loader-edge--r" />
        <span className="loader-mark loader-mark--tl" />
        <span className="loader-mark loader-mark--tr" />
        <span className="loader-mark loader-mark--bl" />
        <span className="loader-mark loader-mark--br" />
      </div>

      <div className="loader-top mono" aria-hidden="true">
        <span className="loader-mask"><span className="loader-reveal">Drafting sheet 01</span></span>
        <span className="loader-mask"><span className="loader-reveal">Vishnu Datta — Portfolio</span></span>
      </div>

      <div className="loader-center" aria-hidden="true">
        <div className="loader-mask">
          <div className="loader-count loader-reveal">
            <span className="loader-count-value">000</span>
            <span className="loader-count-unit mono">%</span>
          </div>
        </div>
        <div className="loader-mask">
          <div className="loader-reveal loader-status mono">
            <span className="loader-bar"><span className="loader-bar-fill" /></span>
            <span className="loader-status-text">{STAGES[0][1]}</span>
          </div>
        </div>
      </div>

      <dl className="loader-block mono" aria-hidden="true">
        {TITLE_BLOCK.map(([k, v]) => (
          <div key={k} className="loader-mask">
            <div className="loader-reveal loader-block-row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          </div>
        ))}
      </dl>

      <span className="loader-scan" aria-hidden="true" />
    </div>
  );
}
