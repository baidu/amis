"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusFieldRenderer = exports.StatusField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var icons_1 = require("../components/icons");
var helper_1 = require("../utils/helper");
var StatusField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(StatusField, _super);
    function StatusField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusField.prototype.render = function () {
        var _a = this.props, className = _a.className, placeholder = _a.placeholder, map = _a.map, labelMap = _a.labelMap, cx = _a.classnames, data = _a.data;
        var value = (0, helper_1.getPropValue)(this.props);
        var viewValue = (react_1.default.createElement("span", { className: "text-muted", key: "status-value" }, placeholder));
        var wrapClassName = '';
        if (value !== undefined && value !== '' && map) {
            if (typeof value === 'boolean') {
                value = value ? 1 : 0;
            }
            else if (/^\d+$/.test(value)) {
                value = parseInt(value, 10) || 0;
            }
            wrapClassName = "StatusField--".concat(value);
            var itemClassName = map[value] || '';
            var svgIcon_1 = '';
            itemClassName = itemClassName.replace(/\bsvg-([^\s|$]+)\b/g, function (_, icon) {
                svgIcon_1 = icon;
                return 'icon';
            });
            if (svgIcon_1) {
                viewValue = (react_1.default.createElement(icons_1.Icon, { icon: svgIcon_1, className: cx('Status-icon icon', itemClassName), key: "icon" }));
            }
            else if (itemClassName) {
                viewValue = (react_1.default.createElement("i", { className: cx('Status-icon', itemClassName), key: "icon" }));
            }
            if (labelMap && labelMap[value]) {
                viewValue = [
                    viewValue,
                    react_1.default.createElement("span", { className: cx('StatusField-label'), key: "label" }, (0, tpl_1.filter)(labelMap[value], data))
                ];
            }
        }
        return (react_1.default.createElement("span", { className: cx('StatusField', wrapClassName, className) }, viewValue));
    };
    StatusField.defaultProps = {
        placeholder: '-',
        map: {
            0: 'svg-fail',
            1: 'svg-success',
            success: 'svg-success',
            pending: 'rolling',
            fail: 'svg-fail',
            queue: 'svg-warning',
            schedule: 'svg-schedule'
        },
        labelMap: {
            success: '成功',
            pending: '运行中',
            fail: '失败',
            queue: '排队中',
            schedule: '调度中'
        }
    };
    return StatusField;
}(react_1.default.Component));
exports.StatusField = StatusField;
var StatusFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(StatusFieldRenderer, _super);
    function StatusFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'status'
        })
    ], StatusFieldRenderer);
    return StatusFieldRenderer;
}(StatusField));
exports.StatusFieldRenderer = StatusFieldRenderer;
//# sourceMappingURL=./renderers/Status.js.map
