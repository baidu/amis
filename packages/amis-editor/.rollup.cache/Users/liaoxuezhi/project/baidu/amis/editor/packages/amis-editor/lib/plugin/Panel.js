import { __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
var PanelPlugin = /** @class */ (function (_super) {
    __extends(PanelPlugin, _super);
    function PanelPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'panel';
        _this.$schema = '/schemas/panelSchema.json';
        _this.name = '面板';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-window-maximize';
        _this.description = '展示一个面板，可以配置标题，内容区。';
        _this.docLink = '/amis/zh-CN/components/panel';
        _this.tags = '容器';
        _this.scaffold = {
            type: 'panel',
            title: '标题',
            body: '内容'
        };
        _this.previewSchema = {
            type: 'panel',
            title: '这是一个面板',
            body: '这是内容区',
            className: 'Panel--default text-left m-b-none',
            actions: [
                {
                    label: '按钮1',
                    type: 'button'
                },
                {
                    label: '按钮2',
                    type: 'button'
                }
            ]
        };
        _this.regions = [
            {
                key: 'body',
                label: '内容区',
                // 复写渲染器里面的 renderBody 方法
                renderMethod: 'renderBody',
                // 这个 case 很另类，要自己写。form 里面直接复用了 Panel 来输出内容。
                // 这种 case 应该跳过包裹 Region
                // 只有他自己输出时才包裹，form 调用进来是下发了 children 来完成渲染
                // 自己的话是其他方式。
                renderMethodOverride: function (regions, insertRegion) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var info = this.props.$$editor;
                        var dom = this.super.apply(this, args);
                        if (info && !this.props.children) {
                            return insertRegion(this, dom, regions, info, info.plugin.manager);
                        }
                        return dom;
                    };
                }
            },
            {
                key: 'actions',
                label: '按钮组',
                renderMethod: 'renderActions',
                preferTag: '按钮'
            }
        ];
        _this.panelTitle = '面板';
        _this.panelBodyCreator = function (context) {
            var isForm = /(?:^|\/)form$/.test(context.path);
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                label: '标题',
                                name: 'title',
                                type: 'input-text'
                            },
                            isForm
                                ? null
                                : {
                                    children: (React.createElement(Button, { size: "sm", level: "info", className: "m-b", onClick: function () {
                                            // this.manager.showInsertPanel('body')
                                            _this.manager.showRendererPanel('');
                                        }, block: true }, "\u5185\u5BB9\u533A\u65B0\u589E\u5185\u5BB9"))
                                }
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            getSchemaTpl('switch', {
                                name: 'affixFooter',
                                label: '固定底部',
                                value: false
                            }),
                            getSchemaTpl('horizontal', {
                                visibleOn: '(data.mode || data.$$formMode) == "horizontal" && data.$$mode == "form"'
                            }),
                            {
                                name: isForm ? 'panelClassName' : 'className',
                                label: '样式',
                                type: 'button-group-select',
                                size: 'sm',
                                pipeIn: function (value) {
                                    return typeof value === 'string' &&
                                        /(?:^|\s)(Panel\-\-(\w+))(?:$|\s)/.test(value)
                                        ? RegExp.$1
                                        : '';
                                },
                                pipeOut: function (value, origin) {
                                    return origin
                                        ? "".concat(origin.replace(/(?:^|\s)(Panel\-\-(\w+))(?=($|\s))/g, ''), " ").concat(value)
                                            .replace(/\s+/g, ' ')
                                            .trim()
                                        : value;
                                },
                                options: [
                                    {
                                        label: '默认',
                                        value: 'Panel--default'
                                    },
                                    {
                                        label: '主色',
                                        value: 'Panel--primary'
                                    },
                                    {
                                        label: '提示',
                                        value: 'Panel--info'
                                    },
                                    {
                                        label: '成功',
                                        value: 'Panel--success'
                                    },
                                    {
                                        label: '警告',
                                        value: 'Panel--warning'
                                    },
                                    {
                                        label: '危险',
                                        value: 'Panel--danger'
                                    }
                                ]
                            },
                            getSchemaTpl('className', {
                                name: isForm ? 'panelClassName' : 'className',
                                pipeIn: defaultValue('Panel--default')
                            }),
                            getSchemaTpl('className', {
                                name: 'headerClassName',
                                label: '头部区域 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'bodyClassName',
                                label: '内容区域 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'footerClassName',
                                label: '底部区域 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'actionsClassName',
                                label: '按钮外层 CSS 类名'
                            }),
                            getSchemaTpl('subFormItemMode'),
                            getSchemaTpl('subFormHorizontalMode'),
                            getSchemaTpl('subFormHorizontal')
                        ]
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
    PanelPlugin.prototype.buildEditorPanel = function (context, panels) {
        var path = context.path;
        var schema = context.schema;
        if (context.info.renderer.name === 'form' &&
            schema.wrapWithPanel !== false &&
            !context.selections.length) {
            panels.push({
                key: 'panel',
                icon: 'fa fa-list-alt',
                title: this.panelTitle,
                render: this.manager.makeSchemaFormRender({
                    body: this.panelBodyCreator(context)
                })
            });
        }
        else {
            _super.prototype.buildEditorPanel.call(this, context, panels);
        }
    };
    return PanelPlugin;
}(BasePlugin));
export { PanelPlugin };
registerEditorPlugin(PanelPlugin);
