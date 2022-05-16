"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkAction = void 0;
var tslib_1 = require("tslib");
var api_1 = require("../utils/api");
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var Action_1 = require("./Action");
/**
 * 打开页面动作
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
var LinkAction = /** @class */ (function () {
    function LinkAction() {
    }
    LinkAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var urlObj;
            return (0, tslib_1.__generator)(this, function (_g) {
                if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.jumpTo)) {
                    throw new Error('env.jumpTo is required!');
                }
                urlObj = (0, api_1.buildApi)({
                    url: (((_b = action.args) === null || _b === void 0 ? void 0 : _b.url) || ((_c = action.args) === null || _c === void 0 ? void 0 : _c.link)),
                    method: 'get'
                }, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ((_e = (_d = action.args) === null || _d === void 0 ? void 0 : _d.params) !== null && _e !== void 0 ? _e : {})), (0, omit_1.default)((_f = action.args) !== null && _f !== void 0 ? _f : {}, ['params', 'blank', 'url', 'link'])), {
                    autoAppend: true
                });
                renderer.props.env.jumpTo(urlObj.url, (0, tslib_1.__assign)({ actionType: action.actionType, type: 'button' }, action.args), action.args);
                return [2 /*return*/];
            });
        });
    };
    return LinkAction;
}());
exports.LinkAction = LinkAction;
(0, Action_1.registerAction)('openlink', new LinkAction());
//# sourceMappingURL=./actions/LinkAction.js.map
