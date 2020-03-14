import MongooseProblemPlugin from '../lib/mongoose-problem-plugin';
import { Schema } from 'mongoose';

describe('MongooseProblemPlugin', function () {
  it('should set up the hook to handle validation errors', () => {
    const schema: Schema = {} as any;
    schema.post = jest.fn();

    MongooseProblemPlugin(schema);

    expect(schema.post).toHaveBeenCalledTimes(1);
    expect(schema.post).toHaveBeenCalledWith('save', expect.any(Function));
  });
});
