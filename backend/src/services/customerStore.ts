import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Customer } from "../types/customer.js";
import { ErrorCodes } from "../constants/errorCodes.js";
import { HttpError } from "../utils/httpError.js";
import { isCustomerId } from "../utils/customerId.js";

/**
 * On Vercel the deployment filesystem is read-only, so we copy the bundled
 * seed file to `/tmp/database.json` on first access and read/write there.
 * Locally, `database.json` lives in cwd (the `backend/` folder).
 */
function getDbPath(): string {
  const fromEnv = process.env.CUSTOMERS_DB_PATH;
  if (fromEnv?.trim()) {
    return path.resolve(fromEnv.trim());
  }
  if (process.env.VERCEL) {
    const tmpDb = "/tmp/database.json";
    if (!existsSync(tmpDb)) {
      const seed = path.resolve(process.cwd(), "backend", "database.json");
      if (existsSync(seed)) {
        copyFileSync(seed, tmpDb);
      } else {
        writeFileSync(tmpDb, "[]\n", "utf8");
      }
    }
    return tmpDb;
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
