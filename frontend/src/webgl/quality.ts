export type QualityTier = "high" | "medium" | "low" | "off";

export interface QualityProfile {
  tier: QualityTier;
  particleCount: number;
  dpr: number;
  bloom: boolean;
  grain: boolean;
  chromatic: boolean;
}

export function detectQuality(): QualityProfile {
  if (typeof window === "undefined") {
    return {
      tier: "off",
      particleCount: 0,
      dpr: 1,
      bloom: false,
      grain: false,
      chromatic: false,
    };
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");

  if (!gl || reduced) {
    return {
      tier: "off",
      particleCount: 0,
      dpr: 1,
      bloom: false,
      grain: false,
      chromatic: false,
    };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const dpr = window.devicePixelRatio || 1;

  if (isMobile || cores <= 4 || memory <= 4) {
    return {
      tier: "low",
      particleCount: 700,
      dpr: Math.min(dpr, 1),
      bloom: false,
      grain: false,
      chromatic: false,
    };
  }

  if (cores <= 8 || memory <= 8) {
    return {
      tier: "medium",
      particleCount: 1600,
      dpr: Math.min(dpr, 1.35),
      bloom: true,
      grain: true,
      chromatic: false,
    };
  }

  return {
    tier: "high",
    particleCount: 2800,
    dpr: Math.min(dpr, 1.6),
    bloom: true,
    grain: true,
    chromatic: true,
  };
}
