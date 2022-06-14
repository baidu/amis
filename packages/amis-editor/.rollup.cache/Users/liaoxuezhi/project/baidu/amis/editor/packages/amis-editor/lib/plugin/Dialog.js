import { __assign, __extends } from "tslib";
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { noop } from 'amis-editor-core';
import { getEventControlConfig } from '../util';
var DialogPlugin = /** @class */ (function (_super) {
    __extends(DialogPlugin, _super);
    function DialogPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'dialog';
        _this.$schema = '/schemas/DialogSchema.json';
        // 组件名称
        _this.name = '弹框';
        _this.isBaseComponent = true;
        _this.wrapperProps = {
            wrapperComponent: InlineModal,
            onClose: noop,
            show: true
        };
        _this.regions = [
            {
                key: 'body',
                label: '内容区',
                renderMethod: 'renderBody',
                renderMethodOverride: function (regions, insertRegion) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var info = this.props.$$editor;
                        var dom = this.super.apply(this, args);
                        if (info && args[1] === 'body') {
                            return insertRegion(this, dom, regions, info, info.plugin.manager);
                        }
                        return dom;
                    };
                }
            },
            {
                key: 'actions',
                label: '按钮组',
                renderMethod: 'renderFooter',
                wrapperResolve: function (dom) { return dom; }
            }
        ];
        // 现在没用，后面弹窗优化后有用
        _this.events = [
            {
                eventName: 'confirm',
                eventLabel: '确认',
                description: '确认'
            },
            {
                eventName: 'cancel',
                eventLabel: '取消',
                description: '取消'
            }
        ];
        _this.actions = [
            {
                actionType: 'confirm',
                actionLabel: '确认',
                description: '确认操作'
            },
            {
                actionType: 'cancel',
                actionLabel: '取消',
                description: '取消操作'
            },
            {
                actionType: 'setValue',
                actionLabel: '更新数据',
                description: '触发组件数据更新'
            }
        ];
        _this.panelTitle = '弹框';
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            label: '标题',
                            type: 'input-text',
                            name: 'title'
                        },
                        getSchemaTpl('switch', {
                            label: '数据映射',
                            name: 'data',
                            className: 'block m-b-xs',
                            pipeIn: function (value) { return !!value; },
                            pipeOut: function (value) { return (value ? { '&': '$$' } : null); }
                        }),
                        {
                            type: 'tpl',
                            visibleOn: '!this.data',
                            tpl: '<p class="text-sm text-muted">当没开启数据映射时，弹框中默认会拥有触发打开弹框按钮所在环境的所有数据。</p>'
                        },
                        {
                            type: 'input-kv',
                            syncDefaultValue: false,
                            name: 'data',
                            visibleOn: 'this.data',
                            descriptionClassName: 'help-block text-xs m-b-none',
                            description: '<p>当开启数据映射时，弹框中的数据只会包含设置的部分，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>',
                            messages: {
                                validateFailed: '数据映射中存在错误，请仔细检查'
                            }
                        },
                        getSchemaTpl('switch', {
                            label: '按 Esc 关闭弹框',
                            name: 'closeOnEsc',
                            value: false
                        }),
                        getSchemaTpl('switch', {
                            label: '点击弹框外区域关闭弹框',
                            name: 'closeOnOutside',
                            value: false
                        })
                    ]
                },
                {
                    title: '外观',
                    body: [
                        {
                            label: '尺寸',
                            type: 'button-group-select',
                            name: 'size',
                            size: 'sm',
                            className: 'block',
                            pipeIn: defaultValue(''),
                            options: [
                                {
                                    label: '小',
                                    value: 'sm'
                                },
                                {
                                    label: '默认',
                                    value: ''
                                },
                                {
                                    label: '中',
                                    value: 'md'
                                },
                                {
                                    label: '大',
                                    value: 'lg'
                                },
                                {
                                    label: '超大',
                                    value: 'xl'
                                }
                            ]
                        },
                        getSchemaTpl('switch', {
                            label: '是否显示关闭按钮',
                            name: 'showCloseButton',
                            value: true
                        }),
                        getSchemaTpl('className', {
                            name: 'headerClassName',
                            label: '顶部 CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'bodyClassName',
                            label: '内容 CSS 类名'
                        })
                    ]
                },
                {
                    title: '事件',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(_this.manager, context)))
                    ]
                }
            ]);
        };
        return _this;
    }
    DialogPlugin.prototype.buildSubRenderers = function () { };
    return DialogPlugin;
}(BasePlugin));
export { DialogPlugin };
registerEditorPlugin(DialogPlugin);
var InlineModal = /** @class */ (function (_super) {
    __extends(InlineModal, _super);
    function InlineModal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InlineModal.prototype.componentDidMount = function () { };
    InlineModal.prototype.render = function () {
        var children = this.props.children;
        return React.createElement("div", { className: "ae-InlineModel" }, children);
    };
    return InlineModal;
}(React.Component));
export { InlineModal };
