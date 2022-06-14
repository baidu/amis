import { __assign, __awaiter, __extends, __generator } from "tslib";
import { resolveVariable } from 'amis';
import { setVariable } from 'amis-core';
import { registerEditorPlugin, repeatArray } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { mockValue } from 'amis-editor-core';
import { getComboWrapper } from '../event-action/schema';
import { getEventControlConfig } from '../util';
var TablePlugin = /** @class */ (function (_super) {
    __extends(TablePlugin, _super);
    function TablePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'table';
        _this.$schema = '/schemas/TableSchema.json';
        // 组件名称
        _this.name = '表格';
        _this.isBaseComponent = true;
        _this.description = '用来展示表格数据，可以配置列信息，然后关联数据便能完成展示。支持嵌套、超级表头、列固定、表头固顶、合并单元格等等。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
        _this.docLink = '/amis/zh-CN/components/table';
        _this.icon = 'fa fa-table';
        _this.scaffold = {
            type: 'table',
            columns: [
                {
                    label: '列信息',
                    name: 'a'
                }
            ]
        };
        _this.regions = [
            {
                key: 'columns',
                label: '列集合',
                renderMethod: 'renderTableContent',
                preferTag: '展示',
                dndMode: 'position-h'
            }
        ];
        //renderTableContent
        _this.previewSchema = {
            type: 'table',
            className: 'text-left m-b-none',
            affixHeader: false,
            items: [
                { a: 1, b: 2 },
                { a: 3, b: 4 },
                { a: 5, b: 6 }
            ],
            columns: [
                {
                    label: 'A',
                    name: 'a'
                },
                {
                    label: 'B',
                    name: 'b'
                }
            ]
        };
        _this.scaffoldForm = {
            title: '快速构建表格',
            body: [
                {
                    name: 'columns',
                    type: 'combo',
                    multiple: true,
                    label: false,
                    addButtonText: '新增一列',
                    draggable: true,
                    items: [
                        {
                            type: 'input-text',
                            name: 'label',
                            placeholder: '标题'
                        },
                        {
                            type: 'input-text',
                            name: 'name',
                            placeholder: '绑定字段名'
                        },
                        {
                            type: 'select',
                            name: 'type',
                            placeholder: '类型',
                            value: 'text',
                            options: [
                                {
                                    value: 'text',
                                    label: '纯文本'
                                },
                                {
                                    value: 'tpl',
                                    label: '模板'
                                },
                                {
                                    value: 'image',
                                    label: '图片'
                                },
                                {
                                    value: 'date',
                                    label: '日期'
                                },
                                // {
                                //     value: 'datetime',
                                //     label: '日期时间'
                                // },
                                // {
                                //     value: 'time',
                                //     label: '时间'
                                // },
                                {
                                    value: 'progress',
                                    label: '进度'
                                },
                                {
                                    value: 'status',
                                    label: '状态'
                                },
                                {
                                    value: 'mapping',
                                    label: '映射'
                                },
                                {
                                    value: 'operation',
                                    label: '操作栏'
                                }
                            ]
                        }
                    ]
                }
            ],
            canRebuild: true
        };
        _this.panelTitle = '表格';
        _this.events = [
            {
                eventName: 'selectedChange',
                eventLabel: '选择表格项',
                description: '手动选择表格项事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.selectedItems': {
                                type: 'array',
                                title: '已选择行'
                            },
                            'event.data.unSelectedItems': {
                                type: 'array',
                                title: '未选择行'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'columnSort',
                eventLabel: '列排序',
                description: '点击列排序事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.orderBy': {
                                type: 'string',
                                title: '列排序列名'
                            },
                            'event.data.orderDir': {
                                type: 'string',
                                title: '列排序值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'columnFilter',
                eventLabel: '列筛选',
                description: '点击列筛选事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.filterName': {
                                type: 'string',
                                title: '列筛选列名'
                            },
                            'event.data.filterValue': {
                                type: 'string',
                                title: '列筛选值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'columnSearch',
                eventLabel: '列搜索',
                description: '点击列搜索事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.searchName': {
                                type: 'string',
                                title: '列搜索列名'
                            },
                            'event.data.searchValue': {
                                type: 'object',
                                title: '列搜索数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'orderChange',
                eventLabel: '行排序',
                description: '手动拖拽行排序事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.movedItems': {
                                type: 'array',
                                title: '已排序数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'columnToggled',
                eventLabel: '列显示变化',
                description: '点击自定义列事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.columns': {
                                type: 'array',
                                title: '当前显示的列配置数据'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'rowClick',
                eventLabel: '行单击',
                description: '点击整行事件',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.rowItem': {
                                type: 'object',
                                title: '行点击数据'
                            }
                        }
                    }
                ]
            }
        ];
        _this.actions = [
            {
                actionType: 'select',
                actionLabel: '设置选中项',
                description: '设置表格的选中项',
                config: ['selected'],
                schema: getComboWrapper([
                    {
                        type: 'input-formula',
                        variables: '${variables}',
                        evalMode: false,
                        variableMode: 'tabs',
                        label: '选中项',
                        size: 'lg',
                        name: 'selected',
                        mode: 'horizontal'
                    }
                ])
            },
            {
                actionType: 'selectAll',
                actionLabel: '设置全部选中',
                description: '设置表格全部项选中'
            },
            {
                actionType: 'clearAll',
                actionLabel: '清空选中项',
                description: '清空表格所有选中项'
            },
            {
                actionType: 'initDrag',
                actionLabel: '开启排序',
                description: '开启表格拖拽排序功能'
            }
        ];
        _this.panelBodyCreator = function (context) {
            var isCRUDBody = context.schema.type === 'crud';
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
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
                            name: 'combineNum',
                            label: '自动合并单元格',
                            type: 'input-number',
                            placeholder: '设置列数',
                            description: '设置从左到右多少列内启用自动合并单元格，根据字段值是否相同来决定是否合并。'
                        }
                        // {
                        //   children: (
                        //     <div>
                        //       <Button
                        //         level="info"
                        //         size="sm"
                        //         className="m-b-sm"
                        //         block
                        //         onClick={this.handleAdd}
                        //       >
                        //         新增一列
                        //       </Button>
                        //     </div>
                        //   )
                        // },
                        // {
                        //   children: (
                        //     <div>
                        //       <Button
                        //         level="success"
                        //         size="sm"
                        //         block
                        //         onClick={this.handleColumnsQuickEdit.bind(this)}
                        //       >
                        //         快速编辑列信息
                        //       </Button>
                        //     </div>
                        //   )
                        // }
                    ]
                },
                {
                    title: '外观',
                    body: [
                        {
                            name: 'columnsTogglable',
                            label: '展示列显示开关',
                            type: 'button-group-select',
                            pipeIn: defaultValue('auto'),
                            mode: 'inline',
                            className: 'w-full',
                            size: 'xs',
                            options: [
                                {
                                    label: '自动',
                                    value: 'auto'
                                },
                                {
                                    label: '开启',
                                    value: true
                                },
                                {
                                    label: '关闭',
                                    value: false
                                }
                            ],
                            description: '自动即列数量大于5个时自动开启'
                        },
                        getSchemaTpl('switch', {
                            name: 'affixHeader',
                            label: '是否固顶表头',
                            pipeIn: defaultValue(true)
                        }),
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
                        getSchemaTpl('switch', {
                            name: 'footable',
                            label: '是否开启单条底部展示',
                            description: '如果列太多显示会很臃肿，可以考虑把部分列放在当前行的底部展示',
                            pipeIn: function (value) { return !!value; }
                        }),
                        {
                            name: 'footable.expand',
                            type: 'button-group-select',
                            size: 'xs',
                            visibleOn: 'data.footable',
                            label: '底部默认展开',
                            pipeIn: defaultValue('none'),
                            mode: 'inline',
                            className: 'w-full',
                            options: [
                                {
                                    label: '第一条',
                                    value: 'first'
                                },
                                {
                                    label: '所有',
                                    value: 'all'
                                },
                                {
                                    label: '不展开',
                                    value: 'none'
                                }
                            ]
                        },
                        {
                            name: 'placeholder',
                            pipeIn: defaultValue('暂无数据'),
                            type: 'input-text',
                            label: '无数据提示'
                        },
                        {
                            name: 'rowClassNameExpr',
                            type: 'input-text',
                            label: '行高亮规则',
                            placeholder: "\u652F\u6301\u6A21\u677F\u8BED\u6CD5\uFF0C\u5982 <%= data.id % 2 ? 'bg-success' : '' %>"
                        },
                        getSchemaTpl('className', {
                            label: '外层 CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'tableClassName',
                            label: '表格 CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'headerClassName',
                            label: '顶部外层 CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'footerClassName',
                            label: '底部外层 CSS 类名'
                        }),
                        getSchemaTpl('className', {
                            name: 'toolbarClassName',
                            label: '工具栏 CSS 类名'
                        })
                    ]
                },
                {
                    title: '显隐',
                    body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
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
        return _this;
    }
    TablePlugin.prototype.filterProps = function (props) {
        var arr = Array.isArray(props.value)
            ? props.value
            : typeof props.source === 'string'
                ? resolveVariable(props.source, props.data)
                : resolveVariable('items', props.data);
        if (!Array.isArray(arr) || !arr.length) {
            var mockedData_1 = {};
            if (Array.isArray(props.columns)) {
                props.columns.forEach(function (column) {
                    if (column.name) {
                        setVariable(mockedData_1, column.name, mockValue(column));
                    }
                });
            }
            props.value = repeatArray(mockedData_1, 1).map(function (item, index) { return (__assign(__assign({}, item), { id: index + 1 })); });
        }
        else {
            // 只取10条预览，否则太多卡顿
            props.value = arr.slice(0, 10);
        }
        return props;
    };
    // 为了能够自动注入数据。
    TablePlugin.prototype.getRendererInfo = function (context) {
        var _a;
        var plugin = this;
        var schema = context.schema, renderer = context.renderer;
        if (!schema.$$id &&
            ((_a = schema.$$editor) === null || _a === void 0 ? void 0 : _a.renderer.name) === 'crud' &&
            renderer.name === 'table') {
            return __assign(__assign({}, { id: schema.$$editor.id }), { name: plugin.name, regions: plugin.regions, patchContainers: plugin.patchContainers, vRendererConfig: plugin.vRendererConfig, wrapperProps: plugin.wrapperProps, wrapperResolve: plugin.wrapperResolve, filterProps: plugin.filterProps, $schema: plugin.$schema, renderRenderer: plugin.renderRenderer });
        }
        return _super.prototype.getRendererInfo.call(this, context);
    };
    // 自动插入 label
    TablePlugin.prototype.beforeInsert = function (event) {
        var _a, _b, _c, _d;
        var context = event.context;
        if ((context.info.plugin === this ||
            ((_a = context.node.sameIdChild) === null || _a === void 0 ? void 0 : _a.info.plugin) === this) &&
            context.region === 'columns') {
            context.data = __assign(__assign({}, context.data), { label: (_d = (_b = context.data.label) !== null && _b !== void 0 ? _b : (_c = context.subRenderer) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '列名称' });
        }
    };
    TablePlugin.prototype.buildDataSchemas = function (node, region) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var itemsSchema, columns, _i, _c, current, schema, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        itemsSchema = {
                            $id: 'tableRow',
                            type: 'object',
                            properties: {}
                        };
                        columns = node.children.find(function (item) { return item.isRegion && item.region === 'columns'; });
                        _i = 0, _c = columns.children;
                        _g.label = 1;
                    case 1:
                        if (!(_i < _c.length)) return [3 /*break*/, 6];
                        current = _c[_i];
                        schema = current.schema;
                        if (!schema.name) return [3 /*break*/, 5];
                        _d = itemsSchema.properties;
                        _e = schema.name;
                        if (!((_b = (_a = current.info) === null || _a === void 0 ? void 0 : _a.plugin) === null || _b === void 0 ? void 0 : _b.buildDataSchemas)) return [3 /*break*/, 3];
                        return [4 /*yield*/, current.info.plugin.buildDataSchemas(current, region)];
                    case 2:
                        _f = _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _f = {
                            type: 'string',
                            title: schema.label || schema.name,
                            description: schema.description
                        };
                        _g.label = 4;
                    case 4:
                        _d[_e] = _f;
                        _g.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        if ((region === null || region === void 0 ? void 0 : region.region) === 'columns') {
                            return [2 /*return*/, itemsSchema];
                        }
                        return [2 /*return*/, {
                                $id: 'table',
                                type: 'object',
                                properties: {
                                    items: {
                                        type: 'array',
                                        items: itemsSchema
                                    }
                                }
                            }];
                }
            });
        });
    };
    return TablePlugin;
}(BasePlugin));
export { TablePlugin };
registerEditorPlugin(TablePlugin);
