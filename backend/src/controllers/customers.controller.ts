import type { Request, Response, NextFunction } from "express";
import {
  createCustomer,
  deleteCustomerById,
  getCustomerById,
  listCustomers,
} from "../services/customerService.ts";
import type { CreateCustomerBody } from "../validators/customer.schemas.ts";

type ValidatedRequest = Request & { validatedBody: CreateCustomerBody };

function wantsAsyncAccept(req: Request): boolean {
  const prefer = req.get("prefer");
  return Boolean(prefer?.toLowerCase().includes("respond-async"));
}

export function listCustomersHandler(_req: Request, res: Response): void {
  res.status(200).json(listCustomers());
}

export function getCustomerHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void {
  try {
    const customer = getCustomerById(req.params.id);
    res.status(200).json(customer);
  } catch (e) {
    next(e);
  }
}

export function createCustomerHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const body = (req as ValidatedRequest).validatedBody;
    const customer = createCustomer(body);
    const location = `/customers/${customer.id}`;
    res.setHeader("Location", location);

    // RFC 7240: Prefer: respond-async → 202 Accepted (request accepted; same persistence path)
    if (wantsAsyncAccept(req)) {
      res.status(202).json(customer);
      return;
    }

    res.status(201).json(customer);
  } catch (e) {
    next(e);
  }
}

export function deleteCustomerHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void {
  try {
    deleteCustomerById(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
