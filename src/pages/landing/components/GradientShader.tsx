import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  
  varying vec2 vUv;
  
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  // Smooth blob function
  float blob(vec2 uv, vec2 center, float radius, float softness) {
    float d = length(uv - center);
    return smoothstep(radius + softness, radius - softness, d);
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.15;
    
    // Create flowing distortion
    vec2 distortedUv = uv;
    distortedUv.x += snoise(vec2(uv.y * 2.0, time)) * 0.15;
    distortedUv.y += snoise(vec2(uv.x * 2.0, time + 100.0)) * 0.15;
    
    // Create multiple animated blob positions
    vec2 blob1Pos = vec2(
      0.3 + sin(time * 0.7) * 0.2,
      0.7 + cos(time * 0.5) * 0.15
    );
    vec2 blob2Pos = vec2(
      0.7 + cos(time * 0.6) * 0.2,
      0.3 + sin(time * 0.8) * 0.2
    );
    vec2 blob3Pos = vec2(
      0.5 + sin(time * 0.9 + 1.0) * 0.25,
      0.5 + cos(time * 0.4 + 2.0) * 0.2
    );
    vec2 blob4Pos = vec2(
      0.2 + cos(time * 0.5 + 3.0) * 0.15,
      0.3 + sin(time * 0.7 + 1.5) * 0.2
    );
    vec2 blob5Pos = vec2(
      0.8 + sin(time * 0.6 + 2.0) * 0.15,
      0.7 + cos(time * 0.9 + 0.5) * 0.15
    );
    
    // Create blobs with noise-based distortion
    float noise1 = fbm(distortedUv * 3.0 + time * 0.5);
    float noise2 = fbm(distortedUv * 2.0 - time * 0.3);
    
    float b1 = blob(distortedUv, blob1Pos, 0.35 + noise1 * 0.1, 0.3);
    float b2 = blob(distortedUv, blob2Pos, 0.4 + noise2 * 0.1, 0.35);
    float b3 = blob(distortedUv, blob3Pos, 0.3 + noise1 * 0.08, 0.25);
    float b4 = blob(distortedUv, blob4Pos, 0.25 + noise2 * 0.06, 0.2);
    float b5 = blob(distortedUv, blob5Pos, 0.28 + noise1 * 0.07, 0.22);
    
    // Base gradient
    vec3 baseGradient = mix(uColor1, uColor2, uv.x + uv.y * 0.5);
    
    // Layer colors with blobs
    vec3 color = baseGradient;
    color = mix(color, uColor3, b1 * 0.8);
    color = mix(color, uColor4, b2 * 0.7);
    color = mix(color, uColor2, b3 * 0.6);
    color = mix(color, uColor5, b4 * 0.75);
    color = mix(color, uColor3, b5 * 0.5);
    
    // Add subtle noise texture
    float noiseTexture = fbm(uv * 8.0 + time * 0.2) * 0.03;
    color += noiseTexture;
    
    // Vignette effect (subtle)
    float vignette = 1.0 - length(uv - 0.5) * 0.3;
    color *= vignette;
    
    // Slight saturation boost
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.15);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

interface GradientShaderProps {
  colors?: {
    color1?: string
    color2?: string
    color3?: string
    color4?: string
    color5?: string
  }
}

export default function GradientShader({ colors }: GradientShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColor1: { value: new THREE.Color(colors?.color1 || "#f8fafc") }, // Light base
      uColor2: { value: new THREE.Color(colors?.color2 || "#e0e7ff") }, // Soft indigo
      uColor3: { value: new THREE.Color(colors?.color3 || "#c7d2fe") }, // Lighter indigo
      uColor4: { value: new THREE.Color(colors?.color4 || "#ddd6fe") }, // Soft violet
      uColor5: { value: new THREE.Color(colors?.color5 || "#fbcfe8") }, // Soft pink
    }),
    [colors]
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[25, 18, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

