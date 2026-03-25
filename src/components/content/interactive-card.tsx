import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type InteractiveCardTag = "article" | "section" | "div";

type InteractiveCardProps = HTMLAttributes<HTMLElement> & {
  as?: InteractiveCardTag;
  children: ReactNode;
};

export function InteractiveCard({
  as = "article",
  children,
  className,
  ...props
}: InteractiveCardProps) {
  const cardProps = {
    ...props,
    className: cn("interactive-glass-card", className),
  };

  if (as === "section") {
    return <section {...cardProps}>{children}</section>;
  }

  if (as === "div") {
    return <div {...cardProps}>{children}</div>;
  }

  return <article {...cardProps}>{children}</article>;
}
