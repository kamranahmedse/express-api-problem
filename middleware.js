var ApiProblem = require('./index');

var contentType = 'application/problem+json';

module.exports = function (err, req, res, next) {
  if (err instanceof ApiProblem) {
    res.status(err.status)
      .header('Content-Type', contentType)
      .send(JSON.stringify(err));
  } else if (err instanceof Error) {
    var error = new ApiProblem(500, 'Internal Error', err.message, {
      stack: err.stack.split('\n')
    });
    res.status(error.status)
      .header('Content-Type', contentType)
      .send(JSON.stringify(error));
  } else {
    next();
  }
};
