import ApiProblem from './api-problem';
import { ErrorRequestHandler} from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

const contentType: string = 'application/problem+json';

const ProblemMiddleware: ErrorRequestHandler = function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiProblem) {
    res.status(err.status)
      .header('Content-Type', contentType)
      .send(err.toJSON());
  } else if (err instanceof Error) {
    const error: ApiProblem = new ApiProblem({
      status: INTERNAL_SERVER_ERROR,
      additional: {
        stack: err?.stack?.split('\n') || undefined
      }
    });

    res.status(error.status)
      .header('Content-Type', contentType)
      .send(error.toJSON());
  } else {
    next();
  }
};

export default ProblemMiddleware;
