"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const root = sectionRef.current;

        const ctx = gsap.context(() => {
            const words = root.querySelectorAll(".word-inner");
            const eduElements = root.querySelectorAll(".about-education > *");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root.querySelector(".about-text"),
                    start: "top 80%",
                    toggleActions: "play none none none",
                }
            });

            tl.to(words, {
                y: 0,
                opacity: 1,
                stagger: 0.03,
                duration: 0.6,
                ease: "power3.out",
            });

            if (eduElements.length > 0) {
                tl.fromTo(eduElements,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    "-=0.2"
                );
            }

            const imageWrapper = root.querySelector(".about-image-wrapper");
            if (imageWrapper) {
                gsap.to(imageWrapper, {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: imageWrapper,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });

                const image = root.querySelector(".about-image");
                if (image) {
                    const float = gsap.to(image, {
                        y: -15,
                        duration: 2.5,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut",
                        paused: true,
                    });

                    // Idles instead of ticking forever while offscreen.
                    ScrollTrigger.create({
                        trigger: imageWrapper,
                        start: "top bottom",
                        end: "bottom top",
                        onToggle: ({ isActive }) =>
                            isActive ? float.play() : float.pause(),
                    });
                }
            }
        }, root);

        return () => ctx.revert();
    }, []);

    const wrapWords = (text: string) =>
        text.split(" ").map((word, i) => (
            <span key={i} className="word">
                <span className="word-inner">{word}</span>
            </span>
        ));

    return (
        <section ref={sectionRef} className="about" id="about">
            <div className="section-label">
                <span className="section-label-line" />
                About
            </div>

            <div className="about-grid">
                <div className="about-text">
                    {wrapWords(
                        "I'm a passionate web developer dedicated to transforming ideas into exceptional digital experiences. With a keen eye for design and a love for clean code, I create websites that not only look stunning but also perform flawlessly."
                    )}
                    <br />
                    <br />
                    {wrapWords(
                        "Every project is an opportunity to push creative boundaries while maintaining the highest standards of usability and performance."
                    )}

                    <div className="about-education">
                        <p className="education-label">Education</p>
                        <div className="education-header">
                            <h3 className="education-institute">Indian Institute of Information Technology Sricity</h3>
                            <p className="education-date">Aug 2023 - May 2027</p>
                        </div>
                        <p className="education-title">Bachelors of Technology in Computer Science</p>
                        <p className="education-desc">
                            Currently pursuing Bachelor of Technology with a focus on computer science and engineering. Learning New Technologies and exploring various domains in computer science.
                        </p>
                    </div>
                </div>

                <div className="about-image-wrapper">
                    <div className="about-image-glow" />
                    <Image
                        src="/picyay.jpg"
                        alt="Vishnu Datta"
                        width={500}
                        height={500}
                        sizes="(max-width: 560px) 92vw, 500px"
                        className="about-image"
                    />
                </div>
            </div>
        </section>
    );
}
