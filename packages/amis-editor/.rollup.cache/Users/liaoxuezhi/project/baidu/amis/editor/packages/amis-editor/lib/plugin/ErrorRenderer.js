import { __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var ErrorRendererPlugin = /** @class */ (function (_super) {
    __extends(ErrorRendererPlugin, _super);
    function ErrorRendererPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = -9999;
        // 关联渲染器名字
        _this.rendererName = 'error';
        // 组件名称
        _this.name = 'Error';
        _this.isBaseComponent = true;
        return _this;
    }
    return ErrorRendererPlugin;
}(BasePlugin));
export { ErrorRendererPlugin };
registerEditorPlugin(ErrorRendererPlugin);
