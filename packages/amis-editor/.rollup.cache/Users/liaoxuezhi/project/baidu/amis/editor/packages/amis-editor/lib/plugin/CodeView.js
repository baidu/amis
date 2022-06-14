import { __assign, __extends } from "tslib";
/**
 * @file 代码高亮显示
 */
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var CodeViewPlugin = /** @class */ (function (_super) {
    __extends(CodeViewPlugin, _super);
    function CodeViewPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'code';
        _this.$schema = '/schemas/CodeSchema.json';
        // 组件名称
        _this.name = '代码高亮';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-code';
        _this.description = '代码高亮';
        _this.docLink = '/amis/zh-CN/components/code';
        _this.tags = ['展示'];
        _this.scaffold = {
            type: 'code',
            language: 'html',
            value: '<div>html</div>'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '代码高亮';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            type: 'input-text',
                            label: '名称',
                            name: 'name'
                        },
                        {
                            type: 'editor',
                            label: '固定值',
                            allowFullscreen: true,
                            name: 'value'
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
    return CodeViewPlugin;
}(BasePlugin));
export { CodeViewPlugin };
registerEditorPlugin(CodeViewPlugin);
