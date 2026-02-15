import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"
import type { ScrollState } from "../LandingPage"

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform float uProgress;

  varying vec2 vUv;
  varying float vElevation;

  // --- 2D Simplex noise (Ashima) ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
     -0.577350269189626,
      0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;

    float t = uTime * uSpeed;
    vec3 pos = position;

    // Layer two noise passes at different scales for organic waves
    float n1 = snoise(pos.xy * uFrequency + vec2(t * 0.6, t * 0.4));
    float n2 = snoise(pos.xy * uFrequency * 2.0 + vec2(t * -0.3, t * 0.7));

    float elevation = (n1 * 0.7 + n2 * 0.3) * uAmplitude * uProgress;
    pos.z += elevation;

    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uAmplitude;
  uniform float uProgress;
  uniform float uWidth;
  uniform float uHeight;
  uniform float uBorderRadius;
  uniform vec2 uPlaneSize;
  uniform float uTime;
  uniform float uHueSpeed;

  varying vec2 vUv;
  varying float vElevation;

  // Hue rotation (Rodrigues' formula – rotates RGB around (1,1,1) axis)
  vec3 hueShift(vec3 color, float angle) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosA = cos(angle);
    return color * cosA + cross(k, color) * sin(angle) + k * dot(k, color) * (1.0 - cosA);
  }

  // Rounded box SDF (Inigo Quilez)
  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + r;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
  }

  void main() {
    // Normalise elevation into 0..1 range (0 = valley, 1 = peak)
    float h = clamp(vElevation / (uAmplitude * max(uProgress, 0.001)) * 0.5 + 0.5, 0.0, 1.0);

    // Map wave height to color: valleys → uColor1, mid-low → uColor2, mid-high → uColor3, peaks → uColor4
    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.33, h));
    color = mix(color, uColor3, smoothstep(0.33, 0.66, h));
    color = mix(color, uColor4, smoothstep(0.66, 1.0, h));

    // Rotate hue over time
    color = hueShift(color, uTime * uHueSpeed);

    // Darken valleys further based on how low the wave is
    float brightness = mix(0.3, 1.0, h);
    color *= brightness;

    // Map UV to world-space centered coordinates
    vec2 pos = (vUv - 0.5) * uPlaneSize;

    // Rounded rectangle mask
    vec2 halfSize = vec2(uWidth, uHeight) * 0.5;
    float dist = roundedBoxSDF(pos, halfSize, uBorderRadius);
    float edgeSmooth = fwidth(dist) * 1.5;
    float mask = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, dist);

    float alpha = smoothstep(0.0, 0.15, uProgress) * mask;
    gl_FragColor = vec4(color, alpha);
  }
`

interface RefractionGridProps {
  scrollState: ScrollState
  width?: number
  height?: number
  borderRadius?: number
  color1?: string
  color2?: string
  color3?: string
  color4?: string
  amplitude?: number
  frequency?: number
  speed?: number
}

// Padding around the SDF shape so edge vertices exist for wave displacement
const PLANE_PADDING = 1

export default function RefractionGrid({
  scrollState,
  width = 13,
  height = 1.7,
  borderRadius = 0.35,
  color1 = "#3b2c62",
  color2 = "#6952aa",
  color3 = "#442a5f",
  color4 = "#664796",
  amplitude = 1,
  frequency = 0.4,
  speed = 0.4,
}: RefractionGridProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const [controls, set] = useControls("Background Shader", () => ({
    positionX: { value: -0.4, min: -5, max: 5, step: 0.01 },
    positionY: { value: 0, min: -5, max: 5, step: 0.01 },
    positionZ: { value: -1.2, min: -5, max: 5, step: 0.01 },
    width: { value: width, min: 0.1, max: 100, step: 0.01 },
    height: { value: height, min: 0.1, max: 4, step: 0.01 },
    borderRadius: { value: borderRadius, min: 0, max: 1, step: 0.01 },
    amplitude: { value: amplitude, min: 0, max: 2, step: 0.01 },
    frequency: { value: frequency, min: 0, max: 5, step: 0.01 },
    speed: { value: speed, min: 0, max: 3, step: 0.01 },
    hueSpeed: { value: 0.1, min: 0, max: 1, step: 0.01 },
    color1: { value: color1 },
    color2: { value: color2 },
    color3: { value: color3 },
    color4: { value: color4 },
  }))

  // Sync prop changes into leva controls
  useEffect(() => {
    set({
      width,
      height,
      borderRadius,
      color1,
      color2,
      color3,
      color4,
      amplitude,
      frequency,
      speed,
    })
  }, [
    width,
    height,
    borderRadius,
    color1,
    color2,
    color3,
    color4,
    amplitude,
    frequency,
    speed,
    set,
  ])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uAmplitude: { value: controls.amplitude },
      uFrequency: { value: controls.frequency },
      uSpeed: { value: controls.speed },
      uHueSpeed: { value: controls.hueSpeed },
      uColor1: { value: new THREE.Color(controls.color1) },
      uColor2: { value: new THREE.Color(controls.color2) },
      uColor3: { value: new THREE.Color(controls.color3) },
      uColor4: { value: new THREE.Color(controls.color4) },
      uWidth: { value: width },
      uHeight: { value: height },
      uBorderRadius: { value: borderRadius },
      uPlaneSize: {
        value: new THREE.Vector2(width + PLANE_PADDING, height + PLANE_PADDING),
      },
    }),
    []
  )

  useFrame(({ clock }) => {
    const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined
    if (!mat) return

    mat.uniforms.uTime.value = clock.getElapsedTime()

    const progress = scrollState.progress
    const t = Math.min(1, Math.max(0, (progress - 0.5) / 1.5) * 3)
    mat.uniforms.uProgress.value = t

    // Animate shape to match center panel: circle at start → panel dims on scroll
    const shapeT = Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
    mat.uniforms.uWidth.value = THREE.MathUtils.lerp(1, controls.width, shapeT)
    mat.uniforms.uHeight.value = THREE.MathUtils.lerp(
      1,
      controls.height,
      shapeT
    )
    mat.uniforms.uBorderRadius.value = THREE.MathUtils.lerp(
      0.5,
      controls.borderRadius,
      shapeT
    )

    mat.uniforms.uAmplitude.value = controls.amplitude
    mat.uniforms.uFrequency.value = controls.frequency
    mat.uniforms.uSpeed.value = controls.speed
    mat.uniforms.uHueSpeed.value = controls.hueSpeed
    mat.uniforms.uPlaneSize.value.set(
      controls.width + PLANE_PADDING,
      controls.height + PLANE_PADDING
    )
    mat.uniforms.uColor1.value.set(controls.color1)
    mat.uniforms.uColor2.value.set(controls.color2)
    mat.uniforms.uColor3.value.set(controls.color3)
    mat.uniforms.uColor4.value.set(controls.color4)
  })

  return (
    <mesh
      ref={meshRef}
      position={[controls.positionX, controls.positionY, controls.positionZ]}
      rotation={[Math.PI / 6, 0, 0]}
    >
      <planeGeometry
        args={[
          controls.width + PLANE_PADDING,
          controls.height + PLANE_PADDING,
          250,
          250,
        ]}
      />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        // side={THREE.DoubleSide}
      />
    </mesh>
  )
}
