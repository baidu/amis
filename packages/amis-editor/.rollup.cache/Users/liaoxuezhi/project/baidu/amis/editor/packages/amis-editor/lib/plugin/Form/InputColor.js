import { __assign, __extends, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { ValidatorTag } from '../../validator';
import { BasePlugin } from 'amis-editor-core';
import { getEventControlConfig } from '../../util';
import { tipedLabel } from '../../component/BaseControl';
import tinyColor from 'tinycolor2';
function convertColor(value, format) {
    format = format.toLocaleLowerCase();
    function convert(v) {
        var color = tinyColor(v);
        if (!color.isValid()) {
            return '';
        }
        if (format !== 'rgba') {
            color.setAlpha(1);
        }
        switch (format) {
            case 'hex':
                return color.toHexString();
            case 'hsl':
                return color.toHslString();
            case 'rgb':
                return color.toRgbString();
            case 'rgba':
                var _a = color.toRgb(), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
                return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
            default:
                return color.toString();
        }
    }
    return Array.isArray(value) ? value.map(convert) : convert(value);
}
var presetColors = [
    '#ffffff',
    '#000000',
    '#d0021b',
    '#f5a623',
    '#f8e71c',
    '#7ED321',
    '#4A90E2',
    '#9013fe'
];
var colorFormat = ['hex', 'rgb', 'rgba', 'hsl'];
var presetColorsByFormat = colorFormat.reduce(function (res, fmt) {
    res[fmt] = convertColor(presetColors, fmt);
    return res;
}, {});
var ColorControlPlugin = /** @class */ (function (_super) {
    __extends(ColorControlPlugin, _super);
    function ColorControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-color';
        _this.$schema = '/schemas/ColorControlSchema.json';
        // 组件名称
        _this.name = '颜色框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-eyedropper';
        _this.description = '支持<code>hex、hls、rgb、rgba</code>格式，默认为<code>hex</code>格式';
        _this.docLink = '/amis/zh-CN/components/form/input-color';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-color',
            label: '颜色',
            name: 'color'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.panelTitle = '颜色框';
        _this.notRenderFormZone = true;
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '输入框内容变化'
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '输入框获取焦点'
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '输入框失去焦点'
            }
        ];
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清空输入框内容'
            },
            {
                actionType: 'focus',
                actionLabel: '获取焦点',
                description: '输入框获取焦点'
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            var renderer = context.info.renderer;
            var formatOptions = colorFormat.map(function (value) { return ({
                label: value.toUpperCase(),
                value: value
            }); });
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                getSchemaTpl('formItemName', {
                                    required: true
                                }),
                                getSchemaTpl('label'),
                                {
                                    type: 'select',
                                    label: '值格式',
                                    name: 'format',
                                    value: 'hex',
                                    options: formatOptions,
                                    onChange: function (format, oldFormat, model, form) {
                                        var _a = form.data, value = _a.value, presetColors = _a.presetColors;
                                        if (value) {
                                            form.setValueByName('value', convertColor(value, format));
                                        }
                                        if (Array.isArray(presetColors)) {
                                            form.setValueByName('presetColors', convertColor(presetColors, format));
                                        }
                                    }
                                },
                                __spreadArray([], formatOptions.map(function (_a) {
                                    var value = _a.value;
                                    return _this.getConditionalColorPanel(value);
                                }), true),
                                // {
                                //   label: '默认值',
                                //   name: 'value',
                                //   type: 'input-color',
                                //   format: '${format}'
                                // },
                                getSchemaTpl('clearable'),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                            ]
                        },
                        {
                            title: '拾色器',
                            body: __spreadArray([
                                getSchemaTpl('switch', {
                                    label: tipedLabel('隐藏调色盘', '开启时，禁止手动输入颜色，只能从备选颜色中选择'),
                                    name: 'allowCustomColor',
                                    disabledOn: 'Array.isArray(presetColors) && presetColors.length === 0',
                                    pipeIn: function (value) {
                                        return typeof value === 'undefined' ? false : !value;
                                    },
                                    pipeOut: function (value) { return !value; }
                                }),
                                getSchemaTpl('switch', {
                                    label: tipedLabel('备选色', '拾色器底部的备选颜色'),
                                    name: 'presetColors',
                                    onText: '自定义',
                                    offText: '默认',
                                    pipeIn: function (value) {
                                        return typeof value === 'undefined' ? false : true;
                                    },
                                    pipeOut: function (value, originValue, _a) {
                                        var _b = _a.format, format = _b === void 0 ? 'hex' : _b;
                                        return !value ? undefined : presetColorsByFormat[format];
                                    },
                                    onChange: function (colors, oldValue, model, form) {
                                        if (Array.isArray(colors) && colors.length === 0) {
                                            form.setValueByName('allowCustomColor', true);
                                        }
                                    }
                                })
                            ], formatOptions.map(function (_a) {
                                var value = _a.value;
                                return _this.getConditionalColorComb(value);
                            }), true)
                        },
                        getSchemaTpl('status', {
                            isFormItem: true
                        }),
                        getSchemaTpl('validation', {
                            tag: ValidatorTag.MultiSelect
                        })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', { renderer: renderer }),
                        getSchemaTpl('style:classNames', {
                            schema: [
                                getSchemaTpl('className', {
                                    label: '描述',
                                    name: 'descriptionClassName',
                                    visibleOn: 'this.description'
                                })
                            ]
                        })
                    ])
                },
                {
                    title: '事件',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(_this.manager, context)))
                    ]
                }
            ]);
        };
        return _this;
    }
    ColorControlPlugin.prototype.getConditionalColorPanel = function (format) {
        var visibleOnNoFormat = format === 'hex' ? ' || !this.format' : '';
        return {
            label: '默认值',
            name: 'value',
            type: 'input-color',
            format: format,
            clearable: true,
            visibleOn: "this.format===\"".concat(format, "\"").concat(visibleOnNoFormat),
            presetColors: presetColorsByFormat[format]
        };
    };
    ColorControlPlugin.prototype.getConditionalColorComb = function (format) {
        var visibleOnNoFormat = format === 'hex' ? ' || !this.format' : '';
        return getSchemaTpl('combo-container', {
            type: 'combo',
            mode: 'normal',
            name: 'presetColors',
            items: [
                {
                    type: 'input-color',
                    format: format,
                    name: 'color',
                    clearable: false,
                    presetColors: presetColorsByFormat[format]
                }
            ],
            draggable: false,
            multiple: true,
            visibleOn: "this.presetColors !== undefined && (this.format === \"".concat(format, "\"").concat(visibleOnNoFormat, ")"),
            onChange: function (colors, oldValue, model, form) {
                if (Array.isArray(colors) && colors.length === 0) {
                    form.setValueByName('allowCustomColor', true);
                }
            },
            pipeIn: function (value) {
                return value.map(function (color, index) {
                    if (color === void 0) { color = ''; }
                    return ({
                        key: "".concat(color, "-").concat(index),
                        color: convertColor(color, format)
                    });
                });
            },
            pipeOut: function (value) { return value.map(function (_a) {
                var color = _a.color;
                return color;
            }); }
        });
    };
    return ColorControlPlugin;
}(BasePlugin));
export { ColorControlPlugin };
registerEditorPlugin(ColorControlPlugin);
