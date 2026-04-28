import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(120, "Name is too long"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Email must be a valid address")
    .max(254, "Email is too long"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(5, "Phone number is too short")
    .max(32, "Phone number is too long")
    .regex(/^[\d\s+\-().extEXT]+$/, "Phone number contains invalid characters"),
}).strict();

export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;
