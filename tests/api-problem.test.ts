import { ApiProblem, ApiProblemOptionsType, SpecErrorType } from '../lib';

describe('api-problem', function() {
  it.each([
    ['Server Error', undefined],
    ['Bad Request', 400],
    ['Unprocessable Entity', 422],
    ['Server Error', 500],
    ['Unauthorized', 401],
    ['Forbidden', 403],
    ['Service Unavailable', 503],
    ['Not Found', 404],
  ])(
    'should be able to generate title from only status code',
    (expectedTitle: string, statusCode?: number) => {
      const problem: ApiProblem = new ApiProblem({ status: statusCode });

      expect(problem.status).toEqual(statusCode || 500);
      expect(problem.title).toEqual(expectedTitle);
    },
  );

  it.each([
    [
      {
        status: 400,
        title: 'An Error',
        detail: 'An Error Occurred',
        type: 'some error',
        instance: 'http://some/url',
      },
      {
        status: 400,
        title: 'An Error',
        type: 'some error',
        detail: 'An Error Occurred',
        instance: 'http://some/url',
      },
    ],
    [
      {
        status: 500,
        title: 'Non existing additional data',
        detail: 'An Error Occurred',
        type: 'some error',
      },
      {
        status: 500,
        title: 'Non existing additional data',
        detail: 'An Error Occurred',
        type: 'some error',
      },
    ],
    [
      {
        status: 500,
        title: 'Non existing additional data',
        detail: 'An Error Occurred',
        type: 'some error',
        additional: {
          'more': 'nested values',
        },
      },
      {
        status: 500,
        title: 'Non existing additional data',
        detail: 'An Error Occurred',
        type: 'some error',
        more: 'nested values',
      },
    ],
  ])('should be able to stringify errors', (params: ApiProblemOptionsType, expected: SpecErrorType) => {
    const problem: ApiProblem = new ApiProblem(params);

    expect(problem).toMatchObject(expected);
  });

  it('should assign default values', () => {
    const problem: ApiProblem = new ApiProblem();

    expect(JSON.stringify(problem)).toEqual(
      JSON.stringify({
        status: 500,
        title: 'Server Error',
      }),
    );
  });

  it('can attach additional data to errors', () => {
    const error = new ApiProblem({
      status: 400,
      title: 'Insufficient Balance',
      detail: 'You do not have enough balance to purchase the product',
      additional: {
        available_balance: 'USD 2000',
        required_balance: 'USD 12422',
      },
    });

    expect(JSON.stringify(error)).toEqual(JSON.stringify({
      status: 400,
      title: 'Insufficient Balance',
      detail: 'You do not have enough balance to purchase the product',
      available_balance: 'USD 2000',
      required_balance: 'USD 12422',
    }));
  });
});
