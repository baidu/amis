import { __extends } from "tslib";
/**
 * @file 日志组件
 */
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
var LogPlugin = /** @class */ (function (_super) {
    __extends(LogPlugin, _super);
    function LogPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'log';
        _this.$schema = '/schemas/LogSchema.json';
        // 组件名称
        _this.name = '日志';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-file-text-o';
        _this.description = '用来实时显示日志';
        _this.docLink = '/amis/zh-CN/components/log';
        _this.tags = ['展示'];
        _this.previewSchema = {
            type: 'log',
            height: 120
        };
        _this.scaffold = {
            type: 'log'
        };
        _this.panelTitle = '日志';
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        getSchemaTpl('api', {
                            label: '日志数据源',
                            name: 'source'
                        })
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
            ]);
        };
        return _this;
    }
    return LogPlugin;
}(BasePlugin));
export { LogPlugin };
registerEditorPlugin(LogPlugin);
