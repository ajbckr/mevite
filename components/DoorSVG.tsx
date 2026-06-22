"use client";

// 5 clean flat door states — frame fixed, panel rotates around left hinge
// Based on correct perspective: door panel foreshortens as it opens
// Simple, minimal, brand orange

interface DoorProps {
  state: 0 | 1 | 2 | 3 | 4; // 0=almost closed, 4=fully open
  active?: boolean;
  size?: number;
}

const ORANGE = "#E8470A";
const DARK = "#1a1a1a";

// Panel width as fraction of frame inner width, by state
// 0 = barely open (door nearly closed), 4 = fully open (panel very thin)
const PANEL_WIDTHS = [0.88, 0.70, 0.48, 0.24, 0.06];
// Light fill opacity behind open door
const LIGHT_OPACITY = [0, 0.08, 0.2, 0.38, 0.55];

export function DoorSVG({ state, active = false, size = 80 }: DoorProps) {
  const S = size;

  // Frame dimensions
  const frameStroke = S * 0.055;
  const fx = S * 0.12;          // frame left edge
  const fy = S * 0.05;          // frame top
  const fw = S * 0.76;          // frame width
  const fh = S * 0.82;          // frame height
  const floorY = fy + fh;       // bottom of frame

  // Inner opening (where door sits)
  const ix = fx + frameStroke / 2;
  const iy = fy + frameStroke / 2;
  const iw = fw - frameStroke;
  const ih = fh - frameStroke;

  // Hinge is on the LEFT inner edge
  const hingeX = ix;
  const hingeTopY = iy;
  const hingeBottomY = iy + ih;

  // Panel: perspective foreshorten based on state
  const panelW = iw * PANEL_WIDTHS[state];
  // Slight vertical skew for perspective (top edge shifts right more than bottom)
  const skew = panelW * 0.06;

  // Panel 4 corners (parallelogram in perspective)
  const panelPts = [
    { x: hingeX,           y: hingeTopY },           // top-left (hinge)
    { x: hingeX + panelW,  y: hingeTopY + skew },    // top-right
    { x: hingeX + panelW,  y: hingeBottomY - skew }, // bottom-right
    { x: hingeX,           y: hingeBottomY },          // bottom-left (hinge)
  ];
  const pts = panelPts.map(p => `${p.x},${p.y}`).join(" ");

  // Knob position
  const knobX = hingeX + panelW * 0.82;
  const knobY = hingeTopY + ih * 0.54;
  const showKnob = panelW > S * 0.1;

  // Light area (visible inner gap when door is open)
  const lightOpacity = LIGHT_OPACITY[state];

  // Base/floor slab
  const baseH = S * 0.055;
  const baseX = fx - S * 0.04;
  const baseW = fw + S * 0.08;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* Light behind open door */}
      {state > 0 && (
        <rect
          x={ix + panelW}
          y={iy}
          width={iw - panelW}
          height={ih}
          fill={ORANGE}
          opacity={lightOpacity}
        />
      )}

      {/* Door panel */}
      <polygon points={pts} fill={active ? ORANGE : "#CC3D09"} />

      {/* Panel inner detail — single raised rectangle, only when wide enough */}
      {panelW > S * 0.25 && (
        <polygon
          points={[
            { x: hingeX + panelW * 0.15, y: hingeTopY + ih * 0.1 + skew * 0.15 },
            { x: hingeX + panelW * 0.88, y: hingeTopY + ih * 0.1 + skew * 0.88 },
            { x: hingeX + panelW * 0.88, y: hingeBottomY - ih * 0.08 - skew * 0.88 },
            { x: hingeX + panelW * 0.15, y: hingeBottomY - ih * 0.08 - skew * 0.15 },
          ].map(p => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1.2}
        />
      )}

      {/* Knob */}
      {showKnob && (
        <circle cx={knobX} cy={knobY} r={S * 0.028} fill="white" opacity={0.85} />
      )}

      {/* Door frame — drawn on top so it overlaps panel edges */}
      <rect
        x={fx} y={fy}
        width={fw} height={fh}
        fill="none"
        stroke={DARK}
        strokeWidth={frameStroke}
        strokeLinejoin="round"
      />

      {/* Base / floor slab */}
      <rect x={baseX} y={floorY} width={baseW} height={baseH} fill={DARK} rx={S * 0.015} />

    </svg>
  );
}
