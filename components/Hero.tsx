"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, scramble, reducedMotion } from "@/lib/motion";
import HeroStack from "./HeroStack";

const NAME = ["Vishnu", "Datta"];

export default function Hero({ isReady }: { isReady: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !isReady) return;
      gsap.set(root.querySelector(".hero-copy"), { autoAlpha: 1 });
      if (reducedMotion()) return;

      // Outline and fill letters rise together, then ink floods the outline.
      const outline = SplitText.create(".hero-word--outline", { type: "chars" });
      const fill = SplitText.create(".hero-word--fill", { type: "chars" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.from(".hero-note", { yPercent: 110, duration: 0.9, stagger: 0.06 }, 0)
        .call(() => root.querySelectorAll(".hero-note").forEach((n) => scramble(n, { duration: 0.8 })), [], 0)
        .from(".hero-rule", { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
        .from([outline.chars, fill.chars], { yPercent: 110, duration: 1.2, stagger: 0.04 }, 0.15)
        .fromTo(
          ".hero-word--fill",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.12, ease: "expo.inOut" },
          0.85,
        )
        .fromTo(
          ".hero-name-scan",
          { yPercent: 0, autoAlpha: 1 },
          { yPercent: 100, duration: 1.3, stagger: 0.12, ease: "expo.inOut" },
          0.85,
        )
        .to(".hero-name-scan", { autoAlpha: 0, duration: 0.3 }, ">-0.1")
        .from(".hero-lede-line", { yPercent: 110, duration: 1, stagger: 0.08 }, 0.9)
        .from(".hero-foot-item", { yPercent: 110, duration: 0.9, stagger: 0.06 }, 1.1);

      // The copy drifts up and dims as the stack explodes behind it.
      gsap.to(".hero-copy", {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        outline.revert();
        fill.revert();
      };
    },
    { scope: ref, dependencies: [isReady] },
  );

  return (
    <section ref={ref} className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-notes mono">
          <span className="hero-mask"><span className="hero-note">Fig. 01 — Overview</span></span>
          <span className="hero-rule" aria-hidden="true" />
          <span className="hero-mask"><span className="hero-note">Sheet 01 / 07</span></span>
        </div>

        <h1 className="hero-name" aria-label={NAME.join(" ")}>
          {NAME.map((word) => (
            <span key={word} className="hero-name-line" aria-hidden="true">
              <span className="hero-word hero-word--outline">{word}</span>
              <span className="hero-word hero-word--fill">{word}</span>
              <span className="hero-name-scan" />
            </span>
          ))}
        </h1>

        <p className="hero-lede">
          <span className="hero-mask"><span className="hero-lede-line">Full-stack engineer. I build the <em>systems</em></span></span>{" "}
          <span className="hero-mask"><span className="hero-lede-line">behind products — media pipelines, APIs</span></span>{" "}
          <span className="hero-mask"><span className="hero-lede-line">and the interfaces people actually touch.</span></span>
        </p>

        <ul className="hero-foot mono">
          <li className="hero-mask"><span className="hero-foot-item"><b>Prev.</b> SDE Intern, Soundverse AI</span></li>
          <li className="hero-mask"><span className="hero-foot-item"><b>Edu.</b> B.Tech CSE, IIIT Sri City &rsquo;27</span></li>
          <li className="hero-mask hero-foot-scroll"><span className="hero-foot-item">Scroll <span className="hero-arrow" aria-hidden="true">↓</span></span></li>
        </ul>
      </div>

      <HeroStack active={isReady} />
    </section>
  );
}
