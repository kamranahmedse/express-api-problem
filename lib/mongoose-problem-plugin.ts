import ApiProblem, { IApiProblem } from './api-problem';
import { Error, MongooseDocument, Schema } from 'mongoose';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { MongoError } from 'mongodb';
import { NextFunction } from 'express';

export type FormattedErrorType = {
  field: string;
  message: string;
}

function MongooseProblemPlugin(schema: Schema, options: IApiProblem = {}) {
  function validationErrorHandler(err: MongoError, doc: MongooseDocument, next: NextFunction): void {
    if (err.name !== 'ValidationError') {
      return next(err);
    }

    const typedError: Error.ValidationError = err as any;
    const formattedErrors: FormattedErrorType[] = [];

    // For each of the mongo errors, format them
    for (const error in typedError.errors) {
      formattedErrors.push({
        field: typedError.errors[error].path,
        message: typedError.errors[error].message
      });
    }

    next(new ApiProblem({
      status: options.status || UNPROCESSABLE_ENTITY,
      title: options.title || 'Validation Failed',
      additional: formattedErrors
    }));
  }

  schema.post('save', validationErrorHandler);
}

export default MongooseProblemPlugin;
