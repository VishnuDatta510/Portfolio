"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PreloaderProps {
    onComplete: () => void;
    /** Fires once the letters have risen; the 3D scene mounts then. */
    onIntroDone: () => void;
    isSplineLoaded: boolean;
}

export default function Preloader({ onComplete, onIntroDone, isSplineLoaded }: PreloaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);
    const exitStarted = useRef(false);

    const [introDone, setIntroDone] = useState(false);
    const [waitedLongEnough, setWaitedLongEnough] = useState(false);

    /* A cold cache or slow connection must never strand the visitor on the
       loader, so the reveal proceeds with or without the 3D scene. */
    useEffect(() => {
        if (isSplineLoaded) return;
        const timer = window.setTimeout(() => setWaitedLongEnough(true), 5500);
        return () => window.clearTimeout(timer);
    }, [isSplineLoaded]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

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

            /* Hydration runs in the same task that creates this timeline, so
               start it on a fresh frame or the first ~100ms of the rise is
               skipped. */
            const tlIntro = gsap.timeline({
                paused: true,
                defaults: { ease: "power3.inOut" },
                onComplete: () => setIntroDone(true),
            });

            tlIntro.from(".preloader-letter", {
                yPercent: 110,
                rotate: 8,
                stagger: 0.045,
                duration: 1,
                ease: "expo.out",
            })
                .from(".preloader-line", { scaleX: 0, duration: 0.9, ease: "expo.inOut" }, 0.25)
                .from(".preloader-caption", {
                    yPercent: 100,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.6,
                    ease: "power3.out",
                }, 0.55)
                .call(onIntroDone)
                .to({}, { duration: 1.2 });

            const frame = requestAnimationFrame(() => tlIntro.play());
            return () => cancelAnimationFrame(frame);
        },
        { scope: containerRef }
    );

    /* Building the Spline scene blocks the main thread for seconds, so the
       full name holds still until it is done; anything animating during that
       block would visibly freeze and jump. */
    useGSAP(() => {
        if (exitStarted.current) return;
        if (!introDone || !(isSplineLoaded || waitedLongEnough)) return;
        exitStarted.current = true;

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
            .to(".preloader-caption", {
                yPercent: -100,
                opacity: 0,
                stagger: 0.05,
                duration: 0.4,
                ease: "power3.in",
            })
            .to(".preloader-line", {
                scaleX: 0,
                transformOrigin: "right center",
                duration: 0.5,
                ease: "expo.in",
            }, 0)
            .to(".preloader-fade", {
                yPercent: -110,
                rotate: -6,
                stagger: { each: 0.025, from: "center" },
                duration: 0.45,
                ease: "power3.in",
            }, 0.1)
            .to(".preloader-fade-group", { width: 0, duration: 0.55, ease: "expo.inOut" }, "-=0.2")
            .to(".preloader-space", { width: 0, duration: 0.55, ease: "expo.inOut" }, "<")
            .to(name, {
                scale: 1.15,
                duration: 0.35,
                ease: "back.out(2.5)",
            }, "-=0.15")
            .to(".preloader-keep", {
                yPercent: -110,
                stagger: 0.07,
                duration: 0.5,
                ease: "power4.in",
            }, "+=0.1")
            .to(container, {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.7,
                ease: "expo.inOut",
            }, "-=0.2")
            .to(layerRef.current, {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.7,
                ease: "expo.inOut",
            }, "-=0.55");

    }, [introDone, isSplineLoaded, waitedLongEnough]);


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
                    <div className="preloader-mask">
                        <span className="preloader-letter preloader-keep">V</span>
                        <span className="preloader-fade-group">{makeLetters("ISHNU")}</span>
                        <span className="preloader-space" />
                        <span className="preloader-letter preloader-keep">D</span>
                        <span className="preloader-fade-group">{makeLetters("ATTA")}</span>
                    </div>
                    <div className="preloader-meta" aria-hidden="true">
                        <span className="preloader-line">
                            <span className="preloader-line-glow" />
                        </span>
                        <div className="preloader-captions">
                            <span className="preloader-caption">Full-Stack Engineer</span>
                            <span className="preloader-caption">Portfolio &copy; 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
