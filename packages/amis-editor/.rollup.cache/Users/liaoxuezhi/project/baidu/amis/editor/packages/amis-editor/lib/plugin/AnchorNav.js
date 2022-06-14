import { __assign, __extends } from "tslib";
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { VRenderer } from 'amis-editor-core';
import { mapReactElement } from 'amis-editor-core';
import findIndex from 'lodash/findIndex';
import { RegionWrapper as Region } from 'amis-editor-core';
import { AnchorNavSection } from 'amis-ui';
var AnchorNavPlugin = /** @class */ (function (_super) {
    __extends(AnchorNavPlugin, _super);
    function AnchorNavPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'anchor-nav';
        _this.$schema = '/schemas/AnchorNavSchema.json';
        // 组件名称
        _this.name = '锚点导航';
        _this.isBaseComponent = true;
        _this.description = '锚点导航，在多行内容展示时，可以将内容用锚点导航分组的形式展示，点击导航菜单可以定位到对应内容区域。';
        _this.docLink = '/amis/zh-CN/components/anchor-nav';
        _this.tags = ['容器'];
        _this.icon = 'fa fa-link';
        _this.scaffold = {
            type: 'anchor-nav',
            links: [
                {
                    title: '锚点1',
                    href: '1',
                    body: [
                        {
                            type: 'tpl',
                            tpl: '这里是锚点内容1',
                            inline: false
                        }
                    ]
                },
                {
                    title: '锚点2',
                    href: '2',
                    body: [
                        {
                            type: 'tpl',
                            tpl: '这里是锚点内容2',
                            inline: false
                        }
                    ]
                },
                {
                    title: '锚点3',
                    href: '3',
                    body: [
                        {
                            type: 'tpl',
                            tpl: '这里是锚点内容3',
                            inline: false
                        }
                    ]
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '锚点导航';
        _this.panelJustify = true;
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                getSchemaTpl('combo-container', {
                                    type: 'combo',
                                    name: 'links',
                                    label: '锚点设置',
                                    mode: 'normal',
                                    multiple: true,
                                    draggable: true,
                                    minLength: 1,
                                    addButtonText: '添加锚点',
                                    items: [
                                        {
                                            type: 'input-text',
                                            name: 'title',
                                            required: true,
                                            placeholder: '请输入锚点标题'
                                        }
                                    ],
                                    scaffold: {
                                        title: '锚点',
                                        href: '',
                                        body: [
                                            {
                                                type: 'tpl',
                                                tpl: '这里是锚点内容',
                                                inline: false
                                            }
                                        ]
                                    },
                                    draggableTip: '',
                                    onChange: function (value, oldValue, model, form) {
                                        var active = form.data.active;
                                        var isInclude = value.findIndex(function (link) { return link.href === active; }) > -1;
                                        form.setValues({
                                            active: isInclude ? active : value[0].href
                                        });
                                    },
                                    pipeOut: function (value) {
                                        var hrefs = value.map(function (item) { return item.href; });
                                        var findMinCanUsedKey = function (keys, max) {
                                            for (var i = 1; i <= max; i++) {
                                                if (!keys.includes(String(i))) {
                                                    return String(i);
                                                }
                                            }
                                        };
                                        value.forEach(function (item) {
                                            if (!item.href) {
                                                var key = findMinCanUsedKey(hrefs, value.length);
                                                item.href = key;
                                                item.title = "\u951A\u70B9".concat(key);
                                                item.body[0].tpl = "\u8FD9\u91CC\u662F\u951A\u70B9\u5185\u5BB9".concat(key);
                                            }
                                        });
                                        return value;
                                    },
                                    deleteBtn: {
                                        icon: 'fa fa-trash'
                                    }
                                }),
                                {
                                    name: 'active',
                                    type: 'select',
                                    label: '默认定位区域',
                                    source: '${links}',
                                    labelField: 'title',
                                    valueField: 'href',
                                    value: '1'
                                }
                            ]
                        }
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                {
                                    type: 'button-group-select',
                                    name: 'direction',
                                    label: '导航布局',
                                    value: 'vertical',
                                    options: [
                                        {
                                            label: '水平',
                                            value: 'horizontal'
                                        },
                                        {
                                            label: '垂直',
                                            value: 'vertical'
                                        }
                                    ]
                                }
                            ]
                        },
                        getSchemaTpl('style:classNames', {
                            isFormItem: false,
                            schema: [
                                getSchemaTpl('className', {
                                    name: 'linkClassName',
                                    label: '导航'
                                }),
                                getSchemaTpl('className', {
                                    name: 'sectionClassName',
                                    label: '区域内容'
                                })
                            ]
                        })
                    ])
                }
            ])
        ];
        _this.patchContainers = ['anchor-nav.body'];
        _this.vRendererConfig = {
            regions: {
                body: {
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
                            if (info && !this.props.children) {
                                return insertRegion(this, dom, regions, info, info.plugin.manager);
                            }
                            return dom;
                        };
                    }
                }
            },
            panelTitle: '内容区域',
            panelJustify: true,
            panelBody: [
                getSchemaTpl('tabs', [
                    {
                        title: '属性',
                        body: [
                            getSchemaTpl('collapseGroup', [
                                {
                                    title: '基本',
                                    body: [
                                        {
                                            name: 'title',
                                            label: '标题',
                                            type: 'input-text',
                                            required: true
                                        }
                                    ]
                                }
                            ])
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            getSchemaTpl('collapseGroup', [
                                {
                                    title: 'CSS 类名',
                                    body: [getSchemaTpl('className')]
                                }
                            ])
                        ]
                    }
                ])
            ]
        };
        _this.wrapperProps = {
            unmountOnExit: true,
            mountOnEnter: true
        };
        _this.sectionWrapperResolve = function (dom) { return dom.parentElement; };
        _this.overrides = {
            render: function () {
                var _this = this;
                var dom = this.super();
                if (!this.renderSection && this.props.$$editor && dom) {
                    var links_1 = this.props.links;
                    return mapReactElement(dom, function (item) {
                        var _a, _b;
                        if (item.type === AnchorNavSection && item.props.$$id) {
                            var id_1 = item.props.$$id;
                            var index = findIndex(links_1, function (link) { return link.$$id === id_1; });
                            var info = _this.props.$$editor;
                            var plugin = info.plugin;
                            if (~index) {
                                var region = (_b = (_a = plugin.vRendererConfig) === null || _a === void 0 ? void 0 : _a.regions) === null || _b === void 0 ? void 0 : _b.body;
                                if (!region) {
                                    return item;
                                }
                                return React.cloneElement(item, {
                                    children: (React.createElement(VRenderer, { key: id_1, type: info.type, plugin: info.plugin, renderer: info.renderer, "$schema": "/schemas/SectionSchema.json", hostId: info.id, memberIndex: index, name: "".concat(item.props.title || "\u951A\u70B9\u5185\u5BB9".concat(index + 1)), id: id_1, draggable: false, removable: false, wrapperResolve: plugin.sectionWrapperResolve, schemaPath: "".concat(info.schemaPath, "/anchor-nav/").concat(index), path: "".concat(_this.props.$path, "/").concat(index), data: _this.props.data },
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
    return AnchorNavPlugin;
}(BasePlugin));
export { AnchorNavPlugin };
registerEditorPlugin(AnchorNavPlugin);
