"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * 复制动作
 *
 * @export
 * @class CopyAction
 * @implements {Action}
 */
var CopyAction = /** @class */ (function () {
    function CopyAction() {
    }
    CopyAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_g) {
                if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.copy)) {
                    throw new Error('env.copy is required!');
                }
                if ((_b = action.args) === null || _b === void 0 ? void 0 : _b.content) {
                    (_d = (_c = renderer.props.env).copy) === null || _d === void 0 ? void 0 : _d.call(_c, action.args.content, {
                        format: (_f = (_e = action.args) === null || _e === void 0 ? void 0 : _e.copyFormat) !== null && _f !== void 0 ? _f : 'text/html'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    return CopyAction;
}());
exports.CopyAction = CopyAction;
(0, Action_1.registerAction)('copy', new CopyAction());
//# sourceMappingURL=./actions/CopyAction.js.map
