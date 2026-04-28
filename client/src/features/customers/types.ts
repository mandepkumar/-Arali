/** `id` is a UUID returned by the API (RFC 4122 string). */
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type CustomerForm = Pick<Customer, "name" | "email" | "phone">;
