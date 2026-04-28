import { Router } from "express";
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomerHandler,
  listCustomersHandler,
} from "../controllers/customers.controller.ts";
import { validateBody } from "../middleware/validateRequest.ts";
import { createCustomerSchema } from "../validators/customer.schemas.ts";

export const customersRouter = Router();

customersRouter.get("/", listCustomersHandler);
customersRouter.get("/:id", getCustomerHandler);
customersRouter.post("/", validateBody(createCustomerSchema), createCustomerHandler);
customersRouter.delete("/:id", deleteCustomerHandler);
