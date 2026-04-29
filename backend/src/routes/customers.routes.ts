import { Router } from "express";
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomerHandler,
  listCustomersHandler,
} from "../controllers/customers.controller.js";
import { validateBody } from "../middleware/validateRequest.js";
import { createCustomerSchema } from "../validators/customer.schemas.js";

export const customersRouter = Router();

customersRouter.get("/", listCustomersHandler);
customersRouter.get("/:id", getCustomerHandler);
customersRouter.post("/", validateBody(createCustomerSchema), createCustomerHandler);
customersRouter.delete("/:id", deleteCustomerHandler);
