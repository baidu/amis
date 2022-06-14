/**
 * @file 角标控件
 */
import { __assign, __decorate, __extends, __metadata } from "tslib";
import React from 'react';
import cx from 'classnames';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import { FormItem, Switch } from 'amis';
import { autobind, isObject, isEmpty, anyChanged } from 'amis-editor-core';
import { defaultValue } from 'amis-editor-core';
var BadgeControl = /** @class */ (function (_super) {
    __extends(BadgeControl, _super);
    function BadgeControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            checked: !!isObject(props === null || props === void 0 ? void 0 : props.value)
        };
        return _this;
    }
    BadgeControl.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b;
        var props = this.props;
        if (anyChanged([
            'mode',
            'text',
            'size',
            'offset',
            'position',
            'overflowCount',
            'visibleOn',
            'animation',
            'style',
            'level'
        ], (_a = prevProps === null || prevProps === void 0 ? void 0 : prevProps.value) !== null && _a !== void 0 ? _a : {}, (_b = props === null || props === void 0 ? void 0 : props.value) !== null && _b !== void 0 ? _b : {})) {
            this.setState({ checked: !!isObject(props === null || props === void 0 ? void 0 : props.value) });
        }
    };
    BadgeControl.prototype.transformBadgeValue = function () {
        var _a, _b;
        var ctx = this.props.data;
        var badge = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.badge) !== null && _a !== void 0 ? _a : {};
        // 避免获取到上层的size
        var size = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.badge) === null || _b === void 0 ? void 0 : _b.size;
        var offset = { x: 0, y: 0 };
        // 转换成combo可以识别的格式
        if (Array.isArray(badge === null || badge === void 0 ? void 0 : badge.offset) && (badge === null || badge === void 0 ? void 0 : badge.offset.length) >= 2) {
            offset.x = badge === null || badge === void 0 ? void 0 : badge.offset[0];
            offset.y = badge === null || badge === void 0 ? void 0 : badge.offset[1];
        }
        return __assign(__assign({}, badge), { size: size, offset: offset });
    };
    BadgeControl.prototype.normalizeBadgeValue = function (form) {
        var _a, _b;
        var offset = isObject(form === null || form === void 0 ? void 0 : form.offset) && ((_a = form === null || form === void 0 ? void 0 : form.offset) === null || _a === void 0 ? void 0 : _a.x) && ((_b = form === null || form === void 0 ? void 0 : form.offset) === null || _b === void 0 ? void 0 : _b.y)
            ? { offset: [form.offset.x, form.offset.y] }
            : {};
        var style = isObject(form === null || form === void 0 ? void 0 : form.style) && !isEmpty(form === null || form === void 0 ? void 0 : form.style)
            ? {
                style: mapKeys(form === null || form === void 0 ? void 0 : form.style, function (value, key) {
                    return camelCase(key);
                })
            }
            : {};
        return __assign(__assign(__assign({}, form), offset), style);
    };
    BadgeControl.prototype.handleSwitchChange = function (checked) {
        var _a = this.props, onChange = _a.onChange, disabled = _a.disabled;
        if (disabled) {
            return;
        }
        this.setState({ checked: checked });
        onChange === null || onChange === void 0 ? void 0 : onChange(checked ? { mode: 'dot' } : undefined);
    };
    BadgeControl.prototype.handleSubmit = function (form, action) {
        var onBulkChange = this.props.onBulkChange;
        if ((action === null || action === void 0 ? void 0 : action.type) === 'submit') {
            onBulkChange === null || onBulkChange === void 0 ? void 0 : onBulkChange({ badge: this.normalizeBadgeValue(form) });
        }
    };
    BadgeControl.prototype.renderBody = function () {
        var render = this.props.render;
        var data = this.transformBadgeValue();
        return render('badge-form', {
            type: 'form',
            className: 'ae-BadgeControl-form w-full',
            wrapWithPanel: false,
            panelClassName: 'border-none shadow-none mb-0',
            bodyClassName: 'p-none',
            actionsClassName: 'border-none mt-2.5',
            wrapperComponent: 'div',
            preventEnterSubmit: true,
            submitOnChange: true,
            body: [
                {
                    label: '类型',
                    name: 'mode',
                    type: 'button-group-select',
                    size: 'xs',
                    mode: 'row',
                    tiled: true,
                    className: 'ae-BadgeControl-buttonGroup',
                    options: [
                        { label: '点', value: 'dot', icon: 'fa fa-circle' },
                        { label: '文字', value: 'text', icon: 'fa fa-font' },
                        { label: '缎带', value: 'ribbon', icon: 'fa fa-ribbon' }
                    ],
                    pipeIn: defaultValue('dot')
                },
                {
                    label: '文本内容',
                    name: 'text',
                    type: 'input-text',
                    mode: 'row',
                    visibleOn: "data.mode !== 'dot'"
                },
                {
                    label: '角标主题色',
                    name: 'level',
                    type: 'button-group-select',
                    size: 'xs',
                    mode: 'row',
                    tiled: true,
                    className: 'ae-BadgeControl-buttonGroup',
                    options: [
                        { label: '成功', value: 'success' },
                        { label: '警告', value: 'warning' },
                        { label: '危险', value: 'danger' },
                        { label: '信息', value: 'info' }
                    ],
                    pipeIn: defaultValue('danger')
                },
                {
                    label: '角标位置',
                    name: 'position',
                    type: 'button-group-select',
                    size: 'xs',
                    mode: 'row',
                    tiled: true,
                    className: 'ae-BadgeControl-buttonGroup',
                    options: [
                        {
                            label: '左上',
                            value: 'top-left',
                            icon: 'fa fa-long-arrow-alt-up',
                            className: 'ae-BadgeControl-position--antiClockwise'
                        },
                        {
                            label: '右上',
                            value: 'top-right',
                            icon: 'fa fa-long-arrow-alt-up',
                            className: 'ae-BadgeControl-position--clockwise'
                        },
                        {
                            label: '左下',
                            value: 'bottom-left',
                            icon: 'fa fa-long-arrow-alt-down',
                            className: 'ae-BadgeControl-position--clockwise'
                        },
                        {
                            label: '右下',
                            value: 'bottom-right',
                            icon: 'fa fa-long-arrow-alt-down',
                            className: 'ae-BadgeControl-position--antiClockwise'
                        }
                    ],
                    pipeIn: defaultValue('top-right')
                },
                {
                    type: 'group',
                    className: 'ae-BadgeControl-offset',
                    body: [
                        {
                            label: '水平偏移量',
                            name: 'offset.x',
                            type: 'input-number',
                            suffix: 'px',
                            step: 1
                        },
                        {
                            label: '垂直偏移量',
                            name: 'offset.y',
                            type: 'input-number',
                            suffix: 'px',
                            step: 1
                        }
                    ]
                },
                {
                    label: '自定义角标尺寸',
                    name: 'size',
                    type: 'switch',
                    mode: 'row',
                    inputClassName: 'inline-flex justify-between flex-row-reverse',
                    pipeIn: function (value) { return !!value; },
                    pipeOut: function (value, oldValue, data) {
                        return value
                            ? (data === null || data === void 0 ? void 0 : data.mode) === 'dot'
                                ? 6
                                : (data === null || data === void 0 ? void 0 : data.mode) === 'ribbon'
                                    ? 12
                                    : 16
                            : undefined;
                    }
                },
                {
                    label: '',
                    name: 'size',
                    type: 'input-number',
                    size: 'sm',
                    mode: 'row',
                    min: 1,
                    max: 100,
                    suffix: 'px',
                    visibleOn: 'this.size',
                    pipeIn: function (value) { return (typeof value === 'number' ? value : 0); }
                },
                {
                    label: '封顶数字',
                    name: 'overflowCount',
                    type: 'input-number',
                    size: 'sm',
                    mode: 'row',
                    visibleOn: "data.mode === 'text'"
                },
                {
                    label: '动画',
                    name: 'animation',
                    type: 'switch',
                    mode: 'row',
                    inputClassName: 'inline-flex justify-between flex-row-reverse'
                }
            ]
        }, {
            data: data,
            onSubmit: this.handleSubmit.bind(this)
        });
    };
    BadgeControl.prototype.render = function () {
        var _a = this.props, classPrefix = _a.classPrefix, className = _a.className, labelClassName = _a.labelClassName, label = _a.label, disabled = _a.disabled;
        var checked = this.state.checked;
        return (React.createElement("div", { className: cx('ae-BadgeControl', className) },
            React.createElement("div", { className: cx('ae-BadgeControl-switch') },
                React.createElement("label", { className: cx("".concat(classPrefix, "Form-label"), labelClassName) }, label || '角标'),
                React.createElement(Switch, { value: checked, onChange: this.handleSwitchChange, disabled: disabled })),
            checked ? this.renderBody() : null));
    };
    BadgeControl.defaultProps = {
        mode: 'dot',
        overflowCount: 99,
        position: 'top-right',
        level: 'danger',
        animation: false
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean]),
        __metadata("design:returntype", void 0)
    ], BadgeControl.prototype, "handleSwitchChange", null);
    return BadgeControl;
}(React.Component));
export default BadgeControl;
var BadgeControlRenderer = /** @class */ (function (_super) {
    __extends(BadgeControlRenderer, _super);
    function BadgeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BadgeControlRenderer = __decorate([
        FormItem({ type: 'ae-badge', renderLabel: false })
    ], BadgeControlRenderer);
    return BadgeControlRenderer;
}(BadgeControl));
export { BadgeControlRenderer };
