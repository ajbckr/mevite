// Flat SVG icons for arrival statuses — branded orange, matches mockup style
export function IconMaybe({ size = 28, color = "#E8470A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="6" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M14 16v2" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M10 7.5C10.8 5.8 12.3 5 14 5c2.2 0 4 1.8 4 4 0 1.8-1 3-2.5 3.8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="14" cy="20" r="1.2" fill={color}/>
      <path d="M9 24h10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 21.5l-2 2.5M17 21.5l2 2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconProbably({ size = 28, color = "#E8470A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="5" y="7" width="18" height="16" rx="2" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M5 11h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 4v4M19 4v4" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M9 15h3M9 19h3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 17l1.5 1.5L20 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconDefinitely({ size = 28, color = "#E8470A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Backpack */}
      <rect x="7" y="10" width="14" height="13" rx="3" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M10 10V8a4 4 0 018 0v2" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M7 14h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 17h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="14" cy="10" r="1.5" fill={color}/>
    </svg>
  );
}

export function IconOnMyWay({ size = 28, color = "#E8470A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Car */}
      <rect x="3" y="13" width="22" height="9" rx="2" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M7 13l2.5-5h9l2.5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="8" cy="22" r="2.5" fill="white" stroke={color} strokeWidth="2"/>
      <circle cx="20" cy="22" r="2.5" fill="white" stroke={color} strokeWidth="2"/>
      <path d="M12 16h4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconOpenDoor({ size = 28, color = "#E8470A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Door frame */}
      <path d="M5 24V5h18v19" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M5 24h18" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      {/* Door open - perspective */}
      <path d="M14 6l6 2v14l-6-2V6z" fill={color} opacity="0.15"/>
      <path d="M14 6l6 2v14l-6-2V6z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
      {/* Knob */}
      <circle cx="18.5" cy="14" r="1.2" fill={color}/>
    </svg>
  );
}

export function StatusIcon({ status, size = 28, color = "#E8470A" }: { status: string; size?: number; color?: string }) {
  switch (status) {
    case "maybe":         return <IconMaybe size={size} color={color} />;
    case "probably":      return <IconProbably size={size} color={color} />;
    case "definitely":    return <IconDefinitely size={size} color={color} />;
    case "on-my-way":     return <IconOnMyWay size={size} color={color} />;
    case "open-the-door": return <IconOpenDoor size={size} color={color} />;
    default:              return null;
  }
}
