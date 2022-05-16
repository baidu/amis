"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarFieldRenderer = exports.AvatarField = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来展示用户头像
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Avatar_1 = (0, tslib_1.__importDefault)(require("../components/Avatar"));
var Badge_1 = require("../components/Badge");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var AvatarField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AvatarField, _super);
    function AvatarField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AvatarField.prototype.render = function () {
        var _a = this.props, _b = _a.style, style = _b === void 0 ? {} : _b, className = _a.className, cx = _a.classnames, src = _a.src, _c = _a.icon, icon = _c === void 0 ? 'fa fa-user' : _c, fit = _a.fit, shape = _a.shape, size = _a.size, text = _a.text, gap = _a.gap, alt = _a.alt, draggable = _a.draggable, crossOrigin = _a.crossOrigin, onError = _a.onError, data = _a.data;
        var errHandler = function () { return false; };
        if (typeof onError === 'string') {
            try {
                errHandler = new Function('event', onError);
            }
            catch (e) {
                console.warn(onError, e);
            }
        }
        if ((0, tpl_builtin_1.isPureVariable)(src)) {
            src = (0, tpl_builtin_1.resolveVariableAndFilter)(src, data, '| raw');
        }
        if ((0, tpl_builtin_1.isPureVariable)(text)) {
            text = (0, tpl_builtin_1.resolveVariableAndFilter)(text, data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(icon)) {
            icon = (0, tpl_builtin_1.resolveVariableAndFilter)(icon, data);
        }
        return (react_1.default.createElement(Avatar_1.default, { style: style, className: className, classnames: cx, src: src, icon: icon, fit: fit, shape: shape, size: size, text: text, gap: gap, alt: alt, draggable: draggable, crossOrigin: crossOrigin, onError: errHandler }));
    };
    return AvatarField;
}(react_1.default.Component));
exports.AvatarField = AvatarField;
var AvatarFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AvatarFieldRenderer, _super);
    function AvatarFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AvatarFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'avatar'
        }),
        Badge_1.withBadge
    ], AvatarFieldRenderer);
    return AvatarFieldRenderer;
}(AvatarField));
exports.AvatarFieldRenderer = AvatarFieldRenderer;
//# sourceMappingURL=./renderers/Avatar.js.map
