"use client";

import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type HomeScrollRevealProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  delay?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
};

export function HomeScrollReveal({
  children,
  className,
  style,
  delay = 0,
  once = true,
  threshold = 0.16,
  rootMargin = "0px 0px -12% 0px",
  ...props
}: HomeScrollRevealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    node.dataset.ready = "true";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.visible = "true";
      return;
    }

    node.dataset.visible = "false";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            target.dataset.visible = "true";

            if (once) {
              observer.unobserve(target);
            }

            return;
          }

          if (!once) {
            target.dataset.visible = "false";
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  return (
    <section
      ref={sectionRef}
      className={cn("home-scroll-reveal", className)}
      data-ready="false"
      data-visible="true"
      style={
        {
          ...style,
          "--reveal-delay": `${delay}ms`,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </section>
  );
}
