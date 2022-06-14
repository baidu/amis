import { __assign, __extends, __spreadArray } from "tslib";
/**
 * @file Flex 布局
 */
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var FlexPlugin = /** @class */ (function (_super) {
    __extends(FlexPlugin, _super);
    function FlexPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'flex';
        _this.$schema = '/schemas/FlexSchema.json';
        _this.disabledRendererPlugin = true;
        // 组件名称
        _this.name = 'Flex 布局';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-columns';
        _this.description = 'flex 布局';
        _this.docLink = '/amis/zh-CN/components/flex';
        _this.tags = ['容器'];
        _this.scaffold = {
            type: 'flex',
            items: [
                {
                    type: 'wrapper',
                    body: '第一列'
                },
                {
                    type: 'wrapper',
                    body: '第二列'
                },
                {
                    type: 'wrapper',
                    body: '第三列'
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = 'Flex';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '属性',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '布局',
                                body: [
                                    {
                                        name: 'justify',
                                        type: 'select',
                                        value: 'center',
                                        label: '子节点水平分布方式',
                                        menuTpl: "<div class='flex justify-between'><span>${label}</span><span class='text-muted text-sm'>${value}</span></div>",
                                        options: [
                                            {
                                                label: '起始端对齐',
                                                value: 'flex-start'
                                            },
                                            {
                                                label: '居中对齐',
                                                value: 'center'
                                            },
                                            {
                                                label: '末尾端对齐',
                                                value: 'flex-end'
                                            },
                                            {
                                                label: '均匀分布（首尾留空）',
                                                value: 'space-around'
                                            },
                                            {
                                                label: '均匀分布（首尾对齐）',
                                                value: 'space-between'
                                            },
                                            {
                                                label: '均匀分布（元素等间距）',
                                                value: 'space-evenly'
                                            },
                                            {
                                                label: '均匀分布（自动拉伸）',
                                                value: 'stretch'
                                            }
                                        ]
                                    },
                                    {
                                        name: 'alignItems',
                                        type: 'select',
                                        value: 'center',
                                        label: '子节点垂直方向位置',
                                        menuTpl: "<div class='flex justify-between'><span>${label}</span><span class='text-muted text-sm'>${value}</span></div>",
                                        options: [
                                            {
                                                label: '起始端对齐',
                                                value: 'flex-start'
                                            },
                                            {
                                                label: '居中对齐',
                                                value: 'center'
                                            },
                                            {
                                                label: '末尾端对齐',
                                                value: 'flex-end'
                                            },
                                            {
                                                label: '基线对齐',
                                                value: 'baseline'
                                            },
                                            {
                                                label: '自动拉伸',
                                                value: 'stretch'
                                            }
                                        ]
                                    },
                                    {
                                        name: 'direction',
                                        type: 'button-group-select',
                                        size: 'sm',
                                        label: '布局方向',
                                        value: 'row',
                                        mode: 'row',
                                        options: [
                                            { label: '水平', value: 'row' },
                                            { label: '垂直', value: 'column' }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: '子节点管理',
                                body: [
                                    {
                                        name: 'items',
                                        label: false,
                                        type: 'combo',
                                        scaffold: {
                                            type: 'wrapper',
                                            body: '子节点内容'
                                        },
                                        minLength: 2,
                                        multiple: true,
                                        // draggable: true,
                                        draggableTip: '',
                                        items: [
                                            {
                                                type: 'tpl',
                                                tpl: '<span class="label label-default">子节点${index | plus}</span>'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ])
                    ]
                },
                {
                    title: '外观',
                    className: 'p-none',
                    body: getSchemaTpl('collapseGroup', __spreadArray(__spreadArray([], getSchemaTpl('style:common', ['display']), true), [
                        {
                            title: 'CSS 类名',
                            body: [getSchemaTpl('className', { label: '外层CSS类名' })]
                        }
                    ], false))
                },
                {
                    title: '状态',
                    body: [getSchemaTpl('visible'), getSchemaTpl('disabled')]
                }
            ])
        ];
        _this.regions = [
            {
                key: 'items',
                label: '子节点集合',
                // 复写渲染器里面的 render 方法
                renderMethod: 'render',
                dndMode: 'position-h'
            }
        ];
        return _this;
    }
    FlexPlugin.prototype.afterResolveJsonSchema = function (event) {
        var _a, _b;
        var context = event.context;
        var parent = (_a = context.node.parent) === null || _a === void 0 ? void 0 : _a.host;
        if (((_b = parent === null || parent === void 0 ? void 0 : parent.info) === null || _b === void 0 ? void 0 : _b.plugin) === this) {
            event.setData('/schemas/FlexColumn.json');
        }
    };
    return FlexPlugin;
}(BasePlugin));
export { FlexPlugin };
registerEditorPlugin(FlexPlugin);
