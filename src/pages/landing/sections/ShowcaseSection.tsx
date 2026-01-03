import { useState } from "react"
import { Html, Float, MeshReflectorMaterial } from "@react-three/drei"
import { LiquidGlass, MATERIAL_PRESETS } from "../../../components/liquid-glass"
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
      color: new THREE.Color(1.3, 1.3, 1.4),
    },
  },
  {
    id: "crystal",
    label: "Crystal",
    description: "Clear glass with high refraction",
    props: {
      ...MATERIAL_PRESETS.crystal,
      color: new THREE.Color(1.5, 1.5, 1.5),
    },
  },
  {
    id: "water",
    label: "Water",
    description: "Liquid droplet effect",
    props: {
      ...MATERIAL_PRESETS.water,
      color: new THREE.Color(1.2, 1.4, 1.6),
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
      color: new THREE.Color(1.8, 1.8, 1.8),
    },
  },
]

export default function ShowcaseSection() {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const spacing = 1.4

  return (
    <group>
      {/* Lighting */}
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#fff" />
      <directionalLight position={[-3, 4, -3]} intensity={1} color="#667eea" />
      <ambientLight intensity={0.4} />

      {/* Colored accent lights */}
      <pointLight position={[-3, 2, 2]} intensity={3} color="#ec4899" />
      <pointLight position={[3, 2, 2]} intensity={3} color="#667eea" />
      <pointLight position={[0, -1, 3]} intensity={2} color="#10b981" />

      {/* Showcase panels in a row */}
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
                width={1}
                height={1.4}
                borderRadius={0.2}
                borderSmoothness={30}
                position={[0, 0, 0]}
                {...item.props}
                whileHover={{ scale: 1.1, z: 0.2, rotateY: 0.1 }}
                whileTap={{ scale: 0.95 }}
                whileActive={{ scale: 1.15, z: 0.3 }}
                active={isActive}
                onClick={() => setActiveItem(isActive ? null : item.id)}
                extrudeSettings={{
                  depth: 0.015,
                  bevelEnabled: true,
                  bevelThickness: 0.012,
                  bevelSize: 0.018,
                  bevelSegments: 12,
                }}
              />

              {/* Label */}
              <Html
                position={[0, -1, 0]}
                center
                distanceFactor={6}
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: "white",
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
                      opacity: 0.6,
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

      {/* Background decorative elements */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial
          color="#0a0a15"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={0.9}
          mixStrength={50}
          roughness={0.9}
          depthScale={1}
          color="#080815"
          metalness={0.4}
          mirror={0.4}
        />
      </mesh>
    </group>
  )
}

