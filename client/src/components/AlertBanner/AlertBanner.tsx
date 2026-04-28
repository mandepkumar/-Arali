import type { HTMLAttributes, ReactNode } from "react";
import "./AlertBanner.css";

export type AlertVariant = "error" | "info";

export type AlertBannerProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  children: ReactNode;
};

export function AlertBanner({
  variant = "error",
  children,
  className = "",
  role = "alert",
  ...rest
}: AlertBannerProps) {
  return (
    <div
      role={role}
      className={`alert alert--${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
