import { usePagination } from "@/hooks/usePagination.ts";
import type { Customer } from "../../types.ts";

export const CUSTOMERS_TABLE_PAGE_SIZE = 8;

/** Pagination tuned for the customers table (8 rows per page). */
export function useCustomersTablePagination(customers: readonly Customer[]) {
  return usePagination({
    items: customers,
    pageSize: CUSTOMERS_TABLE_PAGE_SIZE,
  });
}
