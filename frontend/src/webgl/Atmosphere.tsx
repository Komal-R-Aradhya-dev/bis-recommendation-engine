import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { ShaderMaterial } from "three";
import { SCENE_MODE_INDEX, useSceneStore } from "@/store/sceneStore";
import { atmosphereFragment, atmosphereVertex } from "@/webgl/shaders";
import { isDocumentDark } from "@/webgl/theme";

interface AtmosphereProps {
  reducedMotion: boolean;
  isDark: boolean;
}

export default function Atmosphere({ reducedMotion, isDark }: AtmosphereProps) {
  const modeRef = useRef(SCENE_MODE_INDEX[useSceneStore.getState().mode]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uTime: { value: 0 },
          uMode: { value: 1 },
          uTheme: { value: isDark ? 1 : 0 },
          uMotion: { value: reducedMotion ? 0 : 1 },
        },
      }),
    [isDark, reducedMotion],
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, delta) => {
    const target = SCENE_MODE_INDEX[useSceneStore.getState().mode];
    const dark = isDocumentDark() || isDark;
    modeRef.current += (target - modeRef.current) * Math.min(1, delta * 1.4);
    material.uniforms.uTime.value += delta;
    material.uniforms.uMode.value = modeRef.current;
    material.uniforms.uTheme.value = dark ? 1 : 0;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
