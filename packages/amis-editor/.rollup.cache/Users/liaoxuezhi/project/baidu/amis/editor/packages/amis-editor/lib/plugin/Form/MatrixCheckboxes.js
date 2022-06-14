import { __assign, __extends } from "tslib";
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var MatrixControlPlugin = /** @class */ (function (_super) {
    __extends(MatrixControlPlugin, _super);
    function MatrixControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'matrix-checkboxes';
        _this.$schema = '/schemas/MatrixControlSchema.json';
        // 组件名称
        _this.name = '矩阵开关';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-th-large';
        _this.description = "\u53EF\u914D\u7F6E\u884C\u5355\u9009\uFF0C\u5217\u5355\u9009\uFF0C\u4EE5\u53CA\u5168\u90E8\u9009\u9879\u53EA\u80FD\u5355\u9009\u6216\u8005\u5168\u90E8\u9009\u9879\u591A\u9009";
        _this.docLink = '/amis/zh-CN/components/form/matrix-checkboxes';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'matrix-checkboxes',
            name: 'matrix',
            label: '矩阵开关',
            rowLabel: '行标题说明',
            columns: [
                {
                    label: '列1'
                },
                {
                    label: '列2'
                }
            ],
            rows: [
                {
                    label: '行1'
                },
                {
                    label: '行2'
                }
            ]
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
        _this.notRenderFormZone = true;
        _this.panelTitle = '矩阵开关';
        _this.panelJustify = true;
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
                                getSchemaTpl('multiple', {
                                    value: true
                                }),
                                {
                                    label: tipedLabel('模式', '行级、列级或者单个单元单选'),
                                    name: 'singleSelectMode',
                                    type: 'button-group-select',
                                    size: 'sm',
                                    option: '列级',
                                    horizontal: {
                                        left: 2,
                                        justify: true
                                    },
                                    visibleOn: '!this.multiple',
                                    options: [
                                        {
                                            label: '行级',
                                            value: 'row'
                                        },
                                        {
                                            label: '列级',
                                            value: 'column'
                                        },
                                        {
                                            label: '单个单元',
                                            value: 'cell'
                                        }
                                    ],
                                    pipeIn: defaultValue('column')
                                }
                            ]
                        },
                        {
                            title: '选项',
                            body: [
                                [
                                    {
                                        label: '列配置',
                                        name: 'columns',
                                        type: 'combo',
                                        multiple: true,
                                        addButtonText: '添加一列',
                                        scaffold: {
                                            label: '列说明'
                                        },
                                        items: [
                                            {
                                                type: 'input-text',
                                                name: 'label',
                                                placeholder: '列说明'
                                            }
                                        ]
                                    },
                                    {
                                        name: 'rowLabel',
                                        label: '行标题文字',
                                        type: 'input-text'
                                    },
                                    {
                                        label: '行配置',
                                        name: 'rows',
                                        type: 'combo',
                                        multiple: true,
                                        scaffold: {
                                            label: '行说明'
                                        },
                                        addButtonText: '添加一行',
                                        items: [
                                            {
                                                type: 'input-text',
                                                name: 'label',
                                                placeholder: '行说明'
                                            }
                                        ]
                                    }
                                ],
                                getSchemaTpl('apiControl', {
                                    label: tipedLabel('接口', '获取矩阵数据接口'),
                                    name: 'source',
                                    mode: 'horizontal',
                                    horizontal: {
                                        left: 4,
                                        justify: true
                                    }
                                })
                                // getSchemaTpl('value')
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', { tag: ValidatorTag.MultiSelect })
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            getSchemaTpl('style:formItem', { renderer: context.info.renderer }),
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
    return MatrixControlPlugin;
}(BasePlugin));
export { MatrixControlPlugin };
registerEditorPlugin(MatrixControlPlugin);
