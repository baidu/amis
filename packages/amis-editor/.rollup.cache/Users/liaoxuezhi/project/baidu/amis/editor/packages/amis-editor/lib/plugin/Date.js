import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var DatePlugin = /** @class */ (function (_super) {
    __extends(DatePlugin, _super);
    function DatePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'date';
        _this.$schema = '/schemas/DateSchema.json';
        // 组件名称
        _this.name = '日期展示';
        _this.isBaseComponent = true;
        _this.description = '主要用来关联字段名做日期展示，支持各种格式如：X（时间戳），YYYY-MM-DD HH:mm:ss。';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-calendar';
        _this.scaffold = {
            type: 'date',
            value: Math.round(Date.now() / 1000)
        };
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { format: 'YYYY-MM-DD', value: Math.round(Date.now() / 1000) });
        _this.panelTitle = '日期展示';
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                type: 'input-date',
                                name: 'value',
                                label: '日期数值'
                            },
                            {
                                type: 'input-text',
                                name: 'format',
                                label: '显示日期格式',
                                description: '请参考 moment 中的格式用法。',
                                pipeIn: defaultValue('YYYY-MM-DD')
                            },
                            {
                                type: 'input-text',
                                name: 'valueFormat',
                                label: '数据日期格式',
                                description: '请参考 moment 中的格式用法。',
                                pipeIn: defaultValue('X')
                            },
                            {
                                name: 'placeholder',
                                type: 'input-text',
                                pipeIn: defaultValue('-'),
                                label: '占位符'
                            }
                        ]
                    },
                    {
                        title: '外观',
                        body: [getSchemaTpl('className')]
                    },
                    {
                        title: '显隐',
                        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                    }
                ])
            ];
        };
        return _this;
    }
    return DatePlugin;
}(BasePlugin));
export { DatePlugin };
registerEditorPlugin(DatePlugin);
