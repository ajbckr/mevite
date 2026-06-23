// Door icons for commitment states — same geometry as DoorSlider
// Angles: maybe=2, probably=20, definitely=42, locked-in=65, open-the-door=85

const ORANGE = "#E8470A";

// Miniature door SVG at a fixed angle — flat, single-color orange
function DoorAtAngle({ angle, size = 28, color = ORANGE }: { angle: number; size?: number; color?: string }) {
  // ViewBox: 0 0 40 48 — scaled door
  const FX = 6, FY = 2, FW = 28, FH = 42, FS = 3;
  const IX = FX + FS / 2;
  const IY = FY + FS / 2;
  const IW = FW - FS;
  const IH = FH - FS;
  const rad = (angle * Math.PI) / 180;
  const panelW = Math.max(0.5, IW * Math.cos(rad));
  const skew = Math.sin(rad) * 2;
  const floorY = FY + FH + FS / 2;
  const p = {
    tl: { x: IX,          y: IY },
    tr: { x: IX + panelW, y: IY + skew },
    br: { x: IX + panelW, y: IY + IH - skew },
    bl: { x: IX,          y: IY + IH },
  };
  const knobX = IX + panelW * 0.72;
  const knobY = IY + IH * 0.54 + skew * 0.72;
  const showKnob = panelW > 6;

  return (
    <svg width={size} height={size} viewBox="0 0 40 50" fill="none">
      {/* Light behind door */}
      {angle > 5 && (
        <rect x={IX + panelW} y={IY} width={Math.max(0, IW - panelW)} height={IH} fill={color} opacity={0.15} />
      )}
      {/* Panel */}
      <polygon
        points={`${p.tl.x},${p.tl.y} ${p.tr.x},${p.tr.y} ${p.br.x},${p.br.y} ${p.bl.x},${p.bl.y}`}
        fill={color}
      />
      {/* Knob */}
      {showKnob && <circle cx={knobX} cy={knobY} r={1.4} fill="white" opacity={0.9} />}
      {/* Frame */}
      <rect x={FX} y={FY} width={FW} height={FH} rx="1" fill="none" stroke={color} strokeWidth={FS} strokeLinejoin="miter" />
      {/* Floor slab */}
      <rect x={FX - 3} y={floorY} width={FW + 6} height={3} rx="1.5" fill={color} />
    </svg>
  );
}

const ANGLES: Record<string, number> = {
  "maybe":          2,
  "probably":       20,
  "definitely":     42,
  "locked-in":      65,
  "open-the-door":  85,
};

export function StatusIcon({ status, size = 28, color = ORANGE }: { status: string; size?: number; color?: string }) {
  const angle = ANGLES[status] ?? 42;
  return <DoorAtAngle angle={angle} size={size} color={color} />;
}

// Named exports kept for any direct imports
export const IconMaybe        = ({ size = 28, color = ORANGE }: { size?: number; color?: string }) => <DoorAtAngle angle={2}  size={size} color={color} />;
export const IconProbably     = ({ size = 28, color = ORANGE }: { size?: number; color?: string }) => <DoorAtAngle angle={20} size={size} color={color} />;
export const IconDefinitely   = ({ size = 28, color = ORANGE }: { size?: number; color?: string }) => <DoorAtAngle angle={42} size={size} color={color} />;
export const IconLockedIn     = ({ size = 28, color = ORANGE }: { size?: number; color?: string }) => <DoorAtAngle angle={65} size={size} color={color} />;
export const IconOpenTheDoor  = ({ size = 28, color = ORANGE }: { size?: number; color?: string }) => <DoorAtAngle angle={85} size={size} color={color} />;
