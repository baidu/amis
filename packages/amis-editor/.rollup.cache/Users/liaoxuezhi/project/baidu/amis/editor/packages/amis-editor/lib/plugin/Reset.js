import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { ButtonPlugin } from './Button';
var ResetPlugin = /** @class */ (function (_super) {
    __extends(ResetPlugin, _super);
    function ResetPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'reset';
        _this.disabledRendererPlugin = true; // 组件面板不显示
        // 组件名称
        _this.name = '重置';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-eraser';
        _this.description = '一般用来重置表单数据到初始值。';
        _this.panelTitle = '按钮';
        _this.scaffold = {
            type: 'reset',
            label: '重置'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        return _this;
    }
    return ResetPlugin;
}(ButtonPlugin));
export { ResetPlugin };
registerEditorPlugin(ResetPlugin);
