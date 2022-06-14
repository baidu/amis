import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { BUTTON_DEFAULT_ACTION, formItemControl } from '../../component/BaseControl';
var ButtonToolbarControlPlugin = /** @class */ (function (_super) {
    __extends(ButtonToolbarControlPlugin, _super);
    function ButtonToolbarControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'button-toolbar';
        _this.$schema = '/schemas/ButtonToolbarControlSchema.json';
        // 组件名称
        _this.name = '按钮工具栏';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-ellipsis-h';
        _this.description = '可以用来放置多个按钮或者按钮组，按钮之间会存在一定的间隔';
        _this.docLink = '/amis/zh-CN/components/form/button-toolbar';
        _this.tags = ['表单项', '按钮'];
        _this.scaffold = {
            type: 'button-toolbar',
            buttons: [
                __assign({ type: 'button', label: '按钮1' }, BUTTON_DEFAULT_ACTION),
                __assign({ type: 'button', label: '按钮2' }, BUTTON_DEFAULT_ACTION)
            ]
        };
        _this.previewSchema = {
            type: 'form',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: __assign(__assign({}, _this.scaffold), { label: '按钮工具栏' })
        };
        // 容器配置
        _this.regions = [
            {
                key: 'buttons',
                label: '按钮集合',
                preferTag: '按钮',
                renderMethod: 'renderButtons'
            }
        ];
        _this.notRenderFormZone = true;
        _this.panelTitle = '工具栏';
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    replace: true,
                    body: [
                        getSchemaTpl('formItemName', {
                            required: true
                        }),
                        getSchemaTpl('label'),
                        getSchemaTpl('remark'),
                        getSchemaTpl('labelRemark'),
                        getSchemaTpl('description')
                    ]
                },
                option: {
                    title: '按钮管理',
                    replace: true,
                    body: [
                        {
                            name: 'buttons',
                            type: 'combo',
                            label: '',
                            multiple: true,
                            addable: true,
                            minLength: 1,
                            draggable: true,
                            draggableTip: '',
                            editable: false,
                            visibleOn: 'this.buttons && this.buttons.length',
                            items: [
                                {
                                    type: 'tpl',
                                    inline: false,
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
                event: {
                    hidden: false
                }
            }, context);
        };
        return _this;
    }
    return ButtonToolbarControlPlugin;
}(BasePlugin));
export { ButtonToolbarControlPlugin };
registerEditorPlugin(ButtonToolbarControlPlugin);
