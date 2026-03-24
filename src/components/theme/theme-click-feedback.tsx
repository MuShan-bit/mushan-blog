"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useColorPalette } from "@/components/theme/use-color-palette";
import type { ColorPalette } from "@/lib/color-themes";

type ClickSpark = {
  id: number;
  x: number;
  y: number;
  palette: ColorPalette["id"];
};

export function ThemeClickFeedback() {
  const palette = useColorPalette();
  const timeoutIdsRef = useRef<number[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [sparks, setSparks] = useState<ClickSpark[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateAvailability = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    updateAvailability();
    finePointer.addEventListener("change", updateAvailability);
    reducedMotion.addEventListener("change", updateAvailability);

    return () => {
      finePointer.removeEventListener("change", updateAvailability);
      reducedMotion.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) {
        return;
      }

      const spark = {
        id: Date.now() + Math.random(),
        x: event.clientX,
        y: event.clientY,
        palette,
      };

      setSparks((currentSparks) => [...currentSparks, spark]);

      const timeoutId = window.setTimeout(() => {
        setSparks((currentSparks) => currentSparks.filter((item) => item.id !== spark.id));
        timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== timeoutId);
      }, 900);

      timeoutIdsRef.current.push(timeoutId);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [enabled, palette]);

  if (!enabled || sparks.length === 0) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[115] overflow-hidden">
      {sparks.map((spark) => (
        <ClickSparkEffect key={spark.id} spark={spark} />
      ))}
    </div>
  );
}

function ClickSparkEffect({ spark }: { spark: ClickSpark }) {
  const style = {
    left: spark.x,
    top: spark.y,
  } satisfies CSSProperties;

  if (spark.palette === "verdant") {
    return (
      <div className="click-spark click-spark--verdant" style={style}>
        <span className="click-spark__ring" />
        <span className="click-spark__leaf click-spark__leaf--left" />
        <span className="click-spark__leaf click-spark__leaf--center" />
        <span className="click-spark__leaf click-spark__leaf--right" />
      </div>
    );
  }

  if (spark.palette === "ocean") {
    return (
      <div className="click-spark click-spark--ocean" style={style}>
        <span className="click-spark__ripple click-spark__ripple--primary" />
        <span className="click-spark__ripple click-spark__ripple--secondary" />
      </div>
    );
  }

  if (spark.palette === "sunrise") {
    return (
      <div className="click-spark click-spark--sunrise" style={style}>
        <span className="click-spark__glow" />
        <span className="click-spark__ray click-spark__ray--one" />
        <span className="click-spark__ray click-spark__ray--two" />
        <span className="click-spark__ray click-spark__ray--three" />
        <span className="click-spark__ray click-spark__ray--four" />
      </div>
    );
  }

  return (
    <div className="click-spark click-spark--graphite" style={style}>
      <span className="click-spark__mist click-spark__mist--one" />
      <span className="click-spark__mist click-spark__mist--two" />
    </div>
  );
}
