import MongooseProblemPlugin, {
  getErrorHandler,
} from '../lib/mongoose-problem-plugin';
import { MongooseDocument, Schema } from 'mongoose';
import { MongoError } from 'mongodb';
import { NextFunction } from 'express';
import ApiProblem from '../lib/api-problem';

describe('MongooseProblemPlugin', function() {
  it('should set up the hook to handle validation errors', () => {
    const schema: Schema = {} as any;
    schema.post = jest.fn();

    MongooseProblemPlugin(schema);

    expect(schema.post).toHaveBeenCalledTimes(1);
    expect(schema.post).toHaveBeenCalledWith('save', expect.any(Function));
  });

  it('should ignore non-validation errors', () => {
    const handler = getErrorHandler();

    const error: MongoError = { name: 'non-validation' } as any;
    const doc: MongooseDocument = {} as any;
    const next: NextFunction = jest.fn() as any;

    handler(error, doc, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should generate api-problem for validation errors', () => {
    const handler = getErrorHandler();

    const error: MongoError = {
      name: 'ValidationError',
      errors: {
        username: {
          path: 'username',
          message: 'Username must be unique',
        },
        age: {
          path: 'age',
          message: 'Age must be a number',
        },
      },
    } as any;
    const doc: MongooseDocument = {} as any;
    const next: NextFunction = jest.fn(error => {
      expect(error).toBeInstanceOf(ApiProblem);
      expect(JSON.stringify(error)).toEqual(
        JSON.stringify({
          status: 422,
          title: 'Validation Failed',
          detail: [
            { field: 'username', message: 'Username must be unique' },
            { field: 'age', message: 'Age must be a number' },
          ],
        }),
      );
    }) as any;

    handler(error, doc, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
