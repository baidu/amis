import { __assign, __extends } from "tslib";
/**
 * @file 面包屑
 */
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var BreadcrumbPlugin = /** @class */ (function (_super) {
    __extends(BreadcrumbPlugin, _super);
    function BreadcrumbPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'breadcrumb';
        _this.$schema = '/schemas/BreadcrumbSchema.json';
        _this.disabledRendererPlugin = true;
        // 组件名称
        _this.name = '面包屑';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-list';
        _this.description = '面包屑导航';
        _this.docLink = '/amis/zh-CN/components/breadcrumb';
        _this.tags = ['其他'];
        _this.scaffold = {
            type: 'breadcrumb',
            items: [
                {
                    label: '首页',
                    href: '/',
                    icon: 'fa fa-home'
                },
                {
                    label: '上级页面'
                },
                {
                    label: '<b>当前页面</b>'
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '面包屑';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            label: '分隔符',
                            type: 'input-text',
                            name: 'separator'
                        },
                        getSchemaTpl('api', {
                            label: '动态数据',
                            name: 'source'
                        }),
                        {
                            label: '面包屑',
                            name: 'items',
                            type: 'combo',
                            multiple: true,
                            multiLine: true,
                            draggable: true,
                            addButtonText: '新增',
                            items: [
                                {
                                    type: 'input-text',
                                    placeholder: '文本',
                                    name: 'label'
                                },
                                {
                                    type: 'input-text',
                                    name: 'href',
                                    placeholder: '链接'
                                },
                                {
                                    name: 'icon',
                                    label: '图标',
                                    type: 'icon-picker',
                                    className: 'fix-icon-picker-overflow'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('className'),
                        getSchemaTpl('className', {
                            name: 'itemClassName',
                            label: '面包屑的 CSS 类名'
                        }),
                        ,
                        getSchemaTpl('className', {
                            name: 'separatorClassName',
                            label: '分隔符的 CSS 类名'
                        })
                    ]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                }
            ])
        ];
        return _this;
    }
    return BreadcrumbPlugin;
}(BasePlugin));
export { BreadcrumbPlugin };
registerEditorPlugin(BreadcrumbPlugin);
