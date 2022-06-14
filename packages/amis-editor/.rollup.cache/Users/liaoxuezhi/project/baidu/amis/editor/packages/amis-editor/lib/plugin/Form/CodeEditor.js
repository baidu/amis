import { __assign, __extends } from "tslib";
import { availableLanguages } from 'amis/lib/renderers/Form/Editor';
import { defaultValue, getSchemaTpl, undefinedPipeOut } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var CodeEditorControlPlugin = /** @class */ (function (_super) {
    __extends(CodeEditorControlPlugin, _super);
    function CodeEditorControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'editor';
        _this.$schema = '/schemas/EditorControlSchema.json';
        // 组件名称
        _this.name = '代码编辑器';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-code';
        _this.description = "\u4EE3\u7801\u7F16\u8F91\u5668\uFF0C\u91C7\u7528 monaco-editor \u652F\u6301\uFF1A".concat(availableLanguages
            .slice(0, 10)
            .join('，'), "\u7B49\u7B49");
        _this.docLink = '/amis/zh-CN/components/form/editor';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'editor',
            label: '代码编辑器',
            name: 'editor'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { value: 'console.log("Hello world.");' })
            ]
        };
        _this.events = [
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
                                title: '当前代码'
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
                                title: '当前代码'
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
                description: '清除选中值'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'focus',
                actionLabel: '获取焦点',
                description: '输入框获取焦点'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.notRenderFormZone = true;
        _this.panelTitle = 'Editor';
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
                                {
                                    label: '语言',
                                    name: 'language',
                                    type: 'select',
                                    value: 'javascript',
                                    searchable: true,
                                    options: availableLanguages.concat()
                                },
                                {
                                    type: 'textarea',
                                    name: 'value',
                                    label: '默认值'
                                },
                                getSchemaTpl('switch', {
                                    label: '可全屏',
                                    name: 'allowFullscreen',
                                    pipeIn: defaultValue(true)
                                }),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('description')
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', {
                            tag: ValidatorTag.Code
                        })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', {
                            renderer: context.info.renderer,
                            schema: [
                                {
                                    name: 'size',
                                    type: 'select',
                                    pipeIn: defaultValue(''),
                                    pipeOut: undefinedPipeOut,
                                    label: '控件尺寸',
                                    options: [
                                        {
                                            label: '默认',
                                            value: ''
                                        },
                                        {
                                            label: '中',
                                            value: 'md'
                                        },
                                        {
                                            label: '大',
                                            value: 'lg'
                                        },
                                        {
                                            label: '特大',
                                            value: 'xl'
                                        },
                                        {
                                            label: '超大',
                                            value: 'xxl'
                                        }
                                    ]
                                }
                            ]
                        }),
                        getSchemaTpl('style:classNames')
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
    return CodeEditorControlPlugin;
}(BasePlugin));
export { CodeEditorControlPlugin };
registerEditorPlugin(CodeEditorControlPlugin);
