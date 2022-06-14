import { __assign, __extends, __rest } from "tslib";
import { Button, resolveVariable } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { diff, JSONPipeOut, repeatArray } from 'amis-editor-core';
var ListPlugin = /** @class */ (function (_super) {
    __extends(ListPlugin, _super);
    function ListPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'list';
        _this.$schema = '/schemas/ListSchema.json';
        // 组件名称
        _this.name = '列表';
        _this.isBaseComponent = true;
        _this.description = '展示一个列表，可以自定标题、副标题，内容及按钮组部分。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
        _this.docLink = '/amis/zh-CN/components/list';
        _this.tags = ['展示'];
        _this.icon = 'fa fa-list';
        _this.scaffold = {
            type: 'list',
            listItem: {
                body: [
                    {
                        type: 'tpl',
                        tpl: '简单的展示数据：$a $b'
                    }
                ],
                actions: [
                    {
                        icon: 'fa fa-eye',
                        type: 'button'
                    }
                ]
            }
        };
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { items: [
                { a: 1, b: 2 },
                { a: 3, b: 4 },
                { a: 5, b: 6 }
            ] });
        _this.panelTitle = '列表';
        _this.panelBodyCreator = function (context) {
            var isCRUDBody = context.schema.type === 'crud';
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            children: (React.createElement(Button, { level: "danger", size: "sm", block: true, onClick: _this.editDetail.bind(_this, context.id) }, "\u914D\u7F6E\u6210\u5458\u8BE6\u60C5"))
                        },
                        {
                            type: 'divider'
                        },
                        {
                            name: 'title',
                            type: 'input-text',
                            label: '标题'
                        },
                        isCRUDBody
                            ? null
                            : {
                                name: 'source',
                                type: 'input-text',
                                label: '数据源',
                                pipeIn: defaultValue('${items}'),
                                description: '绑定当前环境变量'
                            },
                        {
                            name: 'placeholder',
                            pipeIn: defaultValue('没有数据'),
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
                            name: 'listClassName',
                            label: 'List div CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'headerClassName',
                            label: '头部 CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'footerClassName',
                            label: '底部 CSS 类名'
                        })
                    ]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                }
            ]);
        };
        return _this;
    }
    ListPlugin.prototype.filterProps = function (props) {
        if (props.isSlot) {
            props.value = [props.data];
            return props;
        }
        var data = __assign(__assign({}, props.defaultData), props.data);
        var arr = Array.isArray(props.value)
            ? props.value
            : typeof props.source === 'string'
                ? resolveVariable(props.source, data)
                : resolveVariable('items', data);
        if (!Array.isArray(arr) || !arr.length) {
            var mockedData = this.buildMockData();
            props.value = repeatArray(mockedData, 1).map(function (item, index) { return (__assign(__assign({}, item), { id: index + 1 })); });
        }
        var $schema = props.$schema, rest = __rest(props, ["$schema"]);
        return __assign(__assign({}, JSONPipeOut(rest)), { $schema: $schema });
    };
    ListPlugin.prototype.buildMockData = function () {
        return {
            id: 666,
            title: '假数据',
            description: '假数据',
            a: '假数据',
            b: '假数据'
        };
    };
    ListPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        node &&
            value &&
            this.manager.openSubEditor({
                title: '配置成员详情',
                value: __assign({}, value.listItem),
                slot: {
                    type: 'list',
                    listItem: '$$'
                },
                onChange: function (newValue) {
                    newValue = __assign(__assign({}, value), { listItem: newValue });
                    manager.panelChangeValue(newValue, diff(value, newValue));
                },
                data: {
                    // TODO  默认数据不对
                    items: [this.buildMockData()]
                }
            });
    };
    ListPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var id = _a.id, info = _a.info, schema = _a.schema;
        if (info.renderer.name === 'list' ||
            (info.renderer.name === 'crud' && schema.mode === 'list')) {
            toolbars.push({
                icon: 'fa fa-expand',
                order: 100,
                tooltip: '配置成员渲染器',
                onClick: this.editDetail.bind(this, id)
            });
        }
    };
    ListPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var id = _a.id, schema = _a.schema, region = _a.region, info = _a.info, selections = _a.selections;
        if (selections.length || (info === null || info === void 0 ? void 0 : info.plugin) !== this) {
            return;
        }
        if (info.renderer.name === 'list' ||
            (info.renderer.name === 'crud' && schema.mode === 'list')) {
            menus.push('|', {
                label: '配置成员详情',
                onSelect: this.editDetail.bind(this, id)
            });
        }
    };
    // 为了能够自动注入数据。
    ListPlugin.prototype.getRendererInfo = function (context) {
        var _a;
        var plugin = this;
        var renderer = context.renderer, schema = context.schema;
        if (!schema.$$id &&
            ((_a = schema.$$editor) === null || _a === void 0 ? void 0 : _a.renderer.name) === 'crud' &&
            renderer.name === 'list') {
            return __assign(__assign({}, { id: schema.$$editor.id }), { name: plugin.name, regions: plugin.regions, patchContainers: plugin.patchContainers, vRendererConfig: plugin.vRendererConfig, wrapperProps: plugin.wrapperProps, wrapperResolve: plugin.wrapperResolve, filterProps: plugin.filterProps, $schema: plugin.$schema, renderRenderer: plugin.renderRenderer });
        }
        return _super.prototype.getRendererInfo.call(this, context);
    };
    return ListPlugin;
}(BasePlugin));
export { ListPlugin };
registerEditorPlugin(ListPlugin);
