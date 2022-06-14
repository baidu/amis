/**
 * @file Font
 * @description 文字样式相关控件
 */
import { __assign, __decorate, __extends } from "tslib";
import React from 'react';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import { render as amisRender } from 'amis';
import { fontFamilyList } from './font-family';
import { string2CSSUnit, isObject } from 'amis-editor-core';
import { FormItem } from 'amis';
var Font = function (props) {
    var _a, _b, _c, _d, _e;
    var value = props.value, onChange = props.onChange;
    var validProps = [
        'color',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'fontStyle',
        'textAlign',
        'letterSpacing',
        'lineHeight'
    ];
    var fontContext = isObject(value)
        ? __assign(__assign({}, pick(value, validProps)), { 
            /** textDecoration 特殊处理一下，因为可以同时选择多个value */
            underline: !!~((_a = value === null || value === void 0 ? void 0 : value.textDecoration) !== null && _a !== void 0 ? _a : '').indexOf('underline')
                ? 'underline'
                : undefined, lineThrough: !!~((_b = value === null || value === void 0 ? void 0 : value.textDecoration) !== null && _b !== void 0 ? _b : '').indexOf('line-through')
                ? 'line-through'
                : undefined }) : {};
    var handleSubmit = function (formValue, action) {
        onChange === null || onChange === void 0 ? void 0 : onChange(__assign(__assign(__assign({}, value), mapValues(__assign(__assign({}, pick(formValue, validProps)), { textDecoration: [formValue.underline, formValue.lineThrough]
                .filter(Boolean)
                .join(' '), letterSpacing: string2CSSUnit(formValue.letterSpacing), lineHeight: string2CSSUnit(formValue.lineHeight) }), function (props) { return props || undefined; })), { 
            // 字体需要特殊处理，支持设置为空string
            fontFamily: formValue.fontFamily }));
    };
    return (React.createElement(React.Fragment, null, amisRender({
        type: 'form',
        wrapWithPanel: false,
        panelClassName: 'border-none shadow-none mb-0',
        bodyClassName: 'p-none',
        actionsClassName: 'border-none mt-2.5',
        wrapperComponent: 'div',
        preventEnterSubmit: true,
        submitOnChange: true,
        body: [
            {
                name: 'fontFamily',
                label: '字体类型',
                type: 'select',
                mode: 'row',
                size: 'md',
                placeholder: '请选择字体',
                menuTpl: '<div style="font-family: ${value};">${label}</div>',
                options: fontFamilyList,
                clearable: false,
                value: (_c = value === null || value === void 0 ? void 0 : value.fontFamily) !== null && _c !== void 0 ? _c : ''
            },
            {
                name: 'color',
                label: '字体颜色',
                type: 'input-color',
                mode: 'row',
                size: 'md',
                value: (_d = value === null || value === void 0 ? void 0 : value.color) !== null && _d !== void 0 ? _d : ''
            },
            {
                name: 'fontSize',
                label: '字体大小',
                type: 'input-range',
                max: 100,
                min: 12,
                step: 1,
                clearable: false,
                value: (_e = value === null || value === void 0 ? void 0 : value.fontSize) !== null && _e !== void 0 ? _e : 12
            },
            {
                type: 'input-group',
                name: 'input-group',
                label: '文字样式',
                mode: 'row',
                body: [
                    {
                        type: 'button-group-select',
                        name: 'fontWeight',
                        clearable: true,
                        label: false,
                        options: [
                            {
                                label: '',
                                value: 'bold',
                                icon: 'fa fa-bold',
                                className: 'ae-Font-group-lhs ae-Font-relative-left'
                            }
                        ]
                    },
                    {
                        type: 'button-group-select',
                        name: 'fontStyle',
                        clearable: true,
                        label: false,
                        options: [
                            {
                                label: '',
                                value: 'italic',
                                icon: 'fa fa-italic',
                                className: 'ae-Font-group-middle'
                            }
                        ]
                    },
                    {
                        type: 'button-group-select',
                        name: 'underline',
                        clearable: true,
                        label: false,
                        options: [
                            {
                                label: '',
                                value: 'underline',
                                icon: 'fa fa-underline',
                                className: 'ae-Font-group-middle ae-Font-relative-right'
                            }
                        ]
                    },
                    {
                        type: 'button-group-select',
                        name: 'lineThrough',
                        clearable: true,
                        label: false,
                        options: [
                            {
                                label: '',
                                value: 'line-through',
                                icon: 'fa fa-strikethrough',
                                className: 'ae-Font-group-rhs ae-Font-relative-right-2'
                            }
                        ]
                    }
                ]
            },
            // TODO: 添加'justify-all', 'start', 'end', 'match-parent'类型
            {
                name: 'textAlign',
                label: '文字位置',
                type: 'button-group-select',
                mode: 'row',
                options: [
                    {
                        label: '',
                        value: 'left',
                        icon: 'fa fa-align-left'
                    },
                    {
                        label: '',
                        value: 'center',
                        icon: 'fa fa-align-center'
                    },
                    {
                        label: '',
                        value: 'right',
                        icon: 'fa fa-align-right'
                    },
                    {
                        label: '',
                        value: 'justify',
                        icon: 'fa fa-align-justify'
                    }
                ]
            },
            {
                type: 'group',
                label: '文字排版',
                body: [
                    {
                        name: 'letterSpacing',
                        label: '',
                        type: 'input-text',
                        addOn: {
                            className: 'ae-Font-group-lhs',
                            label: '',
                            type: 'text',
                            position: 'left',
                            icon: 'fa fa-text-width'
                        }
                    },
                    {
                        name: 'lineHeight',
                        label: '',
                        type: 'input-text',
                        addOn: {
                            className: 'ae-Font-group-lhs',
                            label: '',
                            type: 'text',
                            position: 'left',
                            icon: 'fa fa-text-height'
                        }
                    }
                ]
            }
        ]
    }, {
        data: fontContext,
        onSubmit: handleSubmit
    })));
};
export default Font;
var FontRenderer = /** @class */ (function (_super) {
    __extends(FontRenderer, _super);
    function FontRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FontRenderer.prototype.render = function () {
        return React.createElement(Font, __assign({}, this.props));
    };
    FontRenderer = __decorate([
        FormItem({ type: 'style-font', renderLabel: false })
    ], FontRenderer);
    return FontRenderer;
}(React.Component));
export { FontRenderer };
