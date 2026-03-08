import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export default function errorMiddleware(
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = "statusCode" in err ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    message: "NG",
    error: message,
  });
}
