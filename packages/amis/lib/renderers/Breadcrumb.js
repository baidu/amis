"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbFieldRenderer = exports.BreadcrumbField = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来展示面包屑导航
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var Breadcrumb_1 = (0, tslib_1.__importDefault)(require("../components/Breadcrumb"));
var BreadcrumbField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BreadcrumbField, _super);
    function BreadcrumbField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbField.prototype.render = function () {
        var _a = this.props, items = _a.items, source = _a.source, data = _a.data, env = _a.env, restProps = (0, tslib_1.__rest)(_a, ["items", "source", "data", "env"]);
        var crumbItems = items
            ? items
            : (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw');
        crumbItems = crumbItems.map(function (item) {
            if (item.label) {
                item.label = (0, tpl_1.filter)(item.label, data);
            }
            if (item.href) {
                item.href = (0, tpl_1.filter)(item.href, data);
            }
            if (item.dropdown) {
                item.dropdown = item.dropdown.map(function (dropdownItem) {
                    if (dropdownItem.label) {
                        dropdownItem.label = (0, tpl_1.filter)(dropdownItem.label, data);
                    }
                    if (dropdownItem.href) {
                        dropdownItem.href = (0, tpl_1.filter)(dropdownItem.href, data);
                    }
                    return dropdownItem;
                });
            }
            return item;
        });
        return (react_1.default.createElement(Breadcrumb_1.default, (0, tslib_1.__assign)({ items: crumbItems, tooltipContainer: env === null || env === void 0 ? void 0 : env.getModalContainer }, restProps)));
    };
    return BreadcrumbField;
}(react_1.default.Component));
exports.BreadcrumbField = BreadcrumbField;
var BreadcrumbFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BreadcrumbFieldRenderer, _super);
    function BreadcrumbFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'breadcrumb'
        })
    ], BreadcrumbFieldRenderer);
    return BreadcrumbFieldRenderer;
}(BreadcrumbField));
exports.BreadcrumbFieldRenderer = BreadcrumbFieldRenderer;
//# sourceMappingURL=./renderers/Breadcrumb.js.map
