import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware factory for Zod validation on Request body, query, and params
 */
export const validate =
  (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      next(error);
    }
  };
