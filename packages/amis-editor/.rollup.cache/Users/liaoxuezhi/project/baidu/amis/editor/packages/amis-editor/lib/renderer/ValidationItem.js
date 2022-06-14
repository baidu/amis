/**
 * @file 校验项
 */
import { __assign, __decorate, __extends, __metadata } from "tslib";
import React from 'react';
import cx from 'classnames';
import { render, Button, Switch } from 'amis';
import { autobind } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
var ValidationItem = /** @class */ (function (_super) {
    __extends(ValidationItem, _super);
    function ValidationItem(props) {
        var _this = _super.call(this, props) || this;
        var data = _this.props.data;
        _this.validator = _this.props.validator;
        _this.state = {
            value: data === null || data === void 0 ? void 0 : data.value,
            checked: data.value != null,
            message: (data === null || data === void 0 ? void 0 : data.message) || '',
            isBuiltIn: data === null || data === void 0 ? void 0 : data.isBuiltIn
        };
        return _this;
    }
    ValidationItem.prototype.handleEdit = function (value, action) {
        var _a = this.props, onEdit = _a.onEdit, data = _a.data;
        if ((action === null || action === void 0 ? void 0 : action.type) === 'submit') {
            onEdit &&
                onEdit(__assign({ name: data.name }, value));
        }
    };
    ValidationItem.prototype.handleDelete = function () {
        var _a = this.props, onDelete = _a.onDelete, data = _a.data;
        onDelete && onDelete(data.name);
    };
    ValidationItem.prototype.handleSwitch = function (checked) {
        var _a = this.props, onSwitch = _a.onSwitch, data = _a.data;
        var _b = this.state, value = _b.value, message = _b.message;
        this.setState({
            checked: checked
        });
        if (checked) {
            data.value = this.validator.schema ? value : true;
            data.message = '';
        }
        onSwitch && onSwitch(checked, data);
    };
    ValidationItem.prototype.renderActions = function () {
        var isDefault = this.props.isDefault;
        var actions = [];
        if (!isDefault) {
            actions.push(React.createElement(Button, { className: "ae-ValidationControl-item-action", level: "link", size: "md", key: "delete", onClick: this.handleDelete },
                React.createElement("i", { className: "fa fa-trash" })));
        }
        return actions.length !== 0 ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "ae-ValidationControl-item-actions" }, actions))) : null;
    };
    ValidationItem.prototype.renderInputControl = function () {
        var _a = this.state, value = _a.value, message = _a.message, checked = _a.checked;
        var control = [];
        if (!checked) {
            return null;
        }
        if (this.validator.schema) {
            control = control.concat(this.validator.schema);
        }
        if (this.validator.message) {
            control.push({
                name: 'message',
                type: 'input-text',
                label: tipedLabel('错误提示', "\u7CFB\u7EDF\u9ED8\u8BA4\u63D0\u793A\uFF1A".concat(this.validator.message)),
                placeholder: '默认使用系统定义提示'
            });
        }
        return control.length !== 0 ? (React.createElement("section", { className: cx('ae-ValidationControl-item-input', 'ae-ExtendMore') }, render({
            type: 'form',
            className: 'w-full',
            wrapWithPanel: false,
            panelClassName: 'border-none shadow-none mb-0',
            bodyClassName: 'p-none',
            actionsClassName: 'border-none mt-2.5',
            wrapperComponent: 'div',
            mode: 'horizontal',
            horizontal: {
                justify: true,
                left: 4,
                right: 8
            },
            preventEnterSubmit: true,
            submitOnChange: true,
            body: control,
            data: { value: value, message: message }
        }, {
            onSubmit: this.handleEdit
        }))) : null;
    };
    ValidationItem.prototype.render = function () {
        var _a = this.props, classPrefix = _a.classPrefix, data = _a.data, isDefault = _a.isDefault;
        var _b = this.state, checked = _b.checked, isBuiltIn = _b.isBuiltIn;
        return (React.createElement("div", { className: cx('ae-ValidationControl-item', {
                'is-active': checked
            }), key: data.name },
            React.createElement("section", { className: cx('ae-ValidationControl-item-control', {
                    'is-active': checked && data.name !== 'required'
                }) },
                React.createElement("label", { className: cx("".concat(classPrefix, "Form-label")) }, this.validator.label),
                React.createElement("div", null,
                    this.renderActions(),
                    React.createElement(Switch, { key: "switch", value: checked, disabled: isBuiltIn, onChange: this.handleSwitch }))),
            this.renderInputControl()));
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ValidationItem.prototype, "handleEdit", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ValidationItem.prototype, "handleDelete", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean]),
        __metadata("design:returntype", void 0)
    ], ValidationItem.prototype, "handleSwitch", null);
    return ValidationItem;
}(React.Component));
export default ValidationItem;
