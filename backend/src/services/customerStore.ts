import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Customer } from "../types/customer.ts";
import { ErrorCodes } from "../constants/errorCodes.ts";
import { HttpError } from "../utils/httpError.ts";
import { isCustomerId } from "../utils/customerId.ts";

/**
 * DB path: `CUSTOMERS_DB_PATH` when set.
 * On Vercel (`VERCEL` is set), use `backend/database.json` under the deployment root.
 * Otherwise `database.json` in cwd — run the API with cwd `backend/` (see `npm run dev` / `npm start`).
 */
function getDbPath(): string {
  const fromEnv = process.env.CUSTOMERS_DB_PATH;
  if (fromEnv?.trim()) {
    return path.resolve(fromEnv.trim());
  }
  if (process.env.VERCEL) {
    return path.resolve(process.cwd(), "backend", "database.json");
  }
  return path.join(process.cwd(), "database.json");
}

function readRaw(): string {
  const dbPath = getDbPath();
  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, "[]\n", "utf8");
    return "[]";
  }
  return readFileSync(dbPath, "utf8");
}

export function loadCustomers(): Customer[] {
  try {
    const raw = readRaw();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("database.json must contain a JSON array");
    }
    return parsed.map(normalizeRow);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to read database";
    throw new HttpError(500, ErrorCodes.INTERNAL_ERROR, `Database error: ${msg}`);
  }
}

export function saveCustomers(customers: Customer[]): void {
  try {
    writeFileSync(
      getDbPath(),
      `${JSON.stringify(customers, null, 2)}\n`,
      "utf8"
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to write database";
    throw new HttpError(500, ErrorCodes.INTERNAL_ERROR, `Database error: ${msg}`);
  }
}

function normalizeRow(row: unknown, index: number): Customer {
  if (!row || typeof row !== "object") {
    throw new Error(`Invalid customer at index ${index}`);
  }
  const r = row as Record<string, unknown>;
  const id = typeof r.id === "string" ? r.id : "";
  const name = typeof r.name === "string" ? r.name : "";
  const email = typeof r.email === "string" ? r.email : "";
  const phone = typeof r.phone === "string" ? r.phone : "";
  if (!id || !name || !email || !phone) {
    throw new Error(`Customer at index ${index} is missing required fields`);
  }
  if (!isCustomerId(id)) {
    throw new Error(
      `Customer at index ${index} has invalid id (expected UUID v4)`
    );
  }
  return { id, name, email, phone };
}
