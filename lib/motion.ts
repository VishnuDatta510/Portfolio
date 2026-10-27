"use client";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Flip } from "gsap/dist/Flip"; // "gsap/Flip" trips a casing clash in gsap's types on Windows
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Flip, useGSAP);

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+-#";

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Decodes an element's own text out of noise. */
export function scramble(el: Element, vars: gsap.TweenVars = {}) {
  return gsap.to(el, {
    duration: 1,
    ease: "none",
    scrambleText: {
      text: el.textContent ?? "",
      chars: SCRAMBLE_CHARS,
      speed: 0.6,
      revealDelay: 0.15,
    },
    ...vars,
  });
}

/**
 * The site's shared reveal vocabulary, wired for everything inside `scope`:
 *   [data-split]     lines rise out of a mask
 *   [data-scramble]  text decodes from noise
 *   [data-draw]      a hairline draws from its start ("y" for vertical)
 * Each plays once when it scrolls into view.
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || reducedMotion()) return;

      root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        let played = false;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // A resize re-splits the text; don't replay what was seen.
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.08,
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
                onEnter: () => (played = true),
              },
            });
          },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
        gsap.set(el, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.set(el, { autoAlpha: 1 });
            scramble(el);
          },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
        const vertical = el.dataset.draw === "y";
        gsap.from(el, {
          [vertical ? "scaleY" : "scaleX"]: 0,
          transformOrigin: vertical ? "center top" : "left center",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    },
    { scope },
  );
}
