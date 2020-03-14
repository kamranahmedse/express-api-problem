import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ErrorRequestHandler } from 'express-serve-static-core';
import ApiProblem from './api-problem';

const contentType: string = 'application/problem+json';

const ExpressProblemMiddleware: ErrorRequestHandler = function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiProblem) {
    res.status(err.status)
      .header('Content-Type', contentType)
      .json(JSON.stringify(err));
  } else if (err instanceof Error) {
    const error: ApiProblem = new ApiProblem({
      status: INTERNAL_SERVER_ERROR,
      additional: {
        stack: err?.stack?.split('\n') || undefined
      }
    });

    res.status(error.status)
      .header('Content-Type', contentType)
      .json(JSON.stringify(error));
  } else {
    next();
  }
};

export default ExpressProblemMiddleware;
