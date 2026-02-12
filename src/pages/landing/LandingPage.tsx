import { Suspense, useEffect, useMemo, useRef } from "react"
import { Canvas, extend } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei"
import { Perf } from "r3f-perf"
import HeroSection from "./sections/HeroSection"
import "./landing.css"
import { geometry } from "maath"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export type ScrollState = { progress: number }

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollState = useMemo<ScrollState>(() => ({ progress: 0 }), [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight
      scrollState.progress = maxScroll > 0 ? el.scrollTop / maxScroll : 0
    }

    // scroll-content has pointer-events: none so R3F panels stay interactive.
    // That means wheel events hit the canvas and never reach the scroll container,
    // so we capture them at the window level and scroll programmatically.
    const handleWheel = (e: WheelEvent) => {
      el.scrollTop += e.deltaY
      e.preventDefault()
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      el.removeEventListener("scroll", handleScroll)
      window.removeEventListener("wheel", handleWheel)
    }
  }, [scrollState])

  return (
    <div ref={scrollRef} className="landing-page">
      {/* 3D Canvas - fixed in viewport */}
      <div className="landing-canvas">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={["fff"]} />

          <PerspectiveCamera makeDefault position={[0, 0, 2.7]} fov={50} />
          <Perf position="bottom-left" />

          <Suspense fallback={null}>
            <OrbitControls
              enableRotate={false}
              enableZoom={false}
              enablePan={false}
              minDistance={2}
              maxDistance={10}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Suspense>
          <HeroSection scrollState={scrollState} />
        </Canvas>
      </div>

      {/* Scrollable content overlay */}
      <div className="scroll-content">
        {/* Hero spacer - pointer-events: none lets clicks through to canvas */}
        <section className="hero-spacer">
          <div className="hero-hints">
            <div className="border border-black/30 rounded-sm px-6 py-2 text-black">
              <pre>npm install @liquid-glass/react</pre>
            </div>
            <div className="flex gap-4 font-semibold text-xs text-black/35 text-center justify-center items-center">
              <span>Scroll</span>
              <span>Click centre panel</span>
            </div>
          </div>
        </section>

        {/* Info section - content placeholder */}
        <section className="info-section">
          {/* Content will go here */}
        </section>
      </div>
    </div>
  )
}
