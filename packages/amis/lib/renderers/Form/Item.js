"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormItem = exports.registerFormItem = exports.asFormItem = exports.detectProps = exports.FormItemWrap = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var mobx_1 = require("mobx");
var factory_1 = require("../../factory");
var helper_1 = require("../../utils/helper");
var mobx_react_1 = require("mobx-react");
var types_1 = require("../../types");
var tpl_1 = require("../../utils/tpl");
var WithStore_1 = require("../../WithStore");
var wrapControl_1 = require("./wrapControl");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var api_1 = require("../../utils/api");
var FormItemWrap = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FormItemWrap, _super);
    function FormItemWrap(props) {
        var _this = _super.call(this, props) || this;
        _this.reaction = [];
        _this.syncAutoFill = (0, debounce_1.default)(function (term) {
            (function (term) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var _a, autoFillApi, onBulkChange, formItem, data, itemName, ctx, result;
                var _b;
                var _c, _d;
                return (0, tslib_1.__generator)(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = this.props, autoFillApi = _a.autoFillApi, onBulkChange = _a.onBulkChange, formItem = _a.formItem, data = _a.data;
                            if (!autoFillApi) {
                                return [2 /*return*/];
                            }
                            itemName = formItem === null || formItem === void 0 ? void 0 : formItem.name;
                            ctx = (0, helper_1.createObject)(data, (_b = {},
                                _b[itemName || ''] = term,
                                _b));
                            if (!(onBulkChange &&
                                (0, api_1.isEffectiveApi)(autoFillApi, ctx) &&
                                this.lastSearchTerm !== term)) return [3 /*break*/, 2];
                            return [4 /*yield*/, (formItem === null || formItem === void 0 ? void 0 : formItem.loadAutoUpdateData(autoFillApi, ctx, !!((_c = autoFillApi) === null || _c === void 0 ? void 0 : _c.silent)))];
                        case 1:
                            result = _e.sent();
                            if (!result)
                                return [2 /*return*/];
                            this.lastSearchTerm = (_d = (0, helper_1.getVariable)(result, itemName)) !== null && _d !== void 0 ? _d : term;
                            onBulkChange(result);
                            _e.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); })(term).catch(function (e) { return console.error(e); });
        }, 250, {
            trailing: true,
            leading: false
        });
        var model = props.formItem;
        if (model) {
            _this.reaction.push((0, mobx_1.reaction)(function () { return "".concat(model.errors.join('')).concat(model.isFocused).concat(model.dialogOpen); }, function () { return _this.forceUpdate(); }));
            _this.reaction.push((0, mobx_1.reaction)(function () { return JSON.stringify(model.tmpValue); }, function () { return _this.syncAutoFill(model.tmpValue); }));
        }
        return _this;
    }
    FormItemWrap.prototype.componentWillUnmount = function () {
        this.reaction.forEach(function (fn) { return fn(); });
        this.reaction = [];
        this.syncAutoFill.cancel();
    };
    FormItemWrap.prototype.handleFocus = function (e) {
        var model = this.props.formItem;
        model && model.focus();
        this.props.onFocus && this.props.onFocus(e);
    };
    FormItemWrap.prototype.handleBlur = function (e) {
        var model = this.props.formItem;
        model && model.blur();
        this.props.onBlur && this.props.onBlur(e);
    };
    FormItemWrap.prototype.handleOpenDialog = function (schema, data) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var model;
            return (0, tslib_1.__generator)(this, function (_a) {
                model = this.props.formItem;
                if (!model) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, new Promise(function (resolve) {
                        return model.openDialog(schema, data, function (result) { return resolve(result); });
                    })];
            });
        });
    };
    FormItemWrap.prototype.handleDialogConfirm = function (_a) {
        var values = _a[0];
        var model = this.props.formItem;
        if (!model) {
            return;
        }
        model.closeDialog(values);
    };
    FormItemWrap.prototype.handleDialogClose = function (confirmed) {
        if (confirmed === void 0) { confirmed = false; }
        var model = this.props.formItem;
        if (!model) {
            return;
        }
        model.closeDialog(confirmed);
    };
    FormItemWrap.prototype.renderControl = function () {
        var _a;
        var _b = this.props, inputClassName = _b.inputClassName, model = _b.formItem, cx = _b.classnames, children = _b.children, type = _b.type, renderControl = _b.renderControl, formItemConfig = _b.formItemConfig, sizeMutable = _b.sizeMutable, size = _b.size, defaultSize = _b.defaultSize, useMobileUI = _b.useMobileUI, rest = (0, tslib_1.__rest)(_b, ["inputClassName", "formItem", "classnames", "children", "type", "renderControl", "formItemConfig", "sizeMutable", "size", "defaultSize", "useMobileUI"]);
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        if (renderControl) {
            var controlSize = size || defaultSize;
            return renderControl((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { onOpenDialog: this.handleOpenDialog, type: type, classnames: cx, formItem: model, className: cx("Form-control", (_a = {
                        'is-inline': !!rest.inline && !mobileUI,
                        'is-error': model && !model.valid
                    },
                    _a["Form-control--withSize Form-control--size".concat((0, helper_1.ucFirst)(controlSize))] = sizeMutable !== false &&
                        typeof controlSize === 'string' &&
                        !!controlSize &&
                        controlSize !== 'full',
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames, inputClassName) }));
        }
        return null;
    };
    FormItemWrap.prototype.render = function () {
        var _a = this.props, formMode = _a.formMode, inputOnly = _a.inputOnly, wrap = _a.wrap, render = _a.render, model = _a.formItem;
        var mode = this.props.mode || formMode;
        if (wrap === false || inputOnly) {
            return this.renderControl();
        }
        var renderLayout = FormItemWrap.layoutRenderers[mode] ||
            FormItemWrap.layoutRenderers['normal'];
        return (react_1.default.createElement(react_1.default.Fragment, null,
            renderLayout(this.props, this.renderControl.bind(this)),
            model
                ? render('modal', (0, tslib_1.__assign)({ type: 'dialog' }, model.dialogSchema), {
                    show: model.dialogOpen,
                    onClose: this.handleDialogClose,
                    onConfirm: this.handleDialogConfirm,
                    data: model.dialogData,
                    formStore: undefined
                })
                : null));
    };
    var _a, _b;
    /**
     * 布局扩充点，可以自己扩充表单项的布局方式
     */
    FormItemWrap.layoutRenderers = {
        horizontal: function (props, renderControl) {
            var _a, _b, _c;
            var className = props.className, cx = props.classnames, description = props.description, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, desc = props.desc, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, remark = props.remark, labelRemark = props.labelRemark, env = props.env, model = props.formItem, renderLabel = props.renderLabel, renderDescription = props.renderDescription, hint = props.hint, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI;
            // 强制不渲染 label 的话
            if (renderLabel === false) {
                label = label === false ? false : '';
            }
            description = description || desc;
            var horizontal = props.horizontal || props.formHorizontal || {};
            var left = (0, helper_1.getWidthRate)(horizontal.left);
            var right = (0, helper_1.getWidthRate)(horizontal.right);
            return (react_1.default.createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--horizontal", className, (_a = {
                        'Form-item--horizontal-justify': horizontal.justify
                    },
                    _a["is-error"] = model && !model.valid,
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                label !== false ? (react_1.default.createElement("label", { className: cx("Form-label", (_b = {},
                        _b["Form-itemColumn--".concat(typeof horizontal.leftFixed === 'string'
                            ? horizontal.leftFixed
                            : 'normal')] = horizontal.leftFixed,
                        _b["Form-itemColumn--".concat(left)] = !horizontal.leftFixed,
                        _b), labelClassName) },
                    react_1.default.createElement("span", null,
                        label
                            ? render('label', typeof label === 'string' ? (0, tpl_1.filter)(label, data) : label)
                            : null,
                        required && (label || labelRemark) ? (react_1.default.createElement("span", { className: cx("Form-star") }, "*")) : null,
                        labelRemark
                            ? render('label-remark', {
                                type: 'remark',
                                icon: labelRemark.icon || 'warning-mark',
                                tooltip: labelRemark,
                                useMobileUI: useMobileUI,
                                className: cx("Form-labelRemark"),
                                container: props.popOverContainer
                                    ? props.popOverContainer
                                    : env && env.getModalContainer
                                        ? env.getModalContainer
                                        : undefined
                            })
                            : null))) : null,
                react_1.default.createElement("div", { className: cx("Form-value", (_c = {},
                        // [`Form-itemColumn--offset${getWidthRate(horizontal.offset)}`]: !label && label !== false,
                        _c["Form-itemColumn--".concat(right)] = !horizontal.leftFixed && !!right && right !== 12 - left,
                        _c)) },
                    renderControl(),
                    caption
                        ? render('caption', caption, {
                            className: cx("Form-caption", captionClassName)
                        })
                        : null,
                    remark
                        ? render('remark', {
                            type: 'remark',
                            icon: remark.icon || 'warning-mark',
                            tooltip: remark,
                            className: cx("Form-remark"),
                            useMobileUI: useMobileUI,
                            container: props.popOverContainer
                                ? props.popOverContainer
                                : env && env.getModalContainer
                                    ? env.getModalContainer
                                    : undefined
                        })
                        : null,
                    hint && model && model.isFocused
                        ? render('hint', hint, {
                            className: cx("Form-hint")
                        })
                        : null,
                    model &&
                        !model.valid &&
                        showErrorMsg !== false &&
                        Array.isArray(model.errors) ? (react_1.default.createElement("ul", { className: cx("Form-feedback") }, model.errors.map(function (msg, key) { return (react_1.default.createElement("li", { key: key }, msg)); }))) : null,
                    renderDescription !== false && description
                        ? render('description', description, {
                            className: cx("Form-description", descriptionClassName)
                        })
                        : null)));
        },
        normal: function (props, renderControl) {
            var _a;
            var className = props.className, cx = props.classnames, desc = props.desc, description = props.description, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, remark = props.remark, labelRemark = props.labelRemark, env = props.env, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, model = props.formItem, renderLabel = props.renderLabel, renderDescription = props.renderDescription, hint = props.hint, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI;
            description = description || desc;
            return (react_1.default.createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--normal", className, (_a = {
                        'is-error': model && !model.valid
                    },
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                label && renderLabel !== false ? (react_1.default.createElement("label", { className: cx("Form-label", labelClassName) },
                    react_1.default.createElement("span", null,
                        label
                            ? render('label', typeof label === 'string' ? (0, tpl_1.filter)(label, data) : label)
                            : null,
                        required && (label || labelRemark) ? (react_1.default.createElement("span", { className: cx("Form-star") }, "*")) : null,
                        labelRemark
                            ? render('label-remark', {
                                type: 'remark',
                                icon: labelRemark.icon || 'warning-mark',
                                tooltip: labelRemark,
                                className: cx("Form-lableRemark"),
                                useMobileUI: useMobileUI,
                                container: props.popOverContainer
                                    ? props.popOverContainer
                                    : env && env.getModalContainer
                                        ? env.getModalContainer
                                        : undefined
                            })
                            : null))) : null,
                renderControl(),
                caption
                    ? render('caption', caption, {
                        className: cx("Form-caption", captionClassName)
                    })
                    : null,
                remark
                    ? render('remark', {
                        type: 'remark',
                        icon: remark.icon || 'warning-mark',
                        className: cx("Form-remark"),
                        tooltip: remark,
                        useMobileUI: useMobileUI,
                        container: env && env.getModalContainer
                            ? env.getModalContainer
                            : undefined
                    })
                    : null,
                hint && model && model.isFocused
                    ? render('hint', hint, {
                        className: cx("Form-hint")
                    })
                    : null,
                model &&
                    !model.valid &&
                    showErrorMsg !== false &&
                    Array.isArray(model.errors) ? (react_1.default.createElement("ul", { className: cx("Form-feedback") }, model.errors.map(function (msg, key) { return (react_1.default.createElement("li", { key: key }, msg)); }))) : null,
                renderDescription !== false && description
                    ? render('description', description, {
                        className: cx("Form-description", descriptionClassName)
                    })
                    : null));
        },
        inline: function (props, renderControl) {
            var _a;
            var className = props.className, cx = props.classnames, desc = props.desc, description = props.description, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, model = props.formItem, remark = props.remark, labelRemark = props.labelRemark, env = props.env, hint = props.hint, renderLabel = props.renderLabel, renderDescription = props.renderDescription, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI;
            description = description || desc;
            return (react_1.default.createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--inline", className, (_a = {
                        'is-error': model && !model.valid
                    },
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                label && renderLabel !== false ? (react_1.default.createElement("label", { className: cx("Form-label", labelClassName) },
                    react_1.default.createElement("span", null,
                        label
                            ? render('label', typeof label === 'string' ? (0, tpl_1.filter)(label, data) : label)
                            : label,
                        required && (label || labelRemark) ? (react_1.default.createElement("span", { className: cx("Form-star") }, "*")) : null,
                        labelRemark
                            ? render('label-remark', {
                                type: 'remark',
                                icon: labelRemark.icon || 'warning-mark',
                                tooltip: labelRemark,
                                className: cx("Form-lableRemark"),
                                useMobileUI: useMobileUI,
                                container: props.popOverContainer
                                    ? props.popOverContainer
                                    : env && env.getModalContainer
                                        ? env.getModalContainer
                                        : undefined
                            })
                            : null))) : null,
                react_1.default.createElement("div", { className: cx("Form-value") },
                    renderControl(),
                    caption
                        ? render('caption', caption, {
                            className: cx("Form-caption", captionClassName)
                        })
                        : null,
                    remark
                        ? render('remark', {
                            type: 'remark',
                            icon: remark.icon || 'warning-mark',
                            className: cx("Form-remark"),
                            tooltip: remark,
                            useMobileUI: useMobileUI,
                            container: props.popOverContainer
                                ? props.popOverContainer
                                : env && env.getModalContainer
                                    ? env.getModalContainer
                                    : undefined
                        })
                        : null,
                    hint && model && model.isFocused
                        ? render('hint', hint, {
                            className: cx("Form-hint")
                        })
                        : null,
                    model &&
                        !model.valid &&
                        showErrorMsg !== false &&
                        Array.isArray(model.errors) ? (react_1.default.createElement("ul", { className: cx("Form-feedback") }, model.errors.map(function (msg, key) { return (react_1.default.createElement("li", { key: key }, msg)); }))) : null,
                    renderDescription !== false && description
                        ? render('description', description, {
                            className: cx("Form-description", descriptionClassName)
                        })
                        : null)));
        },
        row: function (props, renderControl) {
            var _a;
            var className = props.className, cx = props.classnames, desc = props.desc, description = props.description, label = props.label, labelClassName = props.labelClassName, render = props.render, required = props.required, caption = props.caption, remark = props.remark, labelRemark = props.labelRemark, env = props.env, descriptionClassName = props.descriptionClassName, captionClassName = props.captionClassName, model = props.formItem, renderLabel = props.renderLabel, renderDescription = props.renderDescription, hint = props.hint, data = props.data, showErrorMsg = props.showErrorMsg, useMobileUI = props.useMobileUI;
            description = description || desc;
            return (react_1.default.createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--row", className, (_a = {
                        'is-error': model && !model.valid
                    },
                    _a["is-required"] = required,
                    _a), model === null || model === void 0 ? void 0 : model.errClassNames) },
                react_1.default.createElement("div", { className: cx('Form-rowInner') },
                    label && renderLabel !== false ? (react_1.default.createElement("label", { className: cx("Form-label", labelClassName) },
                        react_1.default.createElement("span", null,
                            render('label', typeof label === 'string' ? (0, tpl_1.filter)(label, data) : label),
                            required && (label || labelRemark) ? (react_1.default.createElement("span", { className: cx("Form-star") }, "*")) : null,
                            labelRemark
                                ? render('label-remark', {
                                    type: 'remark',
                                    icon: labelRemark.icon || 'warning-mark',
                                    tooltip: labelRemark,
                                    className: cx("Form-lableRemark"),
                                    useMobileUI: useMobileUI,
                                    container: props.popOverContainer
                                        ? props.popOverContainer
                                        : env && env.getModalContainer
                                            ? env.getModalContainer
                                            : undefined
                                })
                                : null))) : null,
                    renderControl(),
                    caption
                        ? render('caption', caption, {
                            className: cx("Form-caption", captionClassName)
                        })
                        : null,
                    remark
                        ? render('remark', {
                            type: 'remark',
                            icon: remark.icon || 'warning-mark',
                            className: cx("Form-remark"),
                            tooltip: remark,
                            container: env && env.getModalContainer
                                ? env.getModalContainer
                                : undefined
                        })
                        : null),
                hint && model && model.isFocused
                    ? render('hint', hint, {
                        className: cx("Form-hint")
                    })
                    : null,
                model &&
                    !model.valid &&
                    showErrorMsg !== false &&
                    Array.isArray(model.errors) ? (react_1.default.createElement("ul", { className: cx('Form-feedback') }, model.errors.map(function (msg, key) { return (react_1.default.createElement("li", { key: key }, msg)); }))) : null,
                description && renderDescription !== false
                    ? render('description', description, {
                        className: cx("Form-description", descriptionClassName)
                    })
                    : null));
        }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof types_1.Schema !== "undefined" && types_1.Schema) === "function" ? _a : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], FormItemWrap.prototype, "handleOpenDialog", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleDialogConfirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormItemWrap.prototype, "handleDialogClose", null);
    return FormItemWrap;
}(react_1.default.Component));
exports.FormItemWrap = FormItemWrap;
// 白名单形式，只有这些属性发生变化，才会往下更新。
// 除非配置  strictMode
exports.detectProps = [
    'formPristine',
    'formInited',
    'addable',
    'addButtonClassName',
    'addButtonText',
    'addOn',
    'btnClassName',
    'btnLabel',
    'btnDisabled',
    'className',
    'clearable',
    'columns',
    'columnsCount',
    'controls',
    'desc',
    'description',
    'disabled',
    'draggable',
    'editable',
    'editButtonClassName',
    'formHorizontal',
    'formMode',
    'hideRoot',
    'horizontal',
    'icon',
    'inline',
    'inputClassName',
    'label',
    'labelClassName',
    'labelField',
    'language',
    'level',
    'max',
    'maxRows',
    'min',
    'minRows',
    'multiLine',
    'multiple',
    'option',
    'placeholder',
    'removable',
    'required',
    'remark',
    'hint',
    'rows',
    'searchable',
    'showCompressOptions',
    'size',
    'step',
    'showInput',
    'unit',
    'value',
    'diffValue',
    'borderMode',
    'items',
    'showCounter',
    'minLength',
    'maxLength',
    'embed',
    'displayMode'
];
function asFormItem(config) {
    return function (Control) {
        var _a;
        var isSFC = !(Control.prototype instanceof react_1.default.Component);
        // 兼容老的 FormItem 用法。
        if (config.validate && !Control.prototype.validate) {
            var fn_1 = config.validate;
            Control.prototype.validate = function () {
                var host = {
                    input: this
                };
                return fn_1.apply(host, arguments);
            };
        }
        else if (config.validate) {
            console.error('FormItem配置中的 validate 将不起作用，因为类的成员函数中已经定义了 validate 方法，将优先使用类里面的实现。');
        }
        if (config.storeType) {
            Control = (0, WithStore_1.HocStoreFactory)({
                storeType: config.storeType,
                extendsData: config.extendsData
            })((0, mobx_react_1.observer)(Control));
            delete config.storeType;
        }
        return (0, wrapControl_1.wrapControl)((0, hoist_non_react_statics_1.default)((_a = /** @class */ (function (_super) {
                (0, tslib_1.__extends)(class_1, _super);
                function class_1(props) {
                    var _this = _super.call(this, props) || this;
                    _this.refFn = _this.refFn.bind(_this);
                    var validations = props.validations, model = props.formItem;
                    // 组件注册的时候可能默认指定验证器类型
                    if (model && !validations && config.validations) {
                        model.config({
                            rules: config.validations
                        });
                    }
                    return _this;
                }
                class_1.prototype.shouldComponentUpdate = function (nextProps) {
                    var _a;
                    if (((_a = config.shouldComponentUpdate) === null || _a === void 0 ? void 0 : _a.call(config, this.props, nextProps)) ||
                        nextProps.strictMode === false ||
                        config.strictMode === false) {
                        return true;
                    }
                    // 把可能会影响视图的白名单弄出来，减少重新渲染次数。
                    if ((0, helper_1.anyChanged)(exports.detectProps, this.props, nextProps)) {
                        return true;
                    }
                    return false;
                };
                class_1.prototype.getWrappedInstance = function () {
                    return this.ref;
                };
                class_1.prototype.refFn = function (ref) {
                    this.ref = ref;
                };
                class_1.prototype.renderControl = function () {
                    var _a;
                    var _b = this.props, inputClassName = _b.inputClassName, model = _b.formItem, cx = _b.classnames, children = _b.children, type = _b.type, size = _b.size, defaultSize = _b.defaultSize, useMobileUI = _b.useMobileUI, rest = (0, tslib_1.__rest)(_b, ["inputClassName", "formItem", "classnames", "children", "type", "size", "defaultSize", "useMobileUI"]);
                    var controlSize = size || defaultSize;
                    var mobileUI = useMobileUI && (0, helper_1.isMobile)();
                    return (react_1.default.createElement(Control, (0, tslib_1.__assign)({}, rest, { useMobileUI: useMobileUI, onOpenDialog: this.handleOpenDialog, size: config.sizeMutable !== false ? undefined : size, onFocus: this.handleFocus, onBlur: this.handleBlur, type: type, classnames: cx, ref: isSFC ? undefined : this.refFn, forwardedRef: isSFC ? this.refFn : undefined, formItem: model, className: cx("Form-control", (_a = {
                                'is-inline': !!rest.inline && !mobileUI,
                                'is-error': model && !model.valid
                            },
                            _a["Form-control--withSize Form-control--size".concat((0, helper_1.ucFirst)(controlSize))] = config.sizeMutable !== false &&
                                typeof controlSize === 'string' &&
                                !!controlSize &&
                                controlSize !== 'full',
                            _a), model === null || model === void 0 ? void 0 : model.errClassNames, inputClassName) })));
                };
                return class_1;
            }(FormItemWrap)),
            _a.defaultProps = (0, tslib_1.__assign)({ className: '', renderLabel: config.renderLabel, renderDescription: config.renderDescription, sizeMutable: config.sizeMutable, wrap: config.wrap, showErrorMsg: config.showErrorMsg }, Control.defaultProps),
            _a.propsList = (0, tslib_1.__spreadArray)([
                'value',
                'defaultValue',
                'onChange',
                'setPrinstineValue',
                'readOnly',
                'strictMode'
            ], (Control.propsList || []), true),
            _a.displayName = "FormItem".concat(config.type ? "(".concat(config.type, ")") : ''),
            _a.ComposedComponent = Control,
            _a), Control));
    };
}
exports.asFormItem = asFormItem;
function registerFormItem(config) {
    var Control = asFormItem(config)(config.component);
    return (0, factory_1.registerRenderer)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, config), { weight: typeof config.weight !== 'undefined' ? config.weight : -100, component: Control, isFormItem: true }));
}
exports.registerFormItem = registerFormItem;
function FormItem(config) {
    return function (component) {
        var renderer = registerFormItem((0, tslib_1.__assign)((0, tslib_1.__assign)({}, config), { component: component }));
        return renderer.component;
    };
}
exports.FormItem = FormItem;
exports.default = FormItem;
//# sourceMappingURL=./renderers/Form/Item.js.map
