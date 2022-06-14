import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { DatePlugin } from './Date';
var TimePlugin = /** @class */ (function (_super) {
    __extends(TimePlugin, _super);
    function TimePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'time';
        _this.name = '时间展示';
        _this.isBaseComponent = true;
        _this.scaffold = {
            type: 'time',
            value: Math.round(Date.now() / 1000)
        };
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { format: 'HH:mm:ss', value: Math.round(Date.now() / 1000) });
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                type: 'input-time',
                                name: 'value',
                                label: '时间数值'
                            },
                            {
                                type: 'input-text',
                                name: 'format',
                                label: '显示时间格式',
                                description: '请参考 moment 中的格式用法。',
                                pipeIn: defaultValue('HH:mm:ss')
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
    return TimePlugin;
}(DatePlugin));
export { TimePlugin };
registerEditorPlugin(TimePlugin);
