import { useRef } from 'react';
import { m } from 'framer-motion';
import { useLoop } from '../../hooks/useLoop';
import { usePerf } from '../../lib/perf';
import { EASE_IN_OUT } from '../../lib/ease';

/** Mono pill — "KEEP SCROLLING ⌄" — telling visitors a section animates as they scroll. */
export function ScrollCue({ label = 'Keep scrolling', className = '' }: { label?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const loop = useLoop(ref);
  return (
    <span ref={ref} className={`pill !bg-white !py-2.5 !text-ink shadow-[0_8px_24px_-12px_rgb(10_10_10/0.2)] dark:!bg-night-card dark:!text-white ${className}`}>
      {label}
      <m.svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} animate={loop ? { y: [0, 3, 0] } : undefined} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} aria-hidden>
        <path d="M6 9l6 6 6-6" />
      </m.svg>
    </span>
  );
}

/** Vertical "SCROLL TO LEARN MORE" rail on the right edge of heroes (desktop). */
export function ScrollRail({ label = 'Scroll to learn more' }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const loop = useLoop(ref);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute bottom-10 right-6 hidden flex-col items-center gap-4 lg:flex xl:right-10">
      <span className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-ink/60 [writing-mode:vertical-rl] dark:text-white/50">{label}</span>
      <span className="relative h-16 w-px overflow-hidden bg-ink/15 dark:bg-white/15">
        <m.span className="absolute inset-x-0 top-0 h-6 bg-ink dark:bg-white" initial={{ y: '-100%' }} animate={loop ? { y: ['-100%', '280%'] } : undefined} transition={{ duration: 1.8, repeat: Infinity, ease: EASE_IN_OUT }} />
      </span>
    </div>
  );
}

/** Hand-drawn underline that draws itself beneath an accent word. */
export function Squiggle({ className = '', delay = 0.9 }: { className?: string; delay?: number }) {
  const { reduced } = usePerf();
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" className={`pointer-events-none absolute left-0 w-full overflow-visible ${className}`} aria-hidden>
      <m.path
        d="M3 9 C 30 2, 50 15, 80 8 S 140 3, 170 9 S 192 11, 197 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay, ease: EASE_IN_OUT }}
      />
    </svg>
  );
}
