"use strict";
/**
 * @file table/HeadCellDropDown
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellDropDown = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var Overlay_1 = (0, tslib_1.__importDefault)(require("../Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../PopOver"));
var HeadCellDropDown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellDropDown, _super);
    function HeadCellDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false
        };
        _this.openLayer = _this.openLayer.bind(_this);
        _this.closeLayer = _this.closeLayer.bind(_this);
        return _this;
    }
    HeadCellDropDown.prototype.render = function () {
        var _this = this;
        var isOpened = this.state.isOpened;
        var _a = this.props, popOverContainer = _a.popOverContainer, active = _a.active, className = _a.className, layerClassName = _a.layerClassName, filterIcon = _a.filterIcon, filterDropdown = _a.filterDropdown, cx = _a.classnames, ns = _a.classPrefix;
        return (react_1.default.createElement("span", { className: cx(className, active ? 'is-active' : '') },
            react_1.default.createElement("span", { onClick: this.openLayer }, filterIcon && typeof filterIcon === 'function'
                ? filterIcon(active) : (filterIcon || null)),
            isOpened ? (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), placement: "left-bottom-left-top right-bottom-right-top", target: popOverContainer ? function () { return (0, react_dom_1.findDOMNode)(_this).parentNode; } : null, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, onHide: this.closeLayer, className: cx(layerClassName), overlay: true }, filterDropdown && typeof filterDropdown === 'function'
                    ? filterDropdown((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props), { confirm: function (payload) {
                            if (!(payload && payload.closeDropdown === false)) {
                                _this.closeLayer();
                            }
                        } })) : (filterDropdown || null))))
                : null));
    };
    HeadCellDropDown.prototype.openLayer = function () {
        this.setState({ isOpened: true });
    };
    HeadCellDropDown.prototype.closeLayer = function () {
        this.setState({ isOpened: false });
    };
    return HeadCellDropDown;
}(react_1.default.Component));
exports.HeadCellDropDown = HeadCellDropDown;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(HeadCellDropDown));
//# sourceMappingURL=./components/table/HeadCellDropDown.js.map
