# express-api-problem

![](https://img.shields.io/travis/kamranahmedse/express-api-problem/master.svg?style=flat-square)
![](https://img.shields.io/codecov/c/github/kamranahmedse/express-api-problem.svg?style=flat-square)
![](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)

> Automatically turns your thrown exceptions to the JSON response while conforming to API problem specification

An express package that lets you handle the API problems with ease. It provides a straightforward implementation of [IETF Problem Specification](https://tools.ietf.org/html/draft-nottingham-http-problem-07) and turns your thrown exceptions to be returned in the below format with the header of content type set to `application/problem+json`

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

Register the middleware in your server after the routes registration

```javascript
import { ExpressMiddleware as ErrorHandler } from 'express-api-problem';

// Your routes

app.use(ErrorHandler());
```

Throw exceptions while instantiating `ApiProblem` having the following signature

```javascript
import { ApiProblem, FormattedErrorType } from 'express-api-problem';

// status (required): HTTP status code to be returned
// title (optional): Title in response
// detail (optional): Description of the exception or 
// additional (optional): Object having any additional detail that you may want to send in response
throw new ApiProblem({
  status: 400,
  title: 'Validation Failed',
  detail: 'Invalid username or password given',
  type: '2882',
  instance: 'http://some.url/for/details',
});

// or call `next` with an instance of ApiProblem
next(new ApiProblem({
  status: 400,
  title: 'Insufficient Balance',
  detail: 'You do not have enough balance to purchase the product',
  additional: {
    available_balance: 'USD 2000',
    required_balance: 'USD 12422',
  },
}));

// Will return the below JSON with 400 status code and below response
// {
//   status: 400,
//   title: 'Insufficient Balance',
//   detail: 'You do not have enough balance to purchase the product',
//   available_balance: 'USD 2000',
//   required_balance: 'USD 12422',
// }

```

Add the mongoose plugin to automatically transform your model validation errors to API Problem

```javascript
import { MongoosePlugin as ApiProblemPlugin } from 'express-api-problem/mongoose-plugin';

// Will transform any validation exceptions thrown by your model to
//
//  {
//     status: 422,
//     title: "Validation Failed",
//     detail: [
//        {
//          field: "title",
//          message: "Title must be unique"
//        },
//        {
//          field: "expiryDate",
//          message: "Expiry Date must be a valid date"
//        }
//     ]
// }
//
yourSchema.plugin(ApiProblemPlugin, {
  status: 422, // Defaults to 422, you can override here
  title: "Validation Failed", // Defaults to "Validation Failed", you can override here
  instance: null, // Add string value if any
  additional: {}, // Add more details if any
  type: "", // Add type information if any
});
```

## Examples

Throwing exception using only status code
```javascript
throw new ApiProblem();

// {
//    status: 500,
//    title: 'Internal Server Error',
//    stacktrace: "",   // if enabled while registering the middleware
// }
```
Providing description string
```javascript
throw new ApiProblem({
  status: 400,
  title: 'An Error',
  detail: 'An Error Occurred',
  type: 'some error',
  instance: 'http://some/url',
});

// {
//   status: 404,
//   title: 'User not found',
//   detail: 'No user found against the given ID: 10',
//   type: 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
// }
````

Providing error format in the form of field and messages

```javascript
throw new ApiProblem({
  status: 400,
  title: 'An Error',
  detail: [{"field": "some_field", "message": "Some validation message"}],
  type: 'some error',
  instance: 'http://some/url',
});

// {
//   status: 404,
//   title: 'User not found',
//   detail: [
//     {
//       "field": "some_field", 
//       "message": "Some validation message"
//     }
//   ],
//   type: 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html'
// }
```

Attaching more details

```javascript
throw new ApiProblem({
  status: 500,
  title: 'Non existing additional data',
  detail: 'An Error Occurred',
  type: 'some error',
  additional: {
    'more': 'nested values',
  },
});

// {
//  status: 500,
//  title: 'Non existing additional data',
//  detail: 'An Error Occurred',
//  type: 'some error',
//  more: 'nested values',
// }
```

## Contributing
Feel free to fork, enhance, create PR and lock issues.

## License
MIT © [Kamran Ahmed](http://kamranahmed.info)
