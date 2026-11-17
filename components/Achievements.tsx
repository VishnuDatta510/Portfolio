"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import { FiArrowUpRight } from "react-icons/fi";
import SheetHead from "./SheetHead";

type Achievement = {
  year: string;
  metric: string;
  suffix?: string;
  label: string;
  title: string;
  description: string;
  link: string;
  /** Certificate shown on hover (desktop) or inline (touch). */
  image?: string;
};

const achievements: Achievement[] = [
  {
    year: "2026",
    metric: "1st",
    label: "Regional round",
    title: "Regional Winner – GDG Bit N Build International Hackathon",
    description:
      "Won the regional round of GDG's Bit N Build International Hackathon and qualified for the International Grand Finals in Mumbai.",
    link: "https://drive.google.com/file/d/1gEeu1wlL-3aP0Vet02DwGwMzi3EUTWN4/view?usp=sharing",
    image: "/bnb-winner.png",
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

const CERTIFICATE = achievements.find((a) => a.image)?.image;
const noop = () => () => {};

export default function Achievements() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const follow = useRef<{ show: (e: React.PointerEvent) => void; hide: () => void } | null>(null);
  // The floating preview only exists for a real mouse; touch gets an inline thumbnail instead.
  const canHover = useSyncExternalStore(
    noop,
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );
  useReveals(ref);

  useEffect(() => {
    const el = previewRef.current;
    if (!canHover || !el) return;
    const opts = { duration: 0.55, ease: "power3" };
    const xTo = gsap.quickTo(el, "x", opts);
    const yTo = gsap.quickTo(el, "y", opts);
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    let settle = 0;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });

    // The card trails the pointer and leans into the direction of travel.
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.5));
      lastX = e.clientX;
      clearTimeout(settle);
      settle = window.setTimeout(() => rTo(0), 90);
    };

    follow.current = {
      show: (e) => {
        if (e.pointerType !== "mouse") return;
        lastX = e.clientX;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        window.addEventListener("pointermove", move, { passive: true });
        gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out", overwrite: "auto" });
      },
      hide: () => {
        window.removeEventListener("pointermove", move);
        gsap.to(el, { autoAlpha: 0, scale: 0.6, rotation: 0, duration: 0.35, ease: "power3.in", overwrite: "auto" });
      },
    };
    return () => {
      clearTimeout(settle);
      window.removeEventListener("pointermove", move);
      follow.current = null;
    };
  }, [canHover]);

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
            <article
              key={item.title}
              className={`achv-row${item.link ? " achv-row--link" : ""}`}
              onPointerEnter={item.image ? (e) => follow.current?.show(e) : undefined}
              onPointerLeave={item.image ? () => follow.current?.hide() : undefined}
            >
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
                {item.image && (
                  <span className="achv-thumb" aria-hidden="true">
                    <span className="achv-thumb-img">
                      <Image src={item.image} alt="" fill sizes="(max-width: 768px) 92vw, 420px" />
                    </span>
                    <span className="achv-thumb-cap mono">Tap to view certificate ↗</span>
                  </span>
                )}
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
                  aria-label={item.image ? `View certificate: ${item.title}` : `View achievement: ${item.title}`}
                />
              )}
            </article>
          );
        })}
      </div>

      {canHover && CERTIFICATE && (
        <div ref={previewRef} className="achv-preview" aria-hidden="true">
          <span className="achv-preview-img">
            <Image src={CERTIFICATE} alt="" fill sizes="380px" loading="eager" />
          </span>
          <span className="achv-preview-cap mono">
            <span>Certificate</span>
            <span>Click to open ↗</span>
          </span>
        </div>
      )}
    </section>
  );
}
