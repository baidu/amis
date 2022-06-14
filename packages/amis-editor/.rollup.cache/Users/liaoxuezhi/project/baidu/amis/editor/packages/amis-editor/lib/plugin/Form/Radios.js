import { __assign, __extends } from "tslib";
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var RadiosControlPlugin = /** @class */ (function (_super) {
    __extends(RadiosControlPlugin, _super);
    function RadiosControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'radios';
        _this.$schema = '/schemas/RadiosControlSchema.json';
        _this.order = -460;
        // 组件名称
        _this.name = '单选框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-dot-circle-o';
        _this.description = "\u901A\u8FC7<code>options</code>\u914D\u7F6E\u9009\u9879\uFF0C\u53EF\u901A\u8FC7<code>source</code>\u62C9\u53D6\u9009\u9879";
        _this.docLink = '/amis/zh-CN/components/form/radios';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'radios',
            label: '单选框',
            name: 'radios',
            options: [
                {
                    label: '选项A',
                    value: 'A'
                },
                {
                    label: '选项B',
                    value: 'B'
                }
            ]
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { value: 'A' })
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '单选框';
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
                                    useSelectMode: true,
                                    visibleOn: 'this.options && this.options.length > 0 && this.selectFirst !== true'
                                }),
                                // getSchemaTpl('autoFill')
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark')
                            ]
                        },
                        {
                            title: '选项',
                            body: [
                                getSchemaTpl('optionControlV2'),
                                getSchemaTpl('switch', {
                                    label: '默认选择第一个',
                                    name: 'selectFirst',
                                    horizontal: { justify: true, left: 5 },
                                    visibleOn: '!this.options'
                                })
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', {
                            tag: ValidatorTag.All
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
                                    getSchemaTpl('switch', {
                                        label: '一行选项显示',
                                        name: 'inline',
                                        hiddenOn: 'data.mode === "inline"',
                                        pipeIn: defaultValue(true)
                                    }),
                                    {
                                        label: '每行选项个数',
                                        name: 'columnsCount',
                                        hiddenOn: 'data.mode === "inline" || data.inline !== false',
                                        type: 'input-range',
                                        min: 1,
                                        max: 6,
                                        pipeIn: defaultValue(1)
                                    }
                                ]
                            }),
                            getSchemaTpl('style:classNames', {
                                schema: [
                                    getSchemaTpl('className', {
                                        label: '单个选项',
                                        name: 'itemClassName'
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
    return RadiosControlPlugin;
}(BasePlugin));
export { RadiosControlPlugin };
registerEditorPlugin(RadiosControlPlugin);
