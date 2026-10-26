"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

let instance: Lenis | null = null;
export const getLenis = () => instance;

/** One Lenis for the whole app, driven by GSAP's ticker so scroll and
    ScrollTrigger advance on the same frame. Survives route changes. */
export default function SmoothScroll() {
  useEffect(() => {
    // Mobile browsers fire resize every time the URL bar slides; refreshing
    // ScrollTrigger mid-scroll on that is a guaranteed stutter.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      autoRaf: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const lock = () => lenis.stop();
    const unlock = () => lenis.start();
    window.addEventListener("portfolio:lock-scroll", lock);
    window.addEventListener("portfolio:unlock-scroll", unlock);

    return () => {
      window.removeEventListener("portfolio:lock-scroll", lock);
      window.removeEventListener("portfolio:unlock-scroll", unlock);
      gsap.ticker.remove(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
