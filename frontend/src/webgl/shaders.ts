export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uMode;
uniform float uMotion;
uniform float uTheme;
uniform vec2 uPointer;

attribute vec3 aSeed;

varying float vAlpha;
varying vec3 vTint;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.23));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}

vec3 curl(vec3 p) {
  float e = 0.12;
  float n1 = noise(p + vec3(0.0, e, 0.0));
  float n2 = noise(p - vec3(0.0, e, 0.0));
  float n3 = noise(p + vec3(0.0, 0.0, e));
  float n4 = noise(p - vec3(0.0, 0.0, e));
  float n5 = noise(p + vec3(e, 0.0, 0.0));
  float n6 = noise(p - vec3(e, 0.0, 0.0));
  return normalize(vec3(n1 - n2, n3 - n4, n5 - n6) + 0.0001);
}

vec3 formation(float mode, vec3 s) {
  vec3 auth = vec3(s.x * 7.4, s.y * 3.2, s.z * 3.6);
  vec3 hero = vec3(s.x * 3.4, abs(s.y) * 3.8 - 0.6, s.z * 2.8);
  float breath = 1.45 + 0.22 * sin(uTime * 0.55 + s.x * 4.0);
  vec3 analyzing = normalize(s + 0.0001) * breath;
  vec3 results = vec3(s.x * 5.8, floor(s.y * 6.0) * 0.42 - 1.0, s.z * 2.2);
  vec3 settings = vec3(s.x * 8.5, s.y * 5.2, s.z * 5.0);

  float m0 = clamp(1.0 - abs(mode - 0.0), 0.0, 1.0);
  float m1 = clamp(1.0 - abs(mode - 1.0), 0.0, 1.0);
  float m2 = clamp(1.0 - abs(mode - 2.0), 0.0, 1.0);
  float m3 = clamp(1.0 - abs(mode - 3.0), 0.0, 1.0);
  float m4 = clamp(1.0 - abs(mode - 4.0), 0.0, 1.0);
  float sum = max(m0 + m1 + m2 + m3 + m4, 0.0001);

  return (auth * m0 + hero * m1 + analyzing * m2 + results * m3 + settings * m4) / sum;
}

void main() {
  vec3 seed = aSeed * 2.0 - 1.0;
  vec3 pos = formation(uMode, seed);
  pos += curl(pos * 0.28 + vec3(0.0, uTime * 0.045, 0.0)) * (0.22 * uMotion);

  vec2 delta = pos.xy - uPointer * 3.4;
  float influence = exp(-dot(delta, delta) * 0.42) * 0.48 * uMotion;
  pos.xy += normalize(delta + 0.0001) * influence;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float depth = clamp((-mv.z - 2.0) / 10.0, 0.0, 1.0);
  gl_PointSize = mix(6.5, 1.6, depth) * (220.0 / max(-mv.z, 1.0));

  vec3 navy = mix(vec3(0.16, 0.28, 0.48), vec3(0.48, 0.62, 0.82), uTheme);
  vec3 gold = vec3(0.72, 0.58, 0.32);
  vec3 paper = mix(vec3(0.93, 0.90, 0.84), vec3(0.78, 0.84, 0.92), uTheme);
  float pick = hash(seed + 2.1);
  vTint = mix(navy, mix(paper, gold, step(0.82, pick)), pick);

  vAlpha = mix(0.16, 0.72, 1.0 - depth) * mix(0.55, 1.0, uTheme * 0.35 + 0.65);
}
`;

export const particleFragment = /* glsl */ `
precision mediump float;

varying float vAlpha;
varying vec3 vTint;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  float falloff = smoothstep(1.0, 0.08, d);
  gl_FragColor = vec4(vTint, vAlpha * falloff);
}
`;

export const atmosphereVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const atmosphereFragment = /* glsl */ `
precision mediump float;

uniform float uTime;
uniform float uMode;
uniform float uTheme;
uniform float uMotion;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.018 * uMotion;
  vec2 warp = vec2(
    fbm(uv * 2.4 + vec2(t, -t * 0.6)),
    fbm(uv * 2.1 - vec2(t * 0.8, t))
  );
  float field = fbm(uv * 1.6 + warp * 0.55);

  vec3 lightA = mix(vec3(0.95, 0.93, 0.88), vec3(0.03, 0.05, 0.09), uTheme);
  vec3 lightB = mix(vec3(0.90, 0.88, 0.82), vec3(0.05, 0.08, 0.14), uTheme);
  vec3 accent = mix(vec3(0.12, 0.31, 0.55), vec3(0.28, 0.46, 0.72), uTheme);
  vec3 gold = vec3(0.68, 0.54, 0.30);

  vec3 col = mix(lightA, lightB, field);
  col = mix(col, accent, mix(0.18, 0.28, uTheme) * smoothstep(0.35, 0.8, field));
  col = mix(col, gold, 0.07 * (1.0 - abs(uv.y - 0.62)) * (0.4 + 0.2 * uMode));

  float vignette = smoothstep(1.15, 0.28, length(uv - 0.5));
  col *= mix(0.78, 1.0, vignette);

  gl_FragColor = vec4(col, mix(0.38, 0.62, uTheme));
}
`;
