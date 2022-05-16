"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagFieldRenderer = exports.TagField = void 0;
var tslib_1 = require("tslib");
/**
 * @file Tag
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var Tag_1 = (0, tslib_1.__importDefault)(require("../components/Tag"));
var TagField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TagField, _super);
    function TagField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagField.prototype.render = function () {
        var _a = this.props, label = _a.label, icon = _a.icon, displayMode = _a.displayMode, color = _a.color, className = _a.className, data = _a.data, _b = _a.style, style = _b === void 0 ? {} : _b;
        label =
            (0, helper_1.getPropValue)(this.props) ||
                (label ? (0, tpl_builtin_1.resolveVariableAndFilter)(label, data, '| raw') : null);
        if ((0, tpl_builtin_1.isPureVariable)(icon)) {
            icon = (0, tpl_builtin_1.resolveVariableAndFilter)(icon, data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(displayMode)) {
            displayMode = (0, tpl_builtin_1.resolveVariableAndFilter)(displayMode, data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(color)) {
            color = (0, tpl_builtin_1.resolveVariableAndFilter)(color, data);
        }
        return (react_1.default.createElement(Tag_1.default, { className: className, displayMode: displayMode, color: color, icon: icon, style: style }, label));
    };
    TagField.defaultProps = {
        displayMode: 'normal'
    };
    return TagField;
}(react_1.default.Component));
exports.TagField = TagField;
var TagFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TagFieldRenderer, _super);
    function TagFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'tag'
        })
    ], TagFieldRenderer);
    return TagFieldRenderer;
}(TagField));
exports.TagFieldRenderer = TagFieldRenderer;
//# sourceMappingURL=./renderers/Tag.js.map
