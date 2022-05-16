"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubFormControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var helper_1 = require("../../utils/helper");
var icons_1 = require("../../components/icons");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var react_dom_1 = require("react-dom");
var dom;
var stripTag = function (value) {
    if (!value) {
        return value;
    }
    dom = dom || document.createElement('div');
    dom.innerHTML = value;
    return dom.innerText;
};
var SubFormControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SubFormControl, _super);
    function SubFormControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.id = (0, helper_1.guid)();
        _this.addItem = _this.addItem.bind(_this);
        _this.removeItem = _this.removeItem.bind(_this);
        _this.editSingle = _this.editSingle.bind(_this);
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.handleDialogConfirm = _this.handleDialogConfirm.bind(_this);
        return _this;
    }
    SubFormControl.prototype.addItem = function () {
        this.setState({
            dialogData: (0, helper_1.createObject)(this.props.data, this.props.scaffold || {}),
            dialogCtx: {
                mode: 'add'
            }
        });
    };
    SubFormControl.prototype.removeItem = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var value = this.props.value;
        if (!Array.isArray(value)) {
            return;
        }
        value = value.concat();
        value.splice(index, 1);
        this.props.onChange(value);
    };
    SubFormControl.prototype.editSingle = function () {
        var value = this.props.value;
        if (value) {
            this.setState({
                dialogData: (0, helper_1.createObject)(this.props.data, this.props.value),
                dialogCtx: {
                    mode: 'edit'
                }
            });
        }
        else {
            this.addItem();
        }
    };
    SubFormControl.prototype.open = function (e) {
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var value = this.props.value;
        if (!Array.isArray(value) || !value[index]) {
            return;
        }
        this.setState({
            dialogData: (0, helper_1.createObject)(this.props.data, value[index]),
            dialogCtx: {
                mode: 'edit',
                index: index
            }
        });
    };
    SubFormControl.prototype.close = function () {
        this.setState({
            dialogData: undefined,
            dialogCtx: undefined
        });
    };
    SubFormControl.prototype.handleDialogConfirm = function (values) {
        var _a = this.props, multiple = _a.multiple, onChange = _a.onChange, value = _a.value;
        var ctx = this.state.dialogCtx;
        if (multiple) {
            var newValue = Array.isArray(value) ? value.concat() : [];
            if ((ctx === null || ctx === void 0 ? void 0 : ctx.mode) === 'add') {
                newValue.push((0, tslib_1.__assign)({}, values[0]));
            }
            else {
                newValue[ctx.index] = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, newValue[ctx.index]), values[0]);
            }
            onChange(newValue);
        }
        else {
            onChange((0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), values[0]));
        }
        this.close();
    };
    SubFormControl.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    SubFormControl.prototype.initDragging = function () {
        var _this = this;
        var ns = this.props.classPrefix;
        var submitOnChange = this.props.submitOnChange;
        var dom = (0, react_dom_1.findDOMNode)(this);
        this.sortable = new sortablejs_1.default(dom.querySelector(".".concat(ns, "SubForm-values")), {
            group: "SubForm-".concat(this.id),
            animation: 150,
            handle: ".".concat(ns, "SubForm-valueDragBar"),
            ghostClass: "".concat(ns, "SubForm-value--dragging"),
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                // 换回来
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                var value = _this.props.value;
                if (!Array.isArray(value)) {
                    return;
                }
                var newValue = value.concat();
                newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
                _this.props.onChange(newValue, submitOnChange, true);
            }
        });
    };
    SubFormControl.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    SubFormControl.prototype.buildDialogSchema = function () {
        var form = this.props.form;
        var dialogProps = [
            'title',
            'actions',
            'name',
            'size',
            'closeOnEsc',
            'closeOnOutside',
            'showErrorMsg',
            'showCloseButton',
            'bodyClassName',
            'type'
        ];
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, pick_1.default)(form, dialogProps)), { type: 'dialog', body: (0, tslib_1.__assign)({ type: 'form' }, (0, omit_1.default)(form, dialogProps)) });
    };
    SubFormControl.prototype.renderMultipe = function () {
        var _this = this;
        var _a = this.props, addButtonClassName = _a.addButtonClassName, itemClassName = _a.itemClassName, itemsClassName = _a.itemsClassName, disabled = _a.disabled, maxLength = _a.maxLength, labelField = _a.labelField, value = _a.value, btnLabel = _a.btnLabel, render = _a.render, data = _a.data, __ = _a.translate, cx = _a.classnames, placeholder = _a.placeholder, draggable = _a.draggable, draggableTip = _a.draggableTip, addable = _a.addable, removable = _a.removable, minLength = _a.minLength, addButtonText = _a.addButtonText;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            Array.isArray(value) && value.length ? (react_1.default.createElement("div", { className: cx('SubForm-values', itemsClassName), key: "values" }, value.map(function (item, key) { return (react_1.default.createElement("div", { className: cx("SubForm-value", {
                    'is-disabled': disabled
                }, itemClassName), key: key },
                draggable && value.length > 1 ? (react_1.default.createElement("a", { className: cx('SubForm-valueDragBar') },
                    react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: cx('icon') }))) : null,
                react_1.default.createElement("span", { className: cx('SubForm-valueLabel') }, (item &&
                    labelField &&
                    item[labelField] &&
                    stripTag(item[labelField])) ||
                    render('label', {
                        type: 'tpl',
                        tpl: __(btnLabel)
                    }, {
                        data: (0, helper_1.createObject)(data, item)
                    })),
                react_1.default.createElement("a", { "data-index": key, onClick: _this.open, className: cx('SubForm-valueEdit') },
                    react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon" })),
                !disabled &&
                    removable !== false &&
                    (!minLength || value.length > minLength) ? (react_1.default.createElement("a", { "data-index": key, className: cx('SubForm-valueDel'), onClick: _this.removeItem },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null)); }))) : (react_1.default.createElement("div", { className: cx('SubForm-placeholder'), key: "placeholder" }, __(placeholder || 'placeholder.empty'))),
            react_1.default.createElement("div", { key: "toolbar", className: cx('SubForm-toolbar') },
                addable !== false ? (react_1.default.createElement("button", { type: "button", onClick: this.addItem, className: cx("Button SubForm-addBtn", addButtonClassName), disabled: disabled ||
                        !!(maxLength &&
                            Array.isArray(value) &&
                            value.length >= maxLength) },
                    react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }),
                    react_1.default.createElement("span", null, __(addButtonText || 'SubForm.add')))) : null,
                draggable && Array.isArray(value) && value.length > 1 ? (react_1.default.createElement("span", { className: cx("Combo-dragableTip"), ref: this.dragTipRef }, Array.isArray(value) && value.length > 1 ? __(draggableTip) : '')) : null)));
    };
    SubFormControl.prototype.renderSingle = function () {
        var _a = this.props, cx = _a.classnames, itemsClassName = _a.itemsClassName, itemClassName = _a.itemClassName, disabled = _a.disabled, value = _a.value, labelField = _a.labelField, btnLabel = _a.btnLabel, render = _a.render, data = _a.data, __ = _a.translate;
        return (react_1.default.createElement("div", { className: cx('SubForm-values', itemsClassName), key: "values" },
            react_1.default.createElement("div", { className: cx("SubForm-value", {
                    'is-disabled': disabled
                }, itemClassName), onClick: this.editSingle, "data-tooltip": __('SubForm.editDetail'), "data-position": "bottom" },
                react_1.default.createElement("span", { className: cx('SubForm-valueLabel') }, (value &&
                    labelField &&
                    value[labelField] &&
                    stripTag(value[labelField])) ||
                    render('label', {
                        type: 'tpl',
                        tpl: __(btnLabel)
                    }, {
                        data: (0, helper_1.createObject)(data, value)
                    })),
                react_1.default.createElement("a", { className: cx('SubForm-valueEdit') },
                    react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon" })))));
    };
    SubFormControl.prototype.render = function () {
        var _a = this.props, multiple = _a.multiple, ns = _a.classPrefix, className = _a.className, render = _a.render;
        var dialogData = this.state.dialogData;
        var dialogCtx = this.state.dialogCtx;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "SubFormControl"), className) },
            multiple ? this.renderMultipe() : this.renderSingle(),
            render("modal", this.buildDialogSchema(), {
                show: !!dialogCtx,
                onClose: this.close,
                onConfirm: this.handleDialogConfirm,
                data: dialogData,
                formStore: undefined
            })));
    };
    SubFormControl.defaultProps = {
        minLength: 0,
        maxLength: 0,
        multiple: false,
        btnClassName: '',
        addButtonClassName: '',
        itemClassName: '',
        labelField: 'label',
        btnLabel: 'SubForm.button',
        placeholder: 'placeholder.empty'
    };
    SubFormControl.propsList = ['form', 'formStore'];
    return SubFormControl;
}(react_1.default.PureComponent));
exports.default = SubFormControl;
var SubFormControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SubFormControlRenderer, _super);
    function SubFormControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubFormControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-sub-form',
            sizeMutable: false,
            strictMode: false
        })
    ], SubFormControlRenderer);
    return SubFormControlRenderer;
}(SubFormControl));
exports.SubFormControlRenderer = SubFormControlRenderer;
//# sourceMappingURL=./renderers/Form/InputSubForm.js.map
