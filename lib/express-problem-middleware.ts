import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ErrorRequestHandler } from 'express-serve-static-core';
import ApiProblem from './api-problem';

type MiddlewareOptionsType = { stackTrace?: boolean; contentType?: string };
type ExpressProblemMiddlewareType = (
  options?: MiddlewareOptionsType,
) => ErrorRequestHandler;

const ExpressProblemMiddleware: ExpressProblemMiddlewareType = function(
  options: MiddlewareOptionsType = {},
): ErrorRequestHandler {
  // Merge the options with defaults
  options = {
    stackTrace: true,
    contentType: 'application/problem+json',
    ...options,
  };

  return function(err: any, req: Request, res: Response, next: NextFunction) {
    // For API problems, just respond with the error
    if (err instanceof ApiProblem) {
      res
        .status(err.status)
        .header('Content-Type', options.contentType)
        .json(JSON.stringify(err));

      return;
    }

    // For Exceptions, create internal error exception
    if (err instanceof Error) {
      const error: ApiProblem = new ApiProblem({
        status: INTERNAL_SERVER_ERROR,
        detail: err.message,
        additional: options.stackTrace
          ? {
            stack: err?.stack || undefined,
          }
          : undefined,
      });

      res
        .status(error.status)
        .header('Content-Type', options.contentType)
        .json(JSON.stringify(error));

      return;
    }

    next();
  };
};

export default ExpressProblemMiddleware;
