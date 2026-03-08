import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        file: req.file,
      });
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const zodError = err as z.ZodError;
        return res.status(400).json({
          message: "NG",
          error: "Validation Failed",
          details: zodError.issues.map((error: any) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        });
      }
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const zodError = err as z.ZodError;
        return res.status(400).json({
          message: "NG",
          error: "Validation Failed",
          details: zodError.issues.map((error: any) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        });
      }
    }
  };
}
