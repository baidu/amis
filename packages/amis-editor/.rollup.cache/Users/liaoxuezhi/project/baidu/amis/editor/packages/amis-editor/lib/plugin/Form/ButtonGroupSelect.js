import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { formItemControl } from '../../component/BaseControl';
var ButtonGroupControlPlugin = /** @class */ (function (_super) {
    __extends(ButtonGroupControlPlugin, _super);
    function ButtonGroupControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'button-group-select';
        _this.$schema = '/schemas/ButtonGroupControlSchema.json';
        // 组件名称
        _this.name = '按钮点选';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-object-group';
        _this.description = '用来展示多个按钮，视觉上会作为一个整体呈现，同时可以作为表单项选项选择器来用。';
        _this.docLink = '/amis/zh-CN/components/button-group';
        _this.tags = ['按钮'];
        _this.scaffold = {
            type: 'button-group-select',
            name: 'a',
            options: [
                {
                    label: '选项1',
                    value: 'a'
                },
                {
                    label: '选项2',
                    value: 'b'
                }
            ]
        };
        _this.previewSchema = {
            type: 'form',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: __assign(__assign({}, _this.scaffold), { value: 'a', label: '按钮点选', description: '按钮点选可以当选项用。' })
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '按钮点选';
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '选中值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '选中值'
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
                description: '清除选中值'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'reload',
                actionLabel: '重新加载',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    replace: true,
                    body: [
                        getSchemaTpl('formItemName', {
                            required: true
                        }),
                        getSchemaTpl('label'),
                        // getSchemaTpl('value'),
                        getSchemaTpl('valueFormula', {
                            rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                            useSelectMode: true // 改用 Select 设置模式
                        }),
                        getSchemaTpl('clearable'),
                        getSchemaTpl('multiple'),
                        getSchemaTpl('extractValue')
                    ]
                },
                option: {
                    title: '按钮管理',
                    body: [getSchemaTpl('optionControlV2'), getSchemaTpl('autoFill')]
                },
                style: {
                    // reverse: true,
                    body: [
                        getSchemaTpl('size'),
                        getSchemaTpl('buttonLevel', {
                            label: '按钮样式',
                            name: 'btnLevel'
                        }),
                        {
                            type: 'button-group-select',
                            name: 'vertical',
                            label: '布局方向',
                            value: false,
                            options: [
                                {
                                    label: '水平',
                                    value: false
                                },
                                {
                                    label: '垂直',
                                    value: true
                                }
                            ]
                        },
                        {
                            type: 'switch',
                            name: 'tiled',
                            label: '平铺模式',
                            value: false
                        },
                        getSchemaTpl('buttonLevel', {
                            label: '按钮选中样式',
                            name: 'btnActiveLevel'
                        })
                    ]
                },
                status: {}
            }, context);
        };
        return _this;
    }
    return ButtonGroupControlPlugin;
}(BasePlugin));
export { ButtonGroupControlPlugin };
registerEditorPlugin(ButtonGroupControlPlugin);
