import { ErrorCodes } from "../constants/errorCodes.ts";
import type { CreateCustomerInput, Customer } from "../types/customer.ts";
import { isCustomerId, newCustomerId } from "../utils/customerId.ts";
import { HttpError } from "../utils/httpError.ts";
import { loadCustomers, saveCustomers } from "./customerStore.ts";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function listCustomers(): Customer[] {
  return loadCustomers();
}

export function getCustomerById(id: string): Customer {
  if (!isCustomerId(id)) {
    throw new HttpError(
      400,
      ErrorCodes.INVALID_CUSTOMER_ID,
      "Customer id must be a valid UUID"
    );
  }
  const customers = loadCustomers();
  const found = customers.find((c) => c.id === id);
  if (!found) {
    throw new HttpError(
      404,
      ErrorCodes.NOT_FOUND,
      `No customer exists with id "${id}"`
    );
  }
  return found;
}

export function createCustomer(input: CreateCustomerInput): Customer {
  const customers = loadCustomers();
  const emailKey = normalizeEmail(input.email);
  const duplicate = customers.some((c) => normalizeEmail(c.email) === emailKey);
  if (duplicate) {
    throw new HttpError(
      409,
      ErrorCodes.CONFLICT,
      "A customer with this email already exists"
    );
  }
  const customer: Customer = {
    id: newCustomerId(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
  };
  customers.unshift(customer);
  saveCustomers(customers);
  return customer;
}

export function deleteCustomerById(id: string): void {
  if (!isCustomerId(id)) {
    throw new HttpError(
      400,
      ErrorCodes.INVALID_CUSTOMER_ID,
      "Customer id must be a valid UUID"
    );
  }
  const customers = loadCustomers();
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new HttpError(
      404,
      ErrorCodes.NOT_FOUND,
      `No customer exists with id "${id}"`
    );
  }
  customers.splice(idx, 1);
  saveCustomers(customers);
}
