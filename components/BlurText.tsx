"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface BlurTextProps {
  text?: string;
  /** Milliseconds between each segment. */
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  /** Seconds per keyframe step. */
  stepDuration?: number;
  onAnimationComplete?: () => void;
}

const BlurText = ({
  text = "",
  delay = 250,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
  onAnimationComplete,
}: BlurTextProps) => {
  const segments = animateBy === "words" ? text.split(" ") : text.split("");
  const ref = useRef<HTMLSpanElement>(null);
  const completeRef = useRef(onAnimationComplete);
  completeRef.current = onAnimationComplete;

  const fromY = direction === "top" ? -50 : 50;
  const midY = direction === "top" ? 5 : -5;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = gsap.utils.toArray<HTMLElement>(el.children);
    if (targets.length === 0) return;

    let tween: gsap.core.Tween | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        tween = gsap.to(targets, {
          keyframes: [
            {
              opacity: 0.5,
              y: midY,
              filter: "blur(5px)",
              duration: stepDuration,
              ease: "none",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: stepDuration,
              ease: "none",
            },
          ],
          stagger: delay / 1000,
          onComplete: () => {
            // A lingering blur filter keeps every glyph on its own raster
            // layer, so drop it once the reveal has settled.
            gsap.set(targets, { clearProps: "filter,willChange" });
            completeRef.current?.();
          },
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [delay, midY, rootMargin, stepDuration, threshold, text]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap" }}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            opacity: 0,
            transform: `translateY(${fromY}px)`,
            filter: "blur(10px)",
            willChange: "transform, opacity, filter",
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < segments.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
};

export default BlurText;
