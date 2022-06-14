import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { BUTTON_DEFAULT_ACTION, tipedLabel } from '../component/BaseControl';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var ButtonGroupPlugin = /** @class */ (function (_super) {
    __extends(ButtonGroupPlugin, _super);
    function ButtonGroupPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'button-group';
        _this.$schema = '/schemas/ButtonGroupSchema.json';
        // 组件名称
        _this.name = '按钮组';
        _this.isBaseComponent = true;
        _this.description = '用来展示多个按钮，视觉上会作为一个整体呈现。';
        _this.tags = ['按钮'];
        _this.icon = 'fa fa-object-group';
        _this.docLink = '/amis/zh-CN/components/button-group';
        _this.scaffold = {
            type: 'button-group',
            buttons: [
                __assign({ type: 'button', label: '按钮1' }, BUTTON_DEFAULT_ACTION),
                __assign({ type: 'button', label: '按钮2' }, BUTTON_DEFAULT_ACTION)
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '按钮组';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                {
                                    type: 'button-group-select',
                                    name: 'vertical',
                                    label: '布局方向',
                                    options: [
                                        {
                                            label: '水平',
                                            value: false
                                        },
                                        {
                                            label: '垂直',
                                            value: true
                                        }
                                    ],
                                    pipeIn: defaultValue(false)
                                },
                                getSchemaTpl('switch', {
                                    name: 'tiled',
                                    label: tipedLabel('平铺模式', '使按钮组宽度占满父容器，各按钮宽度自适应'),
                                    pipeIn: defaultValue(false)
                                }),
                                getSchemaTpl('combo-container', [
                                    {
                                        type: 'combo',
                                        label: '按钮管理',
                                        name: 'buttons',
                                        mode: 'normal',
                                        multiple: true,
                                        addable: true,
                                        minLength: 1,
                                        draggable: true,
                                        editable: false,
                                        items: [
                                            {
                                                type: 'tpl',
                                                inline: false,
                                                className: 'p-t-xs',
                                                tpl: '<span class="label label-default"><% if (data.type === "button-group") { %> 按钮组 <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>'
                                            }
                                        ],
                                        addButtonText: '新增按钮',
                                        scaffold: {
                                            type: 'button',
                                            label: '按钮'
                                        }
                                    }
                                ])
                            ]
                        },
                        getSchemaTpl('status')
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '基本',
                                body: [
                                    getSchemaTpl('size', {
                                        label: '尺寸'
                                    })
                                ]
                            },
                            getSchemaTpl('style:classNames', {
                                isFormItem: false,
                                schema: [
                                    getSchemaTpl('className', {
                                        label: '按钮',
                                        name: 'btnClassName'
                                    })
                                ]
                            })
                        ])
                    ]
                }
            ]);
        };
        _this.regions = [
            {
                key: 'buttons',
                label: '子按钮',
                renderMethod: 'render',
                preferTag: '按钮',
                insertPosition: 'inner'
            }
        ];
        return _this;
    }
    return ButtonGroupPlugin;
}(BasePlugin));
export { ButtonGroupPlugin };
registerEditorPlugin(ButtonGroupPlugin);
