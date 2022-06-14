import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { TextControlPlugin } from './InputText';
var URLControlPlugin = /** @class */ (function (_super) {
    __extends(URLControlPlugin, _super);
    function URLControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-url';
        _this.$schema = '/schemas/TextControlSchema.json';
        _this.name = 'URL输入框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-link';
        _this.description = '验证输入是否为合法的 URL';
        _this.docLink = '/amis/zh-CN/components/form/input-url';
        _this.scaffold = {
            type: 'input-url',
            label: '链接',
            name: 'url'
        };
        _this.disabledRendererPlugin = true;
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: __assign({}, _this.scaffold)
        };
        _this.panelTitle = 'URL';
        return _this;
    }
    return URLControlPlugin;
}(TextControlPlugin));
export { URLControlPlugin };
registerEditorPlugin(URLControlPlugin);
