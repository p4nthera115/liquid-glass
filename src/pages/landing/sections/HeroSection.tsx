import { Float, Text } from "@react-three/drei"
import { LiquidGlass } from "../../../components/liquid-glass"
import * as THREE from "three"
import { useState, useCallback } from "react"

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

export default function HeroSection() {
  // Track which position each panel is at (0-3, clockwise from top-left)
  // [circle, smallSquare, tallRect, smallOrb] - initial positions
  const [panelOffsets, setPanelOffsets] = useState([0, 1, 2, 3])

  const handleCenterClick = useCallback(() => {
    // Rotate all panels clockwise (each moves to next position)
    setPanelOffsets((prev) => prev.map((offset) => (offset + 1) % 4))
  }, [])

  // Get position for a panel based on its current offset
  const getPosition = (panelIndex: number): [number, number, number] => {
    return PANEL_POSITIONS[panelOffsets[panelIndex]]
  }

  const getRotation = (panelIndex: number): [number, number, number] => {
    return PANEL_ROTATIONS[panelOffsets[panelIndex]]
  }

  return (
    <group>
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

      <Text fontSize={1.8} position={[0, 0.2, -0.8]}>
        Liquid
        <meshStandardMaterial color="#000" />
      </Text>

      {/* Central hero glass panel - click to rotate surrounding panels */}
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
          whileHover={{ scale: 1.05, borderRadius: 0.3 }}
          whileTap={{ scale: 0.98, z: -0.1, borderRadius: 0.3 }}
          onClick={handleCenterClick}
          extrudeSettings={{
            depth: 0.01,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.03,
            bevelSegments: 20,
          }}
        />
      </Float>

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
            strength: 5,
            damping: 0.75,
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
            strength: 5,
            damping: 0.75,
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
            strength: 5,
            damping: 0.75,
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
            strength: 5,
            damping: 0.75,
          }}
        />
      </Float>
    </group>
  )
}
