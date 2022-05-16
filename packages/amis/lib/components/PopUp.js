"use strict";
/**
 * @file PopUp
 * @description
 * @author fex
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopUp = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var Portal_1 = (0, tslib_1.__importDefault)(require("react-overlays/Portal"));
var icons_1 = require("./icons");
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERED] = '',
    _a[Transition_1.EXITING] = 'out',
    _a[Transition_1.EXITED] = '',
    _a[Transition_1.ENTERING] = 'in',
    _a);
var PopUp = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PopUp, _super);
    function PopUp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scrollTop = 0;
        return _this;
    }
    PopUp.prototype.componentDidUpdate = function () {
        if (this.props.isShow) {
            this.scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop;
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
            document.body.scrollTop = this.scrollTop;
        }
    };
    PopUp.prototype.componentWillUnmount = function () {
        document.body.style.overflow = 'auto';
        document.body.scrollTop = this.scrollTop;
    };
    PopUp.prototype.handleClick = function (e) {
        e.stopPropagation();
    };
    PopUp.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, title = _a.title, children = _a.children, overlay = _a.overlay, onHide = _a.onHide, onConfirm = _a.onConfirm, ns = _a.classPrefix, cx = _a.classnames, className = _a.className, isShow = _a.isShow, container = _a.container, showConfirm = _a.showConfirm, __ = _a.translate, showClose = _a.showClose, header = _a.header, _b = _a.placement, placement = _b === void 0 ? 'center' : _b, rest = (0, tslib_1.__rest)(_a, ["style", "title", "children", "overlay", "onHide", "onConfirm", "classPrefix", "classnames", "className", "isShow", "container", "showConfirm", "translate", "showClose", "header", "placement"]);
        var outerStyle = (0, tslib_1.__assign)({}, style);
        delete outerStyle.top;
        return (react_1.default.createElement(Portal_1.default, { container: container },
            react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, in: isShow, timeout: 500, appear: true }, function (status) {
                return (react_1.default.createElement("div", (0, tslib_1.__assign)({ className: cx("".concat(ns, "PopUp"), className, fadeStyles[status]), style: outerStyle }, rest, { onClick: _this.handleClick }),
                    overlay && (react_1.default.createElement("div", { className: "".concat(ns, "PopUp-overlay"), onClick: onHide })),
                    react_1.default.createElement("div", { className: cx("".concat(ns, "PopUp-inner")) },
                        !showConfirm && showClose ? (react_1.default.createElement("div", { className: cx("".concat(ns, "PopUp-closeWrap")) },
                            header,
                            react_1.default.createElement("span", { className: cx("PopUp-closeBox"), onClick: onHide },
                                react_1.default.createElement(icons_1.Icon, { icon: "close", className: cx('icon', "".concat(ns, "PopUp-close")) })))) : null,
                        showConfirm && (react_1.default.createElement("div", { className: cx("".concat(ns, "PopUp-toolbar")) },
                            react_1.default.createElement(Button_1.default, { className: cx("".concat(ns, "PopUp-cancel")), level: "text", onClick: onHide }, __('cancel')),
                            title && (react_1.default.createElement("span", { className: cx("".concat(ns, "PopUp-title")) }, title)),
                            react_1.default.createElement(Button_1.default, { className: cx("".concat(ns, "PopUp-confirm")), level: "text", onClick: onConfirm }, __('confirm')))),
                        react_1.default.createElement("div", { className: cx("".concat(ns, "PopUp-content"), "justify-".concat(placement)) }, isShow ? children : null),
                        react_1.default.createElement("div", { className: cx("PopUp-safearea") }))));
            })));
    };
    PopUp.defaultProps = {
        className: '',
        overlay: true,
        isShow: false,
        container: document.body,
        showClose: true,
        onConfirm: function () { }
    };
    return PopUp;
}(react_1.default.PureComponent));
exports.PopUp = PopUp;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(PopUp));
//# sourceMappingURL=./components/PopUp.js.map
