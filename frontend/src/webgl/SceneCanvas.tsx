import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector2 } from "three";
import Atmosphere from "@/webgl/Atmosphere";
import ParticleField from "@/webgl/ParticleField";
import { detectQuality, type QualityProfile } from "@/webgl/quality";
import { isDocumentDark } from "@/webgl/theme";

type EffectsComponent = typeof import("@/webgl/Effects").default;

interface SceneCanvasProps {
  onFatal?: () => void;
}

function ThemeFrameBridge({ isDark }: { isDark: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate, isDark]);

  return null;
}

export default function SceneCanvas({ onFatal }: SceneCanvasProps) {
  const quality = useMemo<QualityProfile>(() => detectQuality(), []);
  const pointer = useRef(new Vector2(0, 0));
  const [paused, setPaused] = useState(false);
  const [PostEffects, setPostEffects] = useState<EffectsComponent | null>(null);
  const [isDark, setIsDark] = useState(() =>
    typeof document === "undefined" ? false : isDocumentDark(),
  );

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(isDocumentDark());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = document.querySelector("canvas.bis-webgl");
    if (canvas instanceof HTMLCanvasElement) {
      canvas.dataset.bisTheme = isDark ? "dark" : "light";
    }
  }, [isDark]);

  useEffect(() => {
    if (quality.tier === "off") {
      onFatal?.();
    }
  }, [onFatal, quality.tier]);

  useEffect(() => {
    if (quality.tier === "low" || quality.tier === "off" || prefersReduced) {
      return;
    }

    let active = true;

    void import("@/webgl/Effects").then((module) => {
      if (active) {
        setPostEffects(() => module.default);
      }
    });

    return () => {
      active = false;
    };
  }, [prefersReduced, quality.tier]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    };

    const onVisibility = () => {
      setPaused(document.hidden);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (quality.tier === "off") {
    return null;
  }

  return (
    <Canvas
      dpr={quality.dpr}
      frameloop={paused ? "never" : "always"}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 6.2], fov: 42, near: 0.1, far: 40 }}
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        background: "transparent",
      }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.setClearColor(0x000000, 0);
        const canvas = gl.domElement;
        canvas.style.pointerEvents = "none";
        canvas.classList.add("bis-webgl");

        const onLost = (event: Event) => {
          event.preventDefault();
          onFatal?.();
        };

        canvas.addEventListener("webglcontextlost", onLost, false);
      }}
    >
      <ThemeFrameBridge isDark={isDark} />
      <Atmosphere reducedMotion={prefersReduced} isDark={isDark} />
      <ParticleField
        count={quality.particleCount}
        reducedMotion={prefersReduced}
        pointer={pointer}
        isDark={isDark}
      />
      {PostEffects ? (
        <PostEffects
          quality={quality}
          reducedMotion={prefersReduced}
          isDark={isDark}
        />
      ) : null}
    </Canvas>
  );
}
