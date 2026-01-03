import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text3D, Center } from "@react-three/drei"
import { LiquidGlass } from "../../../components/liquid-glass"
import * as THREE from "three"

export default function HeroSection() {
  const groupRef = useRef<THREE.Group>(null)

  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lighting for light mode */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#667eea"
      />
      <ambientLight intensity={0.6} />

      {/* Accent lights for glass reflections */}
      <pointLight position={[2, 2, 3]} intensity={1.5} color="#ec4899" />
      <pointLight position={[-2, -1, 2]} intensity={1} color="#667eea" />

      {/* 3D Text behind the glass */}
      <Center position={[0, 0.15, -0.8]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.5}
          height={0.1}
          curveSegments={4}
          bevelEnabled={false}
        >
          Liquid
          <meshStandardMaterial color="#1a1a2e" />
        </Text3D>
      </Center>
      <Center position={[0, -0.4, -0.8]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.5}
          height={0.1}
          curveSegments={4}
          bevelEnabled={false}
        >
          Glass
          <meshStandardMaterial color="#667eea" />
        </Text3D>
      </Center>

      {/* Central hero glass panel - optimized */}
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <LiquidGlass
          width={1.4}
          height={1}
          borderRadius={0.2}
          borderSmoothness={12}
          position={[0, 0.2, 0]}
          // color={new THREE.Color(1.1, 1.1, 1.15)}
          transmission={1}
          roughness={0.08}
          ior={2.5}
          chromaticAberration={0.03}
          thickness={0.1}
          whileHover={{ scale: 1.05, rotateY: 0.05 }}
          whileTap={{ scale: 0.98, z: -0.1 }}
          extrudeSettings={{
            depth: 0.02,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.02,
            bevelSegments: 6,
          }}
        />
      </Float>

      {/* Floating accent panel - circle */}
      {/* <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.3}
        floatingRange={[-0.05, 0.05]}
      >
        <LiquidGlass
          width={0.45}
          height={0.45}
          borderRadius={0.5}
          borderSmoothness={16}
          position={[-1.2, 0.5, -0.3]}
          rotation={[0, 0.3, 0]}
          color={new THREE.Color(1.3, 1.1, 1.5)}
          transmission={0.92}
          roughness={0.05}
          ior={2.2}
          chromaticAberration={0.08}
          thickness={0.6}
          whileHover={{ scale: 1.15, rotateZ: 0.1 }}
          whileTap={{ scale: 0.9 }}
          extrudeSettings={{
            depth: 0.01,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.03,
            bevelSegments: 6,
          }}
        />
      </Float> */}

      {/* Floating accent panel - tall rectangle */}
      {/* <Float
        speed={1.8}
        rotationIntensity={0.25}
        floatIntensity={0.4}
        floatingRange={[-0.08, 0.08]}
      >
        <LiquidGlass
          width={0.35}
          height={0.7}
          borderRadius={0.15}
          borderSmoothness={10}
          position={[1.3, -0.2, -0.2]}
          rotation={[0, -0.2, 0.1]}
          color={new THREE.Color(1.1, 1.3, 1.2)}
          transmission={0.9}
          roughness={0.1}
          ior={1.8}
          chromaticAberration={0.05}
          thickness={0.4}
          whileHover={{ scale: 1.1, rotateY: -0.15 }}
          whileTap={{ scale: 0.95, y: -0.3 }}
          extrudeSettings={{
            depth: 0.015,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.015,
            bevelSegments: 5,
          }}
        />
      </Float> */}

      {/* Small floating orb */}
      {/* <Float speed={3} floatIntensity={0.6}>
        <LiquidGlass
          width={0.18}
          height={0.18}
          borderRadius={0.5}
          borderSmoothness={12}
          position={[-0.9, -0.5, 0.3]}
          color={new THREE.Color(1.5, 1.2, 1.8)}
          transmission={1}
          roughness={0}
          ior={2.5}
          chromaticAberration={0.15}
          thickness={0.8}
          whileHover={{ scale: 1.3 }}
          extrudeSettings={{
            depth: 0.005,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.03,
            bevelSegments: 5,
          }}
        />
      </Float>

      <Float speed={2.5} floatIntensity={0.5}>
        <LiquidGlass
          width={0.15}
          height={0.15}
          borderRadius={0.5}
          borderSmoothness={12}
          position={[1.1, 0.7, 0.2]}
          color={new THREE.Color(1.2, 1.6, 1.3)}
          transmission={1}
          roughness={0}
          ior={2.2}
          chromaticAberration={0.1}
          thickness={0.6}
          whileHover={{ scale: 1.4 }}
          extrudeSettings={{
            depth: 0.005,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.03,
            bevelSegments: 5,
          }}
        />
      </Float> */}
    </group>
  )
}
