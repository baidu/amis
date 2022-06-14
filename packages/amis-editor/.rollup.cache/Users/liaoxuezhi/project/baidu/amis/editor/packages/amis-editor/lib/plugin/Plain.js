import { __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var PlainPlugin = /** @class */ (function (_super) {
    __extends(PlainPlugin, _super);
    function PlainPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'plain';
        _this.$schema = '/schemas/PlainSchema.json';
        _this.disabledRendererPlugin = true; // 组件面板不显示
        // 组件名称
        _this.name = '纯文本';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-file-text-o';
        _this.description = '用来展示纯文字，html 标签会被转义。';
        _this.docLink = '/amis/zh-CN/components/plain';
        _this.tags = ['展示'];
        _this.previewSchema = {
            type: 'plain',
            text: '这是纯文本',
            className: 'text-center',
            inline: false
        };
        _this.scaffold = {
            type: 'plain',
            tpl: '内容',
            inline: false
        };
        _this.panelTitle = '纯文本';
        _this.panelBodyCreator = function (context) {
            var isTableCell = context.info.renderer.name === 'table-cell';
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            label: '内容',
                            type: 'textarea',
                            pipeIn: function (value, data) { return value || (data && data.text); },
                            name: 'tpl',
                            description: '如果当前字段有值，请不要设置，否则覆盖。支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'
                        },
                        {
                            name: 'placeholder',
                            label: '占位符',
                            type: 'input-text',
                            pipeIn: defaultValue('-')
                        }
                    ]
                },
                isTableCell
                    ? null
                    : {
                        title: '外观',
                        body: [
                            getSchemaTpl('switch', {
                                name: 'inline',
                                label: '内联模式',
                                value: true
                            }),
                            getSchemaTpl('className')
                        ]
                    },
                isTableCell
                    ? null
                    : {
                        title: '显隐',
                        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                    }
            ]);
        };
        return _this;
    }
    return PlainPlugin;
}(BasePlugin));
export { PlainPlugin };
registerEditorPlugin(PlainPlugin);
