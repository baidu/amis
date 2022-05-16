"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAction = void 0;
var tslib_1 = require("tslib");
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var qs_1 = (0, tslib_1.__importDefault)(require("qs"));
var Action_1 = require("./Action");
/**
 * 邮件动作
 *
 * @export
 * @class EmailAction
 * @implements {Action}
 */
var EmailAction = /** @class */ (function () {
    function EmailAction() {
    }
    EmailAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var mailTo, mailInfo, mailStr, mailto;
            return (0, tslib_1.__generator)(this, function (_c) {
                mailTo = (_a = action.args) === null || _a === void 0 ? void 0 : _a.to;
                mailInfo = (0, pick_1.default)((_b = action.args) !== null && _b !== void 0 ? _b : {}, 'cc', 'bcc', 'subject', 'body');
                mailStr = qs_1.default.stringify(mailInfo);
                mailto = "mailto:".concat(mailTo, "?").concat(mailStr);
                window.open(mailto);
                return [2 /*return*/];
            });
        });
    };
    return EmailAction;
}());
exports.EmailAction = EmailAction;
(0, Action_1.registerAction)('email', new EmailAction());
//# sourceMappingURL=./actions/EmailAction.js.map
