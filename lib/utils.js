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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var once_1 = __importDefault(require("once"));
var exenv_1 = require("exenv");
exports.canUseDOM = function () { return exenv_1.canUseDOM; };
exports.supportsInlineSVG = function () {
    /* istanbul ignore next */
    if (!document) {
        return false;
    }
    var div = document.createElement('div');
    div.innerHTML = '<svg />';
    return div.firstChild && div.firstChild.namespaceURI === 'http://www.w3.org/2000/svg';
};
// tslint:disable-next-line:no-shadowed-variable
var InlineSVGError = /** @class */ (function (_super) {
    __extends(InlineSVGError, _super);
    function InlineSVGError(message, data) {
        var _this = _super.call(this) || this;
        _this.name = 'InlineSVGError';
        _this.message = message;
        _this.data = data;
        return _this;
    }
    return InlineSVGError;
}(Error));
exports.InlineSVGError = InlineSVGError;
exports.isSupportedEnvironment = once_1.default(function () { return exports.supportsInlineSVG() && typeof window !== 'undefined' && window !== null; });
exports.randomString = function (length) {
    if (length === void 0) { length = 8; }
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    var numbers = '1234567890';
    var charset = "" + letters + letters.toUpperCase() + numbers;
    var randomCharacter = function (character) {
        return character[Math.floor(Math.random() * character.length)];
    };
    var R = '';
    for (var i = 0; i < length; i++) {
        R += randomCharacter(charset);
    }
    return R;
};
