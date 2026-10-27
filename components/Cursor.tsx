"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

const TARGETS = "a, button, [data-cursor]";
const IDLE = 9; // reticle half-size
const PAD = 6; // bracket clearance around a locked target

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

/**
 * Drafting crosshair: hairlines track the pointer with a coordinate readout,
 * and four corner brackets lock onto whatever is clickable. It sits on top of
 * the system cursor rather than replacing it.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const q = <T extends Element>(s: string) => root.querySelector<T>(s)!;
    const opts = { duration: 0.35, ease: "power3" };
    const hY = gsap.quickTo(q(".cursor-h"), "y", opts);
    const vX = gsap.quickTo(q(".cursor-v"), "x", opts);
    const coords = q<HTMLElement>(".cursor-coords");
    const cX = gsap.quickTo(coords, "x", opts);
    const cY = gsap.quickTo(coords, "y", opts);
    const corners = Array.from(root.querySelectorAll(".cursor-corner")).map((c) => ({
      x: gsap.quickTo(c, "x", opts),
      y: gsap.quickTo(c, "y", opts),
    }));

    let px = -100;
    let py = -100;
    let target: Element | null = null;
    let frame = 0;

    const place = () => {
      frame = 0;
      let l = px - IDLE, t = py - IDLE, r = px + IDLE, b = py + IDLE;
      if (target) {
        const rect = target.getBoundingClientRect();
        l = rect.left - PAD; t = rect.top - PAD; r = rect.right + PAD; b = rect.bottom + PAD;
      }
      [[l, t], [r, t], [l, b], [r, b]].forEach(([x, y], i) => {
        corners[i].x(x);
        corners[i].y(y);
      });
      hY(py);
      vX(px);
      cX(px);
      cY(py);
      coords.textContent = `X ${pad(px)}  Y ${pad(py)}`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      root.classList.add("is-visible");
      schedule();
    };
    const onOver = (e: PointerEvent) => {
      const next = (e.target as Element).closest(TARGETS);
      if (next === target) return;
      target = next;
      root.classList.toggle("is-locked", !!next);
      schedule();
    };
    const onLeave = () => root.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    // A locked target moves under a still pointer while the page scrolls.
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor-h" />
      <span className="cursor-v" />
      <span className="cursor-coords mono" />
      <span className="cursor-corner cursor-corner--tl" />
      <span className="cursor-corner cursor-corner--tr" />
      <span className="cursor-corner cursor-corner--bl" />
      <span className="cursor-corner cursor-corner--br" />
    </div>
  );
}
