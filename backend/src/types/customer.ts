/** `id` is always a UUID v4 string (see `newCustomerId` / DB validation). */
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type CreateCustomerInput = Pick<Customer, "name" | "email" | "phone">;
