import { __assign, __extends } from "tslib";
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { formItemControl } from '../../component/BaseControl';
var CityControlPlugin = /** @class */ (function (_super) {
    __extends(CityControlPlugin, _super);
    function CityControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-city';
        _this.$schema = '/schemas/CityControlSchema.json';
        // 组件名称
        _this.name = '城市选择';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-building-o';
        _this.description = '可配置是否选择区域或者城市';
        _this.docLink = '/amis/zh-CN/components/form/input-city';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-city',
            label: '城市选择',
            name: 'city'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            wrapWithPanel: false,
            mode: 'horizontal',
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '城市选择';
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '选中值变化',
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
                description: '重置为默认值'
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
                        // getSchemaTpl('switchDefaultValue'),
                        /*
                        {
                          name: 'value',
                          type: 'input-city',
                          label: '默认值',
                          visibleOn: 'typeof data.value !== "undefined"',
                          validations: 'isNumeric',
                          labelRemark: {
                            trigger: 'click',
                            className: 'm-l-xs',
                            rootClose: true,
                            content: '城市编码',
                            placement: 'left'
                          }
                        },
                        */
                        getSchemaTpl('valueFormula', {
                            rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                            rendererWrapper: true,
                            mode: 'vertical' // 改成上下展示模式
                        }),
                        getSchemaTpl('switch', {
                            name: 'allowDistrict',
                            label: '允许选择区域',
                            pipeIn: defaultValue(true)
                        }),
                        getSchemaTpl('switch', {
                            name: 'allowCity',
                            label: '允许选择城市',
                            pipeIn: defaultValue(true)
                        }),
                        getSchemaTpl('switch', {
                            name: 'searchable',
                            label: '是否出搜索框',
                            pipeIn: defaultValue(false)
                        }),
                        getSchemaTpl('extractValue')
                    ]
                },
                status: {}
            }, context);
        };
        return _this;
    }
    return CityControlPlugin;
}(BasePlugin));
export { CityControlPlugin };
registerEditorPlugin(CityControlPlugin);
