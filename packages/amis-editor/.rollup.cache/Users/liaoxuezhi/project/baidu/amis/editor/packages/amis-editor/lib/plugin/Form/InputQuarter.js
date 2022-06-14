import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { DateControlPlugin } from './InputDate';
var InputQuarterPlugin = /** @class */ (function (_super) {
    __extends(InputQuarterPlugin, _super);
    function InputQuarterPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-quarter';
        _this.$schema = '/schemas/QuarterControlSchema.json';
        // 组件名称
        _this.name = '季度';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-calendar';
        _this.description = "\u5B63\u5EA6\u9009\u62E9";
        _this.docLink = '/amis/zh-CN/components/form/input-quarter';
        _this.tags = ['表单项'];
        // @ts-ignore
        _this.scaffold = {
            type: 'input-quarter',
            name: 'month'
        };
        _this.disabledRendererPlugin = true;
        _this.previewSchema = {
            type: 'form',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.panelTitle = 'Quarter';
        return _this;
    }
    return InputQuarterPlugin;
}(DateControlPlugin));
export { InputQuarterPlugin };
registerEditorPlugin(InputQuarterPlugin);
