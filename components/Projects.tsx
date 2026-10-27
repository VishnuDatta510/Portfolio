"use client";
import { Fragment, useRef, useState } from "react";
import { gsap, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import { FEATURED, PROJECTS } from "@/lib/projects";
import SheetHead from "./SheetHead";
import { TransitionLink } from "./PageTransition";

/** Columns of nodes, joined by connectors that carry a travelling packet. */
function ArchDiagram({ columns }: { columns: string[][] }) {
  return (
    <div className="arch" role="img" aria-label={`Architecture: ${columns.map((c) => c.join(" and ")).join(", then ")}`}>
      {columns.map((col, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="arch-link" aria-hidden="true">
              <span className="arch-packet" style={{ animationDelay: `${i * 0.35}s` }} />
            </span>
          )}
          <div className="arch-col">
            {col.map((node) => (
              <span key={node} className="arch-node mono">
                {node}
              </span>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const first = useRef(true);
  useReveals(ref);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(".proj-panel");
      if (first.current || reducedMotion()) {
        first.current = false;
        panels.forEach((p, i) => gsap.set(p, { height: i === open ? "auto" : 0 }));
        return;
      }
      panels.forEach((p, i) => {
        const opening = i === open;
        gsap.to(p, { height: opening ? "auto" : 0, duration: 0.9, ease: "expo.inOut", overwrite: true });
        if (opening) {
          gsap.fromTo(
            p.querySelectorAll(".proj-panel-inner > *"),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", delay: 0.25 },
          );
        }
      });
    },
    { scope: ref, dependencies: [open] },
  );

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".proj-head", {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 1.2,
        stagger: 0.08,
        ease: "expo.inOut",
        clearProps: "clipPath",
        scrollTrigger: { trigger: ".proj-list", start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="section projects" id="work">
      <SheetHead fig="05" title="Selected work" note={`Projects 01—${String(FEATURED.length).padStart(2, "0")}`} />

      <div className="proj-list">
        {FEATURED.map((p, i) => {
          const isOpen = open === i;
          const id = `proj-panel-${p.slug}`;
          return (
            <article key={p.slug} className={`proj${isOpen ? " is-open" : ""}`}>
              <h3 className="proj-title">
                <button
                  type="button"
                  className="proj-head"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="proj-num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="proj-name">{p.name}</span>
                  <span className="proj-tags mono">{p.tags.join(" / ")}</span>
                  <span className="proj-year mono">{p.year}</span>
                  <span className="proj-toggle" aria-hidden="true" />
                </button>
              </h3>

              <div id={id} className="proj-panel" inert={!isOpen}>
                <div className="proj-panel-inner">
                  <p className="proj-desc">{p.description ?? p.summary}</p>
                  {p.arch && <ArchDiagram columns={p.arch} />}
                  <div className="proj-foot">
                    <ul className="proj-stack mono">
                      {p.stack?.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                    <div className="proj-links mono">
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer">
                          Live ↗
                        </a>
                      )}
                      <a href={p.github} target="_blank" rel="noopener noreferrer">
                        Source ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <TransitionLink href="/projects" className="proj-index mono">
        <span>View all projects ({String(PROJECTS.length).padStart(2, "0")})</span>
        <span className="proj-index-arrow" aria-hidden="true">→</span>
      </TransitionLink>
    </section>
  );
}
