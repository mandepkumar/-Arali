import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";

describe("customers API", () => {
  let createApp: typeof import("../src/app.ts").createApp;

  beforeEach(async () => {
    const dir = mkdtempSync(join(tmpdir(), "customers-api-"));
    const dbPath = join(dir, "database.json");
    process.env.CUSTOMERS_DB_PATH = dbPath;
    writeFileSync(dbPath, "[]\n", "utf8");
    vi.resetModules();
    ({ createApp } = await import("../src/app.ts"));
  });

  afterEach(() => {
    delete process.env.CUSTOMERS_DB_PATH;
  });

  it("GET / returns 303 with Location /customers", async () => {
    const app = createApp();
    const res = await request(app).get("/").redirects(0);
    expect(res.status).toBe(303);
    expect(res.headers.location).toBe("/customers");
  });

  it("GET /customers returns 200 and an array", async () => {
    const app = createApp();
    const res = await request(app).get("/customers");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
  });

  it("POST /customers creates a customer (201) and persists to DB file", async () => {
    const app = createApp();
    const body = {
      name: "Test User",
      email: "test.user@student.arali",
      phone: "+1-555-0199",
    };
    const res = await request(app).post("/customers").send(body);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body);
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(res.headers.location).toBe(`/customers/${res.body.id}`);

    const list = await request(app).get("/customers");
    expect(list.body).toHaveLength(1);
    expect(list.body[0].email).toBe(body.email);

    const raw = readFileSync(process.env.CUSTOMERS_DB_PATH!, "utf8");
    const stored = JSON.parse(raw) as unknown[];
    expect(stored).toHaveLength(1);
  });

  it("POST /customers prepends so newest appears first in GET /customers", async () => {
    const app = createApp();
    const first = await request(app).post("/customers").send({
      name: "First",
      email: "first@student.arali",
      phone: "+91-90000-00001",
    });
    const second = await request(app).post("/customers").send({
      name: "Second",
      email: "second@student.arali",
      phone: "+91-90000-00002",
    });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);

    const list = await request(app).get("/customers");
    expect(list.body).toHaveLength(2);
    expect(list.body[0].email).toBe("second@student.arali");
    expect(list.body[1].email).toBe("first@student.arali");
  });

  it("POST /customers with invalid body returns 422", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/customers")
      .send({ name: "", email: "not-an-email", phone: "1" });
    expect(res.status).toBe(422);
    expect(res.body?.error?.code).toBe("VALIDATION_ERROR");
    expect(res.body?.error?.message).toBeTruthy();
  });

  it("DELETE /customers/:id returns 204 and removes the row", async () => {
    const app = createApp();
    const created = await request(app).post("/customers").send({
      name: "To Delete",
      email: "to.delete@student.arali",
      phone: "+1-555-0188",
    });
    const id = created.body.id as string;

    const del = await request(app).delete(`/customers/${id}`);
    expect(del.status).toBe(204);
    expect(del.text).toBe("");

    const list = await request(app).get("/customers");
    expect(list.body).toEqual([]);
  });

  it("DELETE /customers/:id with valid UUID but missing row returns 404", async () => {
    const app = createApp();
    const res = await request(
      app
    ).delete("/customers/00000000-0000-4000-8000-000000000099");
    expect(res.status).toBe(404);
    expect(res.body?.error?.code).toBe("NOT_FOUND");
  });

  it("DELETE /customers/:id with invalid UUID returns 400", async () => {
    const app = createApp();
    const res = await request(app).delete("/customers/does-not-exist");
    expect(res.status).toBe(400);
    expect(res.body?.error?.code).toBe("INVALID_CUSTOMER_ID");
  });

  it("GET /customers/:id with invalid UUID returns 400", async () => {
    const app = createApp();
    const res = await request(app).get("/customers/not-a-uuid");
    expect(res.status).toBe(400);
    expect(res.body?.error?.code).toBe("INVALID_CUSTOMER_ID");
  });
});
