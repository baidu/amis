import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var FieldSetControlPlugin = /** @class */ (function (_super) {
    __extends(FieldSetControlPlugin, _super);
    function FieldSetControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'fieldset';
        _this.$schema = '/schemas/FieldSetControlSchema.json';
        _this.disabledRendererPlugin = true; // 组件面板不显示
        // 组件名称
        _this.name = '字段集';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-toggle-down';
        _this.description = "\u591A\u4E2A\u8868\u5355\u9879\u7684\u7EC4\u5408\uFF0C\u53EF\u914D\u7F6E\u662F\u5426\u6298\u53E0";
        _this.docLink = '/amis/zh-CN/components/form/fieldset';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'fieldset',
            title: '标题',
            collapsable: true,
            body: [
                {
                    type: 'input-text',
                    label: '文本1',
                    name: 'text'
                },
                {
                    type: 'input-text',
                    label: '文本2',
                    name: 'text'
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
        _this.regions = [
            {
                key: 'body',
                label: '子表单项',
                renderMethod: 'renderBody',
                insertPosition: 'inner',
                preferTag: '表单项'
            }
        ];
        _this.panelTitle = '字段集';
        _this.panelBodyCreator = function (context) {
            return [
                {
                    label: '标题',
                    name: 'title',
                    type: 'input-text'
                    // required: true
                },
                getSchemaTpl('switch', {
                    name: 'collapsable',
                    label: '是否可折叠',
                    pipeIn: defaultValue(false)
                }),
                getSchemaTpl('switch', {
                    name: 'collapsed',
                    label: '默认是否折叠',
                    visibleOn: 'this.collapsable'
                }),
                {
                    name: 'className',
                    type: 'button-group-select',
                    clearable: true,
                    size: 'sm',
                    label: '控件样式',
                    className: 'w-full',
                    pipeIn: defaultValue(''),
                    options: [
                        {
                            label: '默认',
                            value: ''
                        },
                        {
                            value: 'Collapse--xs',
                            label: '极小'
                        },
                        {
                            value: 'Collapse--sm',
                            label: '小'
                        },
                        {
                            value: 'Collapse--base',
                            label: '正常'
                        },
                        {
                            value: 'Collapse--md',
                            label: '大'
                        },
                        {
                            value: 'Collapse--lg',
                            label: '超大'
                        }
                    ]
                },
                getSchemaTpl('className', {
                    name: 'headingClassName',
                    label: '标题 CSS 类名'
                }),
                getSchemaTpl('className', {
                    name: 'bodyClassName',
                    label: '内容区域 CSS 类名'
                }),
                {
                    children: (React.createElement(Button, { level: "info", size: "sm", className: "m-b-sm", block: true, onClick: function () {
                            // this.manager.showInsertPanel('body', context.id);
                            _this.manager.showRendererPanel('表单项', '请从左侧组件面板中点击添加子表单项');
                        } }, "\u6DFB\u52A0\u5B50\u8868\u5355\u9879"))
                },
                getSchemaTpl('subFormItemMode'),
                getSchemaTpl('subFormHorizontalMode'),
                getSchemaTpl('subFormHorizontal')
            ];
        };
        return _this;
    }
    FieldSetControlPlugin.prototype.filterProps = function (props) {
        props.collapsed = false;
        return props;
    };
    return FieldSetControlPlugin;
}(BasePlugin));
export { FieldSetControlPlugin };
registerEditorPlugin(FieldSetControlPlugin);
