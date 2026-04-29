import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { ErrorCodes } from "../constants/errorCodes.js";
import { HttpError } from "../utils/httpError.js";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(zodToHttpError(result.error));
    }
    (req as Request & { validatedBody: T }).validatedBody = result.data;
    return next();
  };
}

function zodToHttpError(err: ZodError): HttpError {
  const details = err.issues.map((e) => ({
    path: e.path.length ? e.path.join(".") : "body",
    message: e.message,
  }));
  const message =
    details.length === 1
      ? details[0].message
      : "One or more fields failed validation";
  return new HttpError(422, ErrorCodes.VALIDATION_ERROR, message, details);
}
