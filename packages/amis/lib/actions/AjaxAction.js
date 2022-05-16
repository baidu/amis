"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjaxAction = void 0;
var tslib_1 = require("tslib");
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var api_1 = require("../utils/api");
var errors_1 = require("../utils/errors");
var helper_1 = require("../utils/helper");
var Action_1 = require("./Action");
/**
 * 发送请求动作
 *
 * @export
 * @class AjaxAction
 * @implements {Action}
 */
var AjaxAction = /** @class */ (function () {
    function AjaxAction() {
    }
    AjaxAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var env, result, responseData, msg, e_1, result;
            var _m;
            return (0, tslib_1.__generator)(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        if (!((_a = renderer.props.env) === null || _a === void 0 ? void 0 : _a.fetcher)) {
                            throw new Error('env.fetcher is required!');
                        }
                        env = event.context.env;
                        _o.label = 1;
                    case 1:
                        _o.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, env.fetcher((_b = action.args) === null || _b === void 0 ? void 0 : _b.api, (0, omit_1.default)((_c = action.args) !== null && _c !== void 0 ? _c : {}, ['api', 'options', 'messages']), (_e = (_d = action.args) === null || _d === void 0 ? void 0 : _d.options) !== null && _e !== void 0 ? _e : {})];
                    case 2:
                        result = _o.sent();
                        if (!(0, helper_1.isEmpty)(result.data) || result.ok) {
                            responseData = (0, api_1.normalizeApiResponseData)(result.data);
                            // 记录请求返回的数据
                            event.setData((0, helper_1.createObject)(event.data, action.outputVar
                                ? (_m = {},
                                    _m["".concat(action.outputVar)] = responseData,
                                    _m) : responseData));
                        }
                        if (!result.ok) {
                            throw new errors_1.ServerError((_h = (_g = (_f = action.args) === null || _f === void 0 ? void 0 : _f.messages) === null || _g === void 0 ? void 0 : _g.failed) !== null && _h !== void 0 ? _h : result.msg, result);
                        }
                        else {
                            msg = (_l = (_k = (_j = action.args) === null || _j === void 0 ? void 0 : _j.messages) === null || _k === void 0 ? void 0 : _k.success) !== null && _l !== void 0 ? _l : result.msg;
                            msg &&
                                env.notify('success', msg, result.msgTimeout !== undefined
                                    ? {
                                        closeButton: true,
                                        timeout: result.msgTimeout
                                    }
                                    : undefined);
                        }
                        return [2 /*return*/, result.data];
                    case 3:
                        e_1 = _o.sent();
                        if (e_1.type === 'ServerError') {
                            result = e_1.response;
                            env.notify('error', e_1.message, result.msgTimeout !== undefined
                                ? {
                                    closeButton: true,
                                    timeout: result.msgTimeout
                                }
                                : undefined);
                        }
                        else {
                            env.notify('error', e_1.message);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AjaxAction;
}());
exports.AjaxAction = AjaxAction;
(0, Action_1.registerAction)('ajax', new AjaxAction());
//# sourceMappingURL=./actions/AjaxAction.js.map
