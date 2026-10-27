"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import { PROJECTS } from "@/lib/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";

const FILTERS = ["All", "AI", "Full-stack", "Backend", "Real-time", "Tools"];

export default function ProjectsPage() {
  const ref = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState("All");
  const flipState = useRef<Flip.FlipState | null>(null);
  useReveals(ref);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".dwg", {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        stagger: 0.07,
        ease: "expo.out",
        delay: 0.4,
      });
    },
    { scope: ref },
  );

  // Cards that stay glide to their new slots; new ones fade in behind them.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      targets: ".dwg",
      duration: 0.8,
      ease: "expo.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.2 }),
    });
  }, [filter]);

  const choose = (next: string) => {
    if (next === filter) return;
    if (!reducedMotion()) flipState.current = Flip.getState(".dwg");
    setFilter(next);
  };

  const shown = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter));

  return (
    <>
      <Navbar isReady />
      <main ref={ref} id="main" className="section index">
        <header className="index-head">
          <div className="sheet-rule mono">
            <span data-scramble>Fig. 00 — All projects</span>
            <span className="sheet-rule-line" data-draw />
            <TransitionLink href="/#work" className="index-back">
              ← Back to home
            </TransitionLink>
          </div>
          <h1 className="sheet-title index-title" data-split>
            All work <sup className="mono">({String(PROJECTS.length).padStart(2, "0")})</sup>
          </h1>
        </header>

        <div className="index-filters mono" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => choose(f)}>
              {f}
              <span className="chip-count">
                {f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(f)).length}
              </span>
            </button>
          ))}
        </div>

        <ul className="index-grid" aria-live="polite">
          {shown.map((p) => (
            <li key={p.slug} className="dwg" data-flip-id={p.slug}>
              <div className="dwg-top mono">
                <span>Project {String(PROJECTS.indexOf(p) + 1).padStart(2, "0")}</span>
                <span>{p.year}</span>
              </div>
              <h2 className="dwg-name">{p.name}</h2>
              <p className="dwg-summary">{p.summary}</p>
              <div className="dwg-foot mono">
                <span className="dwg-tags">{p.tags.join(" / ")}</span>
                <span className="dwg-links">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live site`}>
                      Live ↗
                    </a>
                  )}
                  <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source code`}>
                    Source ↗
                  </a>
                </span>
              </div>
              {["tl", "tr", "bl", "br"].map((c) => (
                <span key={c} className={`dwg-corner dwg-corner--${c}`} aria-hidden="true" />
              ))}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
