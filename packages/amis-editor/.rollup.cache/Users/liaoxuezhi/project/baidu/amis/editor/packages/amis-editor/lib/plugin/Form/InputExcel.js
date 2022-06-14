import { __assign, __extends } from "tslib";
/**
 * @file input-excel 组件的素项目部
 */
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { formItemControl } from '../../component/BaseControl';
var ExcelControlPlugin = /** @class */ (function (_super) {
    __extends(ExcelControlPlugin, _super);
    function ExcelControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-excel';
        _this.$schema = '/schemas/ExcelControlSchema.json';
        // 组件名称
        _this.name = '上传 Excel';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-eyedropper';
        _this.description = '自动解析 Excel';
        _this.docLink = '/amis/zh-CN/components/form/input-excel';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-excel',
            label: 'Excel',
            name: 'excel'
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
        _this.panelTitle = '上传 Excel';
        _this.notRenderFormZone = true;
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: 'excel 上传解析完成后触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: 'excel 解析后的数据'
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
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelBodyCreator = function (context) {
            return formItemControl({
                common: {
                    body: [
                        {
                            label: '解析模式',
                            name: 'parseMode',
                            type: 'select',
                            options: [
                                {
                                    label: '对象',
                                    value: 'object'
                                },
                                { label: '数组', value: 'array' }
                            ]
                        },
                        getSchemaTpl('switch', {
                            name: 'allSheets',
                            label: '是否解析所有 Sheet'
                        }),
                        getSchemaTpl('switch', {
                            name: 'plainText',
                            label: '是否解析为纯文本',
                            pipeIn: defaultValue(true)
                        }),
                        getSchemaTpl('switch', {
                            name: 'includeEmpty',
                            label: '是否包含空内容',
                            visibleOn: 'data.parseMode === "array"'
                        })
                    ]
                }
            }, context);
        };
        return _this;
    }
    return ExcelControlPlugin;
}(BasePlugin));
export { ExcelControlPlugin };
registerEditorPlugin(ExcelControlPlugin);
