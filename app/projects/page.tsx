"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiGithub, FiExternalLink, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import NoiseBackground from "@/components/NoiseBackground";
import Footer from "@/components/Footer";
import BlurText from "@/components/BlurText";

gsap.registerPlugin(ScrollTrigger);

const allProjects = [
  {
    id: 1,
    name: "Audira AI",
    description:
      "AI technical interviewer that runs coding, project and fundamentals rounds against your résumé, with code sandboxed on Judge0 in 13 languages.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/Audira",
    liveLink: "https://audira-ai.vercel.app/",
  },
  {
    id: 2,
    name: "CodeRep",
    description:
      "Next.js app & Chrome Extension bringing spaced repetition to LeetCode, used by 20+ daily active users.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/CodeRep",
    liveLink: "https://coderep.vercel.app/",
  },
  {
    id: 3,
    name: "TaskLane",
    description:
      "Multi-tenant Jira-style tracker with role-based access, audit logs, Redis-cached analytics and Celery background jobs.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/Tasklane",
    liveLink: "",
  },
  {
    id: 4,
    name: "AlgoClash",
    description:
      "Real-time 1v1 competitive coding arena featuring live execution and dynamic Elo ranking.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/AlgoClash",
    liveLink: "",
  },
  {
    id: 5,
    name: "FluenSee",
    description:
      "AI-powered language tutor with real-time video calls, peer-to-peer chat, and interactive flashcards.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/FluenSee",
    liveLink: "https://fluensee.onrender.com/",
  },
  {
    id: 6,
    name: "WhisperWall",
    description:
      "Secure, real-time anonymous note-sharing board featuring distributed rate limiting via Redis.",
    year: "2026",
    github: "https://github.com/VishnuDatta510/WishperWall",
    liveLink: "https://wishper-wall.vercel.app/",
  },
  {
    id: 7,
    name: "PrimeSignal",
    description:
      "Scalable crypto trading REST API featuring role-based access control and Redis caching.",
    year: "2025",
    github: "https://github.com/VishnuDatta510/primesignal",
    liveLink: "",
  },
  {
    id: 8,
    name: "Telugu Spell Checker",
    description:
      "Intelligent NLP spell checker for Telugu providing semantic-based ranked correction candidates.",
    year: "2025",
    github: "https://github.com/VishnuDatta510/Telugu-SpellChecker",
    liveLink: "",
  },
];

export default function ProjectsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const cards = document.querySelectorAll(".project-grid-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-page-grid",
          start: "top 85%",
        },
      },
    );
  }, []);

  return (
    <>
      <NoiseBackground />
      <CustomCursor />

      <SmoothScroll>
        <main
          className="projects-page"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "100px 40px",
            minHeight: "100vh",
          }}
        >
          <div className="projects-page-header">
            <Link href="/#work" className="back-link hoverable">
              <FiArrowLeft size={24} />
              <span>Back to Portfolio</span>
            </Link>

            <h1 className="projects-page-title display-text">All Projects</h1>
          </div>

          <div className="projects-page-grid">
            {allProjects.map((p) => (
              <div
                key={p.id}
                className="project-grid-card hoverable"
                onClick={() => {
                  const url = p.liveLink || p.github;
                  if (url) window.open(url, "_blank");
                }}
              >
                <div className="project-grid-header">
                  <BlurText
                    text={p.name}
                    delay={30}
                    animateBy="letters"
                    direction="bottom"
                    className="project-name"
                  />
                  <span className="project-year">{p.year}</span>
                </div>

                <p className="project-description line-clamp-2">
                  {p.description}
                </p>

                <div className="project-grid-footer">
                  <div className="project-links grid-links">
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
              </div>
            ))}
          </div>

          <div
            className="projects-footer"
            style={{ marginTop: "80px", paddingBottom: "40px" }}
          >
            <Link href="/#work" className="btn-view-all hoverable">
              <FiArrowLeft size={18} className="btn-icon-back" />
              <span className="btn-text">BACK TO PORTFOLIO</span>
            </Link>
          </div>
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
