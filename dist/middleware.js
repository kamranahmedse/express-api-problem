"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_problem_1 = require("./api-problem");
var http_status_codes_1 = require("http-status-codes");
var contentType = 'application/problem+json';
exports.ProblemMiddleware = function (err, req, res, next) {
    var _a;
    if (err instanceof api_problem_1.default) {
        res.status(err.status)
            .header('Content-Type', contentType)
            .send(err.toJSON());
    }
    else if (err instanceof Error) {
        var error = new api_problem_1.default({
            status: http_status_codes_1.INTERNAL_SERVER_ERROR,
            additional: {
                stack: ((_a = err === null || err === void 0 ? void 0 : err.stack) === null || _a === void 0 ? void 0 : _a.split('\n')) || undefined
            }
        });
        res.status(error.status)
            .header('Content-Type', contentType)
            .send(error.toJSON());
    }
    else {
        next();
    }
};
