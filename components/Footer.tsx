"use client";
import { useRef } from "react";
import { gsap, useGSAP, useReveals, scramble, reducedMotion } from "@/lib/motion";
import { toTop } from "./Navbar";
import LocalTime from "./LocalTime";

const EMAIL = "vishnudatta2004@gmail.com";

const BLOCK: { k: string; v: React.ReactNode; href?: string }[] = [
  { k: "Name", v: "Vishnu Datta" },
  { k: "Location", v: <>India · <LocalTime /></> },
  { k: "Phone", v: "8186071702", href: "tel:8186071702" },
  { k: "LinkedIn", v: "/in/vishnudattagb", href: "https://www.linkedin.com/in/vishnudattagb/" },
  { k: "GitHub", v: "VishnuDatta510", href: "https://github.com/VishnuDatta510" },
  { k: "LeetCode", v: "Vishno-Way", href: "https://leetcode.com/u/Vishno-Way/" },
  { k: "Résumé", v: "PDF ↗", href: "/resume.pdf" },
  { k: "Updated", v: "Oct 2026" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  useGSAP(
    () => {
      if (reducedMotion()) return;

      // The title block is drawn in: the sheet border wipes across, then each entry is
      // written and its value decodes out of noise, like a drawing being annotated.
      gsap
        .timeline({ scrollTrigger: { trigger: ".foot-block", start: "top 85%", once: true } })
        .from(".foot-block", { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath" })
        // Fade the contents, not the cells: hidden cells expose the grid's line-coloured gap.
        .from(".foot-cell > *", { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.05, ease: "expo.out", clearProps: "all" }, 0.35)
        .call(
          () => gsap.utils.toArray<HTMLElement>(".foot-block [data-decode]").forEach((el, i) => scramble(el, { duration: 0.8, delay: i * 0.06 })),
          [],
          0.5,
        );

      gsap.fromTo(
        ".foot-giant-fill",
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: ".foot-giant", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="section foot" id="contact">
      <header className="sheet-head">
        <div className="sheet-rule mono">
          <span data-scramble>Fig. 07</span>
          <span className="sheet-rule-line" data-draw />
          <span data-scramble>Contact</span>
        </div>
      </header>

      <h2 className="foot-heading" data-split>
        Have something <em>worth</em> building?
      </h2>
      <a className="foot-email" href={`mailto:${EMAIL}`}>
        <span className="foot-email-text">{EMAIL}</span>
        <span className="foot-email-arrow" aria-hidden="true">↗</span>
      </a>

      <div className="foot-block mono">
        <dl className="foot-grid">
          {BLOCK.map(({ k, v, href }) => (
            <div key={k} className="foot-cell">
              <dt>{k}</dt>
              {/* Plain-text values decode on entry; the clock cell is live, so it is left alone. */}
              {href ? (
                <dd>
                  <a data-decode href={href} {...(href.startsWith("http") || href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {v}
                  </a>
                </dd>
              ) : (
                <dd {...(typeof v === "string" ? { "data-decode": "" } : {})}>{v}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>

      <div className="foot-giant" aria-hidden="true">
        <span className="foot-giant-outline">Vishnu Datta</span>
        <span className="foot-giant-fill">Vishnu Datta</span>
      </div>

      <div className="foot-bar mono">
        <span>© 2026 Vishnu Datta</span>
        <button type="button" onClick={toTop}>
          Back to top <span className="foot-up" aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
