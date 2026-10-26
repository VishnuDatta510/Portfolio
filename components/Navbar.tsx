"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger, useGSAP, scramble, reducedMotion } from "@/lib/motion";
import { getLenis } from "./SmoothScroll";
import { navigate } from "./PageTransition";
import LocalTime from "./LocalTime";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/** Scroll to a section on this page, or travel home to it from /projects. */
function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return navigate(`/#${id}`);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function toTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Navbar({ isReady }: { isReady: boolean }) {
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || !isReady) return;

      if (!reducedMotion()) {
        gsap.from(nav.querySelectorAll(".nav-reveal"), {
          yPercent: 120,
          duration: 1,
          stagger: 0.05,
          ease: "expo.out",
          delay: 0.3,
        });
      }
      gsap.set(nav, { autoAlpha: 1 });

      gsap.to(".nav-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      ScrollTrigger.create({
        start: "top -80",
        onToggle: (self) => nav.classList.toggle("is-scrolled", self.isActive),
      });
    },
    { scope: navRef, dependencies: [isReady] },
  );

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    window.dispatchEvent(new CustomEvent("portfolio:lock-scroll"));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
      window.dispatchEvent(new CustomEvent("portfolio:unlock-scroll"));
    };
  }, [open, close]);

  const select = (id: string) => {
    close();
    // Let the overlay release scroll before Lenis moves.
    requestAnimationFrame(() => goTo(id));
  };

  const decode = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion()) return;
    const label = e.currentTarget.querySelector(".nav-link-text");
    if (label && !gsap.isTweening(label)) scramble(label, { duration: 0.5 });
  };

  return (
    <>
      <nav ref={navRef} className={`nav${open ? " is-open" : ""}`} aria-label="Primary">
        <button
          type="button"
          className="nav-logo"
          onClick={() => {
            close();
            if (window.location.pathname === "/") toTop();
            else navigate("/");
          }}
        >
          <span className="nav-mask">
            <span className="nav-reveal">
              <b>VD</b>
              <span className="nav-logo-sub mono">/ Portfolio</span>
            </span>
          </span>
        </button>

        <div className="nav-clock mono" aria-label="Local time in India">
          <span className="nav-mask">
            <span className="nav-reveal">
              <span className="nav-clock-dot" aria-hidden="true" />
              IST <LocalTime />
            </span>
          </span>
        </div>

        <ul className="nav-links mono">
          {LINKS.map((link) => (
            <li key={link.id} className="nav-mask">
              <button type="button" className="nav-link nav-reveal" onClick={() => select(link.id)} onPointerEnter={decode}>
                <span className="nav-bracket" aria-hidden="true">[</span>
                <span className="nav-link-text">{link.label}</span>
                <span className="nav-bracket" aria-hidden="true">]</span>
              </button>
            </li>
          ))}
          <li className="nav-mask">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link nav-link--cta nav-reveal"
              onPointerEnter={decode}
            >
              <span className="nav-link-text">Résumé</span> ↗
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="nav-burger mono"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-overlay"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-mask">
            <span className="nav-reveal">{open ? "Close" : "Menu"}</span>
          </span>
          <span className="nav-burger-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>

        <span className="nav-progress" aria-hidden="true" />
      </nav>

      <div
        id="nav-overlay"
        className={`nav-overlay${open ? " is-open" : ""}`}
        inert={!open}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <ul className="nav-overlay-links">
          {LINKS.map((link, i) => (
            <li key={link.id} style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}>
              <button type="button" className="nav-overlay-link" onClick={() => select(link.id)}>
                <span className="nav-overlay-index mono">{String(i + 1).padStart(2, "0")}</span>
                {link.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-overlay-foot mono">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Résumé ↗
          </a>
          <span>
            IST <LocalTime />
          </span>
        </div>
      </div>
    </>
  );
}
