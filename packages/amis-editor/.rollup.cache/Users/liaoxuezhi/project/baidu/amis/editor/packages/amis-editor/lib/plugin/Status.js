import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var StatusPlugin = /** @class */ (function (_super) {
    __extends(StatusPlugin, _super);
    function StatusPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'status';
        _this.$schema = '/schemas/StatusSchema.json';
        // 组件名称
        _this.name = '状态显示';
        _this.isBaseComponent = true;
        _this.description = '用图标更具关联字段来展示状态，比如 1 展示 √、0 展示 x。这块可以自定义配置';
        _this.docLink = '/amis/zh-CN/components/status';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-check-square-o';
        _this.scaffold = {
            type: 'status',
            value: 1
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '状态';
        _this.panelBodyCreator = function (context) {
            var isUnderField = /\/field\/\w+$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            isUnderField
                                ? {
                                    type: 'tpl',
                                    inline: false,
                                    className: 'text-info text-sm',
                                    tpl: '<p>当前为字段内容节点配置，选择上层还有更多的配置。</p>'
                                }
                                : null,
                            {
                                name: 'map',
                                label: '图标配置',
                                type: 'input-array',
                                items: {
                                    type: 'input-text'
                                },
                                descrition: '配置不通的值段，用不通的样式提示用户',
                                pipeIn: defaultValue([
                                    'fa fa-times text-danger',
                                    'fa fa-check text-success'
                                ])
                            },
                            {
                                name: 'placeholder',
                                type: 'input-text',
                                pipeIn: defaultValue('-'),
                                label: '占位符'
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
        };
        return _this;
    }
    return StatusPlugin;
}(BasePlugin));
export { StatusPlugin };
registerEditorPlugin(StatusPlugin);
