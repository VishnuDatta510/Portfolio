"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

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
    title: "Databases & Cloud",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Redis", icon: SiRedis },
      { name: "Prisma", icon: SiPrisma },
      { name: "AWS", icon: FaAws },
      { name: "Firebase", icon: SiFirebase },
      { name: "Azure", icon: VscAzure },
      { name: "Docker", icon: SiDocker },
    ],
  },
  {
    title: "AI & Tools",
    skills: [
      { name: "OpenAI Whisper", icon: SiOpenai },
      { name: "Gemini API", icon: SiGooglegemini },
      { name: "FFmpeg", icon: SiFfmpeg },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Postman", icon: SiPostman },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const categories = gsap.utils.toArray<HTMLElement>(".skill-category");

      /* Measure every category in one pass before touching any style, so the
         setup costs a single layout instead of one reflow per element. */
      const measured = categories.map((category) => {
        const title = category.querySelector<HTMLElement>(
          ".skill-category-title",
        );
        const items = gsap.utils.toArray<HTMLElement>(
          category.querySelectorAll(".skill-item"),
        );
        if (!title || items.length === 0) return null;

        const catRect = category.getBoundingClientRect();
        const cx = catRect.width / 2;
        const cy = Math.min(catRect.height / 2, 200);

        const getDx = (el: Element) => {
          const rect = el.getBoundingClientRect();
          return cx - (rect.left - catRect.left + rect.width / 2);
        };
        const getDy = (el: Element) => {
          const rect = el.getBoundingClientRect();
          return cy - (rect.top - catRect.top + rect.height / 2);
        };

        return {
          category,
          title,
          items,
          getDx,
          getDy,
          titleOffset: { dx: getDx(title), dy: getDy(title) },
          itemOffsets: items.map((item) => ({
            dx: getDx(item),
            dy: getDy(item),
          })),
        };
      });

      measured.forEach((entry) => {
        if (!entry) return;
        const { category, title, items, titleOffset, itemOffsets, getDx, getDy } =
          entry;

        const compact = window.innerWidth < 768;

        if (compact) {
          gsap.set(title, { autoAlpha: 0, y: 24, scale: 1 });
          gsap.set(items, { autoAlpha: 0, y: 20, scale: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: category,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          });

          tl.to(title, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });

          tl.to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.04,
              ease: "power3.out",
              clearProps: "transform",
            },
            "-=0.25",
          );

          return;
        }

        gsap.set(title, {
          x: titleOffset.dx,
          y: titleOffset.dy,
          scale: compact ? 1.4 : 2.5,
          autoAlpha: 0,
          transformOrigin: "center center",
        });

        items.forEach((item, i) => {
          gsap.set(item, {
            x: itemOffsets[i].dx,
            y: itemOffsets[i].dy,
            scale: 0.2,
            autoAlpha: 0,
            zIndex: 0,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: category,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        });

        tl.to(title, {
          autoAlpha: 1,
          scale: compact ? 1.6 : 3,
          duration: 0.3,
          ease: "back.out(1.5)",
        });

        const angleStep = (Math.PI * 2) / items.length;
        const radius = compact ? 80 : 180;

        tl.to(
          items,
          {
            x: (i, el) =>
              getDx(el) +
              Math.cos(angleStep * i) * radius * (Math.random() * 0.3 + 0.85),
            y: (i, el) =>
              getDy(el) +
              Math.sin(angleStep * i) * radius * (Math.random() * 0.3 + 0.85),
            scale: 1,
            autoAlpha: 1,
            duration: 0.15,
            stagger: 0.02,
            ease: "power3.out",
          },
          "+=0.1",
        );

        tl.to(
          title,
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.inOut",
          },
          "+=0.2",
        );

        tl.to(
          items,
          {
            x: 0,
            y: 0,
            zIndex: 1,
            duration: 0.7,
            ease: "power3.inOut",
          },
          "<",
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="skills" id="skills">
      <div className="section-label">
        <span className="section-label-line" />
        Skills
      </div>

      <div className="skills-container">
        {skillCategories.map((category, i) => (
          <div key={i} className="skill-category">
            <h3 className="skill-category-title">{category.title}</h3>
            <div className="skill-grid">
              {category.skills.map((skill, j) => (
                <div key={j} className="skill-item">
                  <span className="skill-icon">
                    <skill.icon />
                  </span>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
