import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { DateControlPlugin } from './InputDate';
var YearControlPlugin = /** @class */ (function (_super) {
    __extends(YearControlPlugin, _super);
    function YearControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-year';
        _this.$schema = '/schemas/YearControlSchema.json';
        // 组件名称
        _this.name = 'Year';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-calendar';
        _this.description = "\u5E74\u9009\u62E9";
        _this.docLink = '/amis/zh-CN/components/form/input-year';
        _this.tags = ['表单项'];
        // @ts-ignore
        _this.scaffold = {
            type: 'input-year',
            name: 'year'
        };
        _this.disabledRendererPlugin = true;
        _this.previewSchema = {
            type: 'form',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.panelTitle = 'Year';
        return _this;
    }
    return YearControlPlugin;
}(DateControlPlugin));
export { YearControlPlugin };
registerEditorPlugin(YearControlPlugin);
