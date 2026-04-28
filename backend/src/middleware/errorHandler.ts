import type { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants/errorCodes.ts";
import { HttpError } from "../utils/httpError.ts";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: {
        code: ErrorCodes.INVALID_JSON,
        message: "Request body must be valid JSON",
      },
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message,
    },
  });
}
