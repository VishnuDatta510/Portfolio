"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".achievement-card");

    gsap.fromTo(
      cards,
      {
        y: 100,
        opacity: 0,
        rotationX: 45,
        transformPerspective: 1000,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current.querySelector(".achievements-grid"),
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  }, []);

  const achievements = [
    {
      year: "2026",
      title: "Achieved 1700+ rating on LeetCode",
      description:
        "Demonstrated strong problem-solving skills and algorithmic thinking by consistently solving complex coding challenges on LeetCode.",
      link: "https://leetcode.com/u/Vishno-Way/",
    },
    {
      year: "2026",
      title: "Founded and Developed 'CodeRep' - A Tool for LeetCode Users",
      description:
        "Engineered a full-stack Next.js web app and Chrome Extension that utilizes spaced repetition algorithms to help developers retain algorithmic problem-solving skills.",
      link: "https://coderep.vercel.app/",
    },
    {
      year: "2026",
      title: "Undergraduate Research - Graph Neural Networks",
      description:
        "Currently researching and implementing advanced GNN architectures applied to bioinformatics as part of a Bachelor's Thesis Project.",
      link: "#",
    },
  ];

  return (
    <section ref={sectionRef} className="achievements" id="achievements">
      <div className="section-label">
        <span className="section-label-line" />
        Achievements
      </div>

      <div className="achievements-grid">
        {achievements.map((item, i) => (
          <a
            key={i}
            href={item.link}
            className="achievement-card hoverable"
            target={item.link.startsWith("http") ? "_blank" : undefined}
            rel={
              item.link.startsWith("http") ? "noopener noreferrer" : undefined
            }
            aria-label={`View achievement: ${item.title}`}
          >
            <div className="achievement-year">{item.year}</div>
            <h3 className="achievement-title">{item.title}</h3>
            <p className="achievement-desc">{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
