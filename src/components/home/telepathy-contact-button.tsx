"use client";

import { ArrowRight, Brain } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const rippleDurationMs = 3000;
const reducedMotionDurationMs = 1200;
const messageDurationMs = 1500;
const exitDurationMs = 420;

type TelepathyPhase = "idle" | "animating" | "failed" | "exiting";

export function TelepathyContactButton() {
  const timeoutIdsRef = useRef<number[]>([]);
  const [phase, setPhase] = useState<TelepathyPhase>("idle");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (event?: MediaQueryListEvent) => {
      setReduceMotion(event?.matches ?? mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimers(timeoutIdsRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      endSequence(timeoutIdsRef.current, setPhase);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [phase]);

  function startSequence() {
    const duration = reduceMotion ? reducedMotionDurationMs : rippleDurationMs;

    clearTimers(timeoutIdsRef.current);
    setRunId((current) => current + 1);
    setPhase("animating");

    timeoutIdsRef.current = [
      window.setTimeout(() => {
        setPhase("failed");
      }, duration),
      window.setTimeout(() => {
        setPhase("exiting");
      }, duration + messageDurationMs),
      window.setTimeout(() => {
        setPhase("idle");
        timeoutIdsRef.current = [];
      }, duration + messageDurationMs + (reduceMotion ? 0 : exitDurationMs)),
    ];
  }

  const portalRoot = typeof document === "undefined" ? null : document.body;
  const isActive = phase !== "idle";

  return (
    <>
      <button
        type="button"
        onClick={startSequence}
        className="inline-flex w-full items-center justify-between rounded-[1.1rem] border border-border bg-white/45 px-4 py-3 text-sm text-foreground transition hover:border-accent/20 hover:text-accent-strong dark:bg-white/5"
        aria-haspopup="dialog"
        aria-expanded={isActive}
      >
        <span className="inline-flex items-center gap-2">
          <Brain className="h-4 w-4" />
          意念联系
        </span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {portalRoot && isActive
        ? createPortal(
            <div className="telepathy-overlay" data-phase={phase} role="dialog" aria-modal="true" aria-label="意念联系模拟">
              <div className="telepathy-overlay__backdrop" />
              <div key={runId} className="telepathy-overlay__stage">
                <span className="telepathy-overlay__pool" />
                <span className="telepathy-overlay__core" />
                <span className="telepathy-overlay__ripple telepathy-overlay__ripple--one" />
                <span className="telepathy-overlay__ripple telepathy-overlay__ripple--two" />
                <span className="telepathy-overlay__ripple telepathy-overlay__ripple--three" />

                <div
                  className={cn(
                    "telepathy-overlay__message",
                    phase === "failed" && "telepathy-overlay__message--visible",
                    phase === "exiting" && "telepathy-overlay__message--leaving",
                  )}
                  aria-live="polite"
                >
                  <p className="telepathy-overlay__eyebrow">Mind Link</p>
                  <p className="telepathy-overlay__text">意念连接失败，对方屏蔽了你的意念。</p>
                </div>
              </div>
            </div>,
            portalRoot,
          )
        : null}
    </>
  );
}

function clearTimers(timerIds: number[]) {
  timerIds.forEach((id) => window.clearTimeout(id));
}

function endSequence(
  timerIds: number[],
  setPhase: Dispatch<SetStateAction<TelepathyPhase>>,
) {
  clearTimers(timerIds);
  setPhase("idle");
}
