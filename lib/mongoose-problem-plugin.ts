import { MongoError } from 'mongodb';
import { NextFunction } from 'express';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { Error, MongooseDocument, Schema } from 'mongoose';
import ApiProblem, { ApiProblemOptionsType } from './api-problem';

export type FormattedErrorType = {
  field: string;
  message: string;
};

type MongoErrorHandler = (
  err: MongoError,
  doc: MongooseDocument,
  next: NextFunction,
) => void;

export function getErrorHandler(options: ApiProblemOptionsType = {}): MongoErrorHandler {
  function validationErrorHandler(
    err: MongoError,
    doc: MongooseDocument,
    next: NextFunction,
  ): void {
    if (err.name !== 'ValidationError') {
      return next(err);
    }

    const typedError: Error.ValidationError = err as any;
    const formattedErrors: FormattedErrorType[] = [];

    // For each of the mongo errors, format them
    for (const error in typedError.errors) {
      formattedErrors.push({
        field: typedError.errors[error].path,
        message: typedError.errors[error].message,
      });
    }

    next(
      new ApiProblem({
        status: options.status || UNPROCESSABLE_ENTITY,
        title: options.title || 'Validation Failed',
        ...options,
        detail: formattedErrors,
      }),
    );
  }

  return validationErrorHandler;
}

function MongooseProblemPlugin(schema: Schema, options: ApiProblemOptionsType = {}) {
  schema.post('save', getErrorHandler(options));
}

export default MongooseProblemPlugin;
