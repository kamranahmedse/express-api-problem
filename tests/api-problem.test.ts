import ApiProblem, { IApiProblem } from '../lib/api-problem';

describe('api-problem', function () {
  it.each([
    ['Server Error', undefined],
    ['Bad Request', 400],
    ['Unprocessable Entity', 422],
    ['Server Error', 500],
    ['Unauthorized', 401],
    ['Forbidden', 403],
    ['Service Unavailable', 503],
    ['Not Found', 404]
  ])('should be able to generate title from only status code', (expectedTitle: string, statusCode?: number) => {
    const problem: ApiProblem = new ApiProblem({ status: statusCode });

    expect(problem.status).toEqual(statusCode || 500);
    expect(problem.title).toEqual(expectedTitle);
  });

  it.each([
    [{
      status: 400,
      title: 'An Error',
      description: 'An Error Occurred',
      type: 'some error',
      additional: {
        instance: 'Additional values with objects'
      }
    }],
    [{
      status: 500,
      title: 'Non existing additional data',
      description: 'An Error Occurred',
      type: 'some error'
    }]
  ])('should be able to stringify errors', (params: IApiProblem) => {
    const problem: ApiProblem = new ApiProblem(params);

    expect(JSON.stringify(problem))
      .toEqual(JSON.stringify(params));
  });

  it('should assign default values', () => {
    const problem: ApiProblem = new ApiProblem();

    expect(JSON.stringify(problem))
      .toEqual(JSON.stringify({
        'status': 500,
        'title': 'Server Error',
        'type': 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
      }));
  });
});
