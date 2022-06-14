import { __assign, __extends } from "tslib";
import React from 'react';
import { Button } from 'amis';
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var InputGroupControlPlugin = /** @class */ (function (_super) {
    __extends(InputGroupControlPlugin, _super);
    function InputGroupControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-group';
        _this.$schema = '/schemas/InputGroupControlSchema.json';
        // 组件名称
        _this.name = '输入组合';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-object-group';
        _this.description = "\u8F93\u5165\u7EC4\u5408\uFF0C\u652F\u6301\u591A\u79CD\u7C7B\u578B\u7684\u63A7\u4EF6\u7EC4\u5408";
        _this.docLink = '/amis/zh-CN/components/form/input-group';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-group',
            name: 'input-group',
            label: 'input 组合',
            body: [
                {
                    type: 'input-text',
                    inputClassName: 'b-r-none p-r-none',
                    name: 'input-group'
                },
                {
                    type: 'submit',
                    label: '提交',
                    level: 'primary'
                }
            ]
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
        _this.panelTitle = 'Input 组合';
        _this.panelBody = [
            [
                {
                    name: 'body',
                    type: 'combo',
                    // label: '子按钮',
                    multiple: true,
                    addable: false,
                    draggable: true,
                    draggableTip: '可排序、可移除、如要编辑请在预览区选中编辑',
                    editable: false,
                    visibleOn: 'this.body && this.body.length',
                    items: [
                        {
                            type: 'tpl',
                            inline: false,
                            className: 'p-t-xs',
                            tpl: '<%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%>'
                        }
                    ]
                },
                {
                    children: (React.createElement(Button, { className: "m-b", 
                        // TODO：需要限制一下 body 的类型，之前是这些 'text', 'url', 'email', 'password', 'select', 'date', 'time', 'date-time', 'date-range', 'formula', 'color', 'city', 'icon', 'plain', 'tpl', 'button', 'submit', 'reset'
                        onClick: function () {
                            // this.manager.showInsertPanel('body')
                            _this.manager.showRendererPanel('表单项'); // '请从左侧组件面板中点击添加表单项'
                        }, level: "danger", tooltip: "\u63D2\u5165\u4E00\u4E2A\u65B0\u7684\u5143\u7D20", size: "sm", block: true }, "\u65B0\u589E\u5143\u7D20"))
                },
                getSchemaTpl('formItemName', {
                    required: true
                })
            ]
        ];
        return _this;
    }
    return InputGroupControlPlugin;
}(BasePlugin));
export { InputGroupControlPlugin };
registerEditorPlugin(InputGroupControlPlugin);
