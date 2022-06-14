/**
 * @file 状态配置组件
 */
import { __decorate, __extends, __metadata, __spreadArray } from "tslib";
import React from 'react';
import cx from 'classnames';
import { FormItem, Switch } from 'amis';
import { autobind } from 'amis-editor-core';
var StatusControl = /** @class */ (function (_super) {
    __extends(StatusControl, _super);
    function StatusControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = _this.initState();
        return _this;
    }
    StatusControl.prototype.initState = function () {
        var _a = this.props, _b = _a.data, ctx = _b === void 0 ? {} : _b, expressioName = _a.expressioName, name = _a.name, trueValue = _a.trueValue;
        return {
            checked: ctx[name] == trueValue || typeof ctx[expressioName] === 'string'
        };
    };
    StatusControl.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return nextState.checked !== this.state.checked;
    };
    StatusControl.prototype.handleSwitch = function (value) {
        var _this = this;
        var _a = this.props, trueValue = _a.trueValue, falseValue = _a.falseValue;
        this.setState({ checked: value == trueValue ? true : false }, function () {
            var _a;
            var _b = _this.props, onBulkChange = _b.onBulkChange, expressioName = _b.expressioName, name = _b.name;
            onBulkChange &&
                onBulkChange((_a = {},
                    _a[name] = value == trueValue ? trueValue : falseValue,
                    _a[expressioName] = undefined,
                    _a));
        });
    };
    StatusControl.prototype.handleSubmit = function (values) {
        var _a = this.props, onBulkChange = _a.onBulkChange, name = _a.name, expressioName = _a.expressioName;
        values[name] = !values[name] ? undefined : values[name];
        values[expressioName] = !values[expressioName]
            ? undefined
            : values[expressioName];
        onBulkChange && onBulkChange(values);
    };
    StatusControl.prototype.handleSelect = function (value) {
        var _a;
        var _b = this.props, onBulkChange = _b.onBulkChange, name = _b.name, expressioName = _b.expressioName;
        onBulkChange &&
            onBulkChange((_a = {},
                _a[value ? expressioName : name] = undefined,
                _a[(!value && expressioName) || ''] = '',
                _a));
    };
    StatusControl.prototype.render = function () {
        var _a = this.props, className = _a.className, _b = _a.data, ctx = _b === void 0 ? {} : _b, trueValue = _a.trueValue, falseValue = _a.falseValue, env = _a.env;
        var checked = this.state.checked;
        return (React.createElement("div", { className: cx('ae-StatusControl', className) },
            React.createElement("header", { className: cx('ae-StatusControl-switch') },
                React.createElement("div", null,
                    React.createElement(Switch, { className: "ae-BaseSwitch", size: "md", trueValue: trueValue, falseValue: falseValue, checked: checked, onChange: this.handleSwitch }))),
            checked ? this.renderContent() : null));
    };
    StatusControl.prototype.renderContent = function () {
        var _a = this.props, render = _a.render, label = _a.label, _b = _a.data, ctx = _b === void 0 ? {} : _b, name = _a.name, expressioName = _a.expressioName, options = _a.options, children = _a.children, messages = _a.messages;
        return (React.createElement("div", { className: "ae-StatusControl-content" }, render('status-control-form', {
            type: 'form',
            title: '',
            panelClassName: 'border-none shadow-none mb-0',
            bodyClassName: 'p-none',
            actionsClassName: 'border-none mt-2.5',
            wrapperComponent: 'div',
            submitOnChange: true,
            autoFocus: true,
            formLazyChange: true,
            footerWrapClassName: 'hidden',
            preventEnterSubmit: true,
            messages: messages,
            mode: 'horizontal',
            horizontal: {
                justify: true,
                left: 3
            },
            body: __spreadArray([
                {
                    type: 'select',
                    label: '条件',
                    name: name,
                    value: "typeof this.".concat(expressioName, " === \"string\" ? 2 : 1"),
                    options: options || [
                        {
                            label: '静态',
                            value: 1
                        },
                        {
                            label: '表达式',
                            value: 2
                        }
                    ],
                    pipeIn: function (value) { return (typeof value === 'boolean' ? 1 : 2); },
                    pipeOut: function (value) { return (value === 1 ? true : ''); },
                    onChange: this.handleSelect
                }
            ], (Array.isArray(children)
                ? children
                : [
                    children || {
                        type: 'ae-formulaControl',
                        name: expressioName,
                        label: '表达式',
                        placeholder: "\u8BF7\u8F93\u5165".concat(label, "\u6761\u4EF6"),
                        visibleOn: "typeof this.".concat(name, " !== \"boolean\"")
                    }
                ]), true)
        }, {
            onSubmit: this.handleSubmit
        })));
    };
    StatusControl.defaultProps = {
        trueValue: true,
        falseValue: false
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean]),
        __metadata("design:returntype", void 0)
    ], StatusControl.prototype, "handleSwitch", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], StatusControl.prototype, "handleSubmit", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], StatusControl.prototype, "handleSelect", null);
    return StatusControl;
}(React.Component));
export { StatusControl };
var StatusControlRenderer = /** @class */ (function (_super) {
    __extends(StatusControlRenderer, _super);
    function StatusControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusControlRenderer = __decorate([
        FormItem({
            type: 'ae-statusControl'
        })
    ], StatusControlRenderer);
    return StatusControlRenderer;
}(StatusControl));
export { StatusControlRenderer };
