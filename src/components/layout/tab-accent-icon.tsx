"use client";

import type { ColorPalette } from "@/lib/color-themes";

type TabAccentIconProps = {
  palette: ColorPalette["id"];
};

export function TabAccentIcon({ palette }: TabAccentIconProps) {
  if (palette === "verdant") {
    return (
      <span className="tab-accent tab-accent--verdant" aria-hidden="true">
        <span className="tab-accent__leaf tab-accent__leaf--main" />
        <span className="tab-accent__leaf tab-accent__leaf--small" />
      </span>
    );
  }

  if (palette === "ocean") {
    return (
      <span className="tab-accent tab-accent--ocean" aria-hidden="true">
        <span className="tab-accent__wave tab-accent__wave--top" />
        <span className="tab-accent__wave tab-accent__wave--bottom" />
      </span>
    );
  }

  if (palette === "sunrise") {
    return (
      <span className="tab-accent tab-accent--sunrise" aria-hidden="true">
        <span className="tab-accent__glow-ring" />
        <span className="tab-accent__glow-core" />
      </span>
    );
  }

  return (
    <span className="tab-accent tab-accent--graphite" aria-hidden="true">
      <span className="tab-accent__stone tab-accent__stone--large" />
      <span className="tab-accent__stone tab-accent__stone--small" />
    </span>
  );
}
