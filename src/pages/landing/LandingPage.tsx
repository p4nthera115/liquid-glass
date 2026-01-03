import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei"
import { Perf } from "r3f-perf"
import HeroSection from "./sections/HeroSection"
import ShowcaseSection from "./sections/ShowcaseSection"
import ControlCenterExample from "./sections/ControlCenterExample"
import GradientShader from "./components/GradientShader"
import "./landing.css"

// Color themes for different sections
const shaderThemes = {
  hero: {
    color1: "#f8fafc",
    color2: "#e0e7ff",
    color3: "#c7d2fe",
    color4: "#ddd6fe",
    color5: "#fbcfe8",
  },
  showcase: {
    color1: "#faf5ff",
    color2: "#f3e8ff",
    color3: "#e9d5ff",
    color4: "#d8b4fe",
    color5: "#c4b5fd",
  },
  "control-center": {
    color1: "#0f172a",
    color2: "#1e1b4b",
    color3: "#312e81",
    color4: "#3730a3",
    color5: "#4338ca",
  },
}

export default function LandingPage() {
  const [showPerf, setShowPerf] = useState(false)
  const [activeSection, setActiveSection] = useState<
    "hero" | "showcase" | "control-center"
  >("hero")

  const isDarkTheme = activeSection === "control-center"

  return (
    <div className={`landing-page ${isDarkTheme ? "dark" : "light"}`}>
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-icon">◆</span>
          <span className="brand-text">Liquid Glass</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${activeSection === "hero" ? "active" : ""}`}
            onClick={() => setActiveSection("hero")}
          >
            Overview
          </button>
          <button
            className={`nav-link ${
              activeSection === "showcase" ? "active" : ""
            }`}
            onClick={() => setActiveSection("showcase")}
          >
            Showcase
          </button>
          <button
            className={`nav-link ${
              activeSection === "control-center" ? "active" : ""
            }`}
            onClick={() => setActiveSection("control-center")}
          >
            Control Center
          </button>
        </div>
        <button
          className="perf-toggle"
          onClick={() => setShowPerf(!showPerf)}
          title="Toggle Performance Monitor"
        >
          {showPerf ? "Hide Stats" : "Show Stats"}
        </button>
      </nav>

      {/* 3D Canvas */}
      <div className="landing-canvas">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          {showPerf && <Perf position="bottom-left" />}

          {/* Animated Gradient Background Shader */}
          <GradientShader colors={shaderThemes[activeSection]} />

          <Suspense fallback={null}>
            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={10}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />

            {activeSection === "hero" && <HeroSection />}
            {activeSection === "showcase" && <ShowcaseSection />}
            {activeSection === "control-center" && <ControlCenterExample />}
          </Suspense>
        </Canvas>
      </div>

      {/* Section Info Overlay */}
      <div className="section-info">
        {activeSection === "hero" && (
          <>
            <p className="section-subtitle">
              A React Three Fiber component for creating Apple-style liquid
              glass effects in 3D
            </p>
            <div className="feature-list">
              <span className="feature">✓ Spring Animations</span>
              <span className="feature">✓ Transmission Materials</span>
              <span className="feature">✓ Interactive States</span>
              <span className="feature">✓ Performance Optimized</span>
            </div>
          </>
        )}
        {activeSection === "showcase" && (
          <p className="section-subtitle">
            Hover and click the glass panels to see spring-based animations
          </p>
        )}
        {activeSection === "control-center" && (
          <p className="section-subtitle">
            A creative real-world example inspired by Apple's Control Center in
            3D
          </p>
        )}
      </div>

      {/* Interaction hints */}
      <div className="interaction-hint">
        <span>🖱️ Drag to orbit</span>
        <span>⬆️ Scroll to zoom</span>
        <span>👆 Click panels</span>
      </div>
    </div>
  )
}
