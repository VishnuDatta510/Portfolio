export type AmbientQuality = "off" | "low" | "high";

export type PerfProfile = {
  reducedMotion: boolean;
  /** Whether the hero may load the Spline WebGL scene. */
  allow3D: boolean;
  /** How much GPU budget the background shader may spend. */
  ambient: AmbientQuality;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

const SERVER_PROFILE: PerfProfile = {
  reducedMotion: false,
  allow3D: false,
  ambient: "off",
};

let cached: PerfProfile | null = null;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Budgets the two WebGL layers (background shader + Spline hero) against the
 * device. Both running at full resolution is what makes weaker machines drop
 * frames, so unknown or constrained hardware gets the cheaper path.
 */
export function getPerfProfile(): PerfProfile {
  if (typeof window === "undefined") return SERVER_PROFILE;
  if (cached) return cached;

  const nav = navigator as NavigatorWithHints;
  const reducedMotion = prefersReducedMotion();
  const saveData = nav.connection?.saveData === true;
  const slowNetwork = /^(slow-2g|2g|3g)$/.test(nav.connection?.effectiveType ?? "");
  // Touch-primary devices pay the most for a second WebGL context. A narrow
  // desktop window does not, so width alone is only a signal when it is tiny.
  const touchPrimary = window.matchMedia("(pointer: coarse)").matches;
  const tinyViewport = window.innerWidth < 640;
  // Browsers that withhold these hints (Safari, Firefox) get the full
  // experience rather than being punished for reporting nothing.
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;

  const constrained =
    reducedMotion || saveData || slowNetwork || touchPrimary || tinyViewport;
  const weak = cores <= 4 || memory <= 4;

  cached = {
    reducedMotion,
    allow3D: !constrained && !weak,
    ambient: constrained || weak ? "off" : cores >= 12 ? "high" : "low",
  };

  return cached;
}
