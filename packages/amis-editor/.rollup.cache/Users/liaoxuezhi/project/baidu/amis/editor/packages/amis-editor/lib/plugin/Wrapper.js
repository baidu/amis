import { __assign, __extends, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var WrapperPlugin = /** @class */ (function (_super) {
    __extends(WrapperPlugin, _super);
    function WrapperPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'wrapper';
        _this.$schema = '/schemas/WrapperSchema.json';
        _this.disabledRendererPlugin = true; // 组件面板不显示
        // 组件名称
        _this.name = '包裹';
        _this.isBaseComponent = true;
        _this.description = '类似于容器，唯一的区别在于会默认会有一层内边距。';
        _this.docLink = '/amis/zh-CN/components/wrapper';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-square-o';
        _this.scaffold = {
            type: 'wrapper',
            body: '内容'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.regions = [
            {
                key: 'body',
                label: '内容区'
            }
        ];
        _this.panelTitle = '包裹';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '属性',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '常用',
                                body: [
                                    {
                                        label: '内间距',
                                        type: 'button-group-select',
                                        name: 'size',
                                        size: 'xs',
                                        mode: 'row',
                                        className: 'ae-buttonGroupSelect--justify',
                                        options: [
                                            {
                                                label: '极小',
                                                value: 'xs'
                                            },
                                            {
                                                label: '小',
                                                value: 'sm'
                                            },
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
                                                label: '无',
                                                value: 'none'
                                            }
                                        ],
                                        pipeIn: defaultValue('')
                                    }
                                ]
                            },
                            {
                                title: '子节点管理',
                                body: [
                                    {
                                        name: 'body',
                                        label: false,
                                        type: 'combo',
                                        scaffold: {
                                            type: 'tpl',
                                            tpl: '子节点',
                                            inline: false
                                        },
                                        multiple: true,
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
                    body: getSchemaTpl('collapseGroup', __spreadArray(__spreadArray([], getSchemaTpl('style:common'), true), [
                        {
                            title: 'CSS 类名',
                            body: [
                                getSchemaTpl('className', {
                                    description: '设置样式后，大小设置将无效。',
                                    pipeIn: defaultValue('bg-white')
                                })
                            ]
                        }
                    ], false))
                }
            ])
        ];
        return _this;
    }
    return WrapperPlugin;
}(BasePlugin));
export { WrapperPlugin };
registerEditorPlugin(WrapperPlugin);
