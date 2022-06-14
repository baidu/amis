import { __assign, __extends } from "tslib";
import { Button } from 'amis-ui';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { diff } from 'amis-editor-core';
var ActionPlugin = /** @class */ (function (_super) {
    __extends(ActionPlugin, _super);
    function ActionPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.panelTitle = '按钮';
        _this.panelBodyCreator = function (context) {
            var isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
            var isInDropdown = /(?:\/|^)dropdown-button\/.+$/.test(context.path);
            var schema = [
                {
                    label: '按钮行为',
                    type: 'select',
                    name: 'actionType',
                    pipeIn: defaultValue(''),
                    options: [
                        {
                            label: '默认',
                            value: ''
                        },
                        {
                            label: '弹框',
                            value: 'dialog'
                        },
                        {
                            label: '抽出式弹框（Drawer）',
                            value: 'drawer'
                        },
                        {
                            label: '发送请求',
                            value: 'ajax'
                        },
                        {
                            label: '下载文件',
                            value: 'download'
                        },
                        {
                            label: '页面跳转(单页模式)',
                            value: 'link'
                        },
                        {
                            label: '页面跳转',
                            value: 'url'
                        },
                        {
                            label: '刷新目标',
                            value: 'reload'
                        },
                        {
                            label: '复制内容',
                            value: 'copy'
                        },
                        {
                            label: '提交',
                            value: 'submit'
                        },
                        {
                            label: '重置',
                            value: 'reset'
                        },
                        {
                            label: '重置表单并提交',
                            value: 'reset-and-submit'
                        },
                        {
                            label: '清空表单并提交',
                            value: 'clear-and-submit'
                        },
                        {
                            label: '确认',
                            value: 'confirm'
                        },
                        {
                            label: '取消',
                            value: 'cancel'
                        },
                        {
                            label: '跳转下一条',
                            value: 'next'
                        },
                        {
                            label: '跳转上一条',
                            value: 'prev'
                        }
                    ]
                },
                {
                    type: 'input-text',
                    name: 'content',
                    visibleOn: 'data.actionType == "copy"',
                    label: '复制内容模板'
                },
                {
                    type: 'select',
                    name: 'copyFormat',
                    options: [
                        {
                            label: '纯文本',
                            value: 'text/plain'
                        },
                        {
                            label: '富文本',
                            value: 'text/html'
                        }
                    ],
                    visibleOn: 'data.actionType == "copy"',
                    label: '复制格式'
                },
                {
                    type: 'input-text',
                    name: 'target',
                    visibleOn: 'data.actionType == "reload"',
                    label: '指定刷新目标',
                    required: true
                },
                {
                    name: 'dialog',
                    pipeIn: defaultValue({
                        title: '弹框标题',
                        body: '<p>对，你刚刚点击了</p>'
                    }),
                    asFormItem: true,
                    children: function (_a) {
                        var value = _a.value, onChange = _a.onChange, data = _a.data;
                        return data.actionType === 'dialog' ? (React.createElement(Button, { size: "sm", level: "danger", className: "m-b", onClick: function () {
                                return _this.manager.openSubEditor({
                                    title: '配置弹框内容',
                                    value: __assign({ type: 'dialog' }, value),
                                    onChange: function (value) { return onChange(value); }
                                });
                            }, block: true }, "\u914D\u7F6E\u5F39\u6846\u5185\u5BB9")) : null;
                    }
                },
                {
                    visibleOn: 'data.actionType == "drawer"',
                    name: 'drawer',
                    pipeIn: defaultValue({
                        title: '弹框标题',
                        body: '<p>对，你刚刚点击了</p>'
                    }),
                    asFormItem: true,
                    children: function (_a) {
                        var value = _a.value, onChange = _a.onChange, data = _a.data;
                        return data.actionType == 'drawer' ? (React.createElement(Button, { size: "sm", level: "danger", className: "m-b", onClick: function () {
                                return _this.manager.openSubEditor({
                                    title: '配置抽出式弹框内容',
                                    value: __assign({ type: 'drawer' }, value),
                                    onChange: function (value) { return onChange(value); }
                                });
                            }, block: true }, "\u914D\u7F6E\u62BD\u51FA\u5F0F\u5F39\u6846\u5185\u5BB9")) : null;
                    }
                },
                getSchemaTpl('api', {
                    label: '目标API',
                    visibleOn: 'data.actionType == "ajax" || data.actionType == "download"'
                }),
                {
                    name: 'feedback',
                    pipeIn: defaultValue({
                        title: '弹框标题',
                        body: '<p>内容</p>'
                    }),
                    asFormItem: true,
                    children: function (_a) {
                        var onChange = _a.onChange, value = _a.value, data = _a.data;
                        return data.actionType == 'ajax' ? (React.createElement("div", { className: "m-b" },
                            React.createElement(Button, { size: "sm", level: value ? 'danger' : 'info', onClick: function () {
                                    return _this.manager.openSubEditor({
                                        title: '配置反馈弹框详情',
                                        value: __assign({ type: 'dialog' }, value),
                                        onChange: function (value) { return onChange(value); }
                                    });
                                } }, "\u914D\u7F6E\u53CD\u9988\u5F39\u6846\u5185\u5BB9"),
                            value ? (React.createElement(Button, { size: "sm", level: "link", className: "m-l", onClick: function () { return onChange(''); } }, "\u6E05\u7A7A\u8BBE\u7F6E")) : null)) : null;
                    }
                },
                {
                    name: 'feedback.visibleOn',
                    label: '是否弹出表达式',
                    type: 'input-text',
                    visibleOn: 'this.feedback',
                    autoComplete: false,
                    description: '请使用 JS 表达式如：`this.xxx == 1`'
                },
                {
                    name: 'feedback.skipRestOnCancel',
                    label: '弹框取消是否中断后续操作',
                    type: 'switch',
                    mode: 'inline',
                    className: 'block',
                    visibleOn: 'this.feedback'
                },
                {
                    name: 'feedback.skipRestOnConfirm',
                    label: '弹框确认是否中断后续操作',
                    type: 'switch',
                    mode: 'inline',
                    className: 'block',
                    visibleOn: 'this.feedback'
                },
                {
                    type: 'input-text',
                    label: '目标地址',
                    name: 'link',
                    visibleOn: 'data.actionType == "link"'
                },
                {
                    type: 'input-text',
                    label: '目标地址',
                    name: 'url',
                    visibleOn: 'data.actionType == "url"',
                    placeholder: 'http://'
                },
                {
                    type: 'switch',
                    name: 'blank',
                    visibleOn: 'data.actionType == "url"',
                    mode: 'inline',
                    className: 'w-full',
                    label: '是否用新窗口打开',
                    value: true
                },
                isInDialog
                    ? {
                        visibleOn: 'data.actionType == "submit" || data.type == "submit"',
                        name: 'close',
                        type: 'switch',
                        mode: 'inline',
                        className: 'w-full',
                        pipeIn: defaultValue(true),
                        label: '是否关闭当前弹框'
                    }
                    : null,
                {
                    name: 'confirmText',
                    type: 'textarea',
                    label: '确认文案',
                    description: '点击后会弹出此内容，等用户确认后才进行相应的操作。'
                },
                {
                    type: 'input-text',
                    name: 'reload',
                    label: '刷新目标组件',
                    visibleOn: 'data.actionType != "link" && data.actionType != "url"',
                    description: '当前动作完成后，指定目标组件刷新。支持传递数据如：<code>xxx?a=\\${a}&b=\\${b}</code>，多个目标请用英文逗号隔开。'
                },
                {
                    type: 'input-text',
                    name: 'target',
                    visibleOn: 'data.actionType != "reload"',
                    label: '指定响应组件',
                    description: '指定动作执行者，默认为当前组件所在的功能性性组件，如果指定则转交给目标组件来处理。'
                },
                {
                    type: 'js-editor',
                    allowFullscreen: true,
                    name: 'onClick',
                    label: '自定义点击事件',
                    description: '将会传递 event 和 props 两个参数'
                },
                {
                    type: 'input-text',
                    name: 'hotKey',
                    label: '键盘快捷键'
                }
            ];
            return [
                {
                    type: 'container',
                    className: 'p-3',
                    body: schema
                }
            ];
        };
        return _this;
    }
    ActionPlugin.prototype.buildEditorPanel = function (context, panels) {
        // 多选时不处理
        if (context.selections.length) {
            return;
        }
        if (~['action', 'button', 'submit', 'reset', 'sparkline'].indexOf(context.info.renderer.name)) {
            var body = this.panelBodyCreator(context);
            // sparkline 的 action 配置是放 clickAction 参数下的，所以需要加一层
            if (context.info.renderer.name === 'sparkline') {
                body = {
                    name: 'clickAction',
                    type: 'combo',
                    label: '',
                    noBorder: true,
                    multiLine: true,
                    items: body
                };
            }
            // panels.push({
            //   key: 'action',
            //   icon: 'fa fa-gavel',
            //   title: '动作',
            //   render: this.manager.makeSchemaFormRender({
            //     body: body
            //   }),
            //   order: 100
            // });
        }
        else {
            _super.prototype.buildEditorPanel.call(this, context, panels);
        }
    };
    ActionPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var _this = this;
        var id = _a.id, schema = _a.schema, info = _a.info;
        if (~['action', 'button', 'submit', 'reset'].indexOf(info.renderer.name) &&
            schema.actionType === 'dialog') {
            toolbars.push({
                iconSvg: 'dialog',
                tooltip: "\u914D\u7F6E\u5F39\u6846\u5185\u5BB9",
                placement: 'bottom',
                onClick: function () { return _this.editDetail(id); }
            });
        }
    };
    ActionPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        node &&
            value &&
            this.manager.openSubEditor({
                title: '配置弹框内容',
                value: __assign({ type: 'dialog' }, value.dialog),
                onChange: function (newValue) {
                    newValue = __assign(__assign({}, value), { dialog: newValue });
                    manager.panelChangeValue(newValue, diff(value, newValue));
                }
            });
    };
    return ActionPlugin;
}(BasePlugin));
export { ActionPlugin };
registerEditorPlugin(ActionPlugin);
