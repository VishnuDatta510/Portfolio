"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import SheetHead from "./SheetHead";

// **text** marks a figure worth catching on a skim.
const EXPERIENCE = [
  {
    role: "SDE Intern",
    org: "Soundverse AI",
    period: "Apr 2026 — Oct 2026",
    location: "Remote",
    bullets: [
      "Scaled a Whisper transcription and speaker-diarization pipeline from **25 MB to 500 MB** inputs with silence-aware chunking, parallel transcription and live progress over Server-Sent Events.",
      "Built core services of the Music Distribution pipeline that releases artists' songs to Spotify, Apple Music and YouTube, behind a fail-closed quality gate of **7 weighted checks** (loudness, ISRC conflicts, AI provenance, copyright, AWS Rekognition moderation).",
      "Built the Media Converter end to end for audio, video and images: background jobs with live Socket.IO progress, per-plan Redis rate limits and token billing; fixed a proxy that stalled large files for **40–200 s**.",
      "Co-built the move from MP4 to HLS over a CDN, benchmarking seeks **7.6x faster** and first byte **6x faster**.",
      "Designed a cross-channel notification system where one record per event feeds the in-app bell, Firebase push and Amazon SES email, cancelling held emails once the user reads it anywhere.",
      "Worked across gRPC/Protobuf and REST API design, PostgreSQL schemas and integrations like Didit identity verification, Sign in with Apple and Google Play Billing.",
    ],
  },
  {
    role: "UI/UX Team Lead",
    org: "IOTA",
    period: "Aug 2025 — Jul 2026",
    location: "IIIT Sri City",
    bullets: [
      "Led the UI/UX team of IOTA, the tech club of IIIT Sri City, owning product and interface design across the club's sites, events and campaigns.",
      "Drove user flows, wireframes and high-fidelity UI for club projects while mentoring a team of junior designers and keeping the design system consistent.",
    ],
  },
];

const emphasise = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  useGSAP(
    () => {
      if (reducedMotion()) return;

      gsap.fromTo(
        ".exp-trace-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".exp-list", start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        },
      );

      gsap.utils.toArray<HTMLElement>(".exp-item").forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 70%",
          onToggle: (self) => item.classList.toggle("is-live", self.isActive),
          end: "bottom 60%",
        });

        gsap.from(item.querySelectorAll(".exp-point"), {
          autoAlpha: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: item.querySelector(".exp-points"), start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="section experience" id="experience">
      <SheetHead fig="03" title="Experience" note="Revision history" />

      <div className="exp-list">
        <span className="exp-trace" aria-hidden="true">
          <span className="exp-trace-fill" />
        </span>

        {EXPERIENCE.map((e, i) => (
          <article key={e.org} className="exp-item">
            <span className="exp-pad" aria-hidden="true" />
            <div className="exp-meta mono">
              <span data-scramble>Rev. {String(EXPERIENCE.length - i).padStart(2, "0")}</span>
              <span data-scramble>{e.period}</span>
              <span data-scramble>{e.location}</span>
            </div>

            <div className="exp-body">
              <h3 className="exp-role" data-split>
                {e.role} <span className="exp-org">@ {e.org}</span>
              </h3>
              <ol className="exp-points">
                {e.bullets.map((b, j) => (
                  <li key={j} className="exp-point">
                    <span className="exp-point-index mono">
                      {i + 1}.{j + 1}
                    </span>
                    <p>{emphasise(b)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
