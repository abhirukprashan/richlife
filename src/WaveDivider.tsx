import type { CSSProperties } from "react"

// A drifting milk wave on the top edge of a section, filled with the
// previous section's colour and hanging down, so sections flow into each
// other without anything overflowing.
const PATH =
  "M0 0 H2400 V30 Q2250 60 2100 30 T1800 30 T1500 30 T1200 30 T900 30 T600 30 T300 30 T0 30 Z"

export default function WaveDivider({
  color,
  back,
}: {
  color: string
  // Optional softer second wave behind, for a milky depth.
  back?: string
}) {
  return (
    <div
      aria-hidden="true"
      className="wave-divider"
      style={{ "--wave": color } as CSSProperties}
    >
      {back && (
        <div className="wave-divider-layer is-back" style={{ fill: back }}>
          <svg preserveAspectRatio="none" viewBox="0 0 2400 60">
            <path d={PATH} />
          </svg>
        </div>
      )}
      <div className="wave-divider-layer" style={{ fill: color }}>
        <svg preserveAspectRatio="none" viewBox="0 0 2400 60">
          <path d={PATH} />
        </svg>
      </div>
    </div>
  )
}
