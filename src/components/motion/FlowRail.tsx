import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { BadgeCheck, FileSpreadsheet, ScanSearch } from 'lucide-react';
import { useLoop } from '../../hooks/useLoop';
import { EASE_IN_OUT } from '../../lib/ease';

const STEPS = [
  { Icon: FileSpreadsheet, n: '01', label: 'Prepared', who: 'by our Madurai team' },
  { Icon: ScanSearch, n: '02', label: 'Checked', who: 'by a second reviewer' },
  { Icon: BadgeCheck, n: '03', label: 'Signed off', who: 'by your Singapore team' },
];
const STEP_MS = 1900;

/**
 * Hero workflow rail: three connected steps. While visible (full tier), the
 * active step cycles and a small document travels along the connector to the
 * next one. Lite / reduced motion: a static, fully readable rail.
 */
export function FlowRail() {
  const ref = useRef<HTMLOListElement>(null);
  const loop = useLoop(ref);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!loop) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length);
      setCycle((c) => c + 1);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [loop]);

  return (
    <ol ref={ref} className="mx-auto flex max-w-[64rem] flex-col items-stretch sm:flex-row sm:items-center">
      {STEPS.map((s, i) => {
        const on = loop ? i === active : false;
        const done = loop && i < active;
        return (
          <li key={s.n} className="contents">
            <div
              className={`relative flex flex-1 items-center gap-3.5 rounded-2xl border bg-white/75 px-4 py-3.5 text-left backdrop-blur-sm transition-all duration-500 sm:min-w-0 dark:bg-white/[0.04] ${
                on
                  ? 'border-brand-800 shadow-[0_18px_40px_-22px_rgb(11_58_134/0.55)] sm:-translate-y-1 dark:border-brand-300'
                  : 'border-ink/10 dark:border-white/10'
              }`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-500 ${on || done ? 'bg-brand-900 text-white dark:bg-brand-300 dark:text-night' : 'bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300'}`}>
                <s.Icon size={18} strokeWidth={1.6} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink/55 dark:text-white/50">
                  <span className="text-brand-800 dark:text-brand-300">{s.n}</span> · {s.label}
                </span>
                <span className="mt-0.5 block text-[0.95rem] leading-snug text-ink dark:text-white">{s.who}</span>
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <span aria-hidden className="relative ml-[2.1rem] h-6 w-px shrink-0 bg-ink/15 sm:ml-0 sm:h-px sm:w-auto sm:min-w-[2rem] sm:flex-[0.28] dark:bg-white/15">
                {/* arrow head (desktop) */}
                <span className="absolute -right-0.5 top-1/2 hidden h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-ink/30 sm:block dark:border-white/30" />
                {loop && active === i && (
                  <>
                    <m.span
                      key={`h${cycle}`}
                      className="absolute top-1/2 hidden h-3.5 w-3 -translate-y-1/2 rounded-[2px] border-[1.5px] border-brand-800 bg-white sm:block dark:border-brand-300 dark:bg-night"
                      initial={{ left: '0%', opacity: 0 }}
                      animate={{ left: ['0%', '85%'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: STEP_MS / 1000 - 0.2, ease: EASE_IN_OUT, opacity: { times: [0, 0.15, 0.8, 1], duration: STEP_MS / 1000 - 0.2 } }}
                    />
                    <m.span
                      key={`v${cycle}`}
                      className="absolute -left-[3px] h-1.5 w-1.5 rounded-full bg-brand-800 sm:hidden dark:bg-brand-300"
                      initial={{ top: '0%', opacity: 0 }}
                      animate={{ top: ['0%', '80%'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: STEP_MS / 1000 - 0.2, ease: EASE_IN_OUT }}
                    />
                  </>
                )}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
