var ApiProblem = require('./index');

module.exports = function (schema, options) {
  options = options || {};

  var validationErrorHandler = function (err, doc, next) {
    if (err && err.name === 'ValidationError') {
      var formattedErrors = [];

      for (var error in err.errors) {
        if (!err.errors.hasOwnProperty(error)) {
          continue;
        }

        formattedErrors.push({
          field: err.errors[error].path,
          message: err.errors[error].message
        });
      }

      next(new ApiProblem(
        options.status || 422,
        options.title || 'Validation Failed',
        formattedErrors
      ));

    } else {
      next(err);
    }
  };

  schema.post('save', validationErrorHandler);
};
