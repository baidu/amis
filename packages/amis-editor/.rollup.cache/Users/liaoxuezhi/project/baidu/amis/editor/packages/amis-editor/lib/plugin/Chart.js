import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { diff } from 'amis-editor-core';
import AMisCodeEditor from 'amis-editor-core';
var ChartConfigEditor = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    return (React.createElement("div", { className: "ae-JsonEditor" },
        React.createElement(AMisCodeEditor, { value: value, onChange: onChange })));
};
var ChartPlugin = /** @class */ (function (_super) {
    __extends(ChartPlugin, _super);
    function ChartPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'chart';
        _this.$schema = '/schemas/ChartSchema.json';
        // 组件名称
        _this.name = '图表';
        _this.isBaseComponent = true;
        _this.description = '用来渲染图表，基于 echarts 图表库，理论上 echarts 所有图表类型都支持。';
        _this.docLink = '/amis/zh-CN/components/chart';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-pie-chart';
        _this.scaffold = {
            type: 'chart',
            config: {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line'
                    }
                ]
            },
            replaceChartOption: true
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        // 动作定义
        _this.actions = [
            {
                actionType: 'reload',
                actionLabel: '重新加载',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionType: 'setValue',
                actionLabel: '更新数据',
                description: '触发组件数据更新'
            }
        ];
        _this.panelTitle = '图表';
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            getSchemaTpl('api', {
                                label: '接口拉取',
                                description: '接口可以返回配置，或者数据，建议返回数据可映射到 Echarts 配置中'
                            }),
                            getSchemaTpl('switch', {
                                label: '初始是否拉取',
                                name: 'initFetch',
                                visibleOn: 'data.api',
                                pipeIn: defaultValue(true)
                            }),
                            {
                                name: 'interval',
                                label: '定时刷新间隔',
                                type: 'input-number',
                                step: 500,
                                visibleOn: 'data.api',
                                description: '设置后将自动定时刷新，最小3000, 单位 ms'
                            },
                            {
                                name: 'config',
                                asFormItem: true,
                                component: ChartConfigEditor,
                                // type: 'json-editor',
                                label: 'Echarts 配置',
                                description: '支持数据映射，可将接口返回的数据填充进来'
                                // size: 'lg'
                                // pipeOut: (value: any) => {
                                //   try {
                                //     return value ? JSON.parse(value) : null;
                                //   } catch (e) {}
                                //   return null;
                                // }
                            },
                            {
                                name: 'clickAction',
                                asFormItem: true,
                                children: function (_a) {
                                    var onChange = _a.onChange, value = _a.value;
                                    return (React.createElement("div", { className: "m-b" },
                                        React.createElement(Button, { size: "sm", level: value ? 'danger' : 'info', onClick: _this.editDrillDown.bind(_this, context.id) }, "\u914D\u7F6E DrillDown"),
                                        value ? (React.createElement(Button, { size: "sm", level: "link", className: "m-l", onClick: function () { return onChange(''); } }, "\u5220\u9664 DrillDown")) : null));
                                }
                            },
                            {
                                name: 'dataFilter',
                                type: 'js-editor',
                                allowFullscreen: true,
                                label: '数据加工',
                                size: 'lg',
                                description: "\n              \u5982\u679C\u540E\u7AEF\u6CA1\u6709\u76F4\u63A5\u8FD4\u56DE Echart \u914D\u7F6E\uFF0C\u53EF\u4EE5\u81EA\u5DF1\u5199\u4E00\u6BB5\u51FD\u6570\u6765\u5305\u88C5\u3002\n              <p>\u7B7E\u540D\uFF1A(config, echarts, data) => config</p>\n              <p>\u53C2\u6570\u8BF4\u660E</p>\n              <ul>\n              <li><code>config</code> \u539F\u59CB\u6570\u636E</li>\n              <li><code>echarts</code> echarts \u5BF9\u8C61</li>\n              <li><code>data</code> \u5982\u679C\u914D\u7F6E\u4E86\u6570\u636E\u63A5\u53E3\uFF0C\u63A5\u53E3\u8FD4\u56DE\u7684\u6570\u636E\u901A\u8FC7\u6B64\u53D8\u91CF\u4F20\u5165</li>\n              </ul>\n              <p>\u793A\u4F8B</p>\n              <pre>debugger; // \u53EF\u4EE5\u6D4F\u89C8\u5668\u4E2D\u65AD\u70B9\u8C03\u8BD5\n\n// \u67E5\u770B\u539F\u59CB\u6570\u636E\nconsole.log(config)\n\n// \u8FD4\u56DE\u65B0\u7684\u7ED3\u679C \nreturn {}</pre>\n              "
                            },
                            getSchemaTpl('switch', {
                                label: 'Chart 配置完全替换',
                                name: 'replaceChartOption',
                                labelRemark: {
                                    trigger: 'click',
                                    className: 'm-l-xs',
                                    rootClose: true,
                                    content: '默认为追加模式，新的配置会跟旧的配置合并，如果勾选将直接完全覆盖。',
                                    placement: 'left'
                                }
                            })
                        ]
                    },
                    {
                        title: '外观',
                        body: [getSchemaTpl('className')]
                    },
                    {
                        title: '显隐',
                        body: [getSchemaTpl('visible')]
                    },
                    {
                        title: '其他',
                        body: [getSchemaTpl('name')]
                    }
                ])
            ];
        };
        return _this;
    }
    ChartPlugin.prototype.editDrillDown = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        var dialog = (value.clickAction && value.clickAction.dialog) || {
            title: '标题',
            body: ['<p>内容 <code>${value|json}</code></p>']
        };
        node &&
            value &&
            this.manager.openSubEditor({
                title: '配置 DrillDown 详情',
                value: __assign({ type: 'container' }, dialog),
                slot: {
                    type: 'container',
                    body: '$$'
                },
                typeMutable: false,
                onChange: function (newValue) {
                    newValue = __assign(__assign({}, value), { clickAction: {
                            actionType: 'dialog',
                            dialog: newValue
                        } });
                    manager.panelChangeValue(newValue, diff(value, newValue));
                }
            });
    };
    return ChartPlugin;
}(BasePlugin));
export { ChartPlugin };
registerEditorPlugin(ChartPlugin);
