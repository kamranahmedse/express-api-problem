"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_problem_1 = require("./api-problem");
var http_status_codes_1 = require("http-status-codes");
function MongooseProblemPlugin(schema, options) {
    function validationErrorHandler(err, doc, next) {
        if (err.name !== 'ValidationError') {
            return next(err);
        }
        var typedError = err;
        var formattedErrors = [];
        // For each of the mongo errors, format them
        for (var error in typedError.errors) {
            formattedErrors.push({
                field: typedError.errors[error].path,
                message: typedError.errors[error].message
            });
        }
        next(new api_problem_1.default({
            status: options.status || http_status_codes_1.UNPROCESSABLE_ENTITY,
            title: options.title || 'Validation Failed',
            additional: formattedErrors
        }));
    }
    schema.post('save', validationErrorHandler);
}
