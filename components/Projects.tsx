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
    name: "Audira AI",
    description:
      "An AI technical interviewer that reads each candidate's résumé against the job description, then runs coding, project and fundamentals rounds, probing vague answers like a human interviewer. LLM-written problems are verified against a hidden reference solution and submissions run sandboxed on Judge0 in 13 languages, with recruiter reports that tie every score to the candidate's own words.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/Audira",
    liveLink: "https://audira-ai.vercel.app/",
  },
  {
    num: "02",
    name: "CodeRep",
    description:
      "A spaced-repetition system for LeetCode: a Next.js web app plus Chrome Extension used by 20+ daily active users, catching accepted submissions with 99% accuracy and scheduling reviews with an adaptive algorithm on PostgreSQL and Prisma.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/CodeRep",
    liveLink: "https://coderep.vercel.app/",
  },
  {
    num: "03",
    name: "TaskLane",
    description:
      "A multi-tenant, Jira-style work tracker with drag-and-drop boards, server-enforced roles and an append-only audit log. The analytics dashboard stays at a constant 4 SQL queries at any data size, with Redis caching and Celery handling email and overdue sweeps off the request path.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/Tasklane",
    liveLink: "",
  },
  {
    num: "04",
    name: "FluenSee",
    description:
      "An AI-powered language learning platform on the MERN stack with real-time video calls, peer-to-peer chat and conversational AI sessions with integrated flashcards, powered by the Google Gemini API and Stream SDK.",
    year: "2025",
    github: "https://github.com/VishnuDatta510/FluenSee",
    liveLink: "https://fluensee.onrender.com/",
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
