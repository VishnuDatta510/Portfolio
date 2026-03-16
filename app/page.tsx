"use client";
import { useState, useCallback, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/NoiseBackground";

export default function Home() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const isReady = splineLoaded && preloaderDone;

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    requestAnimationFrame(() => {
      const hash = window.location.hash;
      if (hash === "#work") {
        const element = document.getElementById("work");
        if (element) {
          element.scrollIntoView({ behavior: "instant" });
        }
      } else {
        window.scrollTo(0, 0);
      }
    });
  }, []);

  return (
    <>
      <NoiseBackground />
      <Preloader
        onComplete={handlePreloaderComplete}
        isSplineLoaded={splineLoaded}
      />
      <CustomCursor />
      <Navbar isReady={isReady} />
      <SmoothScroll>
        <main style={{ position: "relative", zIndex: 1 }}>
          <Hero isReady={isReady} onSplineLoad={handleSplineLoad} />
          <Marquee />
          <About />
          <Skills />
          <Projects />
          <Achievements />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
