import { Float, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { LiquidGlass } from "../../../components/liquid-glass"
import * as THREE from "three"
import { useState, useCallback, useRef } from "react"
import type { ScrollState } from "../LandingPage"

// Positions for the 4 surrounding panels (clockwise: top-left, top-right, bottom-right, bottom-left)
const PANEL_POSITIONS: [number, number, number][] = [
  [-1.2, 0.5, -0.3], // Top left
  [1.1, 0.7, 0.2], // Top right
  [1, -0.2, -0.2], // Bottom right
  [-0.8, -0.4, 0.3], // Bottom left
]

// Rotations for each position
const PANEL_ROTATIONS: [number, number, number][] = [
  [-0.2, -0.5, 0], // Top left
  [-0.4, 0.5, 0], // Top right
  [0.2, 0.5, 0], // Bottom right
  [0.2, -0.5, 0], // Bottom left
]

// Threshold at which surrounding panels unmount for performance
const UNMOUNT_THRESHOLD = 1

interface HeroSectionProps {
  scrollState: ScrollState
}

export default function HeroSection({ scrollState }: HeroSectionProps) {
  const [panelOffsets, setPanelOffsets] = useState([0, 1, 2, 3])
  const [showSurrounding, setShowSurrounding] = useState(true)
  const showSurroundingRef = useRef(true)

  const centerGroupRef = useRef<THREE.Group>(null)
  const surroundingGroupRef = useRef<THREE.Group>(null)

  const handleCenterClick = useCallback(() => {
    setPanelOffsets((prev) => prev.map((offset) => (offset + 1) % 4))
  }, [])

  const getPosition = (panelIndex: number): [number, number, number] => {
    return PANEL_POSITIONS[panelOffsets[panelIndex]]
  }

  const getRotation = (panelIndex: number): [number, number, number] => {
    return PANEL_ROTATIONS[panelOffsets[panelIndex]]
  }

  useFrame(() => {
    const progress = scrollState.progress

    // Center panel slides to the left
    if (centerGroupRef.current) {
      centerGroupRef.current.position.x = THREE.MathUtils.lerp(
        0,
        -0.8,
        progress
      )
    }

    // Surrounding panels fly upward and shrink
    if (surroundingGroupRef.current) {
      surroundingGroupRef.current.position.y = THREE.MathUtils.lerp(
        0,
        3,
        progress
      )
      const scale = Math.max(1, 1)
      surroundingGroupRef.current.scale.setScalar(scale)
    }

    // Unmount surrounding panels when they're offscreen for performance
    const shouldShow = progress < UNMOUNT_THRESHOLD
    if (shouldShow !== showSurroundingRef.current) {
      showSurroundingRef.current = shouldShow
      setShowSurrounding(shouldShow)
    }
  })

  return (
    <group>
      {/* Lighting */}
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
      <pointLight position={[2, 2, 3]} intensity={1.5} color="#ec4899" />
      <pointLight position={[-2, -1, 2]} intensity={1} color="#667eea" />

      {/* Center panel group - slides left on scroll */}
      <group ref={centerGroupRef}>
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          floatingRange={[-0.1, 0.1]}
        >
          <LiquidGlass
            width={1}
            height={1}
            borderRadius={1}
            borderSmoothness={20}
            position={[0, 0.2, 0]}
            color={new THREE.Color(2, 2, 2)}
            transmission={1}
            roughness={0}
            ior={2}
            chromaticAberration={0.03}
            thickness={0.8}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98, z: -0.1 }}
            onClick={handleCenterClick}
            extrudeSettings={{
              depth: 0.01,
              bevelEnabled: true,
              bevelThickness: 0.015,
              bevelSize: 0.03,
              bevelSegments: 20,
            }}
            springStrength={7}
          />
        </Float>
      </group>

      {/* Surrounding panels + text - fly away on scroll, unmount when offscreen */}
      {showSurrounding && (
        <group
          ref={surroundingGroupRef}
          // Set initial transform matching scroll state so there's no pop on remount
          position={[0, scrollState.progress * 3, 0]}
          scale={Math.max(0.01, 1 - scrollState.progress * 2.5)}
        >
          <Text fontSize={1.8} position={[0, 0.2, -0.8]}>
            Liquid
            <meshStandardMaterial color="#000" />
          </Text>

          {/* Panel 0: Circle (starts top-left) */}
          <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.3}
            floatingRange={[-0.05, 0.05]}
          >
            <LiquidGlass
              rotation={getRotation(0)}
              width={0.45}
              height={0.45}
              borderRadius={0.5}
              borderSmoothness={30}
              position={getPosition(0)}
              color={new THREE.Color(2, 1.1, 3)}
              transmission={0.92}
              roughness={0.05}
              ior={2.2}
              chromaticAberration={0.08}
              thickness={0.6}
              whileHover={{ scale: 1.15, rotateZ: 0.1 }}
              animateOnTap={false}
              extrudeSettings={{
                depth: 0.01,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.03,
                bevelSegments: 6,
              }}
              positionSpring={{
                strength: 2,
                damping: 0.75,
              }}
              rotationSpring={{
                strength: 1,
              }}
            />
          </Float>

          {/* Panel 1: Small square (starts top-right) */}
          <Float speed={2.5} floatIntensity={0.5}>
            <LiquidGlass
              rotation={getRotation(1)}
              width={0.15}
              height={0.15}
              borderRadius={0.1}
              borderSmoothness={20}
              position={getPosition(1)}
              color={new THREE.Color(1.2, 1.6, 1.3)}
              transmission={1}
              roughness={0}
              ior={2.2}
              chromaticAberration={0.1}
              thickness={0.6}
              whileHover={{ scale: 1.2 }}
              animateOnTap={false}
              extrudeSettings={{
                depth: 0.005,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelSegments: 20,
              }}
              positionSpring={{
                strength: 2,
                damping: 0.75,
              }}
              rotationSpring={{
                strength: 1,
              }}
            />
          </Float>

          {/* Panel 2: Tall rectangle (starts bottom-right) */}
          <Float
            speed={1.8}
            rotationIntensity={0.25}
            floatIntensity={0.4}
            floatingRange={[-0.08, 0.08]}
          >
            <LiquidGlass
              rotation={getRotation(2)}
              width={0.35}
              height={0.7}
              borderRadius={0.15}
              borderSmoothness={10}
              position={getPosition(2)}
              color={new THREE.Color(1.1, 1.3, 1.2)}
              transmission={0.9}
              roughness={0.1}
              ior={1.8}
              chromaticAberration={0.05}
              thickness={0.6}
              whileHover={{ scale: 1.1, rotateY: -0.15 }}
              animateOnTap={false}
              extrudeSettings={{
                depth: 0.015,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.015,
                bevelSegments: 5,
              }}
              positionSpring={{
                strength: 2,
                damping: 0.75,
              }}
              rotationSpring={{
                strength: 1,
              }}
            />
          </Float>

          {/* Panel 3: Small orb (starts bottom-left) */}
          <Float speed={3} floatIntensity={0.6}>
            <LiquidGlass
              rotation={getRotation(3)}
              width={0.3}
              height={0.18}
              borderRadius={0.5}
              borderSmoothness={20}
              position={getPosition(3)}
              color={new THREE.Color(1.5, 1.2, 1.8)}
              transmission={1}
              roughness={0}
              ior={2.5}
              chromaticAberration={0.15}
              animateOnTap={false}
              thickness={0.45}
              whileHover={{ scale: 1.3 }}
              extrudeSettings={{
                depth: 0.005,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.03,
                bevelSegments: 20,
              }}
              positionSpring={{
                strength: 2,
                damping: 0.75,
              }}
              rotationSpring={{
                strength: 1,
              }}
            />
          </Float>
        </group>
      )}
    </group>
  )
}
