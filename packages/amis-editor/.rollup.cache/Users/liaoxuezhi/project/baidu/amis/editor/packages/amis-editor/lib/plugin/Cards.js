import { __assign, __extends, __rest } from "tslib";
import { Button, resolveVariable } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { diff, JSONPipeOut, repeatArray } from 'amis-editor-core';
var CardsPlugin = /** @class */ (function (_super) {
    __extends(CardsPlugin, _super);
    function CardsPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'cards';
        _this.$schema = '/schemas/CardsSchema.json';
        // 组件名称
        _this.name = '卡片列表';
        _this.isBaseComponent = true;
        _this.description = '功能类似于表格，但是用一个个小卡片来展示数据。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
        _this.docLink = '/amis/zh-CN/components/cards';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-window-maximize';
        _this.scaffold = {
            type: 'cards',
            data: {
                items: [
                    { a: 1, b: 2 },
                    { a: 3, b: 4 }
                ]
            },
            columnsCount: 2,
            card: {
                type: 'card',
                className: 'm-b-none',
                header: {
                    title: '标题',
                    subTitle: '副标题'
                },
                body: [
                    {
                        name: 'a',
                        label: 'A'
                    },
                    {
                        name: 'b',
                        label: 'B'
                    }
                ],
                actions: [
                    {
                        label: '详情',
                        type: 'button'
                    }
                ]
            }
        };
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { className: 'text-left ' });
        _this.panelTitle = '卡片集';
        _this.panelBodyCreator = function (context) {
            var isCRUDBody = context.schema.type === 'crud';
            return [
                getSchemaTpl('tabs', [
                    {
                        title: '常规',
                        body: [
                            {
                                children: (React.createElement("div", { className: "m-b" },
                                    React.createElement(Button, { level: "success", size: "sm", block: true, onClick: _this.editDetail.bind(_this, context.id) }, "\u914D\u7F6E\u5355\u9879\u4FE1\u606F")))
                            },
                            {
                                type: 'divider'
                            },
                            {
                                name: 'title',
                                type: 'input-text',
                                label: '标题'
                            },
                            {
                                name: 'href',
                                type: 'input-text',
                                label: '打开外部链接'
                            },
                            isCRUDBody
                                ? null
                                : {
                                    name: 'source',
                                    type: 'input-text',
                                    label: '数据源',
                                    pipeIn: defaultValue('${items}'),
                                    description: '绑定当前环境变量',
                                    test: !isCRUDBody
                                },
                            {
                                name: 'placeholder',
                                value: '暂无数据',
                                type: 'input-text',
                                label: '无数据提示'
                            }
                        ]
                    },
                    {
                        title: '外观',
                        body: [
                            getSchemaTpl('switch', {
                                name: 'showHeader',
                                label: '是否显示头部',
                                pipeIn: defaultValue(true)
                            }),
                            getSchemaTpl('switch', {
                                name: 'showFooter',
                                label: '是否显示底部',
                                pipeIn: defaultValue(true)
                            }),
                            getSchemaTpl('className', {
                                label: 'CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'headerClassName',
                                label: '头部 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'footerClassName',
                                label: '底部 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                name: 'itemsClassName',
                                label: '内容 CSS 类名'
                            }),
                            getSchemaTpl('className', {
                                pipeIn: defaultValue('Grid-col--sm6 Grid-col--md4 Grid-col--lg3'),
                                name: 'itemClassName',
                                label: '卡片 CSS 类名'
                            }),
                            {
                                name: 'columnsCount',
                                type: 'input-range',
                                visibleOn: '!this.leftFixed',
                                min: 0,
                                max: 12,
                                step: 1,
                                label: '每行显示个数',
                                description: '不设置时，由卡片 CSS 类名决定'
                            },
                            getSchemaTpl('switch', {
                                name: 'masonryLayout',
                                label: '启用瀑布流'
                            })
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
    CardsPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        node &&
            value &&
            this.manager.openSubEditor({
                title: '配置成员渲染器',
                value: __assign({ type: 'card' }, value.card),
                slot: {
                    type: 'container',
                    body: '$$'
                },
                typeMutable: false,
                onChange: function (newValue) {
                    newValue = __assign(__assign({}, value), { card: newValue });
                    manager.panelChangeValue(newValue, diff(value, newValue));
                },
                data: {
                    item: 'mocked data',
                    index: 0
                }
            });
    };
    CardsPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var id = _a.id, info = _a.info, schema = _a.schema;
        if (info.renderer.name === 'cards' ||
            (info.renderer.name === 'crud' && schema.mode === 'cards')) {
            toolbars.push({
                icon: 'fa fa-expand',
                order: 100,
                tooltip: '配置成员渲染器',
                onClick: this.editDetail.bind(this, id)
            });
        }
    };
    CardsPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var id = _a.id, schema = _a.schema, region = _a.region, info = _a.info, selections = _a.selections;
        if (selections.length || (info === null || info === void 0 ? void 0 : info.plugin) !== this) {
            return;
        }
        if (info.renderer.name === 'cards' ||
            (info.renderer.name === 'crud' && schema.mode === 'cards')) {
            menus.push('|', {
                label: '配置成员渲染器',
                onSelect: this.editDetail.bind(this, id)
            });
        }
    };
    CardsPlugin.prototype.filterProps = function (props) {
        var data = __assign(__assign({}, props.defaultData), props.data);
        var arr = Array.isArray(props.value)
            ? props.value
            : typeof props.source === 'string'
                ? resolveVariable(props.source, data)
                : resolveVariable('items', data);
        if (!Array.isArray(arr) || !arr.length) {
            var mockedData = {
                id: 666,
                title: '假数据',
                description: '假数据',
                a: '假数据',
                b: '假数据'
            };
            props.value = repeatArray(mockedData, 1).map(function (item, index) { return (__assign(__assign({}, item), { id: index + 1 })); });
        }
        var $schema = props.$schema, rest = __rest(props, ["$schema"]);
        return __assign(__assign({}, JSONPipeOut(rest)), { $schema: $schema });
    };
    CardsPlugin.prototype.getRendererInfo = function (context) {
        var _a;
        var plugin = this;
        var renderer = context.renderer, schema = context.schema;
        if (!schema.$$id &&
            ((_a = schema.$$editor) === null || _a === void 0 ? void 0 : _a.renderer.name) === 'crud' &&
            renderer.name === 'cards') {
            return __assign(__assign({}, { id: schema.$$editor.id }), { name: plugin.name, regions: plugin.regions, patchContainers: plugin.patchContainers, vRendererConfig: plugin.vRendererConfig, wrapperProps: plugin.wrapperProps, wrapperResolve: plugin.wrapperResolve, filterProps: plugin.filterProps, $schema: plugin.$schema, renderRenderer: plugin.renderRenderer });
        }
        return _super.prototype.getRendererInfo.call(this, context);
    };
    return CardsPlugin;
}(BasePlugin));
export { CardsPlugin };
registerEditorPlugin(CardsPlugin);
