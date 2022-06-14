import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { formItemControl } from '../../component/BaseControl';
var ListControlPlugin = /** @class */ (function (_super) {
    __extends(ListControlPlugin, _super);
    function ListControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'list-select';
        _this.$schema = '/schemas/ListControlSchema.json';
        _this.order = -430;
        // 组件名称
        _this.name = '列表选择';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-ellipsis-h';
        _this.description = "\u5355\u9009\u6216\u8005\u591A\u9009\uFF0C\u652F\u6301<code>source</code>\u62C9\u53D6\u9009\u9879\uFF0C\u9009\u9879\u53EF\u914D\u7F6E\u56FE\u7247\uFF0C\u4E5F\u53EF\u4EE5\u81EA\u5B9A\u4E49<code>HTML</code>\u914D\u7F6E";
        _this.docLink = '/amis/zh-CN/components/form/list-select';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'list-select',
            label: '列表',
            name: 'list',
            options: [
                {
                    label: '选项A',
                    value: 'A'
                },
                {
                    label: '选项B',
                    value: 'B'
                }
            ]
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { value: 'A' })
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '列表选择';
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '选中值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '选中值'
                            }
                        }
                    }
                ]
            }
        ];
        // 动作定义
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清除选中值'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'reload',
                actionLabel: '重新加载',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    replace: true,
                    body: [
                        getSchemaTpl('formItemName', {
                            required: true
                        }),
                        getSchemaTpl('label'),
                        getSchemaTpl('multiple'),
                        getSchemaTpl('valueFormula', {
                            rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                            useSelectMode: true,
                            visibleOn: 'this.options && this.options.length > 0'
                        })
                    ]
                },
                option: {
                    body: [
                        getSchemaTpl('optionControlV2', {
                            description: '设置选项后，输入时会下拉这些选项供用户参考。'
                        })
                    ]
                },
                status: {}
            }, context);
        };
        return _this;
    }
    return ListControlPlugin;
}(BasePlugin));
export { ListControlPlugin };
registerEditorPlugin(ListControlPlugin);
