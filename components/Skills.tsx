"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPytorch,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHtml5,
  SiCss,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiGooglegemini,
  SiSocketdotio,
  SiGithub,
  SiPostman,
  SiFigma,
  SiGit,
  SiGooglechrome,
  SiVercel,
  SiShadcnui,
  SiPrisma,
  SiDocker,
  SiVite,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Languages",
    skills: [
      { name: "Java", icon: FaJava },
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Python", icon: SiPython },
      { name: "SQL", icon: SiMysql },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "ShadCN UI", icon: SiShadcnui },
      { name: "Prisma", icon: SiPrisma },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Redis", icon: SiRedis },
      { name: "MySQL", icon: SiMysql },
      { name: "FireBase", icon: SiFirebase },
      { name: "SupaBase", icon: SiSupabase },
    ],
  },
  {
    title: "Cloud & APIs",
    skills: [
      { name: "REST APIs", icon: SiNodedotjs },
      { name: "Gemini API", icon: SiGooglegemini },
      { name: "Stream SDK", icon: SiReact },
      { name: "WebSockets", icon: SiSocketdotio },
      { name: "Vercel", icon: SiVercel },
    ],
  },
  {
    title: "Developer Tools",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Postman", icon: SiPostman },
      { name: "Chrome Extensions", icon: SiGooglechrome },
      { name: "Figma", icon: SiFigma },
      { name: "Docker", icon: SiDocker },
      { name: "Vite", icon: SiVite },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const categories = sectionRef.current.querySelectorAll(".skill-category");

    categories.forEach((category) => {
      const title = category.querySelector(".skill-category-title");
      const items = category.querySelectorAll(".skill-item");
      if (!title || items.length === 0) return;

      const catRect = category.getBoundingClientRect();
      const cx = catRect.width / 2;
      const cy = Math.min(catRect.height / 2, 200);

      const getDx = (el: Element) => {
        const rect = el.getBoundingClientRect();
        const elCx = rect.left - catRect.left + rect.width / 2;
        return cx - elCx;
      };
      const getDy = (el: Element) => {
        const rect = el.getBoundingClientRect();
        const elCy = rect.top - catRect.top + rect.height / 2;
        return cy - elCy;
      };

      const titleDx = getDx(title);
      const titleDy = getDy(title);

      gsap.set(title, {
        x: titleDx,
        y: titleDy,
        scale: 2.5,
        autoAlpha: 0,
        transformOrigin: "center center",
      });

      items.forEach((item) => {
        gsap.set(item, {
          x: getDx(item),
          y: getDy(item),
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
        scale: 3,
        duration: 0.3,
        ease: "back.out(1.5)",
      });

      const angleStep = (Math.PI * 2) / items.length;
      const radius = 180;

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
