import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { DateControlPlugin } from './InputDate';
var DateTimeControlPlugin = /** @class */ (function (_super) {
    __extends(DateTimeControlPlugin, _super);
    function DateTimeControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-datetime';
        _this.$schema = '/schemas/DateTimeControlSchema.json';
        // 组件名称
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-calendar';
        _this.name = '日期时间';
        _this.description = '年月日时分选择';
        _this.docLink = '/amis/zh-CN/components/form/input-datetime';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-datetime',
            label: '日期时间',
            name: 'datetime'
        };
        _this.disabledRendererPlugin = true;
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.panelTitle = '日期时间';
        return _this;
    }
    return DateTimeControlPlugin;
}(DateControlPlugin));
export { DateTimeControlPlugin };
registerEditorPlugin(DateTimeControlPlugin);
