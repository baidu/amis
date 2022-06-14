import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
var ProgressPlugin = /** @class */ (function (_super) {
    __extends(ProgressPlugin, _super);
    function ProgressPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'progress';
        _this.$schema = '/schemas/ProgressSchema.json';
        // 组件名称
        _this.name = '进度展示';
        _this.searchKeywords = '进度条、progress';
        _this.isBaseComponent = true;
        _this.description = '用来展示进度。可配置各个进度段用不同的颜色展示。';
        _this.docLink = '/amis/zh-CN/components/progress';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-angle-double-right';
        _this.scaffold = {
            type: 'progress',
            value: 66,
            strokeWidth: 6
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '进度';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            var isFormItem = !!(context === null || context === void 0 ? void 0 : context.info.renderer.isFormItem);
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                {
                                    label: '类型',
                                    name: 'mode',
                                    type: 'select',
                                    option: '继承',
                                    value: 'line',
                                    tiled: true,
                                    options: [
                                        {
                                            label: '线形',
                                            value: 'line'
                                        },
                                        {
                                            label: '圆形',
                                            value: 'circle'
                                        },
                                        {
                                            label: '仪表盘',
                                            value: 'dashboard'
                                        }
                                    ],
                                    onChange: function (value, oldValue, model, form) {
                                        if (value === 'circle') {
                                            form.setValueByName('gapDegree', 0);
                                            form.setValueByName('gapPosition', '');
                                        }
                                        else if (value === 'dashboard') {
                                            form.setValueByName('gapDegree', 75);
                                            form.setValueByName('gapPosition', 'bottom');
                                        }
                                    }
                                },
                                {
                                    type: 'input-number',
                                    name: 'value',
                                    label: '默认值',
                                    min: 0,
                                    max: 100
                                },
                                getSchemaTpl('menuTpl', {
                                    name: 'valueTpl'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'showLabel',
                                    label: '进度值',
                                    pipeIn: defaultValue(true)
                                }),
                                getSchemaTpl('placeholder', {
                                    value: '-',
                                    placeholder: '无数据空位提示',
                                    label: tipedLabel('占位提示', '数据字段未定义时的值，不包括0')
                                })
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: isFormItem })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                {
                                    type: 'select',
                                    name: 'progressClassName',
                                    label: '尺寸',
                                    value: '',
                                    options: [
                                        {
                                            label: '极小',
                                            value: 'w-xs'
                                        },
                                        {
                                            label: '小',
                                            value: 'w-sm'
                                        },
                                        {
                                            label: '中',
                                            value: 'w-md'
                                        },
                                        {
                                            label: '大',
                                            value: 'w-lg'
                                        },
                                        {
                                            label: '默认',
                                            value: ''
                                        }
                                    ]
                                },
                                {
                                    type: 'input-number',
                                    name: 'strokeWidth',
                                    label: '线条宽度',
                                    value: 6,
                                    min: 0,
                                    max: 100
                                },
                                {
                                    type: 'input-number',
                                    name: 'gapDegree',
                                    visibleOn: 'data.mode === "dashboard"',
                                    label: '缺口角度',
                                    value: 75,
                                    min: 0,
                                    max: 295
                                },
                                {
                                    label: '缺口位置',
                                    name: 'gapPosition',
                                    type: 'button-group-select',
                                    visibleOn: 'data.mode === "dashboard"',
                                    value: defaultValue('bottom'),
                                    tiled: true,
                                    options: [
                                        {
                                            label: '上',
                                            value: 'top'
                                        },
                                        {
                                            label: '下',
                                            value: 'bottom'
                                        },
                                        {
                                            label: '左',
                                            value: 'left'
                                        },
                                        {
                                            label: '右',
                                            value: 'right'
                                        }
                                    ]
                                },
                                getSchemaTpl('switch', {
                                    name: 'animate',
                                    label: '显示动画',
                                    visibleOn: 'data.mode === "line"'
                                }),
                                {
                                    type: 'button-group-select',
                                    name: 'style',
                                    label: '样式',
                                    visibleOn: 'data.mode === "line"',
                                    options: [
                                        {
                                            label: '纯色',
                                            value: 'purity'
                                        },
                                        {
                                            label: '条纹',
                                            value: 'stripe'
                                        }
                                    ],
                                    pipeIn: function (value, form) {
                                        var _a;
                                        return ((_a = form.data) === null || _a === void 0 ? void 0 : _a.stripe) ? 'stripe' : 'purity';
                                    },
                                    onChange: function (value, oldValue, model, form) {
                                        form.setValueByName('stripe', value === 'stripe');
                                    }
                                },
                                {
                                    name: 'map',
                                    type: 'combo',
                                    mode: 'normal',
                                    multiple: true,
                                    label: tipedLabel('颜色', '分配不同的值段，用不同的颜色提示用户'),
                                    items: [
                                        {
                                            type: 'input-number',
                                            name: 'value',
                                            placeholder: 'value',
                                            required: true,
                                            columnClassName: 'w-xs',
                                            unique: true,
                                            min: 0,
                                            step: 10,
                                            precision: 0
                                        },
                                        {
                                            placeholder: 'color',
                                            type: 'input-color',
                                            name: 'color',
                                            required: true
                                        }
                                    ],
                                    value: [
                                        { color: '#dc3545', value: 20 },
                                        { color: '#fad733', value: 60 },
                                        { color: '#28a745', value: 100 }
                                    ],
                                    pipeIn: function (value) {
                                        return Array.isArray(value) ? value : [];
                                    }
                                }
                            ]
                        },
                        getSchemaTpl('style:classNames', {
                            schema: [],
                            isFormItem: isFormItem
                        })
                    ])
                }
            ]);
        };
        return _this;
    }
    return ProgressPlugin;
}(BasePlugin));
export { ProgressPlugin };
registerEditorPlugin(ProgressPlugin);
