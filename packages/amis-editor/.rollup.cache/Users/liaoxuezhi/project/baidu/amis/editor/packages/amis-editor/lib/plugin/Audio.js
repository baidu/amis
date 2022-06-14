import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var AudioPlugin = /** @class */ (function (_super) {
    __extends(AudioPlugin, _super);
    function AudioPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'audio';
        _this.$schema = '/schemas/AudioSchema.json';
        // 组件名称
        _this.name = '音频';
        _this.isBaseComponent = true;
        _this.description = '音频控件，可以用来播放各种音频文件。';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-music';
        _this.scaffold = {
            type: 'audio',
            autoPlay: false,
            src: ''
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '音频';
        _this.panelBodyCreator = function (context) {
            var isUnderField = /\/field\/\w+$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            isUnderField
                                ? {
                                    type: 'tpl',
                                    inline: false,
                                    className: 'text-info text-sm',
                                    tpl: '<p>当前为字段内容节点配置，选择上层还有更多的配置。</p>'
                                }
                                : null,
                            {
                                name: 'src',
                                type: 'input-text',
                                label: '音频地址',
                                description: '支持获取变量如：<code>\\${audioSrc}</code>'
                            },
                            {
                                type: 'select',
                                name: 'rates',
                                label: '音频倍速',
                                description: '加速范围在0.1到16之间',
                                multiple: true,
                                pipeIn: function (value) {
                                    return Array.isArray(value) ? value.join(',') : [];
                                },
                                pipeOut: function (value) {
                                    if (value && value.length) {
                                        var rates = value.split(',');
                                        rates = rates
                                            .filter(function (x) {
                                            return Number(x) && Number(x) > 0 && Number(x) <= 16;
                                        })
                                            .map(function (x) { return Number(Number(x).toFixed(1)); });
                                        return Array.from(new Set(rates));
                                    }
                                    else {
                                        return [];
                                    }
                                },
                                options: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
                            },
                            {
                                name: 'controls',
                                type: 'select',
                                label: '内部控件',
                                multiple: true,
                                extractValue: true,
                                joinValues: false,
                                options: [
                                    {
                                        label: '倍速',
                                        value: 'rates'
                                    },
                                    {
                                        label: '播放',
                                        value: 'play'
                                    },
                                    {
                                        label: '时间',
                                        value: 'time'
                                    },
                                    {
                                        label: '进度',
                                        value: 'process'
                                    },
                                    {
                                        label: '音量',
                                        value: 'volume'
                                    }
                                ],
                                pipeIn: defaultValue([
                                    'rates',
                                    'play',
                                    'time',
                                    'process',
                                    'volume'
                                ]),
                                labelRemark: {
                                    trigger: 'click',
                                    className: 'm-l-xs',
                                    rootClose: true,
                                    content: '选择倍速后，还需要在常规选择栏中配置倍速',
                                    placement: 'left'
                                }
                            },
                            getSchemaTpl('switch', {
                                name: 'autoPlay',
                                label: '自动播放'
                            }),
                            getSchemaTpl('switch', {
                                name: 'loop',
                                label: '循环播放'
                            })
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            getSchemaTpl('className'),
                            getSchemaTpl('switch', {
                                name: 'inline',
                                label: '内联模式',
                                pipeIn: defaultValue(true)
                            })
                        ]
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
    return AudioPlugin;
}(BasePlugin));
export { AudioPlugin };
registerEditorPlugin(AudioPlugin);
