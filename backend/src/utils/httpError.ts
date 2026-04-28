import type { ErrorCode } from "../constants/errorCodes.ts";

export type FieldErrorDetail = {
  path: string;
  message: string;
};

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode | string;
  readonly details?: FieldErrorDetail[];

  constructor(
    statusCode: number,
    code: ErrorCode | string,
    message: string,
    details?: FieldErrorDetail[]
  ) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toJSON(): {
    error: {
      code: string;
      message: string;
      details?: FieldErrorDetail[];
    };
  } {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details?.length ? { details: this.details } : {}),
      },
    };
  }
}
