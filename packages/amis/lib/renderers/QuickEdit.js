"use strict";
/**
 * @file scoped.jsx.
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocQuickEdit = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var keycode_1 = (0, tslib_1.__importDefault)(require("keycode"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("../components/Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../components/PopOver"));
var icons_1 = require("../components/icons");
var inited = false;
var currentOpened;
var HocQuickEdit = function (config) {
    if (config === void 0) { config = {}; }
    return function (Component) {
        var QuickEditComponent = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(QuickEditComponent, _super);
            function QuickEditComponent(props) {
                var _this = _super.call(this, props) || this;
                _this.openQuickEdit = _this.openQuickEdit.bind(_this);
                _this.closeQuickEdit = _this.closeQuickEdit.bind(_this);
                _this.handleAction = _this.handleAction.bind(_this);
                _this.handleSubmit = _this.handleSubmit.bind(_this);
                _this.handleKeyUp = _this.handleKeyUp.bind(_this);
                _this.overlayRef = _this.overlayRef.bind(_this);
                _this.handleWindowKeyPress = _this.handleWindowKeyPress.bind(_this);
                _this.handleWindowKeyDown = _this.handleWindowKeyDown.bind(_this);
                _this.formRef = _this.formRef.bind(_this);
                _this.handleInit = _this.handleInit.bind(_this);
                _this.handleChange = _this.handleChange.bind(_this);
                _this.state = {
                    isOpened: false
                };
                return _this;
            }
            QuickEditComponent.prototype.componentDidMount = function () {
                this.target = (0, react_dom_1.findDOMNode)(this);
                if (inited) {
                    return;
                }
                inited = true;
                document.body.addEventListener('keypress', this.handleWindowKeyPress);
                document.body.addEventListener('keydown', this.handleWindowKeyDown);
            };
            QuickEditComponent.prototype.formRef = function (ref) {
                var _a = this.props, quickEditFormRef = _a.quickEditFormRef, rowIndex = _a.rowIndex, colIndex = _a.colIndex;
                if (quickEditFormRef) {
                    while (ref && ref.getWrappedInstance) {
                        ref = ref.getWrappedInstance();
                    }
                    quickEditFormRef(ref, colIndex, rowIndex);
                }
            };
            QuickEditComponent.prototype.handleWindowKeyPress = function (e) {
                var ns = this.props.classPrefix;
                var el = e.target.closest(".".concat(ns, "Field--quickEditable"));
                if (!el) {
                    return;
                }
                var table = el.closest('table');
                if (!table) {
                    return;
                }
                if ((0, keycode_1.default)(e) === 'space' &&
                    !~['INPUT', 'TEXTAREA'].indexOf(el.tagName)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            QuickEditComponent.prototype.handleWindowKeyDown = function (e) {
                var code = (0, keycode_1.default)(e);
                if (code === 'esc' && currentOpened) {
                    currentOpened.closeQuickEdit();
                }
                else if (~['INPUT', 'TEXTAREA'].indexOf(e.target.tagName) ||
                    e.target.contentEditable === 'true' ||
                    !~['up', 'down', 'left', 'right'].indexOf(code)) {
                    return;
                }
                e.preventDefault();
                var ns = this.props.classPrefix;
                var el = e.target.closest(".".concat(ns, "Field--quickEditable")) ||
                    document.querySelector(".".concat(ns, "Field--quickEditable"));
                if (!el) {
                    return;
                }
                var table = el.closest('table');
                if (!table) {
                    return;
                }
                var current = table.querySelector(".".concat(ns, "Field--quickEditable:focus"));
                if (!current) {
                    var dom = table.querySelector(".".concat(ns, "Field--quickEditable[tabindex]"));
                    dom && dom.focus();
                }
                else {
                    var prevTr = void 0, nextTr = void 0, prevTd = void 0, nextTd = void 0;
                    switch (code) {
                        case 'up':
                            prevTr = current.parentNode
                                .previousSibling;
                            if (prevTr) {
                                var index = current.cellIndex;
                                prevTr.children[index].focus();
                            }
                            break;
                        case 'down':
                            nextTr = current.parentNode
                                .nextSibling;
                            if (nextTr) {
                                var index = current.cellIndex;
                                nextTr.children[index].focus();
                            }
                            break;
                        case 'left':
                            prevTd = current.previousElementSibling;
                            while (prevTd) {
                                if (prevTd.matches(".".concat(ns, "Field--quickEditable[tabindex]"))) {
                                    break;
                                }
                                prevTd = prevTd.previousElementSibling;
                            }
                            if (prevTd) {
                                prevTd.focus();
                            }
                            else if (current.parentNode.previousSibling) {
                                var tds = current.parentNode
                                    .previousSibling.querySelectorAll(".".concat(ns, "Field--quickEditable[tabindex]"));
                                if (tds.length) {
                                    tds[tds.length - 1].focus();
                                }
                            }
                            break;
                        case 'right':
                            nextTd = current.nextSibling;
                            while (nextTd) {
                                if (nextTd.matches(".".concat(ns, "Field--quickEditable[tabindex]"))) {
                                    break;
                                }
                                nextTd = nextTd.nextSibling;
                            }
                            if (nextTd) {
                                nextTd.focus();
                            }
                            else if (current.parentNode.nextSibling) {
                                nextTd = current.parentNode.nextSibling.querySelector(".".concat(ns, "Field--quickEditable[tabindex]"));
                                if (nextTd) {
                                    nextTd.focus();
                                }
                            }
                            break;
                    }
                }
            };
            // handleClickOutside() {
            //     this.closeQuickEdit();
            // }
            QuickEditComponent.prototype.overlayRef = function (ref) {
                this.overlay = ref;
            };
            QuickEditComponent.prototype.handleAction = function (e, action, ctx) {
                var onAction = this.props.onAction;
                if (action.actionType === 'cancel' || action.actionType === 'close') {
                    this.closeQuickEdit();
                    return;
                }
                onAction && onAction(e, action, ctx);
            };
            QuickEditComponent.prototype.handleSubmit = function (values) {
                var _a = this.props, onQuickChange = _a.onQuickChange, quickEdit = _a.quickEdit;
                this.closeQuickEdit();
                onQuickChange(values, quickEdit.saveImmediately, false, quickEdit.resetOnFailed);
                return false;
            };
            QuickEditComponent.prototype.handleInit = function (values) {
                var onQuickChange = this.props.onQuickChange;
                onQuickChange(values, false, true);
            };
            QuickEditComponent.prototype.handleChange = function (values) {
                var _a = this.props, onQuickChange = _a.onQuickChange, quickEdit = _a.quickEdit;
                onQuickChange(values, quickEdit.saveImmediately, false, quickEdit.resetOnFailed);
            };
            QuickEditComponent.prototype.openQuickEdit = function () {
                currentOpened = this;
                this.setState({
                    isOpened: true
                });
            };
            QuickEditComponent.prototype.closeQuickEdit = function () {
                var _this = this;
                if (!this.state.isOpened) {
                    return;
                }
                currentOpened = null;
                var ns = this.props.classPrefix;
                this.setState({
                    isOpened: false
                }, function () {
                    var el = (0, react_dom_1.findDOMNode)(_this);
                    var table = el.closest('table');
                    ((table &&
                        table.querySelectorAll("td.".concat(ns, "Field--quickEditable:focus"))
                            .length) ||
                        el) &&
                        el.focus();
                });
            };
            QuickEditComponent.prototype.buildSchema = function () {
                var _a = this.props, quickEdit = _a.quickEdit, name = _a.name, label = _a.label, __ = _a.translate;
                var schema;
                if (quickEdit === true) {
                    schema = {
                        type: 'form',
                        title: '',
                        autoFocus: true,
                        body: [
                            {
                                type: 'input-text',
                                name: name,
                                placeholder: label,
                                label: false
                            }
                        ]
                    };
                }
                else if (quickEdit) {
                    if (quickEdit.body &&
                        !~['combo', 'group', 'panel', 'fieldSet', 'fieldset'].indexOf(quickEdit.type)) {
                        schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({ title: '', autoFocus: quickEdit.mode !== 'inline' }, quickEdit), { mode: 'normal', type: 'form' });
                    }
                    else {
                        schema = {
                            title: '',
                            className: quickEdit.formClassName,
                            type: 'form',
                            autoFocus: quickEdit.mode !== 'inline',
                            mode: 'normal',
                            body: [
                                (0, tslib_1.__assign)((0, tslib_1.__assign)({ type: quickEdit.type || 'input-text', name: quickEdit.name || name }, quickEdit), { mode: undefined })
                            ]
                        };
                    }
                }
                if (schema) {
                    schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), { wrapWithPanel: quickEdit.mode !== 'inline', actions: quickEdit.mode === 'inline'
                            ? []
                            : [
                                {
                                    type: 'button',
                                    label: __('cancel'),
                                    actionType: 'cancel'
                                },
                                {
                                    label: __('confirm'),
                                    type: 'submit',
                                    primary: true
                                }
                            ] });
                }
                return schema || 'error';
            };
            QuickEditComponent.prototype.handleKeyUp = function (e) {
                var code = (0, keycode_1.default)(e);
                if (code === 'space' &&
                    !~['INPUT', 'TEXTAREA'].indexOf(e.target.tagName)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openQuickEdit();
                }
            };
            QuickEditComponent.prototype.renderPopOver = function () {
                var _this = this;
                var _a = this.props, quickEdit = _a.quickEdit, render = _a.render, popOverContainer = _a.popOverContainer, ns = _a.classPrefix, cx = _a.classnames, canAccessSuperData = _a.canAccessSuperData;
                var content = (react_1.default.createElement("div", { ref: this.overlayRef, className: cx(quickEdit.className) }, render('quick-edit-form', this.buildSchema(), {
                    value: undefined,
                    onSubmit: this.handleSubmit,
                    onAction: this.handleAction,
                    onChange: null,
                    formLazyChange: false,
                    ref: this.formRef,
                    popOverContainer: function () { return _this.overlay; },
                    canAccessSuperData: canAccessSuperData,
                    formStore: undefined
                })));
                popOverContainer = popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); });
                return (react_1.default.createElement(Overlay_1.default, { container: popOverContainer, target: function () { return _this.target; }, onHide: this.closeQuickEdit, placement: "left-top right-top left-bottom right-bottom left-top", show: true },
                    react_1.default.createElement(PopOver_1.default, { classPrefix: ns, className: cx("".concat(ns, "QuickEdit-popover"), quickEdit.popOverClassName), onHide: this.closeQuickEdit, overlay: true }, content)));
            };
            QuickEditComponent.prototype.render = function () {
                var _a = this.props, onQuickChange = _a.onQuickChange, quickEdit = _a.quickEdit, quickEditEnabled = _a.quickEditEnabled, className = _a.className, cx = _a.classnames, render = _a.render, noHoc = _a.noHoc, canAccessSuperData = _a.canAccessSuperData, disabled = _a.disabled;
                if (!quickEdit ||
                    !onQuickChange ||
                    quickEditEnabled === false ||
                    noHoc ||
                    disabled) {
                    return react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props));
                }
                if (quickEdit.mode === 'inline') {
                    return (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props), render('inline-form', this.buildSchema(), {
                        value: undefined,
                        wrapperComponent: 'div',
                        className: cx('Form--quickEdit'),
                        ref: this.formRef,
                        simpleMode: true,
                        onInit: this.handleInit,
                        onChange: this.handleChange,
                        formLazyChange: false,
                        canAccessSuperData: canAccessSuperData
                    })));
                }
                else {
                    return (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props, { className: cx("Field--quickEditable", className, {
                            in: this.state.isOpened
                        }), tabIndex: quickEdit.focusable === false
                            ? undefined
                            : '0', onKeyUp: this.handleKeyUp }),
                        react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props, { wrapperComponent: '', noHoc: true })),
                        react_1.default.createElement("span", { key: "edit-btn", className: cx('Field-quickEditBtn'), onClick: this.openQuickEdit },
                            react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon" })),
                        this.state.isOpened ? this.renderPopOver() : null));
                }
            };
            QuickEditComponent.ComposedComponent = Component;
            return QuickEditComponent;
        }(react_1.default.PureComponent));
        (0, hoist_non_react_statics_1.default)(QuickEditComponent, Component);
        return QuickEditComponent;
    };
};
exports.HocQuickEdit = HocQuickEdit;
exports.default = exports.HocQuickEdit;
//# sourceMappingURL=./renderers/QuickEdit.js.map
