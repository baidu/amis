import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
import { isObject } from 'amis-editor-core';
var CollapseGroupPlugin = /** @class */ (function (_super) {
    __extends(CollapseGroupPlugin, _super);
    function CollapseGroupPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'collapse-group';
        _this.$schema = '/schemas/CollapseGroupSchema.json';
        // 组件名称
        _this.name = '折叠面板';
        _this.isBaseComponent = true;
        _this.description = '折叠面板，当信息量较大且分类较多时，可使用折叠面板进行分类收纳。';
        _this.tags = ['展示', '容器'];
        _this.icon = 'fa fa-align-justify';
        _this.scaffold = {
            type: 'collapse-group',
            activeKey: ['1'],
            body: [
                {
                    type: 'collapse',
                    key: '1',
                    active: true,
                    header: '标题1',
                    body: [
                        {
                            type: 'tpl',
                            tpl: '这里是内容1',
                            inline: false
                        }
                    ]
                },
                {
                    type: 'collapse',
                    key: '2',
                    header: '标题2',
                    body: [
                        {
                            type: 'tpl',
                            tpl: '这里是内容1',
                            inline: false
                        }
                    ]
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.activeKeyData = [];
        _this.panelTitle = '折叠面板';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '属性',
                        body: getSchemaTpl('collapseGroup', [
                            {
                                title: '基本',
                                body: [
                                    {
                                        name: 'expandIconPosition',
                                        label: '图标位置',
                                        type: 'button-group-select',
                                        pipeIn: defaultValue('left'),
                                        options: [
                                            {
                                                label: '左边',
                                                value: 'left',
                                                icon: 'fa fa-align-left'
                                            },
                                            {
                                                label: '右边',
                                                value: 'right',
                                                icon: 'fa fa-align-right'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'ae-switch-more',
                                        label: '自定义图标',
                                        bulk: true,
                                        mode: 'normal',
                                        value: false,
                                        formType: 'extend',
                                        autoFocus: false,
                                        form: {
                                            body: [
                                                {
                                                    label: '图标',
                                                    name: 'expandIcon',
                                                    type: 'icon-picker',
                                                    className: 'fix-icon-picker-overflow',
                                                    pipeIn: function (value) {
                                                        var _a;
                                                        var val = (_a = value === null || value === void 0 ? void 0 : value.icon) !== null && _a !== void 0 ? _a : '';
                                                        return (val &&
                                                            ((value === null || value === void 0 ? void 0 : value.prefix)
                                                                ? "".concat(value.prefix).concat(val)
                                                                : "fa fa-".concat(val)));
                                                    },
                                                    pipeOut: function (value) {
                                                        var _a;
                                                        var fa = ~value.lastIndexOf('fa fa-');
                                                        var fab = ~value.lastIndexOf('fab fa-');
                                                        if (!(value || fa || fab)) {
                                                            return '';
                                                        }
                                                        var prefix = fab ? 'fab fa-' : fa ? 'fa fa-' : '';
                                                        value =
                                                            (_a = value.substring(prefix.length, value.length)) !== null && _a !== void 0 ? _a : '';
                                                        return {
                                                            type: 'icon',
                                                            prefix: prefix,
                                                            icon: value
                                                        };
                                                    }
                                                }
                                            ]
                                        },
                                        pipeIn: function (value) {
                                            if (typeof value === 'string' && value.length) {
                                                return {
                                                    character: value
                                                };
                                            }
                                            return undefined;
                                        },
                                        pipeOut: function (value) {
                                            if (!isObject(value)) {
                                                return undefined;
                                            }
                                            return typeof value.character === 'string'
                                                ? value.character
                                                : undefined;
                                        }
                                    },
                                    {
                                        name: 'accordion',
                                        label: tipedLabel('手风琴模式', '手风琴模式，只允许单个面板展开'),
                                        mode: 'row',
                                        inputClassName: 'inline-flex justify-between flex-row-reverse',
                                        type: 'switch',
                                        pipeIn: defaultValue(false)
                                    },
                                    getSchemaTpl('combo-container', {
                                        name: 'body',
                                        type: 'combo',
                                        label: '面板管理',
                                        mode: 'normal',
                                        multiple: true,
                                        addable: true,
                                        addButtonText: '新增折叠器',
                                        minLength: 1,
                                        draggable: true,
                                        draggableTip: '',
                                        placeholder: '请添加折叠器',
                                        items: [
                                            {
                                                type: 'container',
                                                columnClassName: 'w-xs w-9 text-xs',
                                                body: tipedLabel([
                                                    {
                                                        name: 'active',
                                                        type: 'checkbox'
                                                    }
                                                ], '默认展开此面板')
                                            },
                                            {
                                                name: 'header',
                                                placeholder: '标题',
                                                type: 'input-text'
                                            }
                                        ],
                                        onChange: function (value, oldValue, model, form) {
                                            var activeKey = value.reduce(function (arr, item) {
                                                item.active === true && arr.push(item.key);
                                                return arr;
                                            }, []);
                                            form.setValues({
                                                activeKey: activeKey
                                            });
                                        },
                                        pipeOut: function (value, oldValue, data) {
                                            var keys = value.map(function (item) { return item.key; });
                                            var findMinCanUsedKey = function (keys, max) {
                                                for (var i = 1; i <= max; i++) {
                                                    if (!keys.includes(String(i))) {
                                                        return String(i);
                                                    }
                                                }
                                            };
                                            value.forEach(function (item) {
                                                if (!item.key) {
                                                    var key = findMinCanUsedKey(keys, value.length);
                                                    item.key = key;
                                                    item.header = "\u6807\u9898".concat(key);
                                                }
                                            });
                                            return value;
                                        },
                                        scaffold: {
                                            type: 'collapse',
                                            header: '标题',
                                            body: [
                                                {
                                                    type: 'tpl',
                                                    tpl: '内容',
                                                    inline: false
                                                }
                                            ],
                                            key: ''
                                        }
                                    })
                                ]
                            }
                        ])
                    },
                    {
                        title: '外观',
                        body: getSchemaTpl('collapseGroup', [
                            getSchemaTpl('style:classNames', {
                                isFormItem: false
                            })
                        ])
                    }
                ])
            ];
        };
        _this.regions = [
            {
                key: 'body',
                label: '内容区',
                renderMethod: 'render',
                insertPosition: 'inner'
            }
        ];
        return _this;
    }
    return CollapseGroupPlugin;
}(BasePlugin));
export { CollapseGroupPlugin };
registerEditorPlugin(CollapseGroupPlugin);
