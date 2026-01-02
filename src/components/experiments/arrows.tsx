import { LiquidGlass } from "../liquid-glass"
import { VideoTexture, Html } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { geometry } from "maath"
import { Color } from "three"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function Arrows() {
  return (
    <>
      {/* Video */}
      <mesh position={[0, 0, -0.4]}>
        <roundedPlaneGeometry args={[1, 1, 0.5]} />
        <VideoTexture src="/wave.mp4">
          {(texture) => <meshBasicMaterial map={texture} />}
        </VideoTexture>
      </mesh>

      <directionalLight
        color={0xffffff}
        intensity={3}
        position={[0.2, 0.2, 0.8]}
      />

      <LiquidGlass
        position={[0, 0, 0.2]}
        width={0.8}
        height={0.8}
        borderRadius={0.5}
        color={new Color(1.5, 1.5, 1.5)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ z: 0.15 }}
        ior={3}
        thickness={1}
        roughness={0}
        borderSmoothness={60}
        extrudeSettings={{
          depth: 0,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.05,
          bevelSegments: 30,
        }}
      />
    </>
  )
}

;<Html>
  <div
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      fontSize: "2rem",
      transform: "translateX(-50%) translateY(-45%)",
      borderRadius: "3rem",
      padding: "1rem 0",
      // gap: "4rem",
      border: "1px solid #eee",
      boxShadow: "0 10px 1rem 0 rgba(0, 0, 0, 0.3)",
      zIndex: 100,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20rem",
        height: "10rem",
        padding: "4rem 3rem 2rem 3rem",
        // margin: "0 0 1rem 0",
        transform: "translateY(-10px)",
        zIndex: 100,
      }}
    >
      <FaChevronLeft className="arrows" />
      <FaChevronRight className="arrows" />
    </div>
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        justifyContent: "center",
        alignItems: "center",
        height: "2rem",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "0.5rem",
          width: "0.5rem",
          borderRadius: "100%",
          backgroundColor: "#000",
          scale: 1.05,
        }}
      ></div>
      <div
        style={{
          height: "0.5rem",
          width: "0.5rem",
          borderRadius: "100%",
          backgroundColor: "#aaa",
        }}
      ></div>
      <div
        style={{
          height: "0.5rem",
          width: "0.5rem",
          borderRadius: "100%",
          backgroundColor: "#aaa",
        }}
      ></div>
    </div>
  </div>
  {/* <div
  style={{
    position: "absolute",
    height: "16rem",
    width: "60rem",
    transform: "translateX(-50%) translateY(-175%)",
    background:
      "linear-gradient(to right, #fff 0%, rgba(0, 0, 0, 0) 40% 60%, #fff 100%)",
    // border: "1px solid red",
  }}
></div> */}
</Html>
