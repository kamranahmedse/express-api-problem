var ApiProblem = require('./index');

module.exports = function (err, req, res, next) {
  if (err instanceof ApiProblem) {
    res.status(err.status)
      .header('Content-Type', 'application/problem+json')
      .send(JSON.stringify(err));
  } else {
    next();
  }
};
