"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    isReady: boolean;
}

const LINKS = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "work", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" },
];

export default function Navbar({ isReady }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(false);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!isReady || !navRef.current) return;

        const nav = navRef.current;

        gsap.to(nav, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        });

        const trigger = ScrollTrigger.create({
            start: "top -80",
            onEnter: () => nav.classList.add("navbar-blur"),
            onLeaveBack: () => nav.classList.remove("navbar-blur"),
        });

        return () => trigger.kill();
    }, [isReady]);

    useEffect(() => {
        document.body.classList.toggle("menu-open", open);
        window.dispatchEvent(
            new CustomEvent(open ? "portfolio:lock-scroll" : "portfolio:unlock-scroll"),
        );

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.classList.remove("menu-open");
            window.dispatchEvent(new CustomEvent("portfolio:unlock-scroll"));
        };
    }, [open, close]);

    const scrollTo = (id: string) => {
        close();
        const el = document.getElementById(id);
        if (!el) return;
        requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: "smooth" });
        });
    };

    return (
        <>
        <nav ref={navRef} className={`navbar${open ? " navbar--open" : ""}`}>
            <div
                className="navbar-logo hoverable"
                onClick={() => {
                    close();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            >
                VD
            </div>

            <div className="navbar-links">
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navbar-link hoverable"
                    style={{ textDecoration: "none" }}
                >
                    Resume
                </a>
                {LINKS.map((link) => (
                    <button
                        key={link.id}
                        className="navbar-link hoverable"
                        onClick={() => scrollTo(link.id)}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            <div className="navbar-mobile-actions">
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navbar-link navbar-resume-mobile hoverable"
                    style={{ textDecoration: "none" }}
                >
                    Resume
                </a>
                <button
                    className="navbar-burger hoverable"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span />
                    <span />
                </button>
            </div>
        </nav>

        <div
            className={`navbar-overlay${open ? " is-open" : ""}`}
            aria-hidden={!open}
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
            }}
        >
            <div className="navbar-overlay-links">
                {LINKS.map((link, i) => (
                    <button
                        key={link.id}
                        className="navbar-overlay-link hoverable"
                        style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                        onClick={() => scrollTo(link.id)}
                    >
                        <span className="navbar-overlay-index">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        {link.label}
                    </button>
                ))}
            </div>
        </div>
        </>
    );
}
