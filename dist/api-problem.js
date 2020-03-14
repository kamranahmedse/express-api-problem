"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var ApiProblem = /** @class */ (function (_super) {
    __extends(ApiProblem, _super);
    function ApiProblem(props) {
        var _a;
        var _this = _super.call(this, props.title) || this;
        _this.status = props.status || http_status_codes_1.INTERNAL_SERVER_ERROR;
        _this.title = props.title || http_status_codes_1.getStatusText(_this.status) || 'Unknown error';
        _this.additional = props.additional;
        _this.description = props.description;
        _this.type = ((_a = props === null || props === void 0 ? void 0 : props.additional) === null || _a === void 0 ? void 0 : _a.type) || 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html';
        return _this;
    }
    ApiProblem.prototype.toJSON = function () {
        return JSON.stringify({
            additional: this.additional,
            description: this.description,
            status: this.status,
            title: this.title
        });
    };
    return ApiProblem;
}(Error));
exports.default = ApiProblem;
