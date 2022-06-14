import { __assign, __extends } from "tslib";
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var ButtonToolbarPlugin = /** @class */ (function (_super) {
    __extends(ButtonToolbarPlugin, _super);
    function ButtonToolbarPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'button-toolbar';
        _this.$schema = '/schemas/ButtonToolbarSchema.json';
        // 组件名称
        _this.name = '按钮工具栏';
        _this.isBaseComponent = true;
        _this.description = '可以用来放置多个按钮或者按钮组，按钮之间会存在一定的间隔';
        _this.tags = ['按钮'];
        _this.icon = 'fa fa-ellipsis-h';
        /**
         * 组件选择面板中隐藏，和ButtonGroup合并
         */
        _this.disabledRendererPlugin = true;
        _this.scaffold = {
            type: 'button-toolbar',
            buttons: [
                {
                    type: 'button',
                    label: '按钮1'
                },
                {
                    type: 'button',
                    label: '按钮2'
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '按钮工具栏';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            name: 'buttons',
                            type: 'combo',
                            label: '按钮管理',
                            multiple: true,
                            addable: true,
                            draggable: true,
                            draggableTip: '可排序、可移除、如要编辑请在预览区选中编辑',
                            editable: false,
                            visibleOn: 'this.buttons && this.buttons.length',
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
                    ]
                },
                {
                    title: '外观',
                    body: [getSchemaTpl('className')]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                }
            ])
        ];
        return _this;
    }
    return ButtonToolbarPlugin;
}(BasePlugin));
export { ButtonToolbarPlugin };
// 和plugin/Form/ButtonToolbar.tsx的重复了
// registerEditorPlugin(ButtonToolbarPlugin);
