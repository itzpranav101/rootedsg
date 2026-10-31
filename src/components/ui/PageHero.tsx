import type { ReactNode } from 'react';
import { Clouds } from '../motion/Clouds';
import { ScrollRail } from '../motion/ScrollCue';

interface Props {
  label: string;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
  /** show the visual on phones too (default: tablet & up only) */
  visualOnPhone?: boolean;
}

export function PageHero({ label, title, children, actions, visual, visualOnPhone = false }: Props) {
  return (
    <section className="sky-wash relative overflow-hidden pt-32 sm:pt-40">
      <Clouds />
      <div className="wrap relative text-center">
        <p className="label animate-fade-up">{label}</p>
        <h1 className="h-display mx-auto mt-6 max-w-5xl animate-fade-up text-[2.6rem] leading-[1] [animation-delay:80ms] sm:text-6xl lg:text-[4.6rem]">{title}</h1>
        {children && <p className="lead mx-auto mt-7 max-w-2xl animate-fade-up [animation-delay:160ms]">{children}</p>}
        {actions && <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">{actions}</div>}
        {visual && <div className={`${visualOnPhone ? '' : 'hidden sm:block'} mx-auto mt-14 max-w-4xl animate-fade-up [animation-delay:320ms]`}>{visual}</div>}
      </div>
      <div className="h-20 sm:h-28" />
      <ScrollRail />
    </section>
  );
}
