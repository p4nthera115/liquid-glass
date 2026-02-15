import { MATERIAL_PRESETS } from "../../../components/liquid-glass/constants"
import type { MaterialPreset } from "../../../components/liquid-glass/constants"
import type { PanelProps } from "./panel-types"

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function SliderRow({ label, value, min, max, step, onChange }: SliderRowProps) {
  return (
    <div className="control-row">
      <div className="control-label">
        <span>{label}</span>
        <span className="control-value">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

interface ControlPanelProps {
  panelProps: PanelProps
  onChange: (props: PanelProps) => void
  visible: boolean
}

export default function ControlPanel({
  panelProps,
  onChange,
  visible,
}: ControlPanelProps) {
  const update = (key: keyof PanelProps, value: number | string) => {
    onChange({ ...panelProps, [key]: value })
  }

  const applyPreset = (preset: MaterialPreset) => {
    const values = MATERIAL_PRESETS[preset]
    onChange({
      ...panelProps,
      transmission: values.transmission,
      roughness: values.roughness,
      ior: values.ior,
      chromaticAberration: values.chromaticAberration,
      thickness: values.thickness,
      anisotropicBlur: "anisotropicBlur" in values ? values.anisotropicBlur : 0,
    })
  }

  return (
    <div className={`control-panel ${visible ? "visible" : ""}`}>
      <div className="control-panel-header">Customize</div>

      <div className="control-presets">
        {(Object.keys(MATERIAL_PRESETS) as MaterialPreset[]).map((preset) => (
          <button
            key={preset}
            className="preset-button"
            onClick={() => applyPreset(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="control-section">
        <div className="control-section-label">Geometry</div>
        <SliderRow
          label="Width"
          value={panelProps.width}
          min={0.5}
          max={1.5}
          step={0.01}
          onChange={(v) => update("width", v)}
        />
        <SliderRow
          label="Height"
          value={panelProps.height}
          min={0.5}
          max={2}
          step={0.01}
          onChange={(v) => update("height", v)}
        />
        <SliderRow
          label="Border Radius"
          value={panelProps.borderRadius}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => update("borderRadius", v)}
        />
      </div>

      <div className="control-section">
        <div className="control-section-label">Material</div>

        <div className="control-row">
          <div className="control-label">
            <span>Color</span>
          </div>
          <input
            type="color"
            value={panelProps.color}
            onChange={(e) => update("color", e.target.value)}
            className="control-color"
          />
        </div>

        <SliderRow
          label="Transmission"
          value={panelProps.transmission}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => update("transmission", v)}
        />
        <SliderRow
          label="Roughness"
          value={panelProps.roughness}
          min={0}
          max={0.5}
          step={0.01}
          onChange={(v) => update("roughness", v)}
        />
        <SliderRow
          label="Thickness"
          value={panelProps.thickness}
          min={0}
          max={5}
          step={0.01}
          onChange={(v) => update("thickness", v)}
        />
        <SliderRow
          label="IOR"
          value={panelProps.ior}
          min={1}
          max={3}
          step={0.01}
          onChange={(v) => update("ior", v)}
        />
        <SliderRow
          label="Chromatic Aberration"
          value={panelProps.chromaticAberration}
          min={0}
          max={10}
          step={0.001}
          onChange={(v) => update("chromaticAberration", v)}
        />
        <SliderRow
          label="Anisotropic Blur"
          value={panelProps.anisotropicBlur}
          min={0}
          max={10}
          step={0.01}
          onChange={(v) => update("anisotropicBlur", v)}
        />
      </div>
    </div>
  )
}
