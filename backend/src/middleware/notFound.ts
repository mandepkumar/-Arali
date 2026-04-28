import type { Request, Response } from "express";
import { ErrorCodes } from "../constants/errorCodes.ts";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: "The requested resource does not exist",
    },
  });
}
