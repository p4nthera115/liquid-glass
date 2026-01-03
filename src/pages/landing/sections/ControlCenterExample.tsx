import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Float, MeshReflectorMaterial } from "@react-three/drei"
import { LiquidGlass } from "../../../components/liquid-glass"
import * as THREE from "three"

// Control Center panel configuration
interface ControlPanel {
  id: string
  icon: string
  label: string
  position: [number, number, number]
  size: [number, number]
  color: THREE.Color
  active?: boolean
}

const controlPanels: ControlPanel[] = [
  {
    id: "wifi",
    icon: "📶",
    label: "Wi-Fi",
    position: [-1.3, 1.1, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(0.3, 0.5, 1),
    active: true,
  },
  {
    id: "bluetooth",
    icon: "🔵",
    label: "Bluetooth",
    position: [-0.65, 1.1, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(0.3, 0.5, 1),
    active: true,
  },
  {
    id: "airplane",
    icon: "✈️",
    label: "Airplane",
    position: [-1.3, 0.45, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(1, 1, 1),
  },
  {
    id: "cellular",
    icon: "📱",
    label: "Cellular",
    position: [-0.65, 0.45, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(0.2, 0.8, 0.4),
    active: true,
  },
  {
    id: "music",
    icon: "🎵",
    label: "Now Playing",
    position: [0.4, 0.775, 0],
    size: [1.25, 1.2],
    color: new THREE.Color(1, 0.4, 0.6),
  },
  {
    id: "brightness",
    icon: "☀️",
    label: "Brightness",
    position: [-1.3, -0.45, 0],
    size: [0.55, 1.2],
    color: new THREE.Color(1.2, 1.2, 0.8),
  },
  {
    id: "volume",
    icon: "🔊",
    label: "Volume",
    position: [-0.65, -0.45, 0],
    size: [0.55, 1.2],
    color: new THREE.Color(0.8, 0.8, 1.2),
  },
  {
    id: "flashlight",
    icon: "🔦",
    label: "Flashlight",
    position: [0.125, -0.45, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(0.3, 0.5, 1),
  },
  {
    id: "timer",
    icon: "⏱️",
    label: "Timer",
    position: [0.725, -0.45, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(1, 0.6, 0.2),
  },
  {
    id: "calculator",
    icon: "🧮",
    label: "Calculator",
    position: [0.125, -1.1, 0],
    size: [0.55, 0.55],
    color: new THREE.Color(0.5, 0.5, 0.5),
  },
  {
    id: "camera",
    icon: "📷",
    label: "Camera",
    position: [0.725, -1.1, 0],
    size: [0.55, 0.55],
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
        borderSmoothness={40}
        position={[0, 0, 0]}
        color={
          isActive
            ? panel.color
            : new THREE.Color(0.5, 0.5, 0.55)
        }
        transmission={isActive ? 0.85 : 0.95}
        roughness={isActive ? 0.05 : 0.12}
        ior={isActive ? 2.2 : 1.8}
        chromaticAberration={isActive ? 0.02 : 0}
        thickness={isActive ? 0.6 : 0.3}
        whileHover={{ scale: 1.08, z: 0.08 }}
        whileTap={{ scale: 0.95 }}
        whileActive={{ scale: 1.05 }}
        active={isActive}
        onClick={onToggle}
        extrudeSettings={{
          depth: 0.01,
          bevelEnabled: true,
          bevelThickness: 0.008,
          bevelSize: 0.012,
          bevelSegments: 10,
        }}
      />

      {/* Icon */}
      <Html
        position={[0, height > 0.8 ? 0.15 : 0, 0.05]}
        center
        distanceFactor={5}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontSize: height > 0.8 ? "28px" : "20px",
            filter: isActive ? "none" : "grayscale(0.5)",
            opacity: isActive ? 1 : 0.7,
          }}
        >
          {panel.icon}
        </div>
      </Html>

      {/* Label for larger panels */}
      {height > 0.8 && (
        <Html
          position={[0, -height / 2 + 0.15, 0.05]}
          center
          distanceFactor={5}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 500,
              color: isActive ? "white" : "rgba(255,255,255,0.6)",
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
      position={[0, 0, 0.06]}
      center
      distanceFactor={4}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          color: "white",
          opacity: isActive ? 1 : 0.7,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          }}
        >
          🎵
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", fontWeight: 600 }}>Blinding Lights</div>
          <div style={{ fontSize: "9px", opacity: 0.7 }}>The Weeknd</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          <span style={{ cursor: "pointer" }}>⏮️</span>
          <span style={{ cursor: "pointer" }}>▶️</span>
          <span style={{ cursor: "pointer" }}>⏭️</span>
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
        Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <directionalLight position={[3, 5, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-3, 3, -2]} intensity={0.8} color="#667eea" />
      <ambientLight intensity={0.35} />

      {/* Colored accent lights */}
      <pointLight position={[-2, 2, 3]} intensity={2} color="#667eea" />
      <pointLight position={[2, 1, 3]} intensity={2} color="#ec4899" />
      <pointLight position={[0, -2, 2]} intensity={1.5} color="#10b981" />

      {/* Main Control Center background panel */}
      <LiquidGlass
        width={2.8}
        height={3.2}
        borderRadius={0.35}
        borderSmoothness={30}
        position={[-0.1, 0, -0.15]}
        color={new THREE.Color(0.3, 0.3, 0.35)}
        transmission={0.75}
        roughness={0.2}
        ior={1.5}
        chromaticAberration={0.01}
        thickness={0.2}
        anisotropicBlur={0.3}
        extrudeSettings={{
          depth: 0.05,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.025,
          bevelSegments: 15,
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
      <group position={[0.4, 0.775, 0]}>
        <MusicPlayerContent isActive={activePanels.has("music")} />
      </group>

      {/* Time display at top */}
      <Html position={[-0.1, 1.75, 0.1]} center distanceFactor={4}>
        <div
          style={{
            color: "white",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            opacity: 0.9,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </Html>

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={0.85}
          mixStrength={60}
          roughness={0.85}
          depthScale={1.2}
          color="#060610"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>

      {/* Background gradient plane */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[15, 10]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

