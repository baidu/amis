import { __assign, __extends } from "tslib";
import { defaultValue } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var KVControlPlugin = /** @class */ (function (_super) {
    __extends(KVControlPlugin, _super);
    function KVControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-kv';
        _this.$schema = '/schemas/KVControlSchema.json';
        // 组件名称
        _this.name = 'KV 键值对';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-eyedropper';
        _this.description = '用于编辑键值对类型的数据';
        _this.docLink = '/amis/zh-CN/components/form/input-kv';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-kv',
            label: 'KV',
            name: 'kv'
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
        // 事件定义
        _this.events = [
            {
                eventName: 'add',
                eventLabel: '添加',
                description: '添加组合项时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'object',
                                title: '当前组合项的值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'delete',
                eventLabel: '删除',
                description: '删除组合项时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.key': {
                                type: 'string',
                                title: '删除项的索引'
                            },
                            'event.data.value': {
                                type: 'string',
                                title: '当前组合项的值'
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
        _this.panelTitle = 'KV 键值对';
        _this.panelBody = [
            {
                type: 'input-text',
                name: 'valueType',
                label: '值类型',
                pipeIn: defaultValue('input-text')
            },
            {
                type: 'input-text',
                name: 'keyPlaceholder',
                label: 'key 的提示信息'
            },
            {
                type: 'input-text',
                name: 'valuePlaceholder',
                label: 'value 的提示信息'
            },
            {
                type: 'switch',
                name: 'draggable',
                label: '是否可排序',
                pipeIn: defaultValue(true)
            }
        ];
        return _this;
    }
    return KVControlPlugin;
}(BasePlugin));
export { KVControlPlugin };
registerEditorPlugin(KVControlPlugin);
