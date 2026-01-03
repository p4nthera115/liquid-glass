import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, MeshReflectorMaterial } from "@react-three/drei"
import { LiquidGlass } from "../../../components/liquid-glass"
import * as THREE from "three"

export default function HeroSection() {
  const groupRef = useRef<THREE.Group>(null)

  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-5, 3, -5]} intensity={1} color="#667eea" />
      <ambientLight intensity={0.3} />

      {/* Accent lights for glass reflections */}
      <pointLight position={[2, 2, 3]} intensity={2} color="#ec4899" />
      <pointLight position={[-2, -1, 2]} intensity={1.5} color="#667eea" />

      {/* Central hero glass panel */}
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <LiquidGlass
          width={2.5}
          height={1.8}
          borderRadius={0.4}
          borderSmoothness={40}
          position={[0, 0.2, 0]}
          color={new THREE.Color(1.2, 1.2, 1.3)}
          transmission={0.98}
          roughness={0.05}
          ior={2.2}
          chromaticAberration={0.03}
          thickness={0.6}
          whileHover={{ scale: 1.05, rotateY: 0.05 }}
          whileTap={{ scale: 0.98, z: -0.1 }}
          extrudeSettings={{
            depth: 0.02,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.02,
            bevelSegments: 20,
          }}
        />
      </Float>

      {/* Floating accent panels */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.3}
        floatingRange={[-0.05, 0.05]}
      >
        <LiquidGlass
          width={0.8}
          height={0.8}
          borderRadius={0.5}
          borderSmoothness={60}
          position={[-2, 0.8, -0.5]}
          rotation={[0, 0.3, 0]}
          color={new THREE.Color(1.5, 1.2, 1.8)}
          transmission={0.95}
          roughness={0.02}
          ior={2.8}
          chromaticAberration={0.08}
          thickness={0.8}
          whileHover={{ scale: 1.15, rotateZ: 0.1 }}
          whileTap={{ scale: 0.9 }}
          extrudeSettings={{
            depth: 0.01,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.03,
            bevelSegments: 15,
          }}
        />
      </Float>

      <Float
        speed={1.8}
        rotationIntensity={0.25}
        floatIntensity={0.4}
        floatingRange={[-0.08, 0.08]}
      >
        <LiquidGlass
          width={0.6}
          height={1.2}
          borderRadius={0.25}
          borderSmoothness={40}
          position={[2.2, -0.3, -0.3]}
          rotation={[0, -0.2, 0.1]}
          color={new THREE.Color(1.2, 1.5, 1.3)}
          transmission={0.92}
          roughness={0.08}
          ior={2.0}
          chromaticAberration={0.05}
          thickness={0.5}
          whileHover={{ scale: 1.1, rotateY: -0.15 }}
          whileTap={{ scale: 0.95, y: -0.4 }}
          extrudeSettings={{
            depth: 0.015,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.015,
            bevelSegments: 15,
          }}
        />
      </Float>

      {/* Small floating orbs */}
      <Float speed={3} floatIntensity={0.6}>
        <LiquidGlass
          width={0.3}
          height={0.3}
          borderRadius={0.5}
          borderSmoothness={80}
          position={[-1.5, -0.8, 0.5]}
          color={new THREE.Color(2, 1.5, 2)}
          transmission={1}
          roughness={0}
          ior={3}
          chromaticAberration={0.15}
          thickness={1}
          whileHover={{ scale: 1.3 }}
          extrudeSettings={{
            depth: 0.005,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.05,
            bevelSegments: 20,
          }}
        />
      </Float>

      <Float speed={2.5} floatIntensity={0.5}>
        <LiquidGlass
          width={0.25}
          height={0.25}
          borderRadius={0.5}
          borderSmoothness={80}
          position={[1.8, 1.2, 0.3]}
          color={new THREE.Color(1.5, 2, 1.5)}
          transmission={1}
          roughness={0}
          ior={2.5}
          chromaticAberration={0.1}
          thickness={0.8}
          whileHover={{ scale: 1.4 }}
          extrudeSettings={{
            depth: 0.005,
            bevelEnabled: true,
            bevelThickness: 0.025,
            bevelSize: 0.04,
            bevelSegments: 18,
          }}
        />
      </Float>

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={0.8}
          mixStrength={40}
          roughness={0.8}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101020"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>
    </group>
  )
}

