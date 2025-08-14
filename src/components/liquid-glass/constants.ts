import * as THREE from "three"

export const DEFAULT_PROPS = {
  width: 1,
  height: 1,
  borderRadius: 0.2,
  borderSmoothness: 30,
  position: [0, 0, 0] as [number, number, number],
  transmission: 1,
  roughness: 0,
  ior: 2.5,
  chromaticAberration: 0,
  anisotropicBlur: 0,
  blur: 1000,
  color: new THREE.Color(1, 1, 1),
  thickness: 0.35,
  wireframe: false,
  springStrength: 15,
  damping: 0.8,
  animationThreshold: 0.001,
  extrudeSettings: {
    depth: 0,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.03,
    bevelSegments: 50,
  },
}

export const DEFAULT_ANIMATIONS = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
  whileActive: { scale: 1.1 },
  whileDisabled: { scale: 0.9, opacity: 0.5 },
}
