export interface PanelProps {
  color: string
  transmission: number
  roughness: number
  ior: number
  chromaticAberration: number
  thickness: number
  anisotropicBlur: number
  borderRadius: number
  width: number
  height: number
}

export const DEFAULT_PANEL_PROPS: PanelProps = {
  color: "#ffffff",
  transmission: 1,
  roughness: 0,
  ior: 2,
  chromaticAberration: 0.03,
  thickness: 0.8,
  anisotropicBlur: 0,
  borderRadius: 0.2,
  width: 1.5,
  height: 1.8,
}
