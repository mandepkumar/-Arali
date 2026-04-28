import { useCallback, useMemo, useState, type FormEvent } from "react";
import { AlertBanner } from "@/components/AlertBanner/AlertBanner.tsx";
import { Button } from "@/components/Button/Button.tsx";
import { Card } from "@/components/Card/Card.tsx";
import { Dialog } from "@/components/Dialog/Dialog.tsx";
import {
  getCustomersApiErrorMessage,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "./api/customersApi.ts";
import { CustomerForm } from "./components/CustomerForm/CustomerForm.tsx";
import { CustomersTable } from "./components/CustomersTable/CustomersTable.tsx";
import type {
  Customer,
  CustomerForm as CustomerFormValues,
} from "./types.ts";
import {
  validateCustomerForm,
  type CustomerFieldErrors,
} from "./validation/customerFormSchema.ts";
import "./CustomersPage.css";

const emptyForm: CustomerFormValues = { name: "", email: "", phone: "" };
const CREATE_CUSTOMER_FORM_ID = "create-customer-form";

export function CustomersPage() {
  const { data: customers = [], isLoading, isError, error } =
    useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [form, setForm] = useState<CustomerFormValues>(emptyForm);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CustomerFieldErrors>({});

  const isDirty = useMemo(
    () =>
      form.name.trim() !== "" ||
      form.email.trim() !== "" ||
      form.phone.trim() !== "",
    [form]
  );

  const listError = isError ? getCustomersApiErrorMessage(error) : null;

  const handleFormChange = (field: keyof CustomerFormValues, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleDialogClosed = useCallback(() => {
    setDialogOpen(false);
    setForm(emptyForm);
    setActionError(null);
    setFieldErrors({});
  }, []);

  const openDialog = () => {
    setActionError(null);
    setFieldErrors({});
    setDeleteTarget(null);
    setDialogOpen(true);
  };

  const handleDiscard = () => {
    setForm(emptyForm);
    setActionError(null);
    setFieldErrors({});
    setDeleteTarget(null);
    setDialogOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);

    const validation = validateCustomerForm(form);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      await createCustomer(validation.data).unwrap();
      setForm(emptyForm);
      setFieldErrors({});
      setDialogOpen(false);
    } catch (err) {
      setActionError(getCustomersApiErrorMessage(err));
    }
  };

  const requestDelete = (customer: Customer) => {
    setActionError(null);
    if (dialogOpen) {
      setForm(emptyForm);
      setFieldErrors({});
    }
    setDialogOpen(false);
    setDeleteTarget({ id: customer.id, name: customer.name });
  };

  const handleDeleteDialogClosed = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionError(null);
    try {
      await deleteCustomer(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      setActionError(getCustomersApiErrorMessage(err));
    }
  };

  /** Only initial load hides the table; refetch after mutations keeps rows visible. */
  const loading = isLoading;
  const submitting = isCreating;

  return (
    <div className="customers-page" id="top">
      {listError && (
        <AlertBanner variant="error">{listError}</AlertBanner>
      )}
      {actionError && !dialogOpen && deleteTarget === null && (
        <AlertBanner variant="error">{actionError}</AlertBanner>
      )}

      <div className="customers-toolbar">
        <h1 className="customers-toolbar__title">Customers</h1>
        <Button
          type="button"
          variant="primary"
          onClick={openDialog}
          aria-label="Add customer"
        >
          Add customer
        </Button>
      </div>

      <section id="customers" className="customers-page__table">
        <Card>
          <CustomersTable
            customers={customers}
            loading={loading}
            onDelete={requestDelete}
          />
        </Card>
      </section>

      {/* At most one modal at a time (portal); add modal only mounts when open. */}
      {deleteTarget ? (
        <Dialog
          key="customer-delete"
          open
          title="Remove customer?"
          isDirty={false}
          onClosed={handleDeleteDialogClosed}
          footer={
            <>
              <Button type="button" variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={isDeleting}
                onClick={() => void confirmDelete()}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </Button>
            </>
          }
        >
          {actionError ? (
            <AlertBanner variant="error">{actionError}</AlertBanner>
          ) : null}
          <p className="customers-page__delete-confirm">
            Are you sure you want to remove{" "}
            <strong>{deleteTarget.name}</strong>? This cannot be undone.
          </p>
        </Dialog>
      ) : dialogOpen ? (
        <Dialog
          key="customer-create"
          open
          title="Add new customer"
          isDirty={isDirty}
          onClosed={handleDialogClosed}
          footer={
            <>
              <Button type="button" variant="secondary" onClick={handleDiscard}>
                Discard
              </Button>
              <Button
                type="submit"
                form={CREATE_CUSTOMER_FORM_ID}
                variant="primary"
                disabled={submitting}
              >
                {submitting ? "Saving…" : "Add user"}
              </Button>
            </>
          }
        >
          {actionError ? (
            <AlertBanner variant="error">{actionError}</AlertBanner>
          ) : null}
          <CustomerForm
            formId={CREATE_CUSTOMER_FORM_ID}
            hideActions
            values={form}
            submitting={submitting}
            fieldErrors={fieldErrors}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        </Dialog>
      ) : null}
    </div>
  );
}
