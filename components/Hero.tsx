"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import type { Application } from "@splinetool/runtime";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  isReady: boolean;
  /** Mount the scene only once the preloader's letters have settled: its
      script eval and scene build stall the main thread. */
  loadScene: boolean;
  onSplineLoad: () => void;
}

export default function Hero({ isReady, loadScene, onSplineLoad }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const splineApp = useRef<Application | null>(null);
  const [showSpline, setShowSpline] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (mobile) {
      onSplineLoad();
      return;
    }
    if (loadScene) setShowSpline(true);
  }, [loadScene, onSplineLoad]);

  useEffect(() => {
    if (!isReady || hasAnimated.current || !heroRef.current) return;
    hasAnimated.current = true;

    const el = heroRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-index",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.2,
      )
        .fromTo(
          ".hero-meta-item",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.5 },
          "-=0.2",
        )
        .to(
          ".hero-heading-line > span",
          { y: 0, stagger: 0.1, duration: 0.9, ease: "power4.out" },
          0.1,
        )
        .to(
          ".hero-heading-accent",
          { scaleX: 1, duration: 0.7, ease: "power3.out" },
          "-=0.6",
        )
        .to(".hero-role", { opacity: 1, duration: 0.6 }, "-=0.5")
        .to(".hero-description", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .fromTo(
          ".hero-scroll-cover",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          0,
        )
        .fromTo(
          ".hero-divider",
          { scaleX: 0 },
          {
            scaleX: 1,
            stagger: 0.1,
            duration: 0.9,
            transformOrigin: "left",
            ease: "power3.out",
          },
          "<",
        );

      gsap.to(".hero-inner", {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      const wrap = el.querySelector(".hero-spline-wrap") as HTMLElement | null;

      ScrollTrigger.create({
        trigger: el,
        start: "bottom top",
        onLeave: () => {
          if (wrap) wrap.style.visibility = "hidden";
        },
        onEnterBack: () => {
          if (wrap) wrap.style.visibility = "visible";
        },
      });
    }, el);

    return () => {
      hasAnimated.current = false;
      ctx.revert();
    };
  }, [isReady]);

  const onLoad = (app: Application) => {
    splineApp.current = app;
    onSplineLoad();
  };

  return (
    <section
      ref={heroRef}
      className="hero"
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {showSpline && (
        <div className="hero-spline-wrap">
          <Spline
            scene="https://prod.spline.design/sF4UdzWuD4EmnRZ2/scene.splinecode"
            onLoad={onLoad}
          />
        </div>
      )}

      <div className="hero-inner" style={{ pointerEvents: "none" }}>
        <div className="hero-content-left">
          <h1 className="hero-heading">
            <span className="hero-heading-line">
              <span>Crafting</span>
            </span>
            <span className="hero-heading-line hero-heading-line--accent">
              <span className="hero-heading-accent-group">
                <em className="italic">Digital</em>
                <span className="hero-heading-accent" aria-hidden="true" />
              </span>
            </span>
            <span className="hero-heading-line">
              <span>Experiences</span>
            </span>
          </h1>

          <p className="hero-role">Full-Stack Developer &amp; AI enthusiast</p>

          <span className="hero-divider" />

          <p className="hero-description hero-bottom-item">
            Building experiences that live at the intersection of design
            precision and engineering craft.
          </p>
        </div>
      </div>

      {showSpline && <div className="hero-spline-badge" aria-hidden="true" />}

      <div className="hero-scroll-cover">
        <span>Scroll to explore</span>
        <div className="hero-scroll-circle">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
