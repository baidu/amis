import { __extends } from "tslib";
import { BasePlugin } from 'amis-editor-core';
/**
 * 添加名字面板，方便根据组件名字定位节点
 */
var NamePlugin = /** @class */ (function (_super) {
    __extends(NamePlugin, _super);
    function NamePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = -9999;
        return _this;
    }
    NamePlugin.prototype.buildEditorPanel = function (_a, panels) {
        var info = _a.info, selections = _a.selections;
        // panels.push({
        //   position: 'left',
        //   key: 'name-list',
        //   icon: 'fa fa-list',
        //   title: '名字',
        //   component: TargetNamePanel,
        //   order: 4000
        // });
    };
    return NamePlugin;
}(BasePlugin));
export { NamePlugin };
// PM端：名字tab 使用有点奇怪，暂时去掉
// registerEditorPlugin(NamePlugin);
