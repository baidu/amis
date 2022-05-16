"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var GridNav_1 = tslib_1.__importStar(require("../components/GridNav"));
var handleAction_1 = (0, tslib_1.__importDefault)(require("../utils/handleAction"));
var validations_1 = require("../utils/validations");
var List = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.handleClick = function (item) {
        var _this = this;
        return function (e) {
            var action;
            if (item.link) {
                action = validations_1.validations.isUrl({}, item.link)
                    ? {
                        type: 'button',
                        actionType: 'url',
                        url: item.link,
                        blank: item.blank
                    }
                    : {
                        type: 'button',
                        actionType: 'link',
                        link: item.link
                    };
            }
            else {
                action = item.clickAction;
            }
            (0, handleAction_1.default)(e, action, _this.props);
        };
    };
    List.prototype.render = function () {
        var _this = this;
        var _a = this.props, itemClassName = _a.itemClassName, source = _a.source, data = _a.data, options = _a.options, classnames = _a.classnames;
        var value = (0, helper_1.getPropValue)(this.props);
        var list = [];
        if (typeof source === 'string' && (0, tpl_builtin_1.isPureVariable)(source)) {
            list = (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw') || undefined;
        }
        else if (Array.isArray(value)) {
            list = value;
        }
        else if (Array.isArray(options)) {
            list = options;
        }
        if (list && !Array.isArray(list)) {
            list = [list];
        }
        if (!(list === null || list === void 0 ? void 0 : list.length)) {
            return null;
        }
        return (react_1.default.createElement(GridNav_1.default, (0, tslib_1.__assign)({}, this.props), list.map(function (item, index) { return (react_1.default.createElement(GridNav_1.GridNavItem, { key: index, onClick: item.clickAction || item.link ? _this.handleClick(item) : undefined, className: itemClassName, text: item.text, icon: item.icon, classnames: classnames, badge: item.badge
                ? {
                    badge: item.badge,
                    data: data,
                    classnames: classnames
                }
                : undefined })); })));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], List.prototype, "handleClick", null);
    List = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'grid-nav'
        })
    ], List);
    return List;
}(react_1.default.Component));
exports.default = List;
//# sourceMappingURL=./renderers/GridNav.js.map
