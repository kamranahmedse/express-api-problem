# express-api-problem

> Automatically turns your thrown exceptions to the JSON response while conforming to API problem specification

An express package that lets you handle the API problems with ease.

Faulty provides a straightforward implementation of [IETF Problem Specification](https://tools.ietf.org/html/draft-nottingham-http-problem-07) and turns your exceptions to be returned in the below format with the content type of `application/problem+json`

```json
{
   "status": 403,
   "type": "http://example.com/problems/out-of-credit",
   "title": "You do not have enough credit.",
   "detail": "Your current balance is 30, but the item costs 50.",
   "instance": "http://example.net/account/12345/logs?id=233"
}
```
Where
- `title` is the summary of problem
- `status` is the status code
- `detail` is human readable explanation specific to problem
- `type` is the absolute URI that identifies the type of problem
- `instance` is the absolute URI that identifies the specific occurrence of the problem

## Installation

```
yarn add express-api-problem
```


## Usage

Register the middleware
```javascript
var ApiProblemHandler = require('express-api-problem/middleware');

app.use(ApiProblemHandler);
```

Throw exceptions while instantiating `ApiProblem` having the following signature

```javascript
var ApiProblem = require('express-api-problem');

// statusCode : HTTP status code to be returned
// title : Title in response
// description : Description of the exception
// additionalDetail : Object having any additional detail that you may want to send
throw new ApiProblem(statusCode, title, description, additionalDetail);
```

## Examples

Throwing exception using only status code
```javascript
throw new ApiProblem(400);

// {
//    status: 400,
//    title: 'Bad Request',
//    type: 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
// }
```
Providing description string
```javascript
throw new ApiProblem(404, 'User not found', 'No user found against the given ID: 10');

// {
//    status: 404,
//    title: 'User not found',
//    description: 'No user found against the given ID: 10',
//    type: 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
// }
````
Using object in description

```javascript
throw new ApiProblem(400, 'Validation failed', {
    name: 'Name field is required',
    email: 'Invalid email given'
});

// {
//    status: 422,
//    title: 'Unprocessable entity',
//    description: {
//      name: ..
//      email: ..
//    },
//    type: 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
// }
```
Adding additional detail to response
```javascript
throw new ApiProblem(400, 'Insufficient Balance', 'You do not have enough balance to purchase the product', {
  available_balance: 'USD 2000',
  required_balance: 'USD 12422'
});

// {
//    status: 400,
//    title: 'Insufficient Balance',
//    description: 'You do not have enough balance to purchase the product',
//    available_balance: 'USD 2000',
//    required_balance: 'USD 12422',
//    type: 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
// }
```

## Contributing
Feel free to fork, enhance, create PR and lock issues.

## License
MIT © [Kamran Ahmed](http://kamranahmed.info)
