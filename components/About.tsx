"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import SheetHead from "./SheetHead";

const SPEC = [
  ["Based", "India · IST"],
  ["Focus", "Backends, media pipelines, product UI"],
  ["Education", "B.Tech CSE, IIIT Sri City"],
  ["Period", "Aug 2023 — May 2027"],
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const figure = ".about-figure";

      gsap
        .timeline({ scrollTrigger: { trigger: figure, start: "top 80%", once: true } })
        .fromTo(".about-frame", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" })
        .fromTo(".about-frame-scan", { yPercent: 0, autoAlpha: 1 }, { yPercent: 100, duration: 1.4, ease: "expo.inOut" }, 0)
        .to(".about-frame-scan", { autoAlpha: 0, duration: 0.3 })
        .from(".about-photo", { scale: 1.35, duration: 1.8, ease: "expo.out" }, 0.2)
        .from(".about-bracket", { scale: 0, duration: 0.6, stagger: 0.06, ease: "back.out(2)" }, 0.9);

      gsap.fromTo(
        ".about-photo-inner",
        { yPercent: -8 },
        { yPercent: 8, ease: "none", scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: true } },
      );

      gsap.from(".about-spec-row", {
        autoAlpha: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-spec", start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="section about" id="about">
      <SheetHead fig="02" title="About" note="The engineer" />

      <div className="about-grid">
        <div className="about-copy">
          <p className="about-lead" data-split>
            I&apos;m a full-stack engineer who enjoys building the systems behind great products, from media pipelines and APIs
            to the interfaces people actually touch.
          </p>
          <p className="about-body" data-split>
            I recently wrapped up a Software Development Engineer internship at Soundverse AI, shipping production backends for
            music distribution, transcription and media processing. I care about software that is fast, reliable and a pleasure
            to use, and I&apos;m always exploring where AI can make it better.
          </p>

          <dl className="about-spec mono">
            {SPEC.map(([k, v]) => (
              <div key={k} className="about-spec-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="about-figure">
          <div className="about-frame">
            <div className="about-photo">
              <div className="about-photo-inner">
                <Image src="/picyay.jpg" alt="Portrait of Vishnu Datta" fill sizes="(max-width: 768px) 92vw, 40vw" />
              </div>
            </div>
            <span className="about-frame-scan" aria-hidden="true" />
          </div>
          {["tl", "tr", "bl", "br"].map((c) => (
            <span key={c} className={`about-bracket about-bracket--${c}`} aria-hidden="true" />
          ))}
          <figcaption className="mono">
            <span>Detail A</span>
            <span>The author, 1 : 1</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
