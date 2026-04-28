import type { HTMLAttributes, ReactNode } from "react";
import "./Card.css";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  children: ReactNode;
};

export function Card({ title, children, className = "", ...rest }: CardProps) {
  return (
    <section className={`card ${className}`.trim()} {...rest}>
      {title != null ? <h2 className="card__title">{title}</h2> : null}
      <div className="card__body">{children}</div>
    </section>
  );
}
