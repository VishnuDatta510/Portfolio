"use client";
import { useRef } from "react";
import { gsap, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import { FiArrowUpRight } from "react-icons/fi";
import SheetHead from "./SheetHead";

const achievements = [
  {
    year: "2026",
    metric: "1st",
    label: "Regional round",
    title: "Regional Winner – GDG Bit N Build International Hackathon",
    description:
      "Won the regional round of GDG's Bit N Build International Hackathon and qualified for the International Grand Finals in Mumbai.",
    link: "",
  },
  {
    year: "2026",
    metric: "1700",
    suffix: "+",
    label: "LeetCode rating",
    title: "1700+ Rating on LeetCode",
    description:
      "Consistent problem solving across data structures, graphs and dynamic programming, sharpened through regular contests.",
    link: "https://leetcode.com/u/Vishno-Way/",
  },
  {
    year: "2026",
    metric: "GNN",
    label: "Thesis research",
    title: "Undergraduate Research – Graph Neural Networks",
    description:
      "Researching and implementing advanced GNN architectures applied to bioinformatics as part of a Bachelor's Thesis Project.",
    link: "",
  },
];

export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".achv-row").forEach((row) => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });

        tl.from(row.querySelector(".achv-line"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
          .from(row.querySelectorAll(".achv-metric-mask > *"), { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.25)
          .from(row.querySelectorAll(".achv-title, .achv-desc"), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.35)
          .from(row.querySelectorAll(".achv-index, .achv-metric-label, .achv-meta"), { y: 12, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.45);

        const count = row.querySelector<HTMLElement>("[data-count]");
        if (count) {
          const n = { v: 0 };
          count.textContent = "0";
          tl.to(
            n,
            {
              v: Number(count.dataset.count),
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => {
                count.textContent = String(Math.round(n.v));
              },
            },
            0.3,
          );
        }
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="section achievements" id="achievements">
      <SheetHead fig="06" title="Achievements" note="Test results" />

      <div className="achv-list">
        {achievements.map((item, i) => {
          const numeric = /^\d+$/.test(item.metric);
          return (
            <article key={item.title} className={`achv-row${item.link ? " achv-row--link" : ""}`}>
              <span className="achv-line" aria-hidden="true" />
              <span className="achv-index mono">{String(i + 1).padStart(2, "0")}</span>

              <div className="achv-metric" aria-hidden="true">
                <span className="achv-metric-mask">
                  <span className="achv-metric-value" data-count={numeric ? item.metric : undefined}>
                    {item.metric}
                  </span>
                  {item.suffix && <span className="achv-metric-suffix">{item.suffix}</span>}
                </span>
                <span className="achv-metric-label mono">{item.label}</span>
              </div>

              <div className="achv-body">
                <h3 className="achv-title">{item.title}</h3>
                <p className="achv-desc">{item.description}</p>
              </div>

              <div className="achv-meta mono">
                <span>{item.year}</span>
                {item.link && <FiArrowUpRight aria-hidden="true" className="achv-arrow" />}
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="achv-hit"
                  aria-label={`View achievement: ${item.title}`}
                />
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
