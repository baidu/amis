import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { DateRangeControlPlugin } from './InputDateRange';
var QuarterRangePlugin = /** @class */ (function (_super) {
    __extends(QuarterRangePlugin, _super);
    function QuarterRangePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-quarter-range';
        _this.$schema = '/schemas/MonthRangeControlSchema.json';
        _this.order = -440;
        // 组件名称
        _this.icon = 'fa fa-calendar';
        _this.name = '季度范围';
        _this.isBaseComponent = true;
        _this.description = '月份范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
        _this.docLink = '/amis/zh-CN/components/form/input-quarter-range';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-quarter-range',
            label: '日期范围',
            name: 'quarter-range'
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
    return QuarterRangePlugin;
}(DateRangeControlPlugin));
export { QuarterRangePlugin };
registerEditorPlugin(QuarterRangePlugin);
