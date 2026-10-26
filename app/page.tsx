"use client";
import { useState, useCallback, useEffect } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Footer from "@/components/Footer";
import { appMounted } from "@/components/PageTransition";

export default function Home() {
  // The preloader belongs to a hard load of this page; arriving from /projects lands straight on it.
  const [showLoader] = useState(() => !appMounted);
  const [ready, setReady] = useState(!showLoader);

  const handleReveal = useCallback(() => setReady(true), []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!showLoader) return;

    requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      const target = hash && document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: "instant" });
      else window.scrollTo(0, 0);
    });
  }, [showLoader]);

  return (
    <>
      {showLoader && <Preloader onReveal={handleReveal} />}
      <Navbar isReady={ready} />
      <main id="main">
        <Hero isReady={ready} />
        <Marquee />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Achievements />
      </main>
      <Footer />
    </>
  );
}
