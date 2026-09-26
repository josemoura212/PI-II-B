interface IconProps {
  size?: number;
  color?: string;
}

function base(size: number) {
  return { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
}

export function HomeIcon({ size = 28 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function HistoryIcon({ size = 28 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function UserIcon({ size = 28 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5a6 6 0 0 1 11 0" />
    </svg>
  );
}

export function LogoutIcon({ size = 26 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5" />
      <path d="M15 8l4 4-4 4" />
      <path d="M19 12H9" />
    </svg>
  );
}

export function ChevronIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function BodyIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v7" />
      <path d="M7 9l5-2 5 2" />
      <path d="M9 21l3-8 3 8" />
    </svg>
  );
}

export function SeriesIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M6 4v16" />
      <path d="M18 4v16" />
      <rect x="3" y="8" width="3" height="8" />
      <rect x="18" y="8" width="3" height="8" />
      <path d="M6 12h12" />
    </svg>
  );
}

export function RepeatIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function BarbellIcon({ size = 40, color = '#8a74f1' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M5 20h30" />
      <rect x="8" y="12" width="4" height="16" rx="1" fill={color} />
      <rect x="28" y="12" width="4" height="16" rx="1" fill={color} />
      <rect x="3" y="15" width="3" height="10" rx="1" fill={color} />
      <rect x="34" y="15" width="3" height="10" rx="1" fill={color} />
    </svg>
  );
}
