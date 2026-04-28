import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Customer, CustomerForm } from "../types.ts";

function parseErrorData(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const root = data as Record<string, unknown>;
  if (typeof root.error === "string") return root.error;
  if (typeof root.error === "object" && root.error !== null) {
    const err = root.error as Record<string, unknown>;
    if (typeof err.message === "string") {
      if (Array.isArray(err.details) && err.details.length > 0) {
        const parts = err.details.map((d) => {
          if (typeof d !== "object" || d === null) return "";
          const o = d as Record<string, unknown>;
          const path = typeof o.path === "string" ? o.path : "";
          const msg = typeof o.message === "string" ? o.message : "";
          return path ? `${path}: ${msg}` : msg;
        });
        const joined = parts.filter(Boolean).join("; ");
        if (joined) return joined;
      }
      return err.message;
    }
  }
  return undefined;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "/",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery,
  tagTypes: ["Customer"],
  endpoints: (build) => ({
    getCustomers: build.query<Customer[], void>({
      query: () => ({ url: "/customers", method: "GET" }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((c) => ({ type: "Customer" as const, id: c.id })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),
    createCustomer: build.mutation<Customer, CustomerForm>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    deleteCustomer: build.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;

export function getCustomersApiErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error
  ) {
    const msg = parseErrorData((error as { data: unknown }).data);
    if (msg) return msg;
    const status = (error as { status?: number }).status;
    if (typeof status === "number") return `Request failed (${status})`;
  }
  if (error instanceof Error) return error.message;
  return "Request failed";
}
