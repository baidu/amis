import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { DateRangeControlPlugin } from './InputDateRange';
var MonthRangeControlPlugin = /** @class */ (function (_super) {
    __extends(MonthRangeControlPlugin, _super);
    function MonthRangeControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-month-range';
        _this.$schema = '/schemas/MonthRangeControlSchema.json';
        _this.order = -440;
        // 组件名称
        _this.icon = 'fa fa-calendar';
        _this.name = '月份范围';
        _this.isBaseComponent = true;
        _this.description = '月份范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
        _this.docLink = '/amis/zh-CN/components/form/input-month-range';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-month-range',
            label: '日期范围',
            name: 'month-range'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.disabledRendererPlugin = true;
        _this.notRenderFormZone = true;
        return _this;
    }
    return MonthRangeControlPlugin;
}(DateRangeControlPlugin));
export { MonthRangeControlPlugin };
registerEditorPlugin(MonthRangeControlPlugin);
