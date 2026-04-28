import {
  useCallback,
  useEffect,
  useId,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import "./Dialog.css";

export type DialogProps = {
  open: boolean;
  title: string;
  /** When true, Escape and backdrop click do not close the dialog. */
  isDirty: boolean;
  /** Called after the user dismisses the modal (backdrop, Escape, or close control). */
  onClosed: () => void;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * Accessible modal rendered via `createPortal` to `document.body`.
 * Avoids native `<dialog>` / `showModal()` bugs on mobile Safari (blocked taps, broken backdrop).
 */
export function Dialog({
  open,
  title,
  isDirty,
  onClosed,
  children,
  footer,
}: DialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isDirty) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      onClosed();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, isDirty, onClosed]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    if (!isDirty) onClosed();
  }, [isDirty, onClosed]);

  const handleCloseClick = useCallback(() => {
    if (!isDirty) onClosed();
  }, [isDirty, onClosed]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="dialog-portal">
      <button
        type="button"
        className="dialog-portal__backdrop"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={handleBackdropClick}
      />
      <div
        className="dialog"
        role="dialog"
        aria-labelledby={titleId}
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog__surface" role="document">
          <header className="dialog__header">
            <h2 id={titleId} className="dialog__title">
              {title}
            </h2>
            <button
              type="button"
              className="dialog__close"
              onClick={handleCloseClick}
              disabled={isDirty}
              aria-label={
                isDirty ? "Close disabled while form has changes" : "Close"
              }
              title={
                isDirty
                  ? "Discard changes or use Add user to save"
                  : "Close"
              }
            >
              ×
            </button>
          </header>
          <div className="dialog__body">{children}</div>
          <footer className="dialog__footer">{footer}</footer>
        </div>
      </div>
    </div>,
    document.body
  );
}
