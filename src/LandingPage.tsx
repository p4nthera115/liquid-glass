import { Suspense, useState } from "react"
import { Canvas, extend } from "@react-three/fiber"
import {
  PerspectiveCamera,
  OrbitControls,
  VideoTexture,
} from "@react-three/drei"
import { Perf } from "r3f-perf"
import HeroSection from "./components/HeroSection"
import "./landing.css"
import { geometry } from "maath"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function LandingPage() {
  const [showPerf, setShowPerf] = useState(false)
  const [activeSection, setActiveSection] = useState<
    "hero" | "showcase" | "control-center"
  >("hero")

  return (
    <div className="landing-page">
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
          <color attach="background" args={["fff"]} />
          {/* <mesh position={[0, 0, -0.4]}>
            <roundedPlaneGeometry args={[1, 1, 0.5]} />
            <VideoTexture src="/wave.mp4">
              {(texture) => <meshBasicMaterial map={texture} />}
            </VideoTexture>
          </mesh> */}

          <PerspectiveCamera makeDefault position={[0, 0, 2.7]} fov={50} />
          {showPerf && <Perf position="bottom-left" />}

          <Suspense fallback={null}>
            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={10}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />

            {activeSection === "hero" && <HeroSection />}
          </Suspense>
        </Canvas>
      </div>

      {/* Section Info Overlay - simplified, titles now in 3D */}
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
