import { useId, useRef } from 'react';
import { m } from 'framer-motion';
import { useLoop } from '../../hooks/useLoop';

/**
 * Stippled clouds (after the Meco hero): a soft white body with a blue dot
 * texture that thickens towards the fringe. Pure static SVG drifted by a
 * compositor-only transform; hidden on phones, idle drift pauses off-screen
 * and on the lite tier.
 */
const PUFFS: [number, number, number][] = [
  [78, 112, 40], [118, 90, 50], [172, 72, 60], [230, 90, 50], [272, 112, 36], [140, 120, 40], [205, 122, 40], [104, 124, 32],
];

function Cloud({ className, width, drift, duration }: { className: string; width: number; drift: number; duration: number }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const loop = useLoop(ref);
  return (
    <m.div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute hidden sm:block ${className}`}
      style={{ width }}
      animate={loop ? { x: [0, drift, 0] } : undefined}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 340 170" className="h-auto w-full text-[#6f9fd0] dark:text-[#3a5f92]">
        <defs>
          <pattern id={`${id}d`} width="3.4" height="3.4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.72" fill="currentColor" />
          </pattern>
          {/* body: solid core, soft edge */}
          <radialGradient id={`${id}b`}>
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          {/* stipple: faint in the core, dense at the fringe, fading out beyond it */}
          <radialGradient id={`${id}s`}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="0.9" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}mb`}>{PUFFS.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={`url(#${id}b)`} />)}</mask>
          <mask id={`${id}ms`}>{PUFFS.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y + 4} r={r * 1.18} fill={`url(#${id}s)`} />)}</mask>
        </defs>
        <rect width="340" height="170" className="fill-white dark:fill-[#15284a]" mask={`url(#${id}mb)`} />
        <rect width="340" height="170" fill={`url(#${id}d)`} mask={`url(#${id}ms)`} />
      </svg>
    </m.div>
  );
}

export function Clouds({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <>
        <Cloud className="-left-14 -top-6" width={260} drift={22} duration={20} />
        <Cloud className="-bottom-12 -right-10" width={300} drift={-28} duration={24} />
      </>
    );
  return (
    <>
      <Cloud className="-left-24 top-44" width={360} drift={34} duration={22} />
      <Cloud className="left-[44%] top-10" width={170} drift={-24} duration={18} />
      <Cloud className="-right-20 top-24" width={400} drift={-42} duration={26} />
    </>
  );
}
