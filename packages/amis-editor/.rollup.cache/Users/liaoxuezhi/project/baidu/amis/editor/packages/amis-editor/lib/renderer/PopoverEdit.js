/**
 * @file 浮窗编辑
 */
import { __assign, __decorate, __extends, __metadata } from "tslib";
import React from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';
import { FormItem, Button, Overlay, PopOver, Icon, Switch } from 'amis';
import { isObject, autobind } from 'amis-editor-core';
var PopoverEdit = /** @class */ (function (_super) {
    __extends(PopoverEdit, _super);
    function PopoverEdit(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            show: false,
            checked: !!props.value
        };
        return _this;
    }
    PopoverEdit.prototype.overlayRef = function (ref) {
        this.overlay = ref ? findDOMNode(ref) : null;
    };
    PopoverEdit.prototype.openPopover = function () {
        this.setState({ show: true });
    };
    PopoverEdit.prototype.closePopover = function () {
        this.setState({ show: false });
    };
    PopoverEdit.prototype.handleDelete = function (e) {
        var onDelete = this.props.onDelete;
        onDelete && onDelete(e);
    };
    PopoverEdit.prototype.handleSwitchChange = function (checked) {
        var _a = this.props, onChange = _a.onChange, enableEdit = _a.enableEdit;
        this.setState({ checked: checked });
        if (!enableEdit) {
            onChange && onChange(checked);
        }
        else {
            // undefined字段会从schema中删除
            !checked && onChange && onChange(undefined);
        }
    };
    PopoverEdit.prototype.handleSubmit = function (values, action) {
        var onChange = this.props.onChange;
        onChange && onChange(values);
    };
    PopoverEdit.prototype.handleAction = function (e, action, data, throwErrors, delegate) {
        if (throwErrors === void 0) { throwErrors = false; }
        var onClose = this.props.onClose;
        if (action.actionType === 'close') {
            this.setState({ show: false });
            onClose && onClose(e);
        }
    };
    PopoverEdit.prototype.renderPopover = function () {
        var _a = this.props, render = _a.render, popOverclassName = _a.popOverclassName, overlay = _a.overlay, offset = _a.offset, target = _a.target, container = _a.container, placement = _a.placement, rootClose = _a.rootClose, style = _a.style, title = _a.title, label = _a.label, form = _a.form, name = _a.name, ctx = _a.data;
        return (React.createElement(Overlay, { show: true, rootClose: rootClose, placement: placement, target: target || this.overlay, container: container },
            React.createElement(PopOver, { className: cx('ae-PopoverEdit-popover', popOverclassName), placement: placement, overlay: overlay, offset: offset, style: style },
                React.createElement("header", null,
                    React.createElement("p", { className: "ae-PopoverEdit-title" }, title || label),
                    React.createElement("a", { onClick: this.closePopover, className: "ae-PopoverEdit-close" },
                        React.createElement(Icon, { icon: "close", className: "icon" }))),
                isObject(form)
                    ? render('popover-edit-form', __assign({ type: 'form', wrapWithPanel: false, panelClassName: 'border-none shadow-none mb-0', bodyClassName: 'p-none', actionsClassName: 'border-none mt-2.5', wrapperComponent: 'div', mode: 'horizontal', autoFocus: true, formLazyChange: true, preventEnterSubmit: true, submitOnChange: true, data: ctx && name ? ctx === null || ctx === void 0 ? void 0 : ctx[name] : {} }, form), {
                        onSubmit: this.handleSubmit
                    })
                    : null)));
    };
    PopoverEdit.prototype.render = function () {
        var _a = this.props, render = _a.render, removable = _a.removable, btnIcon = _a.btnIcon, btnLabel = _a.btnLabel, iconPosition = _a.iconPosition, disabled = _a.disabled, enableEdit = _a.enableEdit, className = _a.className;
        var _b = this.state, show = _b.show, checked = _b.checked;
        var btnLabelNode = btnLabel ? React.createElement("span", null, btnLabel) : null;
        return (React.createElement("div", { className: cx('ae-PopoverEditControl', className) },
            enableEdit && checked && !disabled ? (React.createElement(Button, { level: "link", size: "sm", ref: this.overlayRef, onClick: this.openPopover }, iconPosition === 'right' ? (React.createElement(React.Fragment, null,
                btnLabelNode,
                React.createElement(Icon, { icon: btnIcon, className: "icon" }))) : (React.createElement(React.Fragment, null,
                React.createElement(Icon, { icon: btnIcon, className: "icon" }),
                btnLabelNode)))) : null,
            removable ? (React.createElement(Button, { level: "link", size: "sm", onClick: this.handleDelete },
                React.createElement(Icon, { icon: "delete-btn", className: "icon" }))) : null,
            React.createElement(Switch, { value: checked, onChange: this.handleSwitchChange, disabled: disabled }),
            show ? this.renderPopover() : null));
    };
    PopoverEdit.defaultProps = {
        btnIcon: 'pencil',
        iconPosition: 'right',
        container: document.body,
        placement: 'left',
        overlay: true,
        rootClose: false,
        mode: 'popover',
        trueValue: true,
        falseValue: false,
        enableEdit: true
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "overlayRef", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "openPopover", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "closePopover", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "handleDelete", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean]),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "handleSwitchChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "handleSubmit", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object, Boolean, Object]),
        __metadata("design:returntype", void 0)
    ], PopoverEdit.prototype, "handleAction", null);
    return PopoverEdit;
}(React.Component));
export { PopoverEdit };
var PopoverEditRenderer = /** @class */ (function (_super) {
    __extends(PopoverEditRenderer, _super);
    function PopoverEditRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopoverEditRenderer = __decorate([
        FormItem({
            type: 'popover-edit'
        })
    ], PopoverEditRenderer);
    return PopoverEditRenderer;
}(PopoverEdit));
export { PopoverEditRenderer };
