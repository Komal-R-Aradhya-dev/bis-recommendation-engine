import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import type { QualityProfile } from "@/webgl/quality";

interface EffectsProps {
  quality: QualityProfile;
  reducedMotion: boolean;
  isDark: boolean;
}

const chromaOffset = new Vector2(0.00045, 0.00022);

export default function Effects({ quality, reducedMotion, isDark }: EffectsProps) {

  if (reducedMotion || quality.tier === "low" || quality.tier === "off") {
    return null;
  }

  return (
    <EffectComposer
      multisampling={0}
      enableNormalPass={false}
      depthBuffer={false}
    >
      {quality.bloom && isDark && (
        <Bloom
          intensity={0.16}
          luminanceThreshold={0.82}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
      )}
      <Vignette darkness={isDark ? 0.55 : 0.28} offset={0.32} />
      {quality.grain && (
        <Noise
          opacity={isDark ? 0.04 : 0.02}
          blendFunction={BlendFunction.OVERLAY}
        />
      )}
      {quality.chromatic && isDark && (
        <ChromaticAberration
          offset={chromaOffset}
          radialModulation={false}
          modulationOffset={0}
        />
      )}
    </EffectComposer>
  );
}
