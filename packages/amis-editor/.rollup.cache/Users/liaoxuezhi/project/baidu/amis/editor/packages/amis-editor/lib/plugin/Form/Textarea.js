import { __assign, __extends } from "tslib";
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var TextareaControlPlugin = /** @class */ (function (_super) {
    __extends(TextareaControlPlugin, _super);
    function TextareaControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'textarea';
        _this.$schema = '/schemas/TextareaControlSchema.json';
        _this.order = -490;
        // 组件名称
        _this.name = '多行文本框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-paragraph';
        _this.description = "\u652F\u6301\u6362\u884C\u8F93\u5165";
        _this.docLink = '/amis/zh-CN/components/form/textarea';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'textarea',
            label: '多行文本',
            name: 'textarea'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: __assign({}, _this.scaffold)
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '多行文本';
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '输入框值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '输入框获取焦点时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '输入框失去焦点时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            }
        ];
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清空输入框内容'
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
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    mode: 'vertical' // 改成上下展示模式
                                }),
                                getSchemaTpl('switch', {
                                    name: 'trimContents',
                                    pipeIn: defaultValue(true),
                                    label: tipedLabel('去除首尾空白', '开启后，将不允许用户输入前后空格')
                                }),
                                getSchemaTpl('showCounter'),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                            ]
                        },
                        getSchemaTpl('status', {
                            isFormItem: true,
                            readonly: true
                        }),
                        getSchemaTpl('validation', {
                            tag: ValidatorTag.Text
                        })
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            getSchemaTpl('style:formItem', {
                                renderer: context.info.renderer,
                                schema: [
                                    {
                                        type: 'input-number',
                                        name: 'minRows',
                                        value: 3,
                                        label: '最小展示行数'
                                    },
                                    {
                                        type: 'input-number',
                                        name: 'maxRows',
                                        value: 20,
                                        label: '最大展示行数'
                                    }
                                ]
                            }),
                            getSchemaTpl('style:classNames')
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
    return TextareaControlPlugin;
}(BasePlugin));
export { TextareaControlPlugin };
registerEditorPlugin(TextareaControlPlugin);
