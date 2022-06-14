import { __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var DividerPlugin = /** @class */ (function (_super) {
    __extends(DividerPlugin, _super);
    function DividerPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'divider';
        _this.$schema = '/schemas/DividerSchema.json';
        // 组件名称
        _this.name = '分隔线';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-minus';
        _this.description = '用来展示一个分割线，可用来做视觉上的隔离。';
        _this.scaffold = {
            type: 'divider'
        };
        _this.previewSchema = {
            type: 'divider',
            className: 'm-t-none m-b-none'
        };
        _this.panelTitle = '分隔线';
        _this.panelBody = getSchemaTpl('tabs', [
            {
                title: '外观',
                body: [getSchemaTpl('className')]
            },
            {
                title: '显隐',
                body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
            }
        ]);
        return _this;
    }
    return DividerPlugin;
}(BasePlugin));
export { DividerPlugin };
registerEditorPlugin(DividerPlugin);
