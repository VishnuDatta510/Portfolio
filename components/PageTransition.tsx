"use client";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap, reducedMotion } from "@/lib/motion";
import { getLenis } from "./SmoothScroll";

const PANELS = 6;

/** False only while the first page of a hard load renders: anything later is in-app navigation. */
export let appMounted = false;

export function navigate(href: string) {
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: href }));
}

/** A next/link that swaps sheets through the transition instead of cutting. */
export function TransitionLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(String(href));
      }}
    />
  );
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const phase = useRef<"idle" | "covering" | "covered">("idle");
  const [label, setLabel] = useState("");

  useEffect(() => {
    appMounted = true;
    const el = ref.current;
    if (!el) return;

    const onNavigate = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      if (phase.current !== "idle") return;
      const path = href.split("#")[0] || "/";
      if (path === window.location.pathname || reducedMotion()) {
        router.push(href);
        return;
      }

      phase.current = "covering";
      setLabel(path === "/projects" ? "All projects" : "Home");
      router.prefetch(path);

      gsap
        .timeline({
          onComplete: () => {
            phase.current = "covered";
            router.push(href);
          },
        })
        .set(el, { visibility: "visible" })
        .fromTo(
          el.querySelectorAll(".pt-panel"),
          { scaleY: 0, transformOrigin: "50% 100%" },
          { scaleY: 1, duration: 0.7, stagger: 0.045, ease: "expo.inOut" },
        )
        .fromTo(
          el.querySelectorAll(".pt-label > span"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, stagger: 0.06, ease: "expo.out" },
          "-=0.3",
        );
    };

    window.addEventListener("portfolio:navigate", onNavigate);
    return () => window.removeEventListener("portfolio:navigate", onNavigate);
  }, [router]);

  // The new route has committed: uncover it.
  useEffect(() => {
    const el = ref.current;
    if (!el || phase.current !== "covered") return;

    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      const target = hash && document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: "instant" });
      else window.scrollTo(0, 0);
      getLenis()?.resize();

      gsap
        .timeline({
          onComplete: () => {
            phase.current = "idle";
            gsap.set(el, { visibility: "hidden" });
          },
        })
        .to(el.querySelectorAll(".pt-label > span"), {
          yPercent: -110,
          duration: 0.4,
          stagger: 0.04,
          ease: "power3.in",
        })
        .to(
          el.querySelectorAll(".pt-panel"),
          {
            scaleY: 0,
            transformOrigin: "50% 0%",
            duration: 0.75,
            stagger: 0.045,
            ease: "expo.inOut",
          },
          "-=0.15",
        );
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div ref={ref} className="pt" aria-hidden="true">
      {Array.from({ length: PANELS }, (_, i) => (
        <span key={i} className="pt-panel" />
      ))}
      <div className="pt-label mono">
        <span>Loading sheet</span>
        <span className="pt-label-title">{label}</span>
      </div>
    </div>
  );
}
