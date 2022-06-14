import { __assign, __extends } from "tslib";
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { mapReactElement } from 'amis-editor-core';
import { VRenderer } from 'amis-editor-core';
import findIndex from 'lodash/findIndex';
import { RegionWrapper as Region } from 'amis-editor-core';
import { Tab } from 'amis';
import { tipedLabel } from '../component/BaseControl';
import { getEventControlConfig } from '../util';
import { getComboWrapper } from '../event-action/schema';
var TabsPlugin = /** @class */ (function (_super) {
    __extends(TabsPlugin, _super);
    function TabsPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'tabs';
        _this.$schema = '/schemas/TabsSchema.json';
        // 组件名称
        _this.name = '选项卡';
        _this.isBaseComponent = true;
        _this.description = '选项卡，可以将内容分组用选项卡的形式展示，降低用户使用成本。';
        _this.docLink = '/amis/zh-CN/components/tabs';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-folder-o';
        _this.scaffold = {
            type: 'tabs',
            tabs: [
                {
                    title: '选项卡1',
                    body: '内容1'
                },
                {
                    title: '选项卡2',
                    body: '内容2'
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.notRenderFormZone = true;
        _this.regions = [
            {
                key: 'toolbar',
                label: '工具栏',
                preferTag: '展示'
            }
        ];
        _this.panelTitle = '选项卡';
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '选项卡切换',
                description: '选项卡切换',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'string',
                                title: '选项卡索引'
                            }
                        }
                    }
                ]
            }
        ];
        _this.actions = [
            {
                actionType: 'changeActiveKey',
                actionLabel: '修改激活tab值',
                description: '修改当前激活tab项的key',
                config: ['activeKey'],
                desc: function (info) {
                    var _a;
                    return (React.createElement("div", null,
                        React.createElement("span", { className: "variable-right" }, info === null || info === void 0 ? void 0 : info.__rendererLabel),
                        "\u6FC0\u6D3B\u7B2C",
                        React.createElement("span", { className: "variable-left variable-right" }, (_a = info === null || info === void 0 ? void 0 : info.args) === null || _a === void 0 ? void 0 : _a.activeKey),
                        "\u9879"));
                },
                schema: getComboWrapper({
                    type: 'input-formula',
                    variables: '${variables}',
                    evalMode: false,
                    variableMode: 'tabs',
                    label: '激活项',
                    size: 'lg',
                    name: 'activeKey',
                    mode: 'horizontal'
                })
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            var isNewTabMode = 'data.tabsMode !=="vertical" && data.tabsMode !=="sidebar" && data.tabsMode !=="chrome"';
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                getSchemaTpl('combo-container', {
                                    type: 'combo',
                                    label: '选项卡',
                                    mode: 'normal',
                                    name: 'tabs',
                                    draggableTip: '',
                                    draggable: true,
                                    multiple: true,
                                    minLength: 1,
                                    scaffold: {
                                        title: '选项卡',
                                        body: {
                                            type: 'tpl',
                                            tpl: '内容',
                                            inline: false
                                        }
                                    },
                                    items: [{ type: 'input-text', name: 'title', required: true }]
                                }),
                                getSchemaTpl('switch', {
                                    name: 'showTip',
                                    label: tipedLabel('标题提示', '鼠标移动到选项卡标题时弹出提示，适用于标题超长时进行完整提示'),
                                    visibleOn: isNewTabMode,
                                    clearValueOnHidden: true
                                }),
                                {
                                    label: tipedLabel('数据源', '配置后，将使用该数据重复渲染所配置的选项卡，可用<code>\\${xxx}</code>取值。'),
                                    type: 'input-text',
                                    name: 'source'
                                }
                            ]
                        },
                        getSchemaTpl('status'),
                        {
                            title: '高级',
                            body: [
                                getSchemaTpl('switch', {
                                    name: 'mountOnEnter',
                                    label: tipedLabel('激活时渲染内容', '只有激活选项卡时才进行内容渲染，提升渲染性能')
                                }),
                                getSchemaTpl('switch', {
                                    name: 'unmountOnExit',
                                    label: tipedLabel('隐藏后销毁内容', '激活其他选项卡时销毁当前内容，使其再次激活时内容可以重新渲染，适用于数据容器需要每次渲染实时获取数据的场景')
                                })
                            ]
                        }
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '基本',
                                body: [
                                    {
                                        name: 'tabsMode',
                                        label: '样式',
                                        type: 'select',
                                        options: [
                                            {
                                                label: '默认',
                                                value: ''
                                            },
                                            {
                                                label: '线型',
                                                value: 'line'
                                            },
                                            {
                                                label: '简约',
                                                value: 'simple'
                                            },
                                            {
                                                label: '加强',
                                                value: 'strong'
                                            },
                                            {
                                                label: '卡片',
                                                value: 'card'
                                            },
                                            {
                                                label: '仿 Chrome',
                                                value: 'chrome'
                                            },
                                            {
                                                label: '水平铺满',
                                                value: 'tiled'
                                            },
                                            {
                                                label: '选择器',
                                                value: 'radio'
                                            },
                                            {
                                                label: '垂直',
                                                value: 'vertical'
                                            },
                                            {
                                                label: '侧边栏',
                                                value: 'sidebar'
                                            }
                                        ],
                                        pipeIn: defaultValue('')
                                    },
                                    getSchemaTpl('horizontal-align', {
                                        label: '标题区位置',
                                        name: 'sidePosition',
                                        pipeIn: defaultValue('left'),
                                        visibleOn: 'data.tabsMode === "sidebar"',
                                        clearValueOnHidden: true
                                    })
                                ]
                            },
                            getSchemaTpl('style:classNames', {
                                isFormItem: false,
                                schema: [
                                    getSchemaTpl('className', {
                                        name: 'linksClassName',
                                        label: '标题区'
                                    }),
                                    getSchemaTpl('className', {
                                        name: 'toolbarClassName',
                                        label: '工具栏'
                                    }),
                                    getSchemaTpl('className', {
                                        name: 'contentClassName',
                                        label: '内容区'
                                    }),
                                    getSchemaTpl('className', {
                                        name: 'showTipClassName',
                                        label: '提示',
                                        visibleOn: 'data.showTip',
                                        clearValueOnHidden: true
                                    })
                                ]
                            })
                        ])
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
        _this.patchContainers = ['tabs.body'];
        _this.vRendererConfig = {
            regions: {
                body: {
                    key: 'body',
                    label: '内容区'
                }
            },
            panelTitle: '卡片',
            panelJustify: true,
            panelBodyCreator: function (context) {
                return getSchemaTpl('tabs', [
                    {
                        title: '属性',
                        body: getSchemaTpl('collapseGroup', [
                            {
                                title: '基本',
                                body: [
                                    {
                                        name: 'title',
                                        label: '标题',
                                        type: 'input-text',
                                        required: true
                                    },
                                    {
                                        type: 'ae-switch-more',
                                        formType: 'extend',
                                        mode: 'normal',
                                        label: '标题图标',
                                        form: {
                                            body: [
                                                getSchemaTpl('icon'),
                                                getSchemaTpl('horizontal-align', {
                                                    label: '位置',
                                                    name: 'iconPosition',
                                                    pipeIn: defaultValue('left'),
                                                    visibleOn: 'data.icon',
                                                    clearValueOnHidden: true
                                                })
                                            ]
                                        }
                                    },
                                    {
                                        label: tipedLabel('Hash', '设置后，会同步更新地址栏的 Hash。'),
                                        name: 'hash',
                                        type: 'input-text'
                                    }
                                ]
                            },
                            getSchemaTpl('status', { disabled: true }),
                            {
                                title: '高级',
                                body: [
                                    getSchemaTpl('switch', {
                                        name: 'mountOnEnter',
                                        label: tipedLabel('激活时才渲染', '当选项卡选中后才渲染其内容区，可提高渲染性能。'),
                                        visibleOn: '!this.reload',
                                        clearValueOnHidden: true
                                    }),
                                    getSchemaTpl('switch', {
                                        name: 'unmountOnExit',
                                        label: tipedLabel('隐藏即销毁', '关闭选项卡则销毁其内容去，配置「激活时才渲染」选项可实现每次选中均重新加载的效果。'),
                                        visibleOn: '!this.reload',
                                        clearValueOnHidden: true
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
                ]);
            }
        };
        _this.wrapperProps = {
            unmountOnExit: true,
            mountOnEnter: true
        };
        _this.tabWrapperResolve = function (dom) { return dom.parentElement; };
        _this.overrides = {
            renderTabs: function () {
                var _this = this;
                var dom = this.super();
                if (!this.renderTab && this.props.$$editor && dom) {
                    var tabs_1 = this.props.tabs;
                    return mapReactElement(dom, function (item) {
                        var _a, _b;
                        if (item.type === Tab && item.props.$$id) {
                            var id_1 = item.props.$$id;
                            var index = findIndex(tabs_1, function (tab) { return tab.$$id === id_1; });
                            var info = _this.props.$$editor;
                            var plugin = info.plugin;
                            if (~index) {
                                var region = (_b = (_a = plugin.vRendererConfig) === null || _a === void 0 ? void 0 : _a.regions) === null || _b === void 0 ? void 0 : _b.body;
                                if (!region) {
                                    return item;
                                }
                                return React.cloneElement(item, {
                                    children: (React.createElement(VRenderer, { key: id_1, type: info.type, plugin: info.plugin, renderer: info.renderer, "$schema": "/schemas/TabSchema.json", hostId: info.id, memberIndex: index, name: "".concat(item.props.title || "\u5361\u7247".concat(index + 1)), id: id_1, draggable: false, wrapperResolve: plugin.tabWrapperResolve, schemaPath: "".concat(info.schemaPath, "/tabs/").concat(index), path: "".concat(_this.props.$path, "/").concat(index), data: _this.props.data },
                                        React.createElement(Region, { key: region.key, preferTag: region.preferTag, name: region.key, label: region.label, regionConfig: region, placeholder: region.placeholder, editorStore: plugin.manager.store, manager: plugin.manager, children: item.props.children, wrapperResolve: region.wrapperResolve, rendererName: info.renderer.name })))
                                });
                            }
                        }
                        return item;
                    });
                }
                return dom;
            }
        };
        return _this;
    }
    /**
     * 补充切换的 toolbar
     * @param context
     * @param toolbars
     */
    TabsPlugin.prototype.buildEditorToolbar = function (context, toolbars) {
        if (context.info.plugin === this &&
            context.info.renderer.name === 'tabs' &&
            !context.info.hostId) {
            var node_1 = context.node;
            toolbars.push({
                level: 'secondary',
                icon: 'fa fa-chevron-left',
                tooltip: '上个卡片',
                onClick: function () {
                    var control = node_1.getComponent();
                    if (control === null || control === void 0 ? void 0 : control.switchTo) {
                        var currentIndex = control.currentIndex();
                        control.switchTo(currentIndex - 1);
                    }
                }
            });
            toolbars.push({
                level: 'secondary',
                icon: 'fa fa-chevron-right',
                tooltip: '下个卡片',
                onClick: function () {
                    var control = node_1.getComponent();
                    if (control === null || control === void 0 ? void 0 : control.switchTo) {
                        var currentIndex = control.currentIndex();
                        control.switchTo(currentIndex + 1);
                    }
                }
            });
        }
    };
    TabsPlugin.prototype.onPreventClick = function (e) {
        var mouseEvent = e.context.data;
        if (mouseEvent.defaultPrevented) {
            return false;
        }
        else if (mouseEvent.target.closest('[role=tablist]>li')) {
            return false;
        }
        return;
    };
    return TabsPlugin;
}(BasePlugin));
export { TabsPlugin };
registerEditorPlugin(TabsPlugin);
