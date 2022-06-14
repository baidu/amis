import { __assign, __extends } from "tslib";
import { defaultValue, getSchemaTpl, isObject, undefinedPipeOut } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var RateControlPlugin = /** @class */ (function (_super) {
    __extends(RateControlPlugin, _super);
    function RateControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-rating';
        _this.$schema = '/schemas/RatingControlSchema.json';
        // 组件名称
        _this.name = '评分';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-star-o';
        _this.description = "\u652F\u6301\u53EA\u8BFB\u3001\u534A\u661F\u9009\u62E9";
        _this.docLink = '/amis/zh-CN/components/form/input-rating';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-rating',
            label: '评分',
            name: 'rating'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { value: 3 })
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '评分';
        _this.count = 5;
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '评分值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '评分值'
                            }
                        }
                    }
                ]
            }
        ];
        // 动作定义
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清空评分值'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            var _a;
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
                                {
                                    label: 'Label',
                                    name: 'label',
                                    type: 'input-text'
                                },
                                {
                                    label: '最大值',
                                    name: 'count',
                                    type: 'input-number',
                                    max: 10,
                                    min: 1,
                                    value: 5,
                                    pipeIn: function (value) { return (_this.count = value); },
                                    pipeOut: function (value) { return (_this.count = value); }
                                },
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: {
                                        type: 'input-number',
                                        max: ((_a = context === null || context === void 0 ? void 0 : context.schema) === null || _a === void 0 ? void 0 : _a.count) || 10
                                    },
                                    valueType: 'number' // 期望数值类型
                                }),
                                getSchemaTpl('switch', {
                                    name: 'allowClear',
                                    label: tipedLabel('可清除', '是否允许再次点击后清除'),
                                    value: false
                                }),
                                getSchemaTpl('switch', {
                                    name: 'half',
                                    label: '允许半星',
                                    value: false
                                }),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('combo-container', {
                                    type: 'combo',
                                    label: '描述',
                                    mode: 'normal',
                                    name: 'texts',
                                    items: [
                                        {
                                            placeholder: 'Key',
                                            type: 'input-number',
                                            unique: true,
                                            name: 'key',
                                            columnClassName: 'w-xs',
                                            min: 0,
                                            step: 1,
                                            max: 10,
                                            precision: 0
                                        },
                                        {
                                            placeholder: '描述内容',
                                            type: 'input-text',
                                            name: 'value'
                                        }
                                    ],
                                    draggable: false,
                                    multiple: true,
                                    pipeIn: function (value) {
                                        if (!isObject(value)) {
                                            return Array.isArray(value) ? value : [];
                                        }
                                        var res = Object.keys(value).map(function (item) {
                                            return {
                                                key: item || 0,
                                                value: value[item] || ''
                                            };
                                        }); //.filter((item: any) => item.key <= this.count);
                                        return res;
                                    },
                                    pipeOut: function (value) {
                                        if (!value.length) {
                                            return undefined;
                                        }
                                        var res = {};
                                        var findMinCanUsedKey = function (keys, max) {
                                            for (var i = 1; i <= max; i++) {
                                                if (!keys.includes(String(i))) {
                                                    return i;
                                                }
                                            }
                                        };
                                        value.forEach(function (item) {
                                            var key = item.key !== undefined
                                                ? Number(item.key)
                                                : findMinCanUsedKey(Object.keys(res), _this.count);
                                            // && key <= this.count
                                            if (key) {
                                                res[key] = (item === null || item === void 0 ? void 0 : item.value) || '';
                                            }
                                        });
                                        return res;
                                    }
                                })
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true, readonly: true }),
                        getSchemaTpl('validation', {
                            tag: ValidatorTag.Check
                        })
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            getSchemaTpl('style:formItem', {
                                renderer: context.info.renderer
                            }),
                            {
                                title: '图标',
                                body: [
                                    {
                                        type: 'ae-switch-more',
                                        label: '自定义',
                                        bulk: true,
                                        mode: 'normal',
                                        value: false,
                                        formType: 'extend',
                                        form: {
                                            body: [
                                                {
                                                    type: 'input-text',
                                                    label: '字符',
                                                    name: 'char'
                                                }
                                            ]
                                        },
                                        pipeIn: function (value) {
                                            if (typeof value === 'string' && value.length) {
                                                return {
                                                    character: value
                                                };
                                            }
                                            return undefined;
                                        },
                                        pipeOut: function (value) {
                                            if (!isObject(value)) {
                                                return undefined;
                                            }
                                            return typeof value.character === 'string'
                                                ? value.character
                                                : undefined;
                                        }
                                    },
                                    {
                                        type: 'input-color',
                                        label: tipedLabel('未选中色值', '默认未选中色值为 #e7e7e8'),
                                        name: 'inactiveColor',
                                        pipeIn: defaultValue('#e7e7e8'),
                                        pipeOut: undefinedPipeOut
                                    },
                                    getSchemaTpl('combo-container', {
                                        type: 'combo',
                                        label: '选中色值',
                                        mode: 'normal',
                                        name: 'colors',
                                        items: [
                                            {
                                                placeholder: 'Key',
                                                type: 'input-number',
                                                unique: true,
                                                name: 'key',
                                                columnClassName: 'w-xs',
                                                min: 0,
                                                max: 10,
                                                step: 1,
                                                precision: 0
                                            },
                                            {
                                                placeholder: 'Value',
                                                type: 'input-color',
                                                name: 'value'
                                            }
                                        ],
                                        value: {
                                            2: '#abadb1',
                                            3: '#787b81',
                                            5: '#ffa900'
                                        },
                                        draggable: false,
                                        multiple: true,
                                        pipeIn: function (value) {
                                            if (!isObject(value)) {
                                                return Array.isArray(value) ? value : [];
                                            }
                                            var res = Object.keys(value).map(function (item) {
                                                return {
                                                    key: item,
                                                    value: value[item] || ''
                                                };
                                            }); //.filter((item: any) => item.key <= this.count);
                                            return res;
                                        },
                                        pipeOut: function (value) {
                                            if (!value.length) {
                                                return undefined;
                                            }
                                            var res = {};
                                            var findMinCanUsedKey = function (keys, max) {
                                                for (var i = 1; i <= max; i++) {
                                                    if (!keys.includes(String(i))) {
                                                        return i;
                                                    }
                                                }
                                            };
                                            value.forEach(function (item) {
                                                var key = item.key !== undefined
                                                    ? Number(item.key)
                                                    : findMinCanUsedKey(Object.keys(res), _this.count);
                                                if (key) {
                                                    res[key] = (item === null || item === void 0 ? void 0 : item.value) || '';
                                                }
                                            });
                                            return res;
                                        }
                                    })
                                ]
                            },
                            {
                                title: '描述',
                                body: [
                                    getSchemaTpl('horizontal-align', {
                                        name: 'textPosition',
                                        pipeIn: defaultValue('right')
                                    })
                                ]
                            },
                            getSchemaTpl('style:classNames', {
                                schema: [
                                    getSchemaTpl('className', {
                                        label: '图标',
                                        name: 'charClassName'
                                    }),
                                    getSchemaTpl('className', {
                                        label: '评分描述',
                                        name: 'textClassName'
                                    })
                                ]
                            })
                        ])
                    ]
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
    return RateControlPlugin;
}(BasePlugin));
export { RateControlPlugin };
registerEditorPlugin(RateControlPlugin);
