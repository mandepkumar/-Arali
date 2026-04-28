import type { HTMLAttributes } from "react";
import "./Text.css";

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
};

export function Text({ muted, className = "", ...rest }: TextProps) {
  const cls = ["text", muted ? "text--muted" : "", className].filter(Boolean).join(" ");
  return <p className={cls} {...rest} />;
}
