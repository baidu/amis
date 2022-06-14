import { __assign, __extends, __rest } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { diff, JSONPipeOut } from 'amis-editor-core';
var SubFormControlPlugin = /** @class */ (function (_super) {
    __extends(SubFormControlPlugin, _super);
    function SubFormControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-sub-form';
        _this.$schema = '/schemas/SubFormControlSchema.json';
        // 组件名称
        _this.name = '子表单项';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-window-restore';
        _this.description = "SubForm, \u914D\u7F6E\u4E00\u4E2A\u5B50<code>form</code>\u4F5C\u4E3A\u5F53\u524D\u7684\u8868\u5355\u9879";
        _this.docLink = '/amis/zh-CN/components/form/input-sub-form';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-sub-form',
            name: 'subform',
            label: '子表单',
            form: {
                title: '标题',
                body: [
                    {
                        type: 'input-text',
                        label: '文本',
                        name: 'text'
                    }
                ]
            }
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
        _this.panelTitle = '子表单项';
        _this.panelBodyCreator = function (context) {
            return [
                {
                    children: function (_a) {
                        var value = _a.value, onChange = _a.onChange;
                        return (React.createElement(Button, { size: "sm", level: "danger", className: "m-b", block: true, onClick: _this.editDetail.bind(_this, context.id) }, "\u914D\u7F6E\u6210\u5458\u6E32\u67D3\u5668"));
                    }
                },
                {
                    name: 'labelField',
                    type: 'input-text',
                    value: 'label',
                    label: '名称字段名',
                    description: '当值中存在这个字段，则按钮名称将使用此字段的值来展示。'
                },
                {
                    name: 'btnLabel',
                    label: '按钮标签名',
                    value: '设置',
                    type: 'input-text'
                },
                {
                    name: 'minLength',
                    visibleOn: 'data.multiple',
                    label: '允许最少个数',
                    type: 'input-number'
                },
                {
                    name: 'maxLength',
                    visibleOn: 'data.multiple',
                    label: '允许最多个数',
                    type: 'input-number'
                }
            ];
        };
        return _this;
    }
    SubFormControlPlugin.prototype.filterProps = function (props) {
        props = JSONPipeOut(props);
        // 至少显示一个成员，否则啥都不显示。
        if (!props.value) {
            props.value = [''];
        }
        return props;
    };
    SubFormControlPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var id = _a.id, info = _a.info;
        if (info.renderer.name === 'input-sub-form') {
            toolbars.push({
                icon: 'fa fa-expand',
                order: 100,
                tooltip: '配置成员渲染器',
                onClick: this.editDetail.bind(this, id)
            });
        }
    };
    SubFormControlPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var id = _a.id, schema = _a.schema, region = _a.region, info = _a.info;
        if (info.renderer.name === 'input-sub-form') {
            menus.push('|', {
                label: '配置成员渲染器',
                onSelect: this.editDetail.bind(this, id)
            });
        }
    };
    SubFormControlPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        if (!node || !value) {
            return;
        }
        var _a = value.form, title = _a.title, actions = _a.actions, name = _a.name, size = _a.size, closeOnEsc = _a.closeOnEsc, showCloseButton = _a.showCloseButton, bodyClassName = _a.bodyClassName, type = _a.type, rest = __rest(_a, ["title", "actions", "name", "size", "closeOnEsc", "showCloseButton", "bodyClassName", "type"]);
        var schema = {
            title: title,
            actions: actions,
            name: name,
            size: size,
            closeOnEsc: closeOnEsc,
            showCloseButton: showCloseButton,
            bodyClassName: bodyClassName,
            type: 'dialog',
            body: __assign({ type: 'form' }, rest)
        };
        this.manager.openSubEditor({
            title: '配置子表单项',
            value: schema,
            memberImmutable: ['body'],
            onChange: function (newValue) {
                var form = newValue.body[0];
                newValue = __assign(__assign({}, value), { form: form });
                // delete newValue.form.body;
                delete newValue.form.type;
                manager.panelChangeValue(newValue, diff(value, newValue));
            }
        });
    };
    return SubFormControlPlugin;
}(BasePlugin));
export { SubFormControlPlugin };
registerEditorPlugin(SubFormControlPlugin);
