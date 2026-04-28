import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/Button/Button.tsx";
import { FormField } from "@/components/FormField/FormField.tsx";
import type { CustomerFieldErrors } from "../../validation/customerFormSchema.ts";
import type { CustomerForm as CustomerFormValues } from "../../types.ts";
import "./CustomerForm.css";

export type CustomerFormProps = {
  values: CustomerFormValues;
  submitting: boolean;
  onChange: (field: keyof CustomerFormValues, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  /** When set, used as the form `id` so external buttons can submit via `form={formId}`. */
  formId?: string;
  /** Hide built-in submit row (e.g. when dialog provides footer actions). */
  hideActions?: boolean;
  /** Client-side validation messages per field. */
  fieldErrors?: CustomerFieldErrors;
};

export function CustomerForm({
  values,
  submitting,
  onChange,
  onSubmit,
  formId,
  hideActions = false,
  fieldErrors,
}: CustomerFormProps) {
  const handle =
    (field: keyof CustomerFormValues) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(field, e.target.value);
    };

  const err = (field: keyof CustomerFormValues) => fieldErrors?.[field];

  return (
    <form
      id={formId}
      className="customer-form"
      noValidate
      onSubmit={(e) => void onSubmit(e)}
    >
      <FormField id="customer-name" label="Name" error={err("name")}>
        <input
          id="customer-name"
          type="text"
          value={values.name}
          onChange={handle("name")}
          autoComplete="name"
          aria-required="true"
          aria-invalid={Boolean(err("name"))}
          aria-describedby={err("name") ? "customer-name-error" : undefined}
        />
      </FormField>
      <FormField id="customer-email" label="Email" error={err("email")}>
        <input
          id="customer-email"
          type="email"
          inputMode="email"
          value={values.email}
          onChange={handle("email")}
          autoComplete="email"
          aria-required="true"
          aria-invalid={Boolean(err("email"))}
          aria-describedby={err("email") ? "customer-email-error" : undefined}
        />
      </FormField>
      <FormField id="customer-phone" label="Phone number" error={err("phone")}>
        <input
          id="customer-phone"
          type="tel"
          value={values.phone}
          onChange={handle("phone")}
          autoComplete="tel"
          aria-required="true"
          aria-invalid={Boolean(err("phone"))}
          aria-describedby={err("phone") ? "customer-phone-error" : undefined}
        />
      </FormField>
      {!hideActions ? (
        <div className="customer-form__actions">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving…" : "Submit"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
