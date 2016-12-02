var httpStatus = require('http-status-codes');
var util = require('util');

function ApiProblem(statusCode, title, description, type, additional) {

  additional = additional || {};

  this.status = parseInt(statusCode || httpStatus.STATUS_CODES, 10);
  this.title = title || httpStatus.getStatusText(this.status) || 'Unknown error';
  this.description = description || this.title;
  this.type = type || 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html';

  Object.assign(this, additional);
}

util.inherits(ApiProblem, Error);

module.exports = ApiProblem;
