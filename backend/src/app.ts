import express, { type Request, type Response } from "express";
import cors from "cors";
import { customersRouter } from "./routes/customers.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  // 303 See Other — redirect root to the customers collection (browser-friendly)
  app.get("/", (_req: Request, res: Response) => {
    res.redirect(303, "/customers");
  });

  app.use("/customers", customersRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
