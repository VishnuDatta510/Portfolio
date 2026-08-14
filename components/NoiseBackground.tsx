"use client";
import { useEffect, useRef, useState } from "react";
import { getPerfProfile, type AmbientQuality } from "@/lib/perf";

const VERT = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_mouse;

  // ── Classic 3D noise (Ashima Arts) ──────────────────────
  vec3 mod289(vec3 x){ return x - floor(x*(1./289.))*289.; }
  vec4 mod289(vec4 x){ return x - floor(x*(1./289.))*289.; }
  vec4 permute(vec4 x){ return mod289(((x*34.)+1.)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1./6., 1./3.);
    const vec4 D = vec4(0., 0.5, 1., 2.);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0= v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.,i1.z,i2.z,1.))
      + i.y + vec4(0.,i1.y,i2.y,1.))
      + i.x + vec4(0.,i1.x,i2.x,1.));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.*x_);
    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy,y.xy);
    vec4 b1 = vec4(x.zw,y.zw);
    vec4 s0 = floor(b0)*2.+1.;
    vec4 s1 = floor(b1)*2.+1.;
    vec4 sh = -step(h, vec4(0.));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.);
    m = m*m;
    return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  // ────────────────────────────────────────────────────────

  void main() {
    vec2 uv  = gl_FragCoord.xy / u_resolution;
    vec2 muv = u_mouse / u_resolution; // normalised mouse 0-1

    // ── Base dark colour (cool near-black) ──────────────
    vec3 base = vec3(0.035, 0.035, 0.055);

    // ── Animated film grain ──────────────────────────────
    float t    = u_time * 0.3;
    vec3  p    = vec3(uv * 4.0, t);
    float n1   = snoise(p);
    float n2   = snoise(p * 2.5 + vec3(1.7, 9.2, 3.1));
    #ifdef HIGH_QUALITY
      float n3 = snoise(p * 6.0 + vec3(4.2, 2.8, 7.5));
      float grain = (n1*0.5 + n2*0.3 + n3*0.2) * 0.5 + 0.5;
    #else
      float grain = (n1*0.6 + n2*0.4) * 0.5 + 0.5;
    #endif

    // ── Mouse-follow spotlight ───────────────────────────
    float dist   = length(uv - muv);
    float spot   = smoothstep(0.75, 0.0, dist);       // wide violet glow
    float tight  = smoothstep(0.25, 0.0, dist) * 0.4; // tight core
    vec3  coolLight = vec3(0.10, 0.07, 0.22);          // violet tint

    // ── Edge vignette ────────────────────────────────────
    vec2  vigUV   = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vigUV * vec2(0.75, 0.85), vigUV * vec2(0.75, 0.85));
    vignette = clamp(vignette, 0.0, 1.0);
    vignette = pow(vignette, 0.6);

    // ── Compose ──────────────────────────────────────────
    vec3 col = base;
    col += grain * 0.045;                         // add shimmering grain
    col += coolLight * (spot * 0.18 + tight);      // mouse spotlight
    col *= vignette;                               // darken edges

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* Grain hides resolution loss, so the shader renders below CSS size and the
   browser upscales it for a fraction of the fragment cost. */
const SETTINGS: Record<Exclude<AmbientQuality, "off">, { scale: number; fps: number }> = {
  high: { scale: 0.75, fps: 40 },
  low: { scale: 0.5, fps: 30 },
};

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [quality, setQuality] = useState<AmbientQuality>("off");

  useEffect(() => {
    setQuality(getPerfProfile().ambient);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || quality === "off") return;

    const { scale, fps } = SETTINGS[quality];

    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const mkShader = (src: string, type: number) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const frag = quality === "high" ? `#define HIGH_QUALITY\n${FRAG}` : FRAG;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, mkShader(frag, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const resize = () => {
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: window.innerHeight - e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const start = performance.now();
    const frameInterval = 1000 / fps;
    let rafId = 0;
    let lastFrame = 0;

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(
        uMouse,
        mouseRef.current.x * scale,
        mouseRef.current.y * scale,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    rafId = requestAnimationFrame(render);

    const onVisibility = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) {
        lastFrame = 0;
        rafId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(rafId);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [quality]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`ambient-canvas${quality === "off" ? " ambient-canvas--static" : ""}`}
    />
  );
}
