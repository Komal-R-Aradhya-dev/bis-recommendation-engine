import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
  ShaderMaterial,
  Vector2,
} from "three";
import { SCENE_MODE_INDEX, useSceneStore } from "@/store/sceneStore";
import { isDocumentDark } from "@/webgl/theme";
import { particleFragment, particleVertex } from "@/webgl/shaders";

interface ParticleFieldProps {
  count: number;
  reducedMotion: boolean;
  pointer: MutableRefObject<Vector2>;
  isDark: boolean;
}

export default function ParticleField({
  count,
  reducedMotion,
  pointer,
  isDark,
}: ParticleFieldProps) {
  const modeRef = useRef(SCENE_MODE_INDEX[useSceneStore.getState().mode]);

  const { geometry, material } = useMemo(() => {
    const seeds = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      seeds[i3] = Math.random();
      seeds[i3 + 1] = Math.random();
      seeds[i3 + 2] = Math.random();
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new BufferAttribute(seeds, 3));

    const mat = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: isDark ? AdditiveBlending : NormalBlending,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uMode: { value: 1 },
        uMotion: { value: reducedMotion ? 0 : 1 },
        uTheme: { value: isDark ? 1 : 0 },
        uPointer: { value: new Vector2(0, 0) },
      },
    });

    return { geometry: geo, material: mat };
  }, [count, isDark, reducedMotion]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    const target = SCENE_MODE_INDEX[useSceneStore.getState().mode];
    const dark = isDocumentDark() || isDark;
    modeRef.current += (target - modeRef.current) * Math.min(1, delta * 1.6);
    material.uniforms.uTime.value += delta;
    material.uniforms.uMode.value = modeRef.current;
    material.uniforms.uTheme.value = dark ? 1 : 0;
    material.uniforms.uPointer.value.lerp(pointer.current, 0.08);
    material.blending = dark ? AdditiveBlending : NormalBlending;
  });

  return <points frustumCulled={false} geometry={geometry} material={material} />;
}
