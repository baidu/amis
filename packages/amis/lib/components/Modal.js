"use strict";
/**
 * @file Modal
 * @description
 * @author fex
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var Portal_1 = (0, tslib_1.__importDefault)(require("react-overlays/Portal"));
var ModalManager_1 = require("./ModalManager");
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var locale_1 = require("../locale");
var helper_1 = require("../utils/helper");
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a[Transition_1.EXITING] = 'out',
    _a);
var Modal = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Modal, _super);
    function Modal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isRootClosed = false;
        _this.handleEnter = function () {
            document.body.classList.add("is-modalOpened");
            if (window.innerWidth - document.documentElement.clientWidth > 0 ||
                document.body.scrollHeight > document.body.clientHeight) {
                var scrollbarWidth = (0, helper_1.getScrollbarWidth)();
                document.body.style.width = "calc(100% - ".concat(scrollbarWidth, "px)");
            }
        };
        _this.handleEntered = function () {
            var onEntered = _this.props.onEntered;
            onEntered && onEntered();
        };
        _this.handleExited = function () {
            var onExited = _this.props.onExited;
            onExited && onExited();
            setTimeout(function () {
                if (!document.querySelector('.amis-dialog-widget')) {
                    document.body.classList.remove("is-modalOpened");
                    document.body.style.width = '';
                }
            }, 200);
        };
        _this.modalRef = function (ref) {
            _this.modalDom = ref;
            var ns = _this.props.classPrefix;
            if (ref) {
                (0, ModalManager_1.addModal)(_this);
                ref.classList.add("".concat(ns, "Modal--").concat((0, ModalManager_1.current)(), "th"));
            }
            else {
                (0, ModalManager_1.removeModal)(_this);
            }
        };
        return _this;
    }
    Modal.prototype.componentDidMount = function () {
        if (this.props.show) {
            this.handleEnter();
            this.handleEntered();
        }
        document.body.addEventListener('click', this.handleRootClickCapture, true);
        document.body.addEventListener('click', this.handleRootClick);
    };
    Modal.prototype.componentWillUnmount = function () {
        if (this.props.show) {
            this.handleExited();
        }
        document.body.removeEventListener('click', this.handleRootClick);
        document.body.removeEventListener('click', this.handleRootClickCapture, true);
    };
    Modal.prototype.handleRootClickCapture = function (e) {
        var target = e.target;
        var _a = this.props, closeOnOutside = _a.closeOnOutside, ns = _a.classPrefix;
        var isLeftButton = (e.button === 1 && window.event !== null) || e.button === 0;
        this.isRootClosed = !!(isLeftButton &&
            closeOnOutside &&
            target &&
            this.modalDom &&
            ((!this.modalDom.contains(target) && !target.closest('[role=dialog]')) ||
                (target.matches(".".concat(ns, "Modal")) && target === this.modalDom))); // 干脆过滤掉来自弹框里面的点击
    };
    Modal.prototype.handleRootClick = function (e) {
        var onHide = this.props.onHide;
        this.isRootClosed && !e.defaultPrevented && onHide(e);
    };
    Modal.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, contentClassName = _a.contentClassName, children = _a.children, container = _a.container, show = _a.show, size = _a.size, overlay = _a.overlay, cx = _a.classnames;
        return (react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, appear: true, in: show, timeout: 500, onEnter: this.handleEnter, onExited: this.handleExited, onEntered: this.handleEntered }, function (status) {
            var _a;
            return (react_1.default.createElement(Portal_1.default, { container: container },
                react_1.default.createElement("div", { ref: _this.modalRef, role: "dialog", className: cx("amis-dialog-widget Modal", (_a = {},
                        _a["Modal--".concat(size)] = size,
                        _a), className) },
                    overlay ? (react_1.default.createElement("div", { className: cx("Modal-overlay", fadeStyles[status]) })) : null,
                    react_1.default.createElement("div", { className: cx("Modal-content", contentClassName, fadeStyles[status]) }, status === Transition_1.EXITED ? null : children))));
        }));
    };
    var _b, _c;
    Modal.defaultProps = {
        container: document.body,
        size: '',
        overlay: true
    };
    Modal.Header = (0, theme_1.themeable)((0, locale_1.localeable)(function (_a) {
        var cx = _a.classnames, className = _a.className, showCloseButton = _a.showCloseButton, onClose = _a.onClose, children = _a.children, classPrefix = _a.classPrefix, __ = _a.translate, forwardedRef = _a.forwardedRef, rest = (0, tslib_1.__rest)(_a, ["classnames", "className", "showCloseButton", "onClose", "children", "classPrefix", "translate", "forwardedRef"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx('Modal-header', className) }),
            showCloseButton !== false ? (react_1.default.createElement("a", { "data-tooltip": __('Dialog.close'), "data-position": "left", onClick: onClose, className: cx('Modal-close') },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null,
            children));
    }));
    Modal.Title = (0, theme_1.themeable)(function (_a) {
        var cx = _a.classnames, className = _a.className, children = _a.children, classPrefix = _a.classPrefix, forwardedRef = _a.forwardedRef, rest = (0, tslib_1.__rest)(_a, ["classnames", "className", "children", "classPrefix", "forwardedRef"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx('Modal-title', className) }), children));
    });
    Modal.Body = (0, theme_1.themeable)(function (_a) {
        var cx = _a.classnames, className = _a.className, children = _a.children, classPrefix = _a.classPrefix, forwardedRef = _a.forwardedRef, rest = (0, tslib_1.__rest)(_a, ["classnames", "className", "children", "classPrefix", "forwardedRef"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx('Modal-body', className) }), children));
    });
    Modal.Footer = (0, theme_1.themeable)(function (_a) {
        var cx = _a.classnames, className = _a.className, children = _a.children, classPrefix = _a.classPrefix, forwardedRef = _a.forwardedRef, rest = (0, tslib_1.__rest)(_a, ["classnames", "className", "children", "classPrefix", "forwardedRef"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx('Modal-footer', className) }), children));
    });
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Modal.prototype, "handleRootClickCapture", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Modal.prototype, "handleRootClick", null);
    return Modal;
}(react_1.default.Component));
exports.Modal = Modal;
var FinalModal = (0, theme_1.themeable)((0, locale_1.localeable)(Modal));
exports.default = FinalModal;
//# sourceMappingURL=./components/Modal.js.map
