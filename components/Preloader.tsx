"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PreloaderProps {
    onComplete: () => void;
    isSplineLoaded: boolean;
}

export default function Preloader({ onComplete, isSplineLoaded }: PreloaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);

    const [introDone, setIntroDone] = useState(false);

    useGSAP(
        () => {
            const container = containerRef.current;
            const name = nameRef.current;
            if (!container || !name) return;

            document.body.style.overflow = "hidden";

            gsap.set(name, { opacity: 1 });

            container.querySelectorAll<HTMLElement>(".preloader-fade-group").forEach((el) => {
                el.style.width = el.getBoundingClientRect().width + "px";
            });
            const space = container.querySelector<HTMLElement>(".preloader-space");
            if (space) space.style.width = space.getBoundingClientRect().width + "px";

            const tlIntro = gsap.timeline({
                defaults: { ease: "power3.inOut" },
                onComplete: () => {
                    setIntroDone(true);
                },
            });

            tlIntro.from(".preloader-letter", {
                y: 80,
                opacity: 0,
                stagger: 0.04,
                duration: 0.8,
                ease: "power4.out",
            })
                .to({}, { duration: 1.2 })
                .to(".preloader-fade", {
                    y: -40,
                    opacity: 0,
                    stagger: 0.02,
                    duration: 0.5,
                    ease: "power3.in",
                })
                .to(".preloader-fade-group", { width: 0, duration: 0.5 }, "-=0.2")
                .to(".preloader-space", { width: 0, duration: 0.5 }, "<");

        },
        { scope: containerRef }
    );

    useGSAP(() => {
        if (!introDone || !isSplineLoaded) return;

        const container = containerRef.current;
        const name = nameRef.current;
        if (!container || !name) return;

        const tlExit = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
                document.body.style.overflow = "";
                onComplete();
            },
        });

        tlExit
            .to(name, {
                scale: 1.1,
                duration: 0.25,
                ease: "power2.out",
            })
            .to(name, {
                y: "-40vh",
                opacity: 0,
                scale: 0.9,
                duration: 0.7,
                ease: "power3.in",
            }, "+=0.05")
            .to(container, {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.6,
                ease: "power2.inOut",
            }, "-=0.25")
            .to(layerRef.current, {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.55,
                ease: "power2.inOut",
            }, "-=0.3");

    }, [introDone, isSplineLoaded]);


    const makeLetters = (text: string) =>
        text.split("").map((ch, i) => (
            <span key={i} className="preloader-letter preloader-fade">
                {ch}
            </span>
        ));

    return (
        <>
            <div
                ref={layerRef}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9997,
                    background: "#8b5cf6",
                    clipPath: "inset(0 0 0% 0)",
                }}
            />

            <div ref={containerRef} className="preloader">
                <div ref={nameRef} className="preloader-name">
                    <span className="preloader-letter preloader-keep">V</span>
                    <span className="preloader-fade-group">{makeLetters("ISHNU")}</span>
                    <span className="preloader-space" />
                    <span className="preloader-letter preloader-keep">D</span>
                    <span className="preloader-fade-group">{makeLetters("ATTA")}</span>
                </div>
            </div>
        </>
    );
}
