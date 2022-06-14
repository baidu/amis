import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { isObject } from 'amis-editor-core';
var MappingPlugin = /** @class */ (function (_super) {
    __extends(MappingPlugin, _super);
    function MappingPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'mapping';
        _this.$schema = '/schemas/MappingSchema.json';
        // 组件名称
        _this.name = '映射';
        _this.isBaseComponent = true;
        _this.description = '对现有值做映射展示，比如原始值是：1、2、3...，需要展示成：下线、上线、过期等等。';
        _this.docLink = '/amis/zh-CN/components/mapping';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-exchange';
        _this.scaffold = {
            type: 'mapping',
            value: 2,
            map: {
                0: '<span class="label label-info">一</span>',
                1: '<span class="label label-success">二</span>',
                2: '<span class="label label-danger">三</span>',
                3: '<span class="label label-warning">四</span>',
                4: '<span class="label label-primary">五</span>',
                '*': '<span class="label label-default">-</span>'
            }
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '映射';
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
                                label: '映射表',
                                type: 'combo',
                                scaffold: {
                                    key: 'key-{index}',
                                    value: 'value-{index}'
                                },
                                required: true,
                                name: 'map',
                                descriptionClassName: 'help-block text-xs m-b-none',
                                description: '<p>当值命中左侧 Key 时，展示右侧内容，当没有命中时，默认实现 Key 为 <code>*</code>的内容</div>(请确保key值唯一)',
                                multiple: true,
                                pipeIn: function (value) {
                                    if (!isObject(value)) {
                                        return [
                                            {
                                                key: '*',
                                                value: '通配值'
                                            }
                                        ];
                                    }
                                    var arr = [];
                                    Object.keys(value).forEach(function (key) {
                                        arr.push({
                                            key: key || '',
                                            value: typeof value[key] === 'string'
                                                ? value[key]
                                                : JSON.stringify(value[key])
                                        });
                                    });
                                    return arr;
                                },
                                pipeOut: function (value) {
                                    if (!Array.isArray(value)) {
                                        return value;
                                    }
                                    var obj = {};
                                    value.forEach(function (item, idx) {
                                        var key = item.key || '';
                                        var value = item.value;
                                        if (key === 'key-{index}' && value === 'value-{index}') {
                                            key = key.replace('-{index}', "".concat(idx));
                                            value = value.replace('-{index}', "".concat(idx));
                                        }
                                        try {
                                            value = JSON.parse(value);
                                        }
                                        catch (e) { }
                                        obj[key] = value;
                                    });
                                    return obj;
                                },
                                items: [
                                    {
                                        placeholder: 'Key',
                                        type: 'input-text',
                                        unique: true,
                                        name: 'key',
                                        required: true,
                                        columnClassName: 'w-xs'
                                    },
                                    {
                                        placeholder: '内容',
                                        type: 'input-text',
                                        name: 'value'
                                    }
                                ]
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
    return MappingPlugin;
}(BasePlugin));
export { MappingPlugin };
registerEditorPlugin(MappingPlugin);
