import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { DateControlPlugin } from './InputDate';
var TimeControlPlugin = /** @class */ (function (_super) {
    __extends(TimeControlPlugin, _super);
    function TimeControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-time';
        _this.$schema = '/schemas/TimeControlSchema.json';
        // 组件名称
        _this.name = '时间框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-clock-o';
        _this.description = "\u65F6\u5206\u79D2\u8F93\u5165";
        _this.docLink = '/amis/zh-CN/components/form/input-time';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-time',
            label: '时间',
            name: 'time'
        };
        _this.disabledRendererPlugin = true;
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: __assign({}, _this.scaffold)
        };
        _this.panelTitle = '时间框';
        return _this;
    }
    return TimeControlPlugin;
}(DateControlPlugin));
export { TimeControlPlugin };
registerEditorPlugin(TimeControlPlugin);
