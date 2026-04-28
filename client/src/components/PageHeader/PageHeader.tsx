import type { ReactNode } from "react";
import "./PageHeader.css";

export type PageHeaderProps = {
  title: string;
  description?: ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {description != null ? (
        <div className="page-header__desc">{description}</div>
      ) : null}
    </header>
  );
}
