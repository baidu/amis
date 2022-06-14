import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { DatePlugin } from './Date';
var DatetimePlugin = /** @class */ (function (_super) {
    __extends(DatetimePlugin, _super);
    function DatetimePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'datetime';
        _this.scaffold = {
            type: 'datetime',
            value: Math.round(Date.now() / 1000)
        };
        _this.name = '日期时间展示';
        _this.isBaseComponent = true;
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { format: 'YYYY-MM-DD HH:mm:ss', value: Math.round(Date.now() / 1000) });
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                type: 'input-datetime',
                                name: 'value',
                                label: '日期时间数值'
                            },
                            {
                                type: 'input-text',
                                name: 'format',
                                label: '显示日期时间格式',
                                description: '请参考 moment 中的格式用法。',
                                pipeIn: defaultValue('YYYY-MM-DD HH:mm:ss')
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
    return DatetimePlugin;
}(DatePlugin));
export { DatetimePlugin };
registerEditorPlugin(DatetimePlugin);
