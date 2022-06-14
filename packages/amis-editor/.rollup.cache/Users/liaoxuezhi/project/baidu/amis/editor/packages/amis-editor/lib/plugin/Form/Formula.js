import { __extends } from "tslib";
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var FormulaControlPlugin = /** @class */ (function (_super) {
    __extends(FormulaControlPlugin, _super);
    function FormulaControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'formula';
        _this.$schema = '/schemas/FormulaControlSchema.json';
        // 组件名称
        _this.name = '公式';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-calculator';
        _this.description = "\u901A\u8FC7\u516C\u5F0F\u8BA1\u7B97\u6307\u5B9A\u7684\u53D8\u91CF\u503C\uFF0C\u5E76\u5C06\u5176\u7ED3\u679C\u4F5C\u7528\u5230\u6307\u5B9A\u7684\u53D8\u91CF\u4E2D";
        _this.docLink = '/amis/zh-CN/components/form/formula';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'formula',
            name: 'formula'
        };
        _this.previewSchema = {
            type: 'tpl',
            tpl: '计算公式'
        };
        _this.panelTitle = '公式';
        _this.panelBody = [
            {
                label: '字段名',
                name: 'name',
                type: 'input-text',
                description: '公式计算结果会作用到此字段名对应的变量中。'
            },
            {
                type: 'input-text',
                name: 'value',
                label: '默认值'
            },
            {
                type: 'input-text',
                name: 'formula',
                label: '公式',
                description: '支持 JS 表达式，如： <code>data.var_a + 2</code>，即当表单项 <code>var_a</code> 变化的时候，会自动给当前表单项设置为 <code>var_a + 2</code> 的值。若设置为字符串，则需要加引号'
            },
            {
                type: 'input-text',
                name: 'condition',
                label: '作用条件',
                description: '支持如：<code>\\${xxx}</code>或者<code>data.xxx == "a"</code> 表达式来配置作用条件，当满足该作用条件时，会将计算结果设置到目标变量上。'
            },
            getSchemaTpl('switch', {
                name: 'initSet',
                label: '是否初始应用',
                description: '是否初始化的时候运行公式结果，并设置到目标变量上。',
                pipeIn: defaultValue(true)
            }),
            getSchemaTpl('switch', {
                name: 'autoSet',
                label: '是否自动应用',
                description: '是否自动计算公式结果，有变化时自动设置到目标变量上。<br />关闭后，通过按钮也能触发运算。',
                pipeIn: defaultValue(true)
            })
        ];
        return _this;
    }
    FormulaControlPlugin.prototype.renderRenderer = function (props) {
        return this.renderPlaceholder('功能组件（公式）', props.key);
    };
    return FormulaControlPlugin;
}(BasePlugin));
export { FormulaControlPlugin };
registerEditorPlugin(FormulaControlPlugin);
