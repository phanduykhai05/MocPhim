import * as React from "react"
import { createMap } from "svg-dotted-map"

import { cn } from "@/lib/utils"

export interface Marker {
  lat: number
  lng: number
  size?: number
  pulse?: boolean
}

/** addMarkers returns markers with lat/lng removed; only x, y and other props (e.g. size) remain */
type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
  x: number
  y: number
}

export interface Connection {
  from: number
  to: number
  color?: string
  packetColor?: string
  dashArray?: string
  duration?: number
  delay?: number
  curve?: number
}

export interface Viewport {
  x: number
  y: number
  width: number
  height: number
}

export interface MapRegion {
  lat: { min: number; max: number }
  lng: { min: number; max: number }
}

export interface DottedMapProps<
  M extends Marker = Marker,
> extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  mapSamples?: number
  markers?: M[]
  dotColor?: string
  markerColor?: string
  dotRadius?: number
  stagger?: boolean
  pulse?: boolean
  connections?: Connection[]
  /** Filter to specific countries by ISO-3166-1 alpha-3 code (e.g. ["VNM"]) */
  countries?: string[]
  /** Crop the sampling area to a geographic bounding box */
  region?: MapRegion
  /** Crop SVG to this sub-region of the internal coordinate space. Dots outside are omitted. */
  viewport?: Viewport

  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>
    index: number
    x: number
    y: number
    r: number
  }) => React.ReactNode
}

export function DottedMap<M extends Marker = Marker>({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  dotColor = "currentColor",
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  connections = [],
  countries,
  region,
  viewport,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}: DottedMapProps<M>) {
  const { points, addMarkers } = createMap({
    width,
    height,
    mapSamples,
    countries,
    region,
  })
  const processedMarkers = addMarkers(markers)

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x)
    const rowMap = new Map<number, number>()
    let step = 0
    let prevY = Number.NaN
    let prevXInRow = Number.NaN

    for (const p of sorted) {
      if (p.y !== prevY) {
        prevY = p.y
        prevXInRow = Number.NaN
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size)
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta)
      }
      prevXInRow = p.x
    }

    return { xStep: step || 1, yToRowIndex: rowMap }
  }, [points])

  // Filter dots to viewport when provided (avoids putting thousands of off-screen circles in the DOM)
  const visiblePoints = React.useMemo(() => {
    if (!viewport) return points
    const pad = dotRadius + 0.5
    return points.filter((p) => {
      const rowIndex = yToRowIndex.get(p.y) ?? 0
      const px = p.x + (stagger && rowIndex % 2 === 1 ? xStep / 2 : 0)
      return (
        px >= viewport.x - pad &&
        px <= viewport.x + viewport.width + pad &&
        p.y >= viewport.y - pad &&
        p.y <= viewport.y + viewport.height + pad
      )
    })
  }, [points, viewport, yToRowIndex, stagger, xStep, dotRadius])

  const svgViewBox = viewport
    ? `${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`
    : `0 0 ${width} ${height}`

  return (
    <svg
      viewBox={svgViewBox}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      {visiblePoints.map((point, index) => {
        const rowIndex = yToRowIndex.get(point.y) ?? 0
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0
        return (
          <circle
            cx={point.x + offsetX}
            cy={point.y}
            r={dotRadius}
            fill={dotColor}
            key={`${point.x}-${point.y}-${index}`}
          />
        )
      })}

      {connections.map(({ from, to, color = '#22c55e', packetColor, dashArray = '2 1.5', duration = 1.5, delay = 0, curve = 0.25 }, i) => {
        const m1 = processedMarkers[from]
        const m2 = processedMarkers[to]
        if (!m1 || !m2) return null

        const r1 = yToRowIndex.get(m1.y) ?? 0
        const r2 = yToRowIndex.get(m2.y) ?? 0
        const x1 = m1.x + (stagger && r1 % 2 === 1 ? xStep / 2 : 0)
        const y1 = m1.y
        const x2 = m2.x + (stagger && r2 % 2 === 1 ? xStep / 2 : 0)
        const y2 = m2.y

        const dx = x2 - x1
        const dy = y2 - y1
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const cvx = (x1 + x2) / 2 - (dy / len) * len * curve
        const cvy = (y1 + y2) / 2 + (dx / len) * len * curve
        const d = `M ${x1} ${y1} Q ${cvx} ${cvy} ${x2} ${y2}`
        const parts = dashArray.split(' ').map(Number)
        const period = (parts[0] || 2) + (parts[1] || 1.5)
        const pathId = `conn-path-${i}`

        return (
          <g key={`conn-${i}`}>
            <path id={pathId} d={d} fill="none" stroke={color} strokeWidth={0.18} strokeOpacity={0.15} />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={0.28}
              strokeOpacity={0.85}
              strokeDasharray={dashArray}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to={String(-period)}
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </path>
            <circle r={0.5} fill={packetColor ?? color}>
              <animateMotion
                dur={`${duration * 2.5}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.05;0.92;1"
                dur={`${duration * 2.5}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )
      })}

      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0

        const x = marker.x + offsetX
        const y = marker.y
        const r = marker.size ?? dotRadius
        const shouldPulse = pulse
          ? marker.pulse !== false
          : marker.pulse === true
        const pulseTo = r * 2.8

        return (
          <g key={`${marker.x}-${marker.y}-${index}`}>
            <circle cx={x} cy={y} r={r} fill={markerColor} />

            {shouldPulse ? (
              <g pointerEvents="none">
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={1}
                  strokeWidth={0.35}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={0.9}
                  strokeWidth={0.3}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0"
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ) : null}

            {renderMarkerOverlay?.({
              marker: { ...marker, x, y },
              index,
              x,
              y,
              r,
            })}
          </g>
        )
      })}
    </svg>
  )
}
