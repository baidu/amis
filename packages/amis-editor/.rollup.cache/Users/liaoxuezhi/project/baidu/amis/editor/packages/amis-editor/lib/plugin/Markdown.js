import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var MarkdownPlugin = /** @class */ (function (_super) {
    __extends(MarkdownPlugin, _super);
    function MarkdownPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'markdown';
        _this.$schema = '/schemas/MarkdownSchema.json';
        // 组件名称
        _this.name = 'Markdown';
        _this.isBaseComponent = true;
        _this.description = '展示 markdown 内容';
        _this.docLink = '/amis/zh-CN/components/markdown';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-file-text';
        _this.scaffold = {
            type: 'markdown',
            value: '## 这是标题'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = 'MD';
        _this.panelBodyCreator = function (context) {
            var isUnderField = /\/field\/\w+$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [getSchemaTpl('markdownBody')]
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
    return MarkdownPlugin;
}(BasePlugin));
export { MarkdownPlugin };
registerEditorPlugin(MarkdownPlugin);
