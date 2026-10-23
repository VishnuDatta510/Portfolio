"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
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

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time: number) => {
            lenis.raf(time * 1000);
        };

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
        };
    }, []);

    return <>{children}</>;
}
