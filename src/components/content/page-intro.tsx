import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function PageIntro({ eyebrow, title, description, actions, className }: PageIntroProps) {
  return (
    <section className={cn("glass-panel rounded-[2rem] p-7 sm:p-10", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="section-kicker text-sm font-semibold">{eyebrow}</p>
          <h1 className="font-display text-foreground text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {title}
          </h1>
          <p className="text-muted max-w-2xl text-base leading-8 sm:text-lg">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
