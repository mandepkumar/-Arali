import { randomUUID } from "node:crypto";
import { z } from "zod";

const uuidSchema = z.string().uuid();

export function newCustomerId(): string {
  return randomUUID();
}

export function isCustomerId(value: string): boolean {
  return uuidSchema.safeParse(value.trim()).success;
}
