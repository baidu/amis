import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { formItemControl } from '../../component/BaseControl';
var TagControlPlugin = /** @class */ (function (_super) {
    __extends(TagControlPlugin, _super);
    function TagControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-tag';
        _this.$schema = '/schemas/TagControlSchema.json';
        _this.order = -420;
        // 组件名称
        _this.name = '标签';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-tag';
        _this.description = "\u914D\u7F6E<code>options</code>\u53EF\u4EE5\u5B9E\u73B0\u9009\u62E9\u9009\u9879";
        _this.docLink = '/amis/zh-CN/components/form/input-tag';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-tag',
            label: '标签',
            name: 'tag',
            options: ['红色', '绿色', '蓝色']
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: __assign(__assign({}, _this.scaffold), { value: '红色' })
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '标签';
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '选中值变化',
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
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '获取焦点',
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
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '失去焦点',
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
                description: '重置为默认值'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    replace: true,
                    body: [
                        getSchemaTpl('formItemName', {
                            required: true
                        }),
                        getSchemaTpl('label'),
                        getSchemaTpl('clearable'),
                        {
                            type: 'input-text',
                            name: 'optionsTip',
                            label: '选项提示',
                            value: '最近您使用的标签'
                        },
                        getSchemaTpl('valueFormula', {
                            rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                            mode: 'vertical' // 改成上下展示模式
                        }),
                        getSchemaTpl('joinValues'),
                        getSchemaTpl('delimiter'),
                        getSchemaTpl('extractValue')
                    ]
                },
                option: {
                    body: [
                        getSchemaTpl('optionControlV2', {
                            description: '设置选项后，输入时会下拉这些选项供用户参考。'
                        }),
                        getSchemaTpl('autoFill')
                    ]
                },
                status: {}
            }, context);
        };
        return _this;
    }
    return TagControlPlugin;
}(BasePlugin));
export { TagControlPlugin };
registerEditorPlugin(TagControlPlugin);
