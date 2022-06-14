import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { VRenderer } from 'amis-editor-core';
import { RegionWrapper as Region } from 'amis-editor-core';
import { JSONChangeInArray, JSONPipeIn, repeatArray } from 'amis-editor-core';
import { Icon } from 'amis-editor-core';
var HBoxPlugin = /** @class */ (function (_super) {
    __extends(HBoxPlugin, _super);
    function HBoxPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'hbox';
        _this.$schema = '/schemas/HBoxSchema.json';
        _this.disabledRendererPlugin = true; // 组件面板不显示
        // 组件名称
        _this.name = 'HBox';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-columns';
        _this.description = '用来实现左右排版布局，默认平均分配，可以通过 columnClassName 配置某列的宽度。';
        _this.docLink = '/amis/zh-CN/components/hbox';
        _this.tags = ['容器'];
        _this.scaffold = {
            type: 'hbox',
            gap: 'base',
            columns: [
                {
                    body: []
                },
                {
                    body: []
                }
            ]
        };
        _this.previewSchema = {
            type: 'hbox',
            columns: [
                {
                    type: 'tpl',
                    tpl: '固定宽度<br />w-xs',
                    columnClassName: 'bg-primary w-xs'
                },
                {
                    type: 'tpl',
                    tpl: '自动填满',
                    columnClassName: 'bg-success'
                }
            ]
        };
        _this.panelTitle = 'HBox';
        _this.panelBodyCreator = function (context) { return [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        getSchemaTpl('fieldSet', {
                            title: '插入',
                            collapsable: false,
                            body: [
                                {
                                    type: 'wrapper',
                                    size: 'none',
                                    className: 'grid grid-cols-2 gap-4 mb-4',
                                    body: [
                                        {
                                            children: (React.createElement(Button, { size: "sm", onClick: function () { return _this.insertRowAfter(context.node); } },
                                                React.createElement(Icon, { className: "icon", icon: "arrow-to-bottom" }),
                                                React.createElement("span", null, "\u4E0B\u65B9\u63D2\u5165\u65B0\u884C")))
                                        },
                                        {
                                            children: (React.createElement(Button, { size: "sm", onClick: function () { return _this.insertRowBefore(context.node); } },
                                                React.createElement(Icon, { className: "icon", icon: "top-arrow-to-top" }),
                                                React.createElement("span", null, "\u4E0A\u65B9\u63D2\u5165\u65B0\u884C")))
                                        }
                                    ]
                                },
                                {
                                    label: '列数',
                                    name: 'columns',
                                    type: 'select',
                                    pipeIn: function (value) {
                                        return Array.isArray(value) ? value.length : undefined;
                                    },
                                    pipeOut: function (value, origin) {
                                        if (Array.isArray(origin)) {
                                            if (origin.length > value) {
                                                origin = origin.concat();
                                                origin.splice(value - 1, origin.length - value);
                                            }
                                            else {
                                                origin = origin.concat(repeatArray({
                                                    body: []
                                                }, value - origin.length));
                                            }
                                        }
                                        return origin;
                                    },
                                    options: repeatArray(null, 12).map(function (_, index) { return ({
                                        label: "".concat(index + 1),
                                        value: index + 1
                                    }); })
                                }
                            ]
                        }),
                        {
                            type: 'list-select',
                            name: 'gap',
                            label: '列间距',
                            size: 'sm',
                            clearable: true,
                            tiled: true,
                            options: [
                                {
                                    label: '极小',
                                    value: 'xs'
                                },
                                {
                                    label: '小',
                                    value: 'sm'
                                },
                                {
                                    label: '正常',
                                    value: 'base'
                                },
                                {
                                    label: '中',
                                    value: 'md'
                                },
                                {
                                    label: '大',
                                    value: 'lg'
                                }
                            ]
                        },
                        {
                            name: 'columns',
                            label: '列集合',
                            type: 'combo',
                            scaffold: {
                                body: []
                            },
                            minLength: 1,
                            multiple: true,
                            // draggable: true,
                            draggableTip: '',
                            items: [
                                {
                                    type: 'tpl',
                                    tpl: '<span class="label label-default">列${index | plus}</span>',
                                    columnClassName: 'no-grow v-middle'
                                },
                                getSchemaTpl('className', {
                                    name: 'columnClassName',
                                    labelRemark: '',
                                    label: ''
                                })
                            ]
                        },
                        getSchemaTpl('fieldSet', {
                            title: '水平对齐',
                            collapsable: false,
                            body: [
                                {
                                    type: 'button-group-select',
                                    name: 'align',
                                    size: 'sm',
                                    label: false,
                                    tiled: true,
                                    pipeIn: defaultValue('left'),
                                    options: [
                                        {
                                            value: 'left',
                                            label: '左对齐'
                                        },
                                        {
                                            value: 'center',
                                            label: '中间对齐'
                                        },
                                        {
                                            value: 'right',
                                            label: '右对齐'
                                        },
                                        {
                                            value: 'between',
                                            label: '两端对齐'
                                        }
                                    ]
                                }
                            ]
                        }),
                        getSchemaTpl('fieldSet', {
                            title: '垂直对齐',
                            collapsable: false,
                            body: [
                                {
                                    type: 'button-group-select',
                                    name: 'valign',
                                    size: 'sm',
                                    label: false,
                                    tiled: true,
                                    pipeIn: defaultValue('top'),
                                    options: [
                                        {
                                            value: 'top',
                                            label: '顶部对齐'
                                        },
                                        {
                                            value: 'middle',
                                            label: '中间对齐'
                                        },
                                        {
                                            value: 'bottom',
                                            label: '底部对齐'
                                        },
                                        {
                                            value: 'between',
                                            label: '两端对齐'
                                        }
                                    ]
                                }
                            ]
                        })
                    ]
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('className'),
                        getSchemaTpl('subFormItemMode'),
                        getSchemaTpl('subFormHorizontalMode'),
                        getSchemaTpl('subFormHorizontal')
                    ]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('visible')]
                }
            ])
        ]; };
        _this.vRendererConfig = {
            regions: {
                body: {
                    key: 'body',
                    label: '内容区',
                    placeholder: '列',
                    wrapperResolve: function (dom) { return dom; }
                }
            },
            panelTitle: '列',
            panelBodyCreator: function (context) {
                return [
                    getSchemaTpl('tabs', [
                        {
                            title: '常规',
                            body: [
                                getSchemaTpl('fieldSet', {
                                    title: '插入',
                                    collapsable: false,
                                    body: [
                                        {
                                            type: 'wrapper',
                                            size: 'none',
                                            className: 'grid grid-cols-2 gap-4',
                                            body: [
                                                {
                                                    children: (React.createElement(Button, { size: "sm", onClick: function () {
                                                            return _this.insertRowAfter(context.node.host);
                                                        } },
                                                        React.createElement(Icon, { className: "icon", icon: "arrow-to-bottom" }),
                                                        React.createElement("span", null, "\u4E0B\u65B9\u63D2\u5165\u65B0\u884C")))
                                                },
                                                {
                                                    children: (React.createElement(Button, { size: "sm", onClick: function () {
                                                            return _this.insertRowBefore(context.node.host);
                                                        } },
                                                        React.createElement(Icon, { className: "icon", icon: "top-arrow-to-top" }),
                                                        React.createElement("span", null, "\u4E0A\u65B9\u63D2\u5165\u65B0\u884C")))
                                                },
                                                {
                                                    children: (React.createElement(Button, { size: "sm", onClick: function () { return _this.insertColumnBefore(context); } },
                                                        React.createElement(Icon, { className: "icon", icon: "left-arrow-to-left" }),
                                                        React.createElement("span", null, "\u5DE6\u4FA7\u63D2\u5165\u65B0\u5217")))
                                                },
                                                {
                                                    children: (React.createElement(Button, { size: "sm", onClick: function () { return _this.insertColumnAfter(context); } },
                                                        React.createElement(Icon, { className: "icon", icon: "arrow-to-right" }),
                                                        React.createElement("span", null, "\u53F3\u4FA7\u63D2\u5165\u65B0\u5217")))
                                                }
                                            ]
                                        }
                                    ]
                                }),
                                getSchemaTpl('fieldSet', {
                                    title: '宽度设置',
                                    collapsable: false,
                                    body: [
                                        {
                                            type: 'button-group-select',
                                            name: 'width',
                                            size: 'sm',
                                            label: false,
                                            pipeIn: function (value) {
                                                return value && value !== 'auto' ? 'manual' : value || '';
                                            },
                                            pipeOut: function (value) {
                                                return value === 'manual' ? '20%' : value;
                                            },
                                            options: [
                                                {
                                                    value: '',
                                                    label: '适配宽度'
                                                },
                                                {
                                                    value: 'auto',
                                                    label: '适配内容'
                                                },
                                                {
                                                    value: 'manual',
                                                    label: '手动'
                                                }
                                            ],
                                            description: '<% if (this.width && this.width !== "auto") {%>请按住高亮框右侧方块拖动调整宽度<%}%>'
                                        }
                                    ]
                                }),
                                getSchemaTpl('fieldSet', {
                                    title: '垂直对齐',
                                    collapsable: false,
                                    body: [
                                        {
                                            type: 'button-group-select',
                                            name: 'valign',
                                            size: 'sm',
                                            label: false,
                                            tiled: true,
                                            clearable: true,
                                            options: [
                                                {
                                                    value: 'top',
                                                    label: '顶部对齐'
                                                },
                                                {
                                                    value: 'middle',
                                                    label: '中间对齐'
                                                },
                                                {
                                                    value: 'bottom',
                                                    label: '底部对齐'
                                                },
                                                {
                                                    value: 'between',
                                                    label: '两端对齐'
                                                }
                                            ]
                                        }
                                    ]
                                })
                            ]
                        },
                        {
                            title: '外观',
                            body: [
                                getSchemaTpl('className', {
                                    name: 'columnClassName',
                                    label: '列 CSS 类名',
                                    description: '可以添加宽度类样式调整宽度，默认宽度为平均分配。'
                                })
                            ]
                        }
                    ])
                ];
            }
        };
        _this.vWrapperResolve = function (dom) { return dom; };
        _this.overrides = {
            renderColumn: function (node, index) {
                var _a, _b;
                var dom = this.super(node, index);
                var info = this.props.$$editor;
                if (info && node.$$id) {
                    var plugin = info.plugin;
                    var region = (_b = (_a = plugin.vRendererConfig) === null || _a === void 0 ? void 0 : _a.regions) === null || _b === void 0 ? void 0 : _b.body;
                    if (!region) {
                        return dom;
                    }
                    return (React.createElement(VRenderer, { key: node.$$id, type: info.type, plugin: info.plugin, renderer: info.renderer, "$schema": "" // /schemas/GridColumn.json
                        , hostId: info.id, memberIndex: index, name: "\u7B2C".concat(index + 1, "\u5217"), id: node.$$id, draggable: false, schemaPath: "".concat(info.schemaPath, "/hbox/").concat(index), wrapperResolve: plugin.vWrapperResolve, path: "".concat(this.props.$path, "/").concat(index), data: this.props.data, widthMutable: true }, region ? (React.createElement(Region, { key: region.key, preferTag: region.preferTag, name: region.key, label: region.label, regionConfig: region, placeholder: region.placeholder, editorStore: plugin.manager.store, manager: plugin.manager, children: dom, wrapperResolve: region.wrapperResolve, rendererName: info.renderer.name })) : (dom)));
                }
                return dom;
            }
        };
        return _this;
    }
    // buildEditorPanel(context: BaseEventContext, panels: Array<BasicPanelItem>) {
    //   super.buildEditorPanel(context, panels);
    //   const parent = context.node.parent?.host as EditorNodeType;
    //   if (
    //     parent?.info?.plugin === this &&
    //     (this.vRendererConfig.panelControls ||
    //       this.vRendererConfig.panelControlsCreator)
    //   ) {
    //     panels.push({
    //       key: 'grid',
    //       order: 100,
    //       icon: this.vRendererConfig.panelIcon || 'fa fa-tablet',
    //       title: this.vRendererConfig.panelTitle || '格子',
    //       render: this.manager.makeSchemaFormRender({
    //         body: this.vRendererConfig.panelControlsCreator
    //           ? this.vRendererConfig.panelControlsCreator(context)
    //           : this.vRendererConfig.panelControls!
    //       })
    //     });
    //   }
    // }
    HBoxPlugin.prototype.afterResolveJsonSchema = function (event) {
        var _a, _b;
        var context = event.context;
        var parent = (_a = context.node.parent) === null || _a === void 0 ? void 0 : _a.host;
        if (((_b = parent === null || parent === void 0 ? void 0 : parent.info) === null || _b === void 0 ? void 0 : _b.plugin) === this) {
            event.setData('/schemas/HBoxColumn.json');
        }
    };
    HBoxPlugin.prototype.buildEditorContextMenu = function (context, menus) {
        var _this = this;
        var _a;
        if (context.selections.length || ((_a = context.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        if (context.node.isVitualRenderer) {
            menus.push('|');
            menus.push({
                label: '左侧插入一列',
                onSelect: function () { return _this.insertColumnBefore(context); }
            });
            menus.push({
                label: '右侧插入一列',
                onSelect: function () { return _this.insertColumnAfter(context); }
            });
            menus.push('|');
            menus.push({
                label: '上方插入一行',
                onSelect: function () { return _this.insertRowBefore(context.node.host); }
            });
            menus.push({
                label: '下方插入一行',
                onSelect: function () { return _this.insertRowAfter(context.node.host); }
            });
        }
        else {
            menus.push('|');
            menus.push({
                label: '上方插入一行',
                onSelect: function () { return _this.insertRowBefore(context.node); }
            });
            menus.push({
                label: '下方插入一行',
                onSelect: function () { return _this.insertRowAfter(context.node); }
            });
        }
    };
    HBoxPlugin.prototype.onWidthChangeStart = function (event) {
        var _a, _b;
        var context = event.context;
        var node = context.node;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var host = node.host;
        if (!host || ((_b = host.info) === null || _b === void 0 ? void 0 : _b.plugin) !== this) {
            return;
        }
        var dom = context.dom;
        var parent = dom.parentElement;
        if (!parent) {
            return;
        }
        var resizer = context.resizer;
        var frameRect = parent.getBoundingClientRect();
        var columns = host.schema.columns;
        var index = node.index;
        var finalWidth = columns[index].width;
        var rect = dom.getBoundingClientRect();
        event.setData({
            onMove: function (e) {
                var width = e.pageX - rect.left;
                var percent = (finalWidth = "".concat(Math.max(1, Math.min(99, Math.round((100 * width) / frameRect.width))), "%"));
                columns = columns.concat();
                columns[index] = __assign(__assign({}, columns[index]), { width: percent });
                resizer.setAttribute('data-value', percent);
                host.updateState({
                    columns: columns
                });
                requestAnimationFrame(function () {
                    node.calculateHighlightBox();
                });
            },
            onEnd: function () {
                host.updateState({}, true);
                resizer.removeAttribute('data-value');
                node.updateSchema({
                    width: finalWidth
                });
                requestAnimationFrame(function () {
                    node.calculateHighlightBox();
                });
            }
        });
    };
    HBoxPlugin.prototype.insertRowAfter = function (node) {
        var _a;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var schema = store.schema;
        var id = node.id;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index + 1, 0, JSONPipeIn({
                type: 'hbox',
                align: node.align,
                valign: node.valign,
                columns: node.columns.map(function (column) { return ({
                    body: [],
                    width: column === null || column === void 0 ? void 0 : column.width
                }); })
            }));
        }));
    };
    HBoxPlugin.prototype.insertRowBefore = function (node) {
        var _a;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var id = node.id;
        var schema = store.schema;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index, 0, JSONPipeIn({
                type: 'hbox',
                align: node.align,
                valign: node.valign,
                columns: node.columns.map(function (column) { return ({
                    body: [],
                    width: column === null || column === void 0 ? void 0 : column.width
                }); })
            }));
        }));
    };
    HBoxPlugin.prototype.insertColumnBefore = function (context) {
        var _a;
        var node = context.node;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var schema = store.schema;
        var id = context.id;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index, 0, JSONPipeIn({
                body: []
            }));
        }));
    };
    HBoxPlugin.prototype.insertColumnAfter = function (context) {
        var _a;
        var node = context.node;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var id = context.id;
        var store = this.manager.store;
        var schema = store.schema;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index + 1, 0, JSONPipeIn({
                body: []
            }));
        }));
    };
    return HBoxPlugin;
}(BasePlugin));
export { HBoxPlugin };
registerEditorPlugin(HBoxPlugin);
