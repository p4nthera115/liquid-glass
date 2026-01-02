import { Canvas } from "@react-three/fiber"
import { 
  OrbitControls, 
  Environment, 
  Float,
  Text,
  Html,
} from "@react-three/drei"
import { Suspense, useState } from "react"
import { LiquidGlass, MATERIAL_PRESETS, TRANSITION_PRESETS } from "../liquid-glass"
import { Color } from "three"
import "./landing.css"

/**
 * Hero Section - Main showcase with animated glass panels
 */
function HeroScene() {
  const [activePreset, setActivePreset] = useState<"glass" | "crystal" | "frosted" | "diamond">("crystal")
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4a9eff" />
      
      {/* Main hero glass panel */}
      <Float
        speed={2}
        rotationIntensity={0.3}
        floatIntensity={0.5}
      >
        <LiquidGlass
          position={[0, 0.3, 0]}
          width={2.5}
          height={2.5}
          borderRadius={0.6}
          borderSmoothness={40}
          preset={activePreset}
          initial={{ scale: 0, opacity: 0, rotateY: -0.5 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          whileHover={{ scale: 1.03, rotateY: 0.05 }}
          whileTap={{ scale: 0.98 }}
          transition={TRANSITION_PRESETS.smooth}
          onClick={() => {
            const presets: ("glass" | "crystal" | "frosted" | "diamond")[] = ["glass", "crystal", "frosted", "diamond"]
            const currentIndex = presets.indexOf(activePreset)
            setActivePreset(presets[(currentIndex + 1) % presets.length])
          }}
        />
      </Float>

      {/* Floating accent panels */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.3}>
        <LiquidGlass
          position={[-1.8, -0.8, -0.5]}
          width={0.8}
          height={0.8}
          borderRadius={0.5}
          preset="water"
          initial={{ scale: 0, x: -3 }}
          animate={{ scale: 1, x: -1.8 }}
          whileHover={{ scale: 1.1, rotateZ: 0.1 }}
          transition={{ ...TRANSITION_PRESETS.bouncy, stiffness: 12 }}
        />
      </Float>

      <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <LiquidGlass
          position={[2, 1, -0.3]}
          width={0.6}
          height={0.6}
          borderRadius={0.3}
          preset="ice"
          initial={{ scale: 0, y: 3 }}
          animate={{ scale: 1, y: 1 }}
          whileHover={{ scale: 1.15 }}
          transition={TRANSITION_PRESETS.bouncy}
        />
      </Float>

      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>
        <LiquidGlass
          position={[1.5, -1.2, 0.2]}
          width={1}
          height={0.5}
          borderRadius={0.25}
          preset="plastic"
          color={new Color(0.95, 0.85, 1)}
          initial={{ scale: 0, rotateZ: 0.5 }}
          animate={{ scale: 1, rotateZ: 0 }}
          whileHover={{ scaleX: 1.1 }}
          transition={TRANSITION_PRESETS.smooth}
        />
      </Float>

      {/* Environment for reflections */}
      <Environment preset="city" />
    </>
  )
}

/**
 * Presets showcase section
 */
function PresetsShowcase() {
  const presets = Object.keys(MATERIAL_PRESETS) as (keyof typeof MATERIAL_PRESETS)[]
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} />
      
      {presets.map((preset, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = (col - 1.5) * 1.3
        const y = -row * 1.3 + 0.5
        
        return (
          <group key={preset} position={[x, y, 0]}>
            <Float speed={2 + i * 0.2} floatIntensity={0.2}>
              <LiquidGlass
                width={1}
                height={1}
                borderRadius={0.3}
                preset={preset}
                initial={{ scale: 0, rotateY: Math.PI }}
                animate={{ scale: 1, rotateY: 0 }}
                whileHover={{ scale: 1.1, z: 0.3 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  ...TRANSITION_PRESETS.bouncy,
                  stiffness: 15 + i * 2,
                }}
              />
            </Float>
            <Text
              position={[0, -0.7, 0]}
              fontSize={0.12}
              color="#334155"
              anchorX="center"
              anchorY="top"
              font="/fonts/GeistMono-Medium.woff"
            >
              {preset}
            </Text>
          </group>
        )
      })}
      
      <Environment preset="apartment" />
    </>
  )
}

/**
 * Interactive demo section
 */
function InteractiveDemo() {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 3]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#ff6b6b" />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#4ecdc4" />
      
      {/* Counter button */}
      <group position={[-1.5, 0.5, 0]}>
        <Float speed={2} floatIntensity={0.15}>
          <LiquidGlass
            width={1.2}
            height={1.2}
            borderRadius={0.6}
            preset="crystal"
            color={new Color(1, 0.95, 0.9)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, scaleZ: 0.8 }}
            onClick={() => setCount(c => c + 1)}
            transition={TRANSITION_PRESETS.snappy}
          />
        </Float>
        <Html center position={[0, 0, 0.1]}>
          <div className="demo-label">
            <span className="demo-count">{count}</span>
            <span className="demo-text">clicks</span>
          </div>
        </Html>
      </group>

      {/* Toggle button */}
      <group position={[0, 0.5, 0]}>
        <Float speed={2.2} floatIntensity={0.15}>
          <LiquidGlass
            width={1.2}
            height={1.2}
            borderRadius={0.3}
            preset="glass"
            color={isActive ? new Color(0.8, 1, 0.85) : new Color(1, 1, 1)}
            active={isActive}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            whileActive={{ scale: 1.1, rotateZ: 0.05 }}
            onToggle={setIsActive}
            transition={TRANSITION_PRESETS.bouncy}
          />
        </Float>
        <Html center position={[0, 0, 0.1]}>
          <div className="demo-label">
            <span className="demo-status">{isActive ? "ON" : "OFF"}</span>
            <span className="demo-text">toggle</span>
          </div>
        </Html>
      </group>

      {/* Disabled button */}
      <group position={[1.5, 0.5, 0]}>
        <Float speed={1.8} floatIntensity={0.1}>
          <LiquidGlass
            width={1.2}
            height={1.2}
            borderRadius={0.2}
            preset="frosted"
            disabled
            whileDisabled={{ scale: 0.95, opacity: 0.5 }}
          />
        </Float>
        <Html center position={[0, 0, 0.1]}>
          <div className="demo-label demo-disabled">
            <span className="demo-text">disabled</span>
          </div>
        </Html>
      </group>

      {/* Animation showcase */}
      <group position={[0, -1.2, 0]}>
        <LiquidGlass
          width={4}
          height={0.8}
          borderRadius={0.4}
          preset="water"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          whileHover={{ scaleY: 1.2 }}
          transition={TRANSITION_PRESETS.slow}
        />
        <Html center position={[0, 0, 0.1]}>
          <div className="demo-bar-label">
            Hover to expand
          </div>
        </Html>
      </group>
      
      <Environment preset="sunset" />
    </>
  )
}

/**
 * Animation curves showcase
 */
function AnimationShowcase() {
  const transitions = [
    { name: "snappy", preset: TRANSITION_PRESETS.snappy },
    { name: "smooth", preset: TRANSITION_PRESETS.smooth },
    { name: "bouncy", preset: TRANSITION_PRESETS.bouncy },
    { name: "slow", preset: TRANSITION_PRESETS.slow },
  ]
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      
      {transitions.map((t, i) => (
        <group key={t.name} position={[(i - 1.5) * 1.4, 0, 0]}>
          <Float speed={2} floatIntensity={0.1}>
            <LiquidGlass
              width={1}
              height={1.5}
              borderRadius={0.3}
              preset="crystal"
              color={new Color(0.9 + i * 0.03, 0.95, 1)}
              whileHover={{ scale: 1.15, rotateZ: 0.1 }}
              whileTap={{ scale: 0.85 }}
              transition={t.preset}
            />
          </Float>
          <Text
            position={[0, -1, 0]}
            fontSize={0.14}
            color="#475569"
            anchorX="center"
            anchorY="top"
            font="/fonts/GeistMono-Medium.woff"
          >
            {t.name}
          </Text>
        </group>
      ))}
      
      <Environment preset="dawn" />
    </>
  )
}

/**
 * Section wrapper component
 */
function Section({ 
  id, 
  title, 
  subtitle,
  children,
  dark = false,
}: { 
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <section id={id} className={`section ${dark ? "section-dark" : ""}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      <div className="section-canvas">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Canvas>
      </div>
    </section>
  )
}

/**
 * Landing Page Component
 */
export default function LandingPage() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <span className="nav-logo">◇</span>
          <span className="nav-title">Liquid Glass</span>
        </div>
        <div className="nav-links">
          <a href="#presets">Presets</a>
          <a href="#interactive">Interactive</a>
          <a href="#animations">Animations</a>
          <a href="https://github.com" target="_blank" rel="noopener" className="nav-github">
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Liquid<span className="hero-accent">Glass</span>
          </h1>
          <p className="hero-subtitle">
            Beautiful, interactive glass-effect components for React Three Fiber.
            <br />
            Spring-based animations. Material presets. Fully accessible.
          </p>
          <div className="hero-actions">
            <a href="#interactive" className="btn btn-primary">
              Try It Out
            </a>
            <a href="#presets" className="btn btn-secondary">
              View Presets
            </a>
          </div>
          <div className="hero-hint">
            <span>Click the glass to change presets</span>
          </div>
        </div>
        <div className="hero-canvas">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </div>
      </header>

      {/* Features strip */}
      <div className="features-strip">
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span className="feature-text">Spring Physics</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🎨</span>
          <span className="feature-text">7 Material Presets</span>
        </div>
        <div className="feature">
          <span className="feature-icon">✨</span>
          <span className="feature-text">Interactive States</span>
        </div>
        <div className="feature">
          <span className="feature-icon">♿</span>
          <span className="feature-text">Accessible</span>
        </div>
      </div>

      {/* Presets Section */}
      <Section 
        id="presets" 
        title="Material Presets"
        subtitle="Seven beautiful presets for common glass effects"
      >
        <PresetsShowcase />
      </Section>

      {/* Interactive Section */}
      <Section 
        id="interactive" 
        title="Interactive States"
        subtitle="Hover, tap, toggle, and disabled states with callbacks"
        dark
      >
        <InteractiveDemo />
      </Section>

      {/* Animations Section */}
      <Section 
        id="animations" 
        title="Animation Presets"
        subtitle="Four transition presets for different feels"
      >
        <AnimationShowcase />
      </Section>

      {/* Code example */}
      <section className="code-section">
        <h2 className="section-title">Simple to Use</h2>
        <pre className="code-block">
          <code>{`import { LiquidGlass } from 'liquid-glass'

<LiquidGlass
  width={2}
  height={1.5}
  borderRadius={0.3}
  preset="crystal"
  
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  
  onClick={() => console.log('clicked!')}
/>`}</code>
        </pre>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-brand">
            <span className="nav-logo">◇</span> Liquid Glass
          </p>
          <p className="footer-copy">
            Built with React Three Fiber & drei
          </p>
        </div>
      </footer>
    </div>
  )
}

