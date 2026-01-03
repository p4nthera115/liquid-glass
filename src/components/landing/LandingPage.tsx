import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  Float,
  Html,
} from "@react-three/drei"
import { Suspense, useState } from "react"
import {
  LiquidGlass,
  MATERIAL_PRESETS,
  TRANSITION_PRESETS,
  type MaterialPreset,
} from "../liquid-glass"
import { Color } from "three"
import "./landing.css"

type DemoTab = "hero" | "presets" | "interactive" | "animations"

/**
 * Hero Scene - Main showcase
 */
function HeroScene() {
  const [activePreset, setActivePreset] = useState<MaterialPreset>("crystal")

  const cyclePreset = () => {
    const presets: MaterialPreset[] = ["glass", "crystal", "frosted", "diamond", "water", "ice", "plastic"]
    const currentIndex = presets.indexOf(activePreset)
    setActivePreset(presets[(currentIndex + 1) % presets.length])
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4a9eff" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <LiquidGlass
          position={[0, 0, 0]}
          width={2.2}
          height={2.2}
          borderRadius={0.5}
          borderSmoothness={20}
          preset={activePreset}
          initial={{ scale: 0, opacity: 0, rotateY: -0.3 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          whileHover={{ scale: 1.04, rotateY: 0.03 }}
          whileTap={{ scale: 0.97 }}
          transition={TRANSITION_PRESETS.smooth}
          onClick={cyclePreset}
          extrudeSettings={{
            depth: 0,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.025,
            bevelSegments: 16,
          }}
        />
      </Float>

      <Html center position={[0, -1.6, 0]}>
        <div className="scene-label">
          <span className="preset-name">{activePreset}</span>
          <span className="preset-hint">click to change preset</span>
        </div>
      </Html>

      <Environment preset="city" />
    </>
  )
}

/**
 * Presets Scene - Cycle through presets one at a time
 */
function PresetsScene() {
  const presets = Object.keys(MATERIAL_PRESETS) as MaterialPreset[]
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentPreset = presets[currentIndex]

  const nextPreset = () => setCurrentIndex((i) => (i + 1) % presets.length)
  const prevPreset = () => setCurrentIndex((i) => (i - 1 + presets.length) % presets.length)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} />

      <Float speed={2} floatIntensity={0.3}>
        <LiquidGlass
          key={currentPreset} // Force remount for initial animation
          width={1.8}
          height={1.8}
          borderRadius={0.4}
          borderSmoothness={20}
          preset={currentPreset}
          initial={{ scale: 0, rotateY: 0.5 }}
          animate={{ scale: 1, rotateY: 0 }}
          whileHover={{ scale: 1.06, z: 0.2 }}
          whileTap={{ scale: 0.95 }}
          transition={TRANSITION_PRESETS.bouncy}
          extrudeSettings={{
            depth: 0,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.025,
            bevelSegments: 16,
          }}
        />
      </Float>

      <Html center position={[0, -1.4, 0]}>
        <div className="preset-nav">
          <button className="preset-btn" onClick={prevPreset}>←</button>
          <div className="preset-info">
            <span className="preset-name">{currentPreset}</span>
            <span className="preset-count">{currentIndex + 1} / {presets.length}</span>
          </div>
          <button className="preset-btn" onClick={nextPreset}>→</button>
        </div>
      </Html>

      <Environment preset="apartment" />
    </>
  )
}

/**
 * Interactive Scene - Counter demo
 */
function InteractiveScene() {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 4, 3]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#ff6b6b" />
      <pointLight position={[3, 2, 2]} intensity={0.4} color="#4ecdc4" />

      {/* Main interactive panel */}
      <Float speed={2} floatIntensity={0.2}>
        <LiquidGlass
          position={[0, 0.3, 0]}
          width={2}
          height={2}
          borderRadius={0.5}
          borderSmoothness={20}
          preset="crystal"
          color={isActive ? new Color(0.85, 1, 0.9) : new Color(1, 1, 1)}
          active={isActive}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93, scaleZ: 0.85 }}
          whileActive={{ scale: 1.08 }}
          onClick={() => {
            setCount((c) => c + 1)
            setIsActive(!isActive)
          }}
          transition={TRANSITION_PRESETS.snappy}
          extrudeSettings={{
            depth: 0,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.025,
            bevelSegments: 16,
          }}
        />
      </Float>

      <Html center position={[0, 0.3, 0.1]}>
        <div className="demo-label">
          <span className="demo-count">{count}</span>
          <span className="demo-text">clicks</span>
          <span className={`demo-status ${isActive ? "active" : ""}`}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
      </Html>

      <Html center position={[0, -1.3, 0]}>
        <div className="scene-hint">
          Click to increment & toggle state
        </div>
      </Html>

      <Environment preset="sunset" />
    </>
  )
}

/**
 * Animations Scene - Compare transition presets
 */
function AnimationsScene() {
  const transitions = [
    { name: "snappy", preset: TRANSITION_PRESETS.snappy },
    { name: "smooth", preset: TRANSITION_PRESETS.smooth },
    { name: "bouncy", preset: TRANSITION_PRESETS.bouncy },
    { name: "slow", preset: TRANSITION_PRESETS.slow },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = transitions[currentIndex]
  const [key, setKey] = useState(0) // For re-triggering animation

  const nextTransition = () => {
    setCurrentIndex((i) => (i + 1) % transitions.length)
    setKey((k) => k + 1)
  }
  const prevTransition = () => {
    setCurrentIndex((i) => (i - 1 + transitions.length) % transitions.length)
    setKey((k) => k + 1)
  }
  const replay = () => setKey((k) => k + 1)

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={1} />

      <Float speed={2} floatIntensity={0.15}>
        <LiquidGlass
          key={`${current.name}-${key}`}
          width={1.8}
          height={2.2}
          borderRadius={0.35}
          borderSmoothness={20}
          preset="crystal"
          color={new Color(0.95, 0.97, 1)}
          initial={{ scale: 0, opacity: 0, y: -1 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.08, rotateZ: 0.05 }}
          whileTap={{ scale: 0.9 }}
          transition={current.preset}
          extrudeSettings={{
            depth: 0,
            bevelEnabled: true,
            bevelThickness: 0.015,
            bevelSize: 0.025,
            bevelSegments: 16,
          }}
        />
      </Float>

      <Html center position={[0, -1.5, 0]}>
        <div className="animation-nav">
          <button className="preset-btn" onClick={prevTransition}>←</button>
          <div className="preset-info">
            <span className="preset-name">{current.name}</span>
            <button className="replay-btn" onClick={replay}>↻ replay</button>
          </div>
          <button className="preset-btn" onClick={nextTransition}>→</button>
        </div>
      </Html>

      <Environment preset="dawn" />
    </>
  )
}

/**
 * Main Landing Page Component
 * Uses a single Canvas with tab-based navigation to avoid triangle limit issues
 */
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>("hero")

  const tabs: { id: DemoTab; label: string; description: string }[] = [
    { id: "hero", label: "Showcase", description: "Interactive glass component with material presets" },
    { id: "presets", label: "Presets", description: "7 built-in material presets for different glass effects" },
    { id: "interactive", label: "Interactive", description: "Hover, tap, toggle states with event callbacks" },
    { id: "animations", label: "Animations", description: "4 spring-based transition presets" },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab)!

  return (
    <div className="landing">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <span className="header-logo">◇</span>
          <span className="header-title">Liquid Glass</span>
        </div>
        <p className="header-tagline">
          Beautiful glass-effect components for React Three Fiber
        </p>
      </header>

      {/* Main Canvas - Single instance */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            {activeTab === "hero" && <HeroScene />}
            {activeTab === "presets" && <PresetsScene />}
            {activeTab === "interactive" && <InteractiveScene />}
            {activeTab === "animations" && <AnimationsScene />}
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Description */}
      <div className="tab-description">
        <p>{currentTab.description}</p>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span className="feature-text">Spring Physics</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🎨</span>
          <span className="feature-text">7 Presets</span>
        </div>
        <div className="feature">
          <span className="feature-icon">✨</span>
          <span className="feature-text">Interactive</span>
        </div>
        <div className="feature">
          <span className="feature-icon">♿</span>
          <span className="feature-text">Accessible</span>
        </div>
      </div>

      {/* Code Example */}
      <div className="code-section">
        <h3 className="code-title">Quick Start</h3>
        <pre className="code-block">
          <code>{`<LiquidGlass
  width={2}
  height={1.5}
  borderRadius={0.3}
  preset="crystal"
  
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  
  initial={{ opacity: 0, scale: 0 }}
  onClick={() => console.log('clicked!')}
/>`}</code>
        </pre>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Built with React Three Fiber & drei</p>
      </footer>
    </div>
  )
}
