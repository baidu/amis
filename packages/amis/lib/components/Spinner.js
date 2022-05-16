"use strict";
/**
 * @file Spinner
 * @description
 * @author fex
 * @date 2017-11-07
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var icons_1 = require("./icons");
var icon_1 = require("../utils/icon");
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERED] = 'in',
    _a);
var Spinner = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Spinner, _super);
    function Spinner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Spinner.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, show = _a.show, className = _a.className, spinnerClassName = _a.spinnerClassName, _b = _a.size, size = _b === void 0 ? '' : _b, overlay = _a.overlay, delay = _a.delay, icon = _a.icon, tip = _a.tip, _c = _a.tipPlacement, tipPlacement = _c === void 0 ? '' : _c;
        var isCustomIcon = icon && react_1.default.isValidElement(icon);
        var timeout = { enter: delay, exit: 0 };
        return (react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, in: show, timeout: timeout }, function (status) {
            var _a, _b, _c;
            return (react_1.default.createElement(react_1.default.Fragment, null,
                overlay ? (react_1.default.createElement("div", { className: cx("Spinner-overlay", fadeStyles[status]) })) : null,
                react_1.default.createElement("div", { "data-testid": "spinner", className: cx("Spinner", tip && (_a = {},
                        _a["Spinner-tip--".concat(tipPlacement)] = [
                            'top',
                            'right',
                            'bottom',
                            'left'
                        ].includes(tipPlacement),
                        _a), (_b = {}, _b["Spinner--overlay"] = overlay, _b), fadeStyles[status], className) },
                    react_1.default.createElement("div", { className: cx("Spinner-icon", (_c = {},
                            _c["Spinner-icon--".concat(size)] = ['lg', 'sm'].includes(size),
                            _c["Spinner-icon--default"] = !icon,
                            _c["Spinner-icon--simple"] = !isCustomIcon && icon,
                            _c["Spinner-icon--custom"] = isCustomIcon,
                            _c), spinnerClassName) }, icon ? (isCustomIcon ? (icon) : (0, icons_1.hasIcon)(icon) ? (react_1.default.createElement(icons_1.Icon, { icon: icon, className: "icon" })) : ((0, icon_1.generateIcon)(cx, icon, 'icon'))) : null),
                    tip ? react_1.default.createElement("span", { className: cx("Spinner-tip") }, tip) : '')));
        }));
    };
    Spinner.defaultProps = {
        show: true,
        className: '',
        spinnerClassName: '',
        size: '',
        icon: '',
        tip: '',
        tipPlacement: 'bottom',
        delay: 0,
        overlay: false
    };
    return Spinner;
}(react_1.default.Component));
exports.Spinner = Spinner;
exports.default = (0, theme_1.themeable)(Spinner);
//# sourceMappingURL=./components/Spinner.js.map
