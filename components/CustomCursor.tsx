"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const viewTargetsSelector =
    ".project-row, .achievement-card, .project-grid-card";

  useEffect(() => {
    const dot = dotRef.current;
    const circle = circleRef.current;
    if (!dot || !circle) return;

    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(circle, "x", { duration: 0.2, ease: "power2" });
    const yTo = gsap.quickTo(circle, "y", { duration: 0.2, ease: "power2" });

    const moveCursor = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .hoverable")) {
        circle.classList.add("hovering");
      }
      if (target.closest(viewTargetsSelector)) {
        circle.classList.add("viewing");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if (
        target.closest("a, button, .hoverable") &&
        !related?.closest("a, button, .hoverable")
      ) {
        circle.classList.remove("hovering");
      }
      if (
        target.closest(viewTargetsSelector) &&
        !related?.closest(viewTargetsSelector)
      ) {
        circle.classList.remove("viewing");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={circleRef} className="cursor-circle">
        <span className="cursor-text">VIEW</span>
      </div>
    </>
  );
}
