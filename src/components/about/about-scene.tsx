"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type AboutSceneProps = {
  keywords: string[];
};

type BubbleKeyword = {
  id: string;
  word: string;
  x: number;
  y: number;
  size: "sm" | "md" | "lg";
  drift: number;
  delay: number;
  duration: number;
  rotate: number;
  radius: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isWideCharacter(char: string) {
  return /[^\x00-\xff]/.test(char);
}

function getWordUnits(word: string) {
  return Array.from(word).reduce((total, char) => total + (isWideCharacter(char) ? 1.45 : 1), 0);
}

function estimateBubbleRadius(word: string, size: BubbleKeyword["size"]) {
  const units = getWordUnits(word);
  const sizeBias = size === "lg" ? 34 : size === "md" ? 30 : 26;
  return sizeBias + units * 4.3;
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
      id: `${word}-${index}`,
      word,
      x,
      y,
      size: seed % 7 < 2 ? "lg" : seed % 7 < 5 ? "md" : "sm",
      drift: 8 + (seed % 10),
      delay: (seed % 12) * -0.35,
      duration: 7 + (seed % 8) * 1.25,
      rotate: ((seed % 17) - 8) * 0.9,
      radius: estimateBubbleRadius(word, seed % 7 < 2 ? "lg" : seed % 7 < 5 ? "md" : "sm"),
    } satisfies BubbleKeyword;
  });
}

function resolveBubbleCollisions(
  layout: BubbleKeyword[],
  width: number,
  height: number,
  draggingId: string | null = null,
) {
  if (width <= 0 || height <= 0) {
    return layout;
  }

  const insetX = 22;
  const insetTop = 24;
  const insetBottom = 66;
  const padding = 6;
  const centers = layout.map((bubble) => ({
    x: (bubble.x / 100) * width,
    y: (bubble.y / 100) * height,
  }));

  const clampCenter = (index: number) => {
    const radius = layout[index].radius;
    centers[index].x = clamp(centers[index].x, insetX + radius, width - insetX - radius);
    centers[index].y = clamp(
      centers[index].y,
      insetTop + radius,
      height - insetBottom - radius,
    );
  };

  centers.forEach((_, index) => clampCenter(index));

  for (let pass = 0; pass < 5; pass += 1) {
    for (let i = 0; i < layout.length; i += 1) {
      for (let j = i + 1; j < layout.length; j += 1) {
        const first = layout[i];
        const second = layout[j];
        const dx = centers[j].x - centers[i].x;
        const dy = centers[j].y - centers[i].y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const minDistance = first.radius + second.radius + padding;

        if (distance >= minDistance) {
          continue;
        }

        const overlap = minDistance - distance;
        const nx = dx / distance;
        const ny = dy / distance;
        const firstIsDragging = draggingId === first.id;
        const secondIsDragging = draggingId === second.id;
        const firstWeight = firstIsDragging ? 0 : secondIsDragging ? 1 : 0.5;
        const secondWeight = secondIsDragging ? 0 : firstIsDragging ? 1 : 0.5;

        centers[i].x -= nx * overlap * firstWeight;
        centers[i].y -= ny * overlap * firstWeight;
        centers[j].x += nx * overlap * secondWeight;
        centers[j].y += ny * overlap * secondWeight;

        clampCenter(i);
        clampCenter(j);
      }
    }
  }

  return layout.map((bubble, index) => ({
    ...bubble,
    x: (centers[index].x / width) * 100,
    y: (centers[index].y / height) * 100,
  }));
}

export function AboutScene({ keywords }: AboutSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bubbleStateRef = useRef<BubbleKeyword[]>([]);
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [draggingBubbleId, setDraggingBubbleId] = useState<string | null>(null);
  const sourceBubbles = useMemo(() => createBubbleKeywords(keywords), [keywords]);
  const [bubbles, setBubbles] = useState<BubbleKeyword[]>(sourceBubbles);

  const applyBubbleLayout = (nextLayout: BubbleKeyword[]) => {
    bubbleStateRef.current = nextLayout;
    setBubbles(nextLayout);
  };

  useEffect(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    const initialized = sourceBubbles.map((bubble) => ({ ...bubble }));
    const settled =
      rect && rect.width > 0 && rect.height > 0
        ? resolveBubbleCollisions(initialized, rect.width, rect.height)
        : initialized;

    applyBubbleLayout(settled);
    setDraggingBubbleId(null);
    draggingRef.current = null;
  }, [sourceBubbles]);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(window.scrollY / max);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();

      if (!rect || rect.width <= 0 || rect.height <= 0 || bubbleStateRef.current.length === 0) {
        return;
      }

      applyBubbleLayout(
        resolveBubbleCollisions(
          bubbleStateRef.current,
          rect.width,
          rect.height,
          draggingRef.current?.id ?? null,
        ),
      );
    };

    const onPointerUp = () => {
      draggingRef.current = null;
      setDraggingBubbleId(null);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", onPointerUp);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("blur", onPointerUp);
    };
  }, []);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setPointer({ x, y });

    if (!draggingRef.current) {
      return;
    }

    const dragging = draggingRef.current;
    const targetX = event.clientX - rect.left + dragging.offsetX;
    const targetY = event.clientY - rect.top + dragging.offsetY;

    const moved = bubbleStateRef.current.map((bubble) =>
      bubble.id === dragging.id
        ? {
            ...bubble,
            x: (targetX / rect.width) * 100,
            y: (targetY / rect.height) * 100,
          }
        : bubble,
    );

    applyBubbleLayout(resolveBubbleCollisions(moved, rect.width, rect.height, dragging.id));
  };

  const onPointerLeave = () => {
    if (draggingRef.current) {
      return;
    }

    setPointer({ x: 0, y: 0 });
  };

  const onBubblePointerDown = (
    event: ReactPointerEvent<HTMLSpanElement>,
    bubbleId: string,
  ) => {
    if (event.button !== 0) {
      return;
    }

    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const bubble = bubbleStateRef.current.find((item) => item.id === bubbleId);

    if (!bubble) {
      return;
    }

    const centerX = (bubble.x / 100) * rect.width;
    const centerY = (bubble.y / 100) * rect.height;

    draggingRef.current = {
      id: bubbleId,
      offsetX: centerX - (event.clientX - rect.left),
      offsetY: centerY - (event.clientY - rect.top),
    };

    setDraggingBubbleId(bubbleId);
    event.preventDefault();
  };

  return (
    <div
      ref={wrapperRef}
      className="glass-panel about-bubble-wall relative h-full min-h-[24rem] overflow-hidden rounded-[2rem]"
      data-dragging={draggingBubbleId ? "true" : "false"}
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
            key={bubble.id}
            className="about-bubble-chip"
            data-size={bubble.size}
            data-dragging={draggingBubbleId === bubble.id ? "true" : "false"}
            onPointerDown={(event) => onBubblePointerDown(event, bubble.id)}
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
