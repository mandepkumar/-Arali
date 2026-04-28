import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

export type ButtonVariant =
  | "primary"
  | "danger"
  | "secondary"
  | "ghost"
  | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const variantClass = `btn btn--${variant}`;
  return (
    <button
      type={type}
      className={`${variantClass} ${className}`.trim()}
      {...rest}
    />
  );
}
