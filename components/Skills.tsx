"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, useReveals, reducedMotion } from "@/lib/motion";
import SheetHead from "./SheetHead";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiDjango,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiC,
  SiHtml5,
  SiCss,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiMysql,
  SiFirebase,
  SiGooglegemini,
  SiOpenai,
  SiFfmpeg,
  SiCelery,
  SiSocketdotio,
  SiGithub,
  SiPostman,
  SiGit,
  SiGooglechrome,
  SiShadcnui,
  SiPrisma,
  SiDocker,
  SiVite,
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";

// Six assemblies so the grid is an even 3 x 2.
const skillCategories = [
  {
    title: "Languages",
    skills: [
      { name: "Python", icon: SiPython },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Java", icon: FaJava },
      { name: "C", icon: SiC },
      { name: "SQL", icon: SiMysql },
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "FastAPI", icon: SiFastapi },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "Django REST", icon: SiDjango },
      { name: "gRPC & Protobuf", icon: TbApi },
      { name: "WebSockets", icon: SiSocketdotio },
      { name: "Celery", icon: SiCelery },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "ShadCN UI", icon: SiShadcnui },
      { name: "Vite", icon: SiVite },
      { name: "Chrome Extensions", icon: SiGooglechrome },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Redis", icon: SiRedis },
      { name: "Prisma", icon: SiPrisma },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      { name: "AWS", icon: FaAws },
      { name: "Azure", icon: VscAzure },
      { name: "Docker", icon: SiDocker },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
    ],
  },
  {
    title: "AI & Tools",
    skills: [
      { name: "OpenAI Whisper", icon: SiOpenai },
      { name: "Gemini API", icon: SiGooglegemini },
      { name: "FFmpeg", icon: SiFfmpeg },
      { name: "Postman", icon: SiPostman },
    ],
  },
];

const PARTS = skillCategories.reduce((n, c) => n + c.skills.length, 0);
const LETTER = "ABCDEF";

type Palette = { ink: string; accent: string };

/** Keeps every hidden-until-played part out of sight before its row scrolls in. */
function hide(g: HTMLElement) {
  gsap.set(g.querySelectorAll(".bom-title, .bom-part, .bom-ref, .bom-letter, .bom-count"), { autoAlpha: 0 });
  gsap.set(g.querySelector(".bom-group-rule"), { scaleX: 0 });
  gsap.set(g.querySelectorAll(".bom-row"), { borderBottomColor: "transparent" });
}

/** Rule draws, labels and row lines settle in once the parts have landed. */
function settle(tl: gsap.core.Timeline, g: HTMLElement, at: gsap.Position) {
  tl.to(g.querySelector(".bom-group-rule"), { scaleX: 1, duration: 1, ease: "expo.inOut" }, at)
    .to(g.querySelectorAll(".bom-letter, .bom-count"), { autoAlpha: 1, duration: 0.5 }, at)
    .to(g.querySelectorAll(".bom-ref"), { autoAlpha: 1, duration: 0.5, stagger: 0.03 }, `${at}+=0.1`)
    .to(g.querySelectorAll(".bom-row"), { borderBottomColor: "var(--line)", duration: 0.5, stagger: 0.03 }, `${at}+=0.1`);
}

function finish(g: HTMLElement) {
  gsap.set(g.querySelectorAll(".bom-title, .bom-part"), { clearProps: "all" });
  gsap.set(g, { clearProps: "zIndex" });
}

/**
 * The name pops large at the centre, the parts spiral out into a ring that
 * turns, then tighten into their rows while the name settles into the head.
 * Geometry is measured when the row scrolls in, so it survives resizes and
 * late font loads.
 */
function orbit(g: HTMLElement, delay: number, { ink, accent }: Palette) {
  const titleEl = g.querySelector<HTMLElement>(".bom-title")!;
  const gr = g.getBoundingClientRect();
  const centre = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - gr.left + r.width / 2, y: r.top - gr.top + r.height / 2, w: r.width };
  };
  const c = { x: gr.width / 2, y: Math.min(gr.height / 2, 220) };
  const rx = Math.min(gr.width * 0.36, 190);
  const ry = Math.min(gr.height * 0.3, 140);
  const rs = 0.88; // parts shrink a touch in flight so three rings sit side by side
  const t = centre(titleEl);
  const S = Math.max(1.6, Math.min(2.8, (gr.width * 0.95) / t.w));

  const els = Array.from(g.querySelectorAll<HTMLElement>(".bom-part"));
  const parts = els.map((el, i) => ({
    el,
    ...centre(el),
    a: (Math.PI * 2 * i) / els.length - Math.PI / 2,
    jit: 0.85 + Math.random() * 0.3,
  }));

  // One progress object drives every part: r = ring radius, rot = spin, t = ring -> row.
  const P = { r: 0, rot: 0, t: 0 };
  const update = () =>
    parts.forEach((p) => {
      const k = 1.05 * p.jit * P.r;
      const a = p.a + P.rot;
      const x = c.x - p.x + Math.cos(a) * rx * k;
      const y = c.y - p.y + Math.sin(a) * ry * k;
      gsap.set(p.el, {
        x: x * (1 - P.t),
        y: y * (1 - P.t),
        scale: (0.2 + 0.8 * Math.min(1, P.r * 2.2)) * (rs + (1 - rs) * P.t),
        autoAlpha: Math.min(1, P.r * 4),
        "--chip": 1 - P.t,
      });
    });

  const tl = gsap.timeline({
    delay,
    onStart: () => void gsap.set(g, { zIndex: 20 }),
    onComplete: () => finish(g),
  });
  gsap.set(titleEl, { x: c.x - t.x, y: c.y - t.y, scale: S * 0.85, autoAlpha: 0, color: accent });
  update();

  tl.to(titleEl, { autoAlpha: 1, scale: S, duration: 0.45, ease: "back.out(1.6)" })
    .to(P, { r: 1, rot: 1.1, duration: 1.3, ease: "power2.out", onUpdate: update }, "-=0.1")
    .to(P, { t: 1, rot: 2.9, duration: 1.2, ease: "power3.inOut", onUpdate: update }, "+=0.15")
    .to(titleEl, { x: 0, y: 0, scale: 1, color: ink, duration: 1.1, ease: "power3.inOut" }, "<");
  settle(tl, g, "-=0.5");
}

/** Phones: a short fade-up, one section at a time. */
function fadeUp(g: HTMLElement, delay: number, { ink, accent }: Palette) {
  const titleEl = g.querySelector(".bom-title")!;
  const tl = gsap.timeline({ delay, onComplete: () => finish(g) });
  gsap.set(titleEl, { y: 18, color: accent });
  gsap.set(g.querySelectorAll(".bom-part"), { y: 16 });
  tl.to(titleEl, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" })
    .to(titleEl, { color: ink, duration: 0.5 }, ">-0.1")
    .to(g.querySelectorAll(".bom-part"), { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power3.out" }, "<0.1");
  settle(tl, g, 0.1);
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);

  useGSAP(
    (_, contextSafe) => {
      if (reducedMotion() || !ref.current || !contextSafe) return;
      const css = getComputedStyle(document.documentElement);
      const palette = { ink: css.getPropertyValue("--ink").trim(), accent: css.getPropertyValue("--accent").trim() };
      const groups = Array.from(ref.current.querySelectorAll<HTMLElement>(".bom-group"));
      const played = new Set<HTMLElement>();

      // A group that scrolls in plays together with the rest of its visual row;
      // the next row waits for its own scroll. Layout is read at play time, so
      // breakpoints and late font loads do not matter.
      const playRow = contextSafe((g: HTMLElement) => {
        const row = groups.filter((o) => o.offsetTop === g.offsetTop && !played.has(o));
        const play = window.innerWidth >= 720 ? orbit : fadeUp;
        row.forEach((o, k) => {
          played.add(o);
          play(o, k * 0.14, palette);
        });
      });

      groups.forEach((g) => {
        hide(g);
        ScrollTrigger.create({ trigger: g, start: "top 60%", once: true, onEnter: () => playRow(g) });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="section skills" id="skills">
      <SheetHead fig="04" title="Toolkit" note="Bill of materials" />
      <p className="bom-summary mono" data-scramble>
        {PARTS} parts · {skillCategories.length} assemblies
      </p>

      <div className="bom">
        {skillCategories.map((category, i) => (
          <div key={category.title} className="bom-group">
            <h3 className="bom-group-head mono">
              <span className="bom-letter">{LETTER[i]} —</span>
              <span className="bom-title">{category.title}</span>
              <span className="bom-count">{String(category.skills.length).padStart(2, "0")} pcs</span>
            </h3>
            <span className="bom-group-rule" aria-hidden="true" />
            <ul className="bom-rows">
              {category.skills.map((skill, j) => (
                <li key={skill.name} className="bom-row">
                  <span className="bom-ref mono">
                    {LETTER[i]}.{String(j + 1).padStart(2, "0")}
                  </span>
                  <span className="bom-part">
                    <span className="bom-icon" aria-hidden="true">
                      <skill.icon />
                    </span>
                    <span className="bom-name">{skill.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
