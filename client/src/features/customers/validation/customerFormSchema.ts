import { z } from "zod";
import type { CustomerForm } from "../types.ts";

/** Mirrors backend `createCustomerSchema` so UI rejects the same bad input before calling the API. */
export const customerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(120, "Name is too long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Email must be a valid address")
      .max(254, "Email is too long"),
    phone: z
      .string()
      .trim()
      .min(5, "Phone number is too short")
      .max(32, "Phone number is too long")
      .regex(
        /^[\d\s+\-().extEXT]+$/,
        "Phone number contains invalid characters"
      ),
  })
  .strict();

export type ValidatedCustomerForm = z.infer<typeof customerFormSchema>;

export type CustomerFieldErrors = Partial<
  Record<keyof CustomerForm, string>
>;

export function validateCustomerForm(
  values: CustomerForm
):
  | { ok: true; data: ValidatedCustomerForm }
  | { ok: false; fieldErrors: CustomerFieldErrors } {
  const parsed = customerFormSchema.safeParse(values);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }

  const fieldErrors: CustomerFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (key === "name" || key === "email" || key === "phone") {
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
  }
  return { ok: false, fieldErrors };
}
