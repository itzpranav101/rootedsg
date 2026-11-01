import { useRef } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { m, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLoop } from '../../hooks/useLoop';
import { usePerf } from '../../lib/perf';
import { EASE_IN_OUT, EASE_OUT } from '../../lib/ease';

const ROWS: [string, string][] = [
  ['Opening balance per bank', '1,24,580.00'],
  ['Add: Deposits in transit', '18,250.00'],
  ['Less: Unpresented cheques', '(9,410.00)'],
  ['Adjusted bank balance', '1,33,420.00'],
  ['Balance per ledger', '1,33,420.00'],
];
const OPEN_ITEM = 2;
const ROW_H = 44;
const SCAN_START = 1.5;
const SCAN_DUR = 1.6;

/**
 * Hero "product shot": a bank reconciliation that fills in, gets scanned by a
 * checker line (ticks draw exactly as the line passes each row), has its open
 * item highlighted, and floats with pointer-driven 3D tilt. Plays when scrolled into view.
 */
export function WorkingPaper() {
  const { reduced, lite } = usePerf();
  const wrap = useRef<HTMLDivElement>(null);
  const loop = useLoop(wrap);
  const still = reduced;
  // The sequence starts only once the paper is genuinely on screen, so it is never missed.
  const seen = useInView(wrap, { once: true, amount: 0.45 });
  const go = seen || still;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 18 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (lite || reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const tickDelay = (i: number) => SCAN_START + ((i + 0.6) / ROWS.length) * SCAN_DUR;

  return (
    <div ref={wrap} onPointerMove={onMove} onPointerLeave={reset} className="relative" aria-hidden>
      <m.div
        style={lite ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        className="card relative mx-auto max-w-xl overflow-hidden p-6 text-left shadow-[0_60px_90px_-50px_rgb(11_58_134/0.45)] sm:p-9"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5 dark:border-white/10">
          <div>
            <p className="label">WP ref. B-3 · Period end</p>
            <p className="mt-2 font-display text-3xl font-light tracking-[-0.03em]">Bank reconciliation</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="pill">Madurai</span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/50 dark:text-white/40">Page 1 of 1</span>
          </div>
        </div>

        {/* rows + scanning line */}
        <div className="relative mt-3">
          {!still && (
            <m.div
              className="pointer-events-none absolute inset-x-[-12px] z-10 h-12 border-b-2 border-brand-500/80 bg-gradient-to-b from-transparent to-brand-400/15"
              initial={{ y: -48, opacity: 0 }}
              animate={go ? { y: [-48, ROW_H * ROWS.length - 46], opacity: [0, 1, 1, 0] } : undefined}
              transition={{ delay: SCAN_START, duration: SCAN_DUR, ease: EASE_IN_OUT, opacity: { delay: SCAN_START, duration: SCAN_DUR, times: [0, 0.1, 0.85, 1] } }}
            />
          )}
          <table className="w-full text-[0.95rem]">
            <tbody>
              {ROWS.map(([label, value], i) => (
                <m.tr
                  key={label}
                  initial={still ? false : { opacity: 0, x: -12 }}
                  animate={go ? { opacity: 1, x: 0 } : undefined}
                  transition={{ delay: 0.75 + i * 0.1, duration: 0.6, ease: EASE_OUT }}
                  className={`h-11 ${i === 3 ? 'border-t border-ink/10 dark:border-white/10' : ''}`}
                >
                  <td className={`relative pr-3 ${i === 3 ? 'font-semibold' : 'text-ink-soft dark:text-slate-300'}`}>
                    {i === OPEN_ITEM && (
                      <m.span
                        className="absolute -inset-x-2 inset-y-1.5 -z-0 origin-left rounded bg-amber-300/40 dark:bg-amber-400/20"
                        initial={{ scaleX: still ? 1 : 0 }}
                        animate={go ? { scaleX: 1 } : undefined}
                        transition={{ delay: SCAN_START + SCAN_DUR + 0.2, duration: 0.6, ease: EASE_OUT }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </td>
                  <td className="text-right font-mono text-sm tabular-nums">{value}</td>
                  <td className="w-9 text-right">
                    {i === OPEN_ITEM ? (
                      <m.span initial={{ scale: still ? 1 : 0 }} animate={go ? { scale: 1 } : undefined} transition={{ delay: tickDelay(i), type: 'spring', stiffness: 400, damping: 12 }} className="ml-auto block h-2.5 w-2.5 rounded-full bg-amber-500" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 text-brand-700 dark:text-brand-300" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <m.path d="M5 12.5l4.5 4.5L19 7" initial={{ pathLength: still ? 1 : 0 }} animate={go ? { pathLength: 1 } : undefined} transition={{ delay: tickDelay(i), duration: 0.35 }} />
                      </svg>
                    )}
                  </td>
                </m.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* sign-off strip */}
        <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[0.68rem] uppercase tracking-[0.1em]">
          {(
            [
              ['Prepared', 'AK', 0.9],
              ['Checked', 'RS', SCAN_START + SCAN_DUR],
              ['Review', 'SG', null],
            ] as const
          ).map(([k, v, d]) => (
            <SignCell key={k} text={`${k} · ${v}`} delay={d} still={still} go={go} />
          ))}
        </div>
      </m.div>

      <FloatPill go={go} loop={loop} still={still} className="left-0 top-20 hidden md:inline-flex" delay={1.2} bob={0}>
        <span className="h-2 w-2 rounded-full bg-brand-500" /> Prepared · AK
      </FloatPill>
      <FloatPill go={go} loop={loop} still={still} className="right-0 top-8" delay={SCAN_START + SCAN_DUR} bob={1.2}>
        Ticked to source · <span className="text-brand-800 dark:text-brand-300">4/4</span>
      </FloatPill>
      <FloatPill go={go} loop={loop} still={still} className="bottom-40 left-0 hidden md:inline-flex" delay={SCAN_START + SCAN_DUR + 0.5} bob={2.1}>
        <span className="h-2 w-2 rounded-full bg-amber-500" /> 1 open item
      </FloatPill>
      <FloatPill go={go} loop={loop} still={still} className="bottom-20 right-0 hidden md:inline-flex" delay={SCAN_START + SCAN_DUR + 0.9} bob={0.6}>
        <span className="text-brand-800 dark:text-brand-300">Ready for review</span>
      </FloatPill>
    </div>
  );
}

function FloatPill({ children, className, delay, bob, loop, still, go }: { children: ReactNode; className: string; delay: number; bob: number; loop: boolean; still: boolean; go: boolean }) {
  return (
    <m.span
      initial={still ? false : { opacity: 0, y: 12, scale: 0.94 }}
      animate={!go ? undefined : loop ? { opacity: 1, scale: 1, y: [0, -7, 0] } : { opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5, ease: EASE_OUT },
        y: loop ? { delay: delay + bob, duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : { delay, duration: 0.5 },
      }}
      className={`pill absolute z-20 !bg-white !py-2.5 !text-ink shadow-[0_14px_34px_-14px_rgb(10_10_10/0.25)] dark:!bg-night-card dark:!text-white ${className}`}
    >
      {children}
    </m.span>
  );
}

/** A sign-off box that fills with brand navy from the left when its step completes. */
function SignCell({ text, delay, still, go }: { text: string; delay: number | null; still: boolean; go: boolean }) {
  return (
    <span className="relative overflow-hidden rounded-lg bg-white px-2 py-2.5 text-center text-ink/50 dark:bg-white/5 dark:text-white/40">
      {delay !== null && (
        <>
          <m.span aria-hidden className="absolute inset-0 origin-left bg-brand-900 dark:bg-brand-300" initial={{ scaleX: still ? 1 : 0 }} animate={go ? { scaleX: 1 } : undefined} transition={{ delay, duration: 0.5, ease: EASE_OUT }} />
          <m.span aria-hidden className="absolute inset-0 grid place-items-center text-white dark:text-night" initial={{ opacity: still ? 1 : 0 }} animate={go ? { opacity: 1 } : undefined} transition={{ delay: delay + 0.15, duration: 0.3 }}>
            {text}
          </m.span>
        </>
      )}
      <span className={delay !== null ? 'invisible' : ''}>{text}</span>
    </span>
  );
}
