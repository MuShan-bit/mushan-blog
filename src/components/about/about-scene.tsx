"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type AboutSceneProps = {
  keywords: string[];
};

type BubbleKeyword = {
  word: string;
  x: number;
  y: number;
  size: "sm" | "md" | "lg";
  drift: number;
  delay: number;
  duration: number;
  rotate: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashWord(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function createBubbleKeywords(input: string[]) {
  const words = [...new Set(input.filter((word) => word.trim().length > 0))];
  const count = words.length;

  if (!count) {
    return [] as BubbleKeyword[];
  }

  const columns = clamp(Math.ceil(Math.sqrt(count * 1.5)), 3, 6);
  const rows = Math.ceil(count / columns);

  return words.map((word, index) => {
    const seed = hashWord(`${word}-${index}`);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const jitterX = ((seed % 1000) / 1000 - 0.5) * 10;
    const jitterY = ((((seed >>> 8) % 1000) / 1000) - 0.5) * 8;
    const x = clamp(((column + 0.5) / columns) * 100 + jitterX, 9, 91);
    const y = clamp(((row + 0.8) / (rows + 0.5)) * 100 + jitterY, 16, 84);

    return {
      word,
      x,
      y,
      size: seed % 7 < 2 ? "lg" : seed % 7 < 5 ? "md" : "sm",
      drift: 8 + (seed % 10),
      delay: (seed % 12) * -0.35,
      duration: 7 + (seed % 8) * 1.25,
      rotate: ((seed % 17) - 8) * 0.9,
    } satisfies BubbleKeyword;
  });
}

export function AboutScene({ keywords }: AboutSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const bubbles = useMemo(() => createBubbleKeywords(keywords), [keywords]);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(window.scrollY / max);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setPointer({ x, y });
  };

  const onPointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  return (
    <div
      ref={wrapperRef}
      className="glass-panel about-bubble-wall relative h-full min-h-[24rem] overflow-hidden rounded-[2rem]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="about-bubble-wall__glow pointer-events-none absolute inset-0" />
      <div
        className="about-bubble-wall__layer"
        style={
          {
            "--about-parallax-x": `${pointer.x * 16}px`,
            "--about-parallax-y": `${pointer.y * 10 - scrollProgress * 16}px`,
          } as CSSProperties
        }
      >
        {bubbles.map((bubble) => (
          <span
            key={bubble.word}
            className="about-bubble-chip"
            data-size={bubble.size}
            style={
              {
                "--bubble-x": `${bubble.x}%`,
                "--bubble-y": `${bubble.y}%`,
                "--bubble-drift": `${bubble.drift}px`,
                "--bubble-delay": `${bubble.delay}s`,
                "--bubble-duration": `${bubble.duration}s`,
                "--bubble-rotate": `${bubble.rotate}deg`,
              } as CSSProperties
            }
          >
            {bubble.word}
          </span>
        ))}
      </div>
      <div className="text-muted pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-xs">
        <span>Keyword Wall</span>
        <span>把技能和兴趣挂在墙上，随阅读一起呼吸</span>
      </div>
    </div>
  );
}
