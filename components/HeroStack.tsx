"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";

const LAYERS = [
  { name: "Interface", tech: "Next.js · React · Tailwind" },
  { name: "Services", tech: "FastAPI · Node · gRPC" },
  { name: "Data", tech: "PostgreSQL · Redis · Mongo" },
  { name: "Infra", tech: "AWS · Docker · Celery" },
];

const GRID = 8; // cells per plane edge
const INK = "236, 235, 230";
const ACCENT = "255, 91, 35";

type Vec = [number, number, number];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The full stack as an exploded wireframe: four planes drawn on a 2D canvas
 * with a hand-rolled perspective projection. The pointer steers the camera,
 * scrolling pulls the layers apart, and packets travel between them.
 * Canvas 2D keeps it to a few hundred line segments a frame, no WebGL.
 */
export default function HeroStack({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef({ intro: 0, explode: 0, explodeTarget: 0, mx: 0, my: 0, tx: 0, ty: 0, hover: -1, draw: () => {} });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const s = state.current;
    const still = reducedMotion();
    const touch = !window.matchMedia("(hover: hover)").matches;
    let W = 0, H = 0, dpr = 1, time = 0;
    let labelWidths: number[] = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      labelWidths = labelsRef.current.map((l) => l?.offsetWidth ?? 0);
      draw();
    };

    const draw = () => {
      if (!W || !H) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const S = Math.min(W * 0.21, H * 0.2);
      const gap = S * (0.5 + s.explode * 0.55);
      const yaw = 0.78 + s.mx * 0.32 + Math.sin(time * 0.25) * (touch ? 0.18 : 0.04);
      const pitch = 0.5 + s.my * 0.14;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const D = S * 5.5;
      const ox = W * (W < 560 ? 0.35 : 0.4); // phones: leave room for the labels
      const oy = H * 0.5;

      const project = ([x, y, z]: Vec): [number, number] => {
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const f = D / (D + z2);
        return [ox + x1 * f, oy + y2 * f];
      };
      const line = (a: Vec, b: Vec, t = 1) => {
        const [ax, ay] = project(a);
        const [bx, by] = project([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      };

      const layerY = (i: number) => (i - (LAYERS.length - 1) / 2) * gap;
      const reveal = (i: number) => easeOut(clamp01(s.intro * 1.9 - i * 0.28));

      // Corner risers between consecutive planes.
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      for (let i = 0; i < LAYERS.length - 1; i++) {
        const t = Math.min(reveal(i), reveal(i + 1));
        if (!t) continue;
        ctx.strokeStyle = `rgba(${INK}, ${0.22 * t})`;
        ctx.beginPath();
        for (const [x, z] of [[-S, -S], [S, -S], [S, S], [-S, S]]) line([x, layerY(i), z], [x, layerY(i + 1), z], t);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      LAYERS.forEach((_, i) => {
        const t = reveal(i);
        const y = layerY(i);
        const lit = s.hover === i;
        if (!t) {
          const label = labelsRef.current[i];
          if (label) label.style.opacity = "0";
          return;
        }

        // Faint plate.
        const quad = ([[-S, -S], [S, -S], [S, S], [-S, S]] as const).map(([x, z]) => project([x, y, z]));
        ctx.fillStyle = lit ? `rgba(${ACCENT}, ${0.08 * t})` : `rgba(${INK}, ${0.025 * t})`;
        ctx.beginPath();
        quad.forEach(([x, py], k) => (k ? ctx.lineTo(x, py) : ctx.moveTo(x, py)));
        ctx.closePath();
        ctx.fill();

        // Inner grid draws across the plate.
        ctx.strokeStyle = lit ? `rgba(${ACCENT}, ${0.3 * t})` : `rgba(${INK}, ${0.09 * t})`;
        ctx.beginPath();
        for (let k = 1; k < GRID; k++) {
          const c = -S + (2 * S * k) / GRID;
          line([c, y, -S], [c, y, S], t);
          line([-S, y, c], [S, y, c], t);
        }
        ctx.stroke();

        // Outline.
        ctx.strokeStyle = lit ? `rgba(${ACCENT}, ${t})` : `rgba(${INK}, ${0.7 * t})`;
        ctx.lineWidth = lit ? 1.5 : 1;
        ctx.beginPath();
        line([-S, y, -S], [S, y, -S], t);
        line([S, y, -S], [S, y, S], t);
        line([S, y, S], [-S, y, S], t);
        line([-S, y, S], [-S, y, -S], t);
        ctx.stroke();
        ctx.lineWidth = 1;

        // Leader from the plate's outermost corner to its label.
        const anchor = quad.reduce((a, b) => (b[0] > a[0] ? b : a));
        const lx = Math.min(anchor[0] + 28, W - (labelWidths[i] || 0) - 4);
        ctx.strokeStyle = lit ? `rgba(${ACCENT}, ${t})` : `rgba(${INK}, ${0.35 * t})`;
        ctx.beginPath();
        ctx.moveTo(anchor[0], anchor[1]);
        ctx.lineTo(anchor[0] + (lx - anchor[0]) * t, anchor[1]);
        ctx.stroke();
        ctx.fillStyle = lit ? `rgb(${ACCENT})` : `rgba(${INK}, ${t})`;
        ctx.fillRect(anchor[0] - 2, anchor[1] - 2, 4, 4);

        const label = labelsRef.current[i];
        if (label) {
          label.style.opacity = String(t);
          label.style.transform = `translate3d(${lx + 6}px, ${anchor[1] - 9}px, 0)`;
        }
      });

      // Requests travel down through the stack and responses come back up.
      if (s.intro >= 1) {
        const lanes: [number, number, number][] = [
          [0, 0, 0],
          [S * 0.5, -S * 0.5, 0.33],
          [-S * 0.5, S * 0.5, 0.66],
        ];
        const top = layerY(0);
        const span = layerY(LAYERS.length - 1) - top;

        ctx.strokeStyle = `rgba(${ACCENT}, 0.18)`;
        ctx.beginPath();
        line([0, top, 0], [0, top + span, 0]);
        ctx.stroke();

        lanes.forEach(([x, z, offset], k) => {
          const raw = (time * 0.32 + offset) % 2;
          const p = raw < 1 ? raw : 2 - raw; // down, then back up
          const [px, py] = project([x, top + span * p, z]);
          ctx.fillStyle = `rgba(${ACCENT}, 0.18)`;
          ctx.beginPath();
          ctx.arc(px, py, k === 0 ? 7 : 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${ACCENT})`;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        });
      }
    };
    s.draw = draw;

    const tick = (t: number) => {
      time = t;
      s.mx += (s.tx - s.mx) * 0.06;
      s.my += (s.ty - s.my) * 0.06;
      s.explode += (s.explodeTarget - s.explode) * 0.08;
      draw();
    };

    const onPointer = (e: PointerEvent) => {
      s.tx = (e.clientX / window.innerWidth) * 2 - 1;
      s.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let running = false;
    const setRunning = (on: boolean) => {
      if (still || on === running) return;
      running = on;
      if (on) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };
    const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    io.observe(wrap);

    const trigger = ScrollTrigger.create({
      trigger: wrap.closest("section"),
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        s.explodeTarget = self.progress;
        if (still) {
          s.explode = self.progress;
          draw();
        }
      },
    });

    if (!touch) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      ro.disconnect();
      io.disconnect();
      trigger.kill();
      setRunning(false);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const s = state.current;
    if (reducedMotion()) {
      s.intro = 1;
      s.draw();
      return;
    }
    const tween = gsap.to(s, { intro: 1, duration: 2.4, ease: "power2.inOut", delay: 0.2 });
    return () => {
      tween.kill();
    };
  }, [active]);

  return (
    <div ref={wrapRef} className="stack" aria-hidden="true">
      <canvas ref={canvasRef} className="stack-canvas" />
      {LAYERS.map((layer, i) => (
        <div
          key={layer.name}
          ref={(el) => {
            labelsRef.current[i] = el;
          }}
          className="stack-label mono"
          onPointerEnter={() => {
            state.current.hover = i;
            state.current.draw();
          }}
          onPointerLeave={() => {
            state.current.hover = -1;
            state.current.draw();
          }}
        >
          <span className="stack-label-name">
            {String(i + 1).padStart(2, "0")} — {layer.name}
          </span>
          <span className="stack-label-tech">{layer.tech}</span>
        </div>
      ))}
    </div>
  );
}
