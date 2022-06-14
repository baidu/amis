import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { ButtonPlugin } from './Button';
var SubmitPlugin = /** @class */ (function (_super) {
    __extends(SubmitPlugin, _super);
    function SubmitPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'submit';
        _this.disabledRendererPlugin = true; // 组件面板不显示
        // 组件名称
        _this.name = '提交';
        _this.isBaseComponent = true;
        _this.description = '用来提交表单，要求表单验证，如果在弹窗中会自动关闭弹窗。';
        _this.panelTitle = '按钮';
        _this.scaffold = {
            type: 'submit',
            label: '提交',
            level: 'primary'
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        return _this;
    }
    return SubmitPlugin;
}(ButtonPlugin));
export { SubmitPlugin };
registerEditorPlugin(SubmitPlugin);
