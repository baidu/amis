import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { VRenderer } from 'amis-editor-core';
import { RegionWrapper as Region } from 'amis-editor-core';
import { Icon } from 'amis-editor-core';
import { JSONChangeInArray, JSONPipeIn, repeatArray } from 'amis-editor-core';
var GridPlugin = /** @class */ (function (_super) {
    __extends(GridPlugin, _super);
    function GridPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'grid';
        _this.$schema = '/schemas/GridSchema.json';
        // 组件名称
        _this.name = '分栏';
        _this.isBaseComponent = true;
        _this.description = '分栏布局';
        _this.docLink = '/amis/zh-CN/components/grid';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-th';
        /*
        scaffolds = [
          {
            name: '两栏',
            description: '两栏布局',
            scaffold: {
              type: 'grid',
              columns: [
                {
                  body: []
                },
                {
                  body: []
                }
              ]
            },
      
            previewSchema: {
              type: 'grid',
              columns: [
                {
                  body: [
                    {
                      type: 'tpl',
                      tpl: '栏',
                      inline: false,
                      className: 'bg-light wrapper'
                    }
                  ]
                },
                {
                  body: [
                    {
                      type: 'tpl',
                      tpl: '栏',
                      className: 'bg-light wrapper',
                      inline: false
                    }
                  ]
                }
              ]
            }
          },
      
          {
            name: '三栏',
            description: '三栏布局',
            scaffold: {
              type: 'grid',
              columns: [
                {
                  body: []
                },
                {
                  body: []
                },
                {
                  body: []
                }
              ]
            },
      
            previewSchema: {
              type: 'grid',
              columns: [
                {
                  body: [
                    {
                      type: 'tpl',
                      tpl: '栏',
                      inline: false,
                      className: 'bg-light wrapper'
                    }
                  ]
                },
                {
                  body: [
                    {
                      type: 'tpl',
                      tpl: '栏',
                      className: 'bg-light wrapper',
                      inline: false
                    }
                  ]
                },
                {
                  body: [
                    {
                      type: 'tpl',
                      tpl: '栏',
                      className: 'bg-light wrapper',
                      inline: false
                    }
                  ]
                }
              ]
            }
          }
        ];
        */
        // 仅保留一个分栏布局
        _this.scaffold = {
            type: 'grid',
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
            type: 'grid',
            columns: [
                {
                    body: [
                        {
                            type: 'tpl',
                            tpl: '栏',
                            inline: false,
                            className: 'bg-light wrapper'
                        }
                    ]
                },
                {
                    body: [
                        {
                            type: 'tpl',
                            tpl: '栏',
                            className: 'bg-light wrapper',
                            inline: false
                        }
                    ]
                }
            ]
        };
        _this.panelTitle = '分栏布局';
        _this.panelWithOutOthers = false;
        _this.vRendererConfig = {
            regions: {
                body: {
                    key: 'body',
                    label: '内容区',
                    placeholder: '栏',
                    wrapperResolve: function (dom) { return dom; }
                }
            },
            panelTitle: '栏',
            panelBodyCreator: function (context) {
                var host = context.node.host;
                return [
                    getSchemaTpl('tabs', [
                        {
                            title: '属性',
                            className: 'p-none',
                            body: [
                                getSchemaTpl('collapseGroup', [
                                    {
                                        title: '插入',
                                        body: [
                                            {
                                                type: 'wrapper',
                                                size: 'none',
                                                className: 'grid grid-cols-2 gap-4',
                                                body: [
                                                    host.isSecondFactor
                                                        ? null
                                                        : {
                                                            children: (React.createElement(Button, { size: "sm", onClick: function () {
                                                                    return _this.insertRowAfter(context.node.host);
                                                                } },
                                                                React.createElement(Icon, { className: "icon", icon: "arrow-to-bottom" }),
                                                                React.createElement("span", null, "\u4E0B\u65B9\u63D2\u5165\u65B0\u884C")))
                                                        },
                                                    host.isSecondFactor
                                                        ? null
                                                        : {
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
                                                ].filter(function (item) { return item; })
                                            }
                                        ]
                                    },
                                    {
                                        title: '宽度',
                                        body: [
                                            {
                                                type: 'button-group-select',
                                                name: 'md',
                                                size: 'sm',
                                                label: false,
                                                pipeIn: function (value) {
                                                    return typeof value === 'number' ? 'manual' : value || '';
                                                },
                                                pipeOut: function (value) { return (value === 'manual' ? 1 : value); },
                                                tiled: true,
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
                                                ]
                                            },
                                            {
                                                visibleOn: 'typeof this.md === "number"',
                                                label: '宽度占比',
                                                type: 'input-range',
                                                name: 'md',
                                                min: 1,
                                                max: 12,
                                                step: 1
                                            }
                                        ]
                                    },
                                    {
                                        title: '布局',
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
                                    }
                                ])
                            ]
                        },
                        {
                            title: '外观',
                            body: [
                                _this.panelWithOutOthers
                                    ? null
                                    : getSchemaTpl('className', {
                                        label: '栏 CSS 类名',
                                        name: 'columnClassName'
                                    })
                            ]
                        }
                    ])
                ];
            }
        };
        _this.vWrapperResolve = function (dom) { return dom; };
        _this.overrides = {
            renderColumn: function (node, index, length) {
                var _a, _b;
                var dom = this.super(node, index, length);
                var info = this.props.$$editor;
                if (info && node.$$id) {
                    var plugin = info.plugin;
                    var region = (_b = (_a = plugin.vRendererConfig) === null || _a === void 0 ? void 0 : _a.regions) === null || _b === void 0 ? void 0 : _b.body;
                    if (!region) {
                        return dom;
                    }
                    return (React.createElement(VRenderer, { key: "".concat(node.$$id, "-").concat(index), type: info.type, plugin: info.plugin, renderer: info.renderer, "$schema": "/schemas/GridColumn.json", hostId: info.id, memberIndex: index, name: "\u7B2C".concat(index + 1, "\u680F"), id: node.$$id, draggable: false, schemaPath: "".concat(info.schemaPath, "/grid/").concat(index), wrapperResolve: plugin.vWrapperResolve, path: "".concat(this.props.$path, "/").concat(index), data: this.props.data, widthMutable: true }, region ? (React.createElement(Region, { key: region.key, preferTag: region.preferTag, name: region.key, label: region.label, regionConfig: region, placeholder: region.placeholder, editorStore: plugin.manager.store, manager: plugin.manager, children: dom, wrapperResolve: region.wrapperResolve, rendererName: info.renderer.name })) : (dom)));
                }
                return dom;
            }
        };
        return _this;
    }
    GridPlugin.prototype.panelBodyCreator = function (context) {
        var _this = this;
        var asSecondFactor = context.secondFactor;
        return [
            getSchemaTpl('tabs', [
                {
                    title: '属性',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '插入',
                                body: [
                                    asSecondFactor
                                        ? null
                                        : {
                                            type: 'wrapper',
                                            size: 'none',
                                            className: 'grid grid-cols-2 gap-4 mb-4',
                                            body: [
                                                {
                                                    children: (React.createElement(Button, { size: "sm", onClick: function () {
                                                            return _this.insertRowAfter(context.node);
                                                        } },
                                                        React.createElement(Icon, { className: "icon", icon: "arrow-to-bottom" }),
                                                        React.createElement("span", null, "\u4E0B\u65B9\u63D2\u5165\u65B0\u884C")))
                                                },
                                                {
                                                    children: (React.createElement(Button, { size: "sm", onClick: function () {
                                                            return _this.insertRowBefore(context.node);
                                                        } },
                                                        React.createElement(Icon, { className: "icon", icon: "top-arrow-to-top" }),
                                                        React.createElement("span", null, "\u4E0A\u65B9\u63D2\u5165\u65B0\u884C")))
                                                }
                                            ]
                                        }
                                ].filter(function (item) { return item; })
                            },
                            {
                                title: '布局',
                                body: [
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
                                    },
                                    {
                                        type: 'button-group-select',
                                        name: 'gap',
                                        label: '列间距',
                                        size: 'sm',
                                        clearable: true,
                                        tiled: true,
                                        options: [
                                            {
                                                label: '无',
                                                value: 'none'
                                            },
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
                                        type: 'button-group-select',
                                        name: 'align',
                                        size: 'sm',
                                        label: '水平对齐',
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
                                    },
                                    {
                                        type: 'button-group-select',
                                        name: 'valign',
                                        size: 'sm',
                                        label: '垂直对齐',
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
                            }
                        ])
                    ]
                },
                this.panelWithOutOthers
                    ? null
                    : {
                        title: '外观',
                        body: [
                            getSchemaTpl('className'),
                            getSchemaTpl('subFormItemMode'),
                            getSchemaTpl('subFormHorizontalMode'),
                            getSchemaTpl('subFormHorizontal')
                        ]
                    }
            ])
        ];
    };
    GridPlugin.prototype.afterResolveJsonSchema = function (event) {
        var _a, _b;
        var context = event.context;
        var parent = (_a = context.node.parent) === null || _a === void 0 ? void 0 : _a.host;
        if (((_b = parent === null || parent === void 0 ? void 0 : parent.info) === null || _b === void 0 ? void 0 : _b.plugin) === this) {
            event.setData('/schemas/GridColumn.json');
        }
    };
    GridPlugin.prototype.buildEditorContextMenu = function (context, menus) {
        var _this = this;
        var _a;
        if (context.selections.length || ((_a = context.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        if (context.node.isVitualRenderer) {
            menus.push('|');
            menus.push({
                label: '左侧插入一栏',
                onSelect: function () { return _this.insertColumnBefore(context); }
            });
            menus.push({
                label: '右侧插入一栏',
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
    GridPlugin.prototype.onWidthChangeStart = function (event) {
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
        var finalMd = columns[index].md;
        var rect = dom.getBoundingClientRect();
        event.setData({
            onMove: function (e) {
                var width = e.pageX - rect.left;
                var md = (finalMd = Math.max(1, Math.min(12, Math.round((12 * width) / frameRect.width))));
                columns = columns.concat();
                columns[index] = __assign(__assign({}, columns[index]), { md: md });
                resizer.setAttribute('data-value', "".concat(md));
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
                    md: finalMd
                });
                requestAnimationFrame(function () {
                    node.calculateHighlightBox();
                });
            }
        });
    };
    GridPlugin.prototype.insertRowAfter = function (node) {
        var _this = this;
        var _a;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var schema = store.schema;
        var id = node.id;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index + 1, 0, JSONPipeIn({
                type: _this.rendererName || 'grid',
                align: node.align,
                valign: node.valign,
                columns: node.columns.map(function (column) { return ({
                    body: [],
                    md: column === null || column === void 0 ? void 0 : column.md
                }); })
            }));
        }));
    };
    GridPlugin.prototype.insertRowBefore = function (node) {
        var _this = this;
        var _a;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var schema = store.schema;
        var id = node.id;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index, 0, JSONPipeIn({
                type: _this.rendererName || 'grid',
                align: node.align,
                valign: node.valign,
                columns: node.columns.map(function (column) { return ({
                    body: [],
                    md: column === null || column === void 0 ? void 0 : column.md
                }); })
            }));
        }));
    };
    GridPlugin.prototype.insertColumnBefore = function (context) {
        var _a;
        var node = context.node;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var id = context.id;
        var schema = store.schema;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index, 0, JSONPipeIn({
                body: []
            }));
        }));
    };
    GridPlugin.prototype.insertColumnAfter = function (context) {
        var _a;
        var node = context.node;
        if (((_a = node.info) === null || _a === void 0 ? void 0 : _a.plugin) !== this) {
            return;
        }
        var store = this.manager.store;
        var schema = store.schema;
        var id = context.id;
        store.traceableSetSchema(JSONChangeInArray(schema, id, function (arr, node, index) {
            arr.splice(index + 1, 0, JSONPipeIn({
                body: []
            }));
        }));
    };
    return GridPlugin;
}(BasePlugin));
export { GridPlugin };
registerEditorPlugin(GridPlugin);
