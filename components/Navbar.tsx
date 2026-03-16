"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    isReady: boolean;
}

export default function Navbar({ isReady }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!isReady || !navRef.current) return;

        gsap.to(navRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        });

        ScrollTrigger.create({
            start: "top -80",
            onEnter: () => navRef.current?.classList.add("navbar-blur"),
            onLeaveBack: () => navRef.current?.classList.remove("navbar-blur"),
        });
    }, [isReady]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav ref={navRef} className="navbar">
            <div className="navbar-logo hoverable" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>VD</div>
            <div className="navbar-links">
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navbar-link hoverable"
                    style={{ textDecoration: 'none' }}
                >
                    Resume
                </a>
                <button className="navbar-link hoverable" onClick={() => scrollTo("about")}>
                    About
                </button>
                <button className="navbar-link hoverable" onClick={() => scrollTo("skills")}>
                    Skills
                </button>
                <button className="navbar-link hoverable" onClick={() => scrollTo("work")}>
                    Projects
                </button>
                <button className="navbar-link hoverable" onClick={() => scrollTo("achievements")}>
                    Achievements
                </button>
                <button className="navbar-link hoverable" onClick={() => scrollTo("contact")}>
                    Contact
                </button>
            </div>

        </nav>
    );
}
