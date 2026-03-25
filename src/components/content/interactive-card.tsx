"use client";

import type { FocusEvent, HTMLAttributes, PointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const SHIMMER_DURATION_MS = 760;

type CardShimmerState = "idle" | "entering" | "entered" | "leaving";
type InteractiveCardTag = "article" | "section" | "div";

type InteractiveCardProps = HTMLAttributes<HTMLElement> & {
  as?: InteractiveCardTag;
  children: ReactNode;
};

export function InteractiveCard({
  as = "article",
  children,
  className,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  ...props
}: InteractiveCardProps) {
  const [pointerActive, setPointerActive] = useState(false);
  const [focusActive, setFocusActive] = useState(false);
  const [shimmerState, setShimmerState] = useState<CardShimmerState>("idle");
  const shimmerTimerRef = useRef<number | null>(null);

  const clearShimmerTimer = () => {
    if (shimmerTimerRef.current) {
      window.clearTimeout(shimmerTimerRef.current);
      shimmerTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearShimmerTimer();
    };
  }, []);

  const playShimmer = (nextState: Extract<CardShimmerState, "entering" | "leaving">, resetState: Extract<CardShimmerState, "entered" | "idle">) => {
    clearShimmerTimer();
    setShimmerState(nextState);
    shimmerTimerRef.current = window.setTimeout(() => {
      setShimmerState(resetState);
      shimmerTimerRef.current = null;
    }, SHIMMER_DURATION_MS);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    onPointerEnter?.(event);

    if (event.pointerType === "touch") {
      return;
    }

    setPointerActive(true);
    playShimmer("entering", "entered");
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    onPointerLeave?.(event);

    if (event.pointerType === "touch") {
      return;
    }

    setPointerActive(false);
    playShimmer("leaving", "idle");
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    onFocus?.(event);
    setFocusActive(true);
    playShimmer("entering", "entered");
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    onBlur?.(event);

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setFocusActive(false);
    playShimmer("leaving", "idle");
  };

  const cardProps = {
    ...props,
    className: cn("interactive-glass-card", className),
    "data-card-hovered": pointerActive || focusActive ? "true" : "false",
    "data-card-shimmer": shimmerState,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };

  if (as === "section") {
    return <section {...cardProps}>{children}</section>;
  }

  if (as === "div") {
    return <div {...cardProps}>{children}</div>;
  }

  return <article {...cardProps}>{children}</article>;
}
