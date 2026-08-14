"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCE = [
  {
    role: "Design Team Lead",
    org: "IOTA",
    period: "AUG 2025 → JUL 2026",
    location: "IIIT Sricity",
    bullets: [
      "Led the design team of IOTA, the tech club of IIIT Sricity, owning visual direction across events and campaigns.",
      "Directed brand identity, event creatives and social media design while mentoring a team of junior designers.",
    ],
    tags: ["Design", "Figma", "Leadership"],
    current: false,
  },
  {
    role: "SDE Intern",
    org: "Soundverse AI",
    period: "APR 2026 → PRESENT",
    location: "Remote",
    bullets: [
      "Contributing to Soundverse 3.0: overhauling platform architecture, modernizing the web platform and re-engineering media tooling.",
      "Built a Media Stitching API that turns editing prompts into automated FFmpeg audio and video pipelines: timeline composition, trims, overlays and transitions.",
      "Architected a transcription and speaker-diarization API, extending Whisper from 25MB to 500MB+ audio with silence-aware chunking pipelines.",
      "Engineering the backend for Music Distribution: scalable APIs and orchestration services for release validation, metadata processing and distribution workflows.",
    ],
    tags: ["Python", "FastAPI", "FFmpeg", "Whisper", "Next.js"],
    current: true,
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Spine draws as you scroll through the timeline */
      gsap.fromTo(
        ".experience-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: ".experience-timeline",
            start: "top 72%",
            end: "bottom 58%",
            scrub: 0.6,
          },
        },
      );

      gsap
        .utils.toArray<HTMLElement>(".experience-item")
        .forEach((item) => {
          const fromLeft = item.classList.contains("experience-item--left");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          });

          tl.fromTo(
            item.querySelector(".experience-node"),
            { scale: 0 },
            { scale: 1, duration: 0.6, ease: "back.out(2.2)" },
          )
            .fromTo(
              item.querySelector(".experience-card"),
              { opacity: 0, x: fromLeft ? -60 : 60 },
              { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" },
              0.1,
            )
            .fromTo(
              item.querySelectorAll(".experience-points li"),
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power3.out",
              },
              0.35,
            )
            .fromTo(
              item.querySelectorAll(".experience-tags span"),
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: "power3.out",
              },
              0.5,
            );
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="experience" id="experience">
      <div className="section-label">
        <span className="section-label-line" />
        Experience
      </div>

      <div className="experience-timeline">
        <span className="experience-line" aria-hidden="true">
          <span className="experience-line-fill" />
        </span>

        {EXPERIENCE.map((e, i) => (
          <article
            key={e.role}
            className={`experience-item ${
              i % 2 === 0 ? "experience-item--left" : "experience-item--right"
            }`}
          >
            <span className="experience-node" aria-hidden="true">
              <i className={e.current ? "current" : ""} />
            </span>

            <div className="experience-card">
              <div className="experience-period-row">
                <span className="experience-period">{e.period}</span>
                <span className="experience-location">
                  {e.location.toUpperCase()}
                </span>
              </div>

              <h3 className="experience-role">{e.role}</h3>

              <p className="experience-org">
                {e.org}
                {e.current && <span className="experience-badge">NOW</span>}
              </p>

              <ul className="experience-points">
                {e.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>

              <div className="experience-tags">
                {e.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
