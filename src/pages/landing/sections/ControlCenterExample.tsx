import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Text3D, Center } from "@react-three/drei"
import { LiquidGlass } from "../../../components/liquid-glass"
import * as THREE from "three"

// Control Center panel configuration - scaled down for performance
interface ControlPanel {
  id: string
  icon: string
  label: string
  position: [number, number, number]
  size: [number, number]
  color: THREE.Color
  active?: boolean
}

// Scale factor to reduce overall size
const SCALE = 0.55

const controlPanels: ControlPanel[] = [
  {
    id: "wifi",
    icon: "📶",
    label: "Wi-Fi",
    position: [-0.72 * SCALE, 0.6 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(0.3, 0.5, 1),
    active: true,
  },
  {
    id: "bluetooth",
    icon: "🔵",
    label: "Bluetooth",
    position: [-0.36 * SCALE, 0.6 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(0.3, 0.5, 1),
    active: true,
  },
  {
    id: "airplane",
    icon: "✈️",
    label: "Airplane",
    position: [-0.72 * SCALE, 0.24 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(1, 1, 1),
  },
  {
    id: "cellular",
    icon: "📱",
    label: "Cellular",
    position: [-0.36 * SCALE, 0.24 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(0.2, 0.8, 0.4),
    active: true,
  },
  {
    id: "music",
    icon: "🎵",
    label: "Now Playing",
    position: [0.22 * SCALE, 0.42 * SCALE, 0],
    size: [0.75 * SCALE, 0.72 * SCALE],
    color: new THREE.Color(1, 0.4, 0.6),
  },
  {
    id: "brightness",
    icon: "☀️",
    label: "Brightness",
    position: [-0.72 * SCALE, -0.25 * SCALE, 0],
    size: [0.55 * SCALE, 0.72 * SCALE],
    color: new THREE.Color(1.2, 1.2, 0.8),
  },
  {
    id: "volume",
    icon: "🔊",
    label: "Volume",
    position: [-0.36 * SCALE, -0.25 * SCALE, 0],
    size: [0.55 * SCALE, 0.72 * SCALE],
    color: new THREE.Color(0.8, 0.8, 1.2),
  },
  {
    id: "flashlight",
    icon: "🔦",
    label: "Flashlight",
    position: [0.07 * SCALE, -0.25 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(0.3, 0.5, 1),
  },
  {
    id: "timer",
    icon: "⏱️",
    label: "Timer",
    position: [0.4 * SCALE, -0.25 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(1, 0.6, 0.2),
  },
  {
    id: "calculator",
    icon: "🧮",
    label: "Calculator",
    position: [0.07 * SCALE, -0.61 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(0.5, 0.5, 0.5),
  },
  {
    id: "camera",
    icon: "📷",
    label: "Camera",
    position: [0.4 * SCALE, -0.61 * SCALE, 0],
    size: [0.55 * SCALE, 0.55 * SCALE],
    color: new THREE.Color(0.6, 0.6, 0.6),
  },
]

function ControlPanelItem({
  panel,
  isActive,
  onToggle,
}: {
  panel: ControlPanel
  isActive: boolean
  onToggle: () => void
}) {
  const [width, height] = panel.size
  const borderRadius = Math.min(width, height) * 0.35

  return (
    <group position={panel.position}>
      <LiquidGlass
        width={width}
        height={height}
        borderRadius={borderRadius}
        borderSmoothness={8}
        position={[0, 0, 0]}
        color={isActive ? panel.color : new THREE.Color(0.7, 0.7, 0.75)}
        transmission={isActive ? 0.85 : 0.92}
        roughness={isActive ? 0.05 : 0.15}
        ior={isActive ? 2.0 : 1.6}
        chromaticAberration={isActive ? 0.02 : 0}
        thickness={isActive ? 0.5 : 0.25}
        whileHover={{ scale: 1.08, z: 0.05 }}
        whileTap={{ scale: 0.95 }}
        whileActive={{ scale: 1.05 }}
        active={isActive}
        onClick={onToggle}
        extrudeSettings={{
          depth: 0.006,
          bevelEnabled: true,
          bevelThickness: 0.005,
          bevelSize: 0.008,
          bevelSegments: 4,
        }}
      />

      {/* Icon */}
      <Html
        position={[0, height > 0.25 ? 0.06 : 0, 0.03]}
        center
        distanceFactor={5}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontSize: height > 0.25 ? "18px" : "14px",
            filter: isActive ? "none" : "grayscale(0.5)",
            opacity: isActive ? 1 : 0.7,
          }}
        >
          {panel.icon}
        </div>
      </Html>

      {/* Label for larger panels */}
      {height > 0.25 && (
        <Html
          position={[0, -height / 2 + 0.05, 0.03]}
          center
          distanceFactor={5}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              fontSize: "8px",
              fontWeight: 500,
              color: isActive ? "#1a1a2e" : "rgba(0,0,0,0.5)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {panel.label}
          </div>
        </Html>
      )}
    </group>
  )
}

function MusicPlayerContent({ isActive }: { isActive: boolean }) {
  return (
    <Html
      position={[0, 0, 0.04]}
      center
      distanceFactor={4}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          color: "#1a1a2e",
          opacity: isActive ? 1 : 0.7,
          transform: "scale(0.7)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
          }}
        >
          🎵
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "9px", fontWeight: 600 }}>Blinding Lights</div>
          <div style={{ fontSize: "7px", opacity: 0.6 }}>The Weeknd</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            fontSize: "10px",
            marginTop: "2px",
          }}
        >
          <span>⏮️</span>
          <span>▶️</span>
          <span>⏭️</span>
        </div>
      </div>
    </Html>
  )
}

export default function ControlCenterExample() {
  const groupRef = useRef<THREE.Group>(null)
  const [activePanels, setActivePanels] = useState<Set<string>>(
    new Set(controlPanels.filter((p) => p.active).map((p) => p.id))
  )

  const togglePanel = (id: string) => {
    setActivePanels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Subtle floating animation for the entire control center
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.08
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lighting for light mode */}
      <directionalLight position={[3, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-3, 3, -2]} intensity={0.6} color="#667eea" />
      <ambientLight intensity={0.5} />

      {/* Colored accent lights */}
      <pointLight position={[-2, 2, 3]} intensity={1.5} color="#667eea" />
      <pointLight position={[2, 1, 3]} intensity={1.5} color="#ec4899" />
      <pointLight position={[0, -2, 2]} intensity={1} color="#10b981" />

      {/* 3D Text behind the glass */}
      <Center position={[0, 0, -0.8]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.22}
          height={0.05}
          curveSegments={4}
          bevelEnabled={false}
        >
          Control Center
          <meshStandardMaterial color="#1a1a2e" />
        </Text3D>
      </Center>

      {/* Main Control Center background panel - optimized */}
      <LiquidGlass
        width={1.6 * SCALE}
        height={1.85 * SCALE}
        borderRadius={0.2 * SCALE}
        borderSmoothness={10}
        position={[-0.06 * SCALE, 0, -0.1]}
        color={new THREE.Color(0.85, 0.85, 0.9)}
        transmission={0.8}
        roughness={0.15}
        ior={1.4}
        chromaticAberration={0.01}
        thickness={0.15}
        anisotropicBlur={0.2}
        extrudeSettings={{
          depth: 0.03,
          bevelEnabled: true,
          bevelThickness: 0.012,
          bevelSize: 0.015,
          bevelSegments: 5,
        }}
      />

      {/* Control panels */}
      {controlPanels.map((panel) => (
        <ControlPanelItem
          key={panel.id}
          panel={panel}
          isActive={activePanels.has(panel.id)}
          onToggle={() => togglePanel(panel.id)}
        />
      ))}

      {/* Music player content overlay */}
      <group position={[0.22 * SCALE, 0.42 * SCALE, 0]}>
        <MusicPlayerContent isActive={activePanels.has("music")} />
      </group>

      {/* Time display at top */}
      <Html position={[-0.06 * SCALE, 1 * SCALE, 0.06]} center distanceFactor={4}>
        <div
          style={{
            color: "#1a1a2e",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </Html>
    </group>
  )
}
