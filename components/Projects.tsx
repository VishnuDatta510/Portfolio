"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import BlurText from "./BlurText";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    num: "01",
    name: "Code Rep",
    description:
      "Built a full-stack Next.js web application and Chrome Extension powered by PostgreSQL and Prisma, utilizing spaced repetition algorithms to help users effectively retain LeetCode problem-solving skills.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/CodeRep",
    liveLink: "https://coderep.vercel.app/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    num: "02",
    name: "FluenSee",
    description:
      "Built a comprehensive, AI-powered language learning platform using the MERN stack, featuring real-time video calls, peer-to-peer chatting, and conversational AI chatbot sessions with integrated flashcards, powered by the Google Gemini API and Stream SDK.",
    year: "2025",
    github: "https://github.com/VishnuDatta510/FluenSee",
    liveLink: "https://fluensee.onrender.com/",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    num: "03",
    name: "WishperWall",
    description:
      "Built an anonymous note-sharing application using the MERN stack and Tailwind, implementing real-time updates via Socket.IO and robust backend features including Upstash Redis for distributed rate limiting and MongoDB TTL indexes for automated data lifecycle management.",
    year: "2025",
    github: "https://github.com/VishnuDatta510/WishperWall",
    liveLink: "https://wishper-wall.vercel.app/",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    num: "04",
    name: "AlgoClash",
    description:
      "Developed a real-time 1v1 competitive coding platform featuring live multiplayer execution and an integrated Elo rating system to dynamically rank and match users based on their algorithmic proficiency.",
    year: "Ongoing",
    github: "https://github.com/VishnuDatta510/AlgoClash",
    liveLink: "",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.to(".project-row", {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.querySelector(".projects-list"),
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="projects" id="work">
      <div className="section-label">
        <span className="section-label-line" />
        Projects
      </div>

      <div className="projects-list">
        {projects.map((p) => (
          <div
            key={p.num}
            className="project-row hoverable"
            onClick={() => {
              const url = p.liveLink || p.github;
              if (url) window.open(url, "_blank");
            }}
          >
            <span className="project-num">{p.num}</span>
            <div className="project-info">
              <BlurText
                text={p.name}
                delay={30}
                animateBy="letters"
                direction="bottom"
                className="project-name"
              />
              <p className="project-description">{p.description}</p>
            </div>
            <span className="project-year">{p.year}</span>
            <div className="project-links">
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiGithub size={20} />
                </a>
              )}
              {p.liveLink && (
                <a
                  href={p.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="projects-footer">
        <Link href="/projects" className="btn-view-all hoverable">
          <span className="btn-text">VIEW ALL PROJECTS</span>
          <span className="btn-icon">→</span>
        </Link>
      </div>
    </section>
  );
}
