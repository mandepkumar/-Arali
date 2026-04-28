import type { ReactNode } from "react";
import "./FormField.css";

export type FormFieldProps = {
  id: string;
  label: string;
  /** Inline validation message shown under the control. */
  error?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, children }: FormFieldProps) {
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <div className={`form-field${invalid ? " form-field--invalid" : ""}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="form-field__control">{children}</div>
      {invalid ? (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
