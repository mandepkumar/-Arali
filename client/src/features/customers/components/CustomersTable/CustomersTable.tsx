import { Button } from "@/components/Button/Button.tsx";
import { Text } from "@/components/Text/Text.tsx";
import type { Customer } from "../../types.ts";
import { useCustomersTablePagination } from "./useCustomersTablePagination.ts";
import "./CustomersTable.css";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export type CustomersTableProps = {
  customers: Customer[];
  loading: boolean;
  /** Pass the row customer so delete never depends on a stale list lookup. */
  onDelete: (customer: Customer) => void;
};

export function CustomersTable({
  customers,
  loading,
  onDelete,
}: CustomersTableProps) {
  const pagination = useCustomersTablePagination(customers);

  if (loading) {
    return <Text muted>Loading…</Text>;
  }

  if (customers.length === 0) {
    return (
      <Text muted>No customers yet. Use Add customer to create one.</Text>
    );
  }

  const {
    pageItems,
    page,
    pageSize,
    totalPages,
    totalItems,
    rangeStart,
    rangeEnd,
    goPrev,
    goNext,
    hasPrev,
    hasNext,
  } = pagination;

  const fillerCount = Math.max(0, pageSize - pageItems.length);

  return (
    <div className="customers-table-root">
      <div className="customers-table-wrap">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {pageItems.map((c) => (
              <tr key={c.id}>
                <td className="customers-table__name">{c.name}</td>
                <td className="customers-table__email">{c.email}</td>
                <td className="customers-table__phone">{c.phone}</td>
                <td className="customers-table__actions">
                  <Button
                    type="button"
                    variant="danger"
                    className="customers-table__delete-btn"
                    onClick={() => void onDelete(c)}
                    aria-label={`Delete customer ${c.name}`}
                  >
                    <TrashIcon />
                  </Button>
                </td>
              </tr>
            ))}
            {Array.from({ length: fillerCount }, (_, i) => (
              <tr
                key={`filler-${page}-${i}`}
                className="customers-table__filler"
                aria-hidden="true"
              >
                <td colSpan={4}>
                  {"\u00a0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav
        className="customers-table__pagination"
        aria-label="Customers table pagination"
      >
        <p className="customers-table__range" aria-live="polite">
          Showing <strong>{rangeStart}</strong>–<strong>{rangeEnd}</strong> of{" "}
          <strong>{totalItems}</strong>
        </p>
        <div className="customers-table__pager">
          <Button
            type="button"
            variant="secondary"
            disabled={!hasPrev}
            onClick={goPrev}
          >
            Previous
          </Button>
          <span className="customers-table__page">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={!hasNext}
            onClick={goNext}
          >
            Next
          </Button>
        </div>
      </nav>
    </div>
  );
}
