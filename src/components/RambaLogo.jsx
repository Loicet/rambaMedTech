export default function RambaLogo({ size = 28, leafColor = '#047857', crossColor = '#ffffff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Leaf shape */}
      <path
        d="M16 3C16 3 5 8 5 18C5 23.5 10 28 16 28C22 28 27 23.5 27 18C27 8 16 3 16 3Z"
        fill={leafColor}
      />
      {/* Leaf vein */}
      <path
        d="M16 28C16 28 16 14 16 3"
        stroke={crossColor}
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeLinecap="round"
      />
      {/* Medical cross — horizontal bar */}
      <rect x="12" y="15" width="8" height="2.5" rx="1.25" fill={crossColor} />
      {/* Medical cross — vertical bar */}
      <rect x="14.75" y="12" width="2.5" height="8" rx="1.25" fill={crossColor} />
    </svg>
  );
}
