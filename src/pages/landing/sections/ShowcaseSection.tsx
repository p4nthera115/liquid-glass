import { useState } from "react"
import { Html, Float, Text3D, Center } from "@react-three/drei"
import {
  LiquidGlass,
  MATERIAL_PRESETS,
} from "../../../components/liquid-glass"
import * as THREE from "three"

interface ShowcaseItem {
  id: string
  label: string
  description: string
  props: Partial<Parameters<typeof LiquidGlass>[0]>
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "frosted",
    label: "Frosted",
    description: "Subtle blur with soft diffusion",
    props: {
      ...MATERIAL_PRESETS.frosted,
      color: new THREE.Color(1.2, 1.2, 1.3),
    },
  },
  {
    id: "crystal",
    label: "Crystal",
    description: "Clear glass with high refraction",
    props: {
      ...MATERIAL_PRESETS.crystal,
      color: new THREE.Color(1.3, 1.3, 1.3),
    },
  },
  {
    id: "water",
    label: "Water",
    description: "Liquid droplet effect",
    props: {
      ...MATERIAL_PRESETS.water,
      color: new THREE.Color(1.1, 1.3, 1.5),
    },
  },
  {
    id: "rainbow",
    label: "Rainbow",
    description: "High chromatic aberration",
    props: {
      transmission: 1,
      roughness: 0,
      ior: 3,
      chromaticAberration: 0.2,
      thickness: 1.2,
      color: new THREE.Color(1.5, 1.5, 1.5),
    },
  },
]

export default function ShowcaseSection() {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const spacing = 0.85

  return (
    <group>
      {/* Lighting for light mode */}
      <directionalLight position={[5, 8, 5]} intensity={2} color="#fff" />
      <directionalLight position={[-3, 4, -3]} intensity={0.8} color="#667eea" />
      <ambientLight intensity={0.6} />

      {/* Colored accent lights */}
      <pointLight position={[-3, 2, 2]} intensity={2} color="#ec4899" />
      <pointLight position={[3, 2, 2]} intensity={2} color="#667eea" />
      <pointLight position={[0, -1, 3]} intensity={1.5} color="#10b981" />

      {/* 3D Text behind the glass */}
      <Center position={[0, 0, -1.2]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.35}
          height={0.08}
          curveSegments={4}
          bevelEnabled={false}
        >
          Showcase
          <meshStandardMaterial color="#1a1a2e" />
        </Text3D>
      </Center>

      {/* Showcase panels in a row - optimized sizes */}
      {showcaseItems.map((item, index) => {
        const xPos = (index - (showcaseItems.length - 1) / 2) * spacing
        const isActive = activeItem === item.id

        return (
          <Float
            key={item.id}
            speed={1.5 + index * 0.2}
            rotationIntensity={0.1}
            floatIntensity={0.2}
          >
            <group position={[xPos, 0, 0]}>
              <LiquidGlass
                width={0.6}
                height={0.85}
                borderRadius={0.12}
                borderSmoothness={10}
                position={[0, 0, 0]}
                {...item.props}
                whileHover={{ scale: 1.1, z: 0.15, rotateY: 0.1 }}
                whileTap={{ scale: 0.95 }}
                whileActive={{ scale: 1.15, z: 0.2 }}
                active={isActive}
                onClick={() => setActiveItem(isActive ? null : item.id)}
                extrudeSettings={{
                  depth: 0.01,
                  bevelEnabled: true,
                  bevelThickness: 0.008,
                  bevelSize: 0.012,
                  bevelSegments: 5,
                }}
              />

              {/* Label */}
              <Html
                position={[0, -0.65, 0]}
                center
                distanceFactor={6}
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: "#1a1a2e",
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "4px",
                      opacity: 0.9,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      opacity: 0.5,
                      maxWidth: "100px",
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        )
      })}
    </group>
  )
}
