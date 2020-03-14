import { NextFunction, Request, Response } from 'express';
import ExpressProblemMiddleware from '../lib/express-problem-middleware';
import ApiProblem, { IApiProblem } from '../lib/api-problem';

describe('middleware', () => {
  let res: Response;
  let resHeader: jest.Mock;
  let resStatus: jest.Mock;
  let resJson: jest.Mock;

  function setUpExpressMocks() {
    resJson = jest.fn();
    resStatus = jest.fn();
    resHeader = jest.fn();
    res = {
      header: resHeader,
      status: resStatus,
      json: resJson
    } as any;

    resJson.mockImplementation(() => res);
    resStatus.mockImplementation(() => res);
    resHeader.mockImplementation(() => res);
  }

  beforeAll(setUpExpressMocks);

  it.each([
    [undefined],
    [null],
    [false],
    [{}],
    [{ value: 'some' }],
    [4]
  ])('should ignore any non errors and call next', (errorParam: any) => {
    const req: Request = jest.fn() as any;
    const res: Response = jest.fn() as any;
    const next: NextFunction = jest.fn() as any;

    ExpressProblemMiddleware(errorParam, req, res, next);

    expect(req).not.toHaveBeenCalled();
    expect(res).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should respond with API problem response for ApiProblem', () => {
    const req: Request = jest.fn() as any;
    const next: NextFunction = jest.fn() as any;

    const problemParams: IApiProblem = {
      status: 400,
      title: 'Bad Request',
      description: 'Some bad request',
      type: 'Some type',
      additional: {}
    };

    ExpressProblemMiddleware(new ApiProblem(problemParams), req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(resHeader).toHaveBeenCalledTimes(1);
    expect(resStatus).toHaveBeenCalledTimes(1);
    expect(resJson).toHaveBeenCalledTimes(1);

    expect(resHeader).toHaveBeenCalledWith('Content-Type', 'application/problem+json');
    expect(resStatus).toHaveBeenCalledWith(400);
    expect(resJson).toHaveBeenCalledWith(JSON.stringify(problemParams));
  });
});
