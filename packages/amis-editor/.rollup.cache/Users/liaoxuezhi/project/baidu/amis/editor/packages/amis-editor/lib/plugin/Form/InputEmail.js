import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { TextControlPlugin } from './InputText';
var EmailControlPlugin = /** @class */ (function (_super) {
    __extends(EmailControlPlugin, _super);
    function EmailControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-email';
        _this.$schema = '/schemas/TextControlSchema.json';
        _this.name = '邮箱框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-envelope-o';
        _this.description = '验证输入是否符合邮箱的格式';
        _this.scaffold = {
            type: 'input-email',
            label: '邮箱',
            name: 'email'
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
    return EmailControlPlugin;
}(TextControlPlugin));
export { EmailControlPlugin };
registerEditorPlugin(EmailControlPlugin);
