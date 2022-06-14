import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { TextControlPlugin } from './InputText';
var PasswordControlPlugin = /** @class */ (function (_super) {
    __extends(PasswordControlPlugin, _super);
    function PasswordControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-password';
        _this.$schema = '/schemas/TextControlSchema.json';
        _this.name = '密码框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-asterisk';
        _this.description = '验证输入是否符合邮箱的格式';
        _this.scaffold = {
            type: 'input-password',
            label: '密码',
            name: 'password'
        };
        _this.disabledRendererPlugin = true;
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: __assign({}, _this.scaffold)
        };
        _this.panelTitle = _this.name;
        return _this;
    }
    return PasswordControlPlugin;
}(TextControlPlugin));
export { PasswordControlPlugin };
registerEditorPlugin(PasswordControlPlugin);
