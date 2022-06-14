/**
 * @file table view 组件的可视化编辑
 */
import { __assign, __extends, __spreadArray } from "tslib";
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { VRenderer } from 'amis-editor-core';
import { JSONGetById } from 'amis-editor-core';
import { TableViewEditor } from '../component/TableViewEditor';
/**
 * 尚未实现的功能：
 * * 按列删除，需要将一些 colspan 减一
 * * 水平/垂直拆分单元格，增加周围节点的 colspan 和 rowspan
 */
// td 节点模板
var TD_TEMPLATE = {
    body: {
        type: 'tpl',
        tpl: '---'
    }
};
/**
 * 遍历表格，算出每个单元格在最终渲染时的实际行和列，后续许多操作都需要以这个作为依据
 * 比如插入列的时候，不能根据单元格在数组的位置，而是要根据单元格实际渲染时所属列
 */
function getCellRealPosition(table) {
    if (!table) {
        return {
            trs: []
        };
    }
    // 记录有哪些行列被合并了，这样后续计算的时候就要跳过这些行列
    var spannedCell = [];
    var trs = table.trs || [];
    var currentRow = 0; // 当前渲染的实际行
    for (var _i = 0, trs_1 = trs; _i < trs_1.length; _i++) {
        var tr = trs_1[_i];
        var tds = tr.tds || [];
        var currentCol = 0; // 当前渲染的实际列
        for (var _a = 0, tds_1 = tds; _a < tds_1.length; _a++) {
            var td = tds_1[_a];
            // 跳过被合并的行
            while (spannedCell[currentRow] && spannedCell[currentRow][currentCol]) {
                currentCol = currentCol + 1;
            }
            var rowspan = td.rowspan || 1;
            var colspan = td.colspan || 1;
            // 标记后续行合并情况
            if (rowspan > 1 || colspan > 1) {
                for (var i = 0; i < rowspan; i++) {
                    var spanRow = currentRow + i;
                    if (!spannedCell[spanRow]) {
                        spannedCell[spanRow] = [];
                    }
                    for (var j = 0; j < colspan; j++) {
                        var spanCol = currentCol + j;
                        spannedCell[spanRow][spanCol] = true;
                    }
                }
            }
            td.$$row = currentRow;
            td.$$col = currentCol;
            currentCol = currentCol + 1;
        }
        currentRow = currentRow + 1;
    }
    return table;
}
var TableViewPlugin = /** @class */ (function (_super) {
    __extends(TableViewPlugin, _super);
    function TableViewPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'table-view';
        _this.$schema = '/schemas/TableViewSchema.json';
        // 组件名称
        _this.name = '表格视图';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-columns';
        _this.description = '表格类型的展现';
        _this.docLink = '/amis/zh-CN/components/table-view';
        _this.tags = ['容器'];
        _this.scaffold = {
            type: 'table-view',
            trs: [
                {
                    background: '#F7F7F7',
                    tds: [
                        {
                            body: {
                                type: 'tpl',
                                tpl: '地区'
                            }
                        },
                        {
                            body: {
                                type: 'tpl',
                                tpl: '城市'
                            }
                        },
                        {
                            body: {
                                type: 'tpl',
                                tpl: '销量'
                            }
                        }
                    ]
                },
                {
                    tds: [
                        {
                            rowspan: 2,
                            body: {
                                type: 'tpl',
                                tpl: '华北'
                            }
                        },
                        {
                            body: {
                                type: 'tpl',
                                tpl: '北京'
                            }
                        },
                        {
                            body: {
                                type: 'tpl',
                                tpl: '${beijing}'
                            }
                        }
                    ]
                },
                {
                    tds: [
                        {
                            body: {
                                type: 'tpl',
                                tpl: '天津'
                            }
                        },
                        {
                            body: {
                                type: 'tpl',
                                tpl: '${tianjing}'
                            }
                        }
                    ]
                }
            ]
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.regions = [
            {
                key: 'body',
                label: '内容区',
                renderMethod: 'renderTdBody',
                preferTag: '展示'
            }
        ];
        _this.panelTitle = '表格视图';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '属性',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '常用',
                                body: [
                                    {
                                        label: '标题',
                                        name: 'caption',
                                        type: 'input-text'
                                    },
                                    {
                                        label: '标题位置',
                                        name: 'captionSide',
                                        type: 'button-group-select',
                                        size: 'sm',
                                        mode: 'row',
                                        className: 'ae-buttonGroupSelect--justify',
                                        visibleOn: 'this.caption',
                                        options: [
                                            { label: '顶部', value: 'top' },
                                            { label: '底部', value: 'bottom' }
                                        ]
                                    },
                                    {
                                        type: 'input-text',
                                        label: '视图宽度',
                                        name: 'width',
                                        clearable: true
                                    },
                                    {
                                        type: 'input-text',
                                        label: '单元格默认内间距',
                                        name: 'padding',
                                        clearable: true
                                    },
                                    {
                                        label: '显示边框',
                                        name: 'border',
                                        type: 'switch',
                                        mode: 'row',
                                        inputClassName: 'inline-flex justify-between flex-row-reverse'
                                    },
                                    {
                                        label: '边框颜色',
                                        type: 'input-color',
                                        name: 'borderColor',
                                        visibleOn: 'this.border',
                                        pipeIn: defaultValue('#eceff8')
                                    }
                                ]
                            }
                        ])
                    ]
                },
                {
                    title: '外观',
                    className: 'p-none',
                    body: getSchemaTpl('collapseGroup', __spreadArray(__spreadArray([], getSchemaTpl('style:common'), true), [
                        {
                            title: 'CSS 类名',
                            body: [getSchemaTpl('className')]
                        }
                    ], false))
                },
                {
                    title: '状态',
                    body: [getSchemaTpl('visible')]
                }
            ])
        ];
        _this.fieldWrapperResolve = function (dom) { return dom; };
        _this.overrides = {
            renderTd: function (td, colIndex, rowIndex) {
                var dom = this.super(td, colIndex, rowIndex);
                var info = this.props.$$editor;
                if (!info || !td.$$id) {
                    return dom;
                }
                var plugin = info.plugin;
                var id = td.$$id;
                return (React.createElement(VRenderer, { type: info.type, plugin: info.plugin, renderer: info.renderer, key: id, "$schema": "/schemas/TdObject.json", hostId: info.id, memberIndex: colIndex, name: "".concat("\u5355\u5143\u683C ".concat(rowIndex + 1, ",").concat(colIndex + 1)), id: id, draggable: false, wrapperResolve: plugin.fieldWrapperResolve, schemaPath: "".concat(info.schemaPath, "/td"), path: "".concat(this.props.$path, "/tr/").concat(rowIndex, "/td/").concat(colIndex), data: this.props.data, children: dom }));
            },
            renderTr: function (tr, rowIndex) {
                var dom = this.super(tr, rowIndex);
                var info = this.props.$$editor;
                if (!info || !tr.$$id) {
                    return dom;
                }
                var plugin = info.plugin;
                var id = tr.$$id;
                return (React.createElement(VRenderer, { type: info.type, plugin: info.plugin, renderer: info.renderer, key: id, "$schema": "/schemas/TrObject.json", hostId: info.id, memberIndex: rowIndex, name: "".concat("\u884C ".concat(rowIndex + 1)), id: id, draggable: false, wrapperResolve: plugin.fieldWrapperResolve, schemaPath: "".concat(info.schemaPath, "/tr"), path: "".concat(this.props.$path, "/tr/").concat(rowIndex), data: this.props.data, children: dom }));
            }
        };
        _this.tdVRendererConfig = {
            panelTitle: '单元格',
            panelBodyCreator: function (context) {
                return [
                    getSchemaTpl('tabs', [
                        {
                            title: '属性',
                            className: 'p-none',
                            body: [
                                getSchemaTpl('collapseGroup', [
                                    {
                                        title: '显示',
                                        body: [
                                            {
                                                label: '背景色',
                                                type: 'input-color',
                                                name: 'background'
                                            },
                                            {
                                                label: '文字颜色',
                                                type: 'input-color',
                                                name: 'color'
                                            },
                                            {
                                                label: '文字加粗',
                                                name: 'bold',
                                                type: 'switch',
                                                mode: 'row',
                                                inputClassName: 'inline-flex justify-between flex-row-reverse'
                                            }
                                        ]
                                    },
                                    {
                                        title: '布局',
                                        body: [
                                            {
                                                type: 'input-text',
                                                label: '单元格宽度',
                                                name: 'width',
                                                clearable: true
                                            },
                                            {
                                                type: 'input-number',
                                                name: 'padding',
                                                label: '单元格内边距'
                                            },
                                            {
                                                label: '水平对齐',
                                                name: 'align',
                                                type: 'button-group-select',
                                                size: 'sm',
                                                mode: 'row',
                                                className: 'ae-buttonGroupSelect--justify',
                                                options: [
                                                    {
                                                        label: '',
                                                        value: 'left',
                                                        icon: 'fa fa-align-left'
                                                    },
                                                    {
                                                        label: '',
                                                        value: 'center',
                                                        icon: 'fa fa-align-center'
                                                    },
                                                    {
                                                        label: '',
                                                        value: 'right',
                                                        icon: 'fa fa-align-right'
                                                    },
                                                    {
                                                        label: '',
                                                        value: 'justify',
                                                        icon: 'fa fa-align-justify'
                                                    }
                                                ]
                                            },
                                            {
                                                label: '垂直对齐',
                                                name: 'valign',
                                                type: 'button-group-select',
                                                size: 'sm',
                                                mode: 'row',
                                                className: 'ae-buttonGroupSelect--justify',
                                                options: [
                                                    {
                                                        label: '顶部',
                                                        value: 'top'
                                                    },
                                                    {
                                                        label: '居中',
                                                        value: 'middle'
                                                    },
                                                    {
                                                        label: '底部',
                                                        value: 'bottom'
                                                    },
                                                    {
                                                        label: '基线对齐',
                                                        value: 'baseline'
                                                    }
                                                ]
                                            },
                                            {
                                                type: 'input-number',
                                                name: 'colspan',
                                                label: '水平合并列数'
                                            },
                                            {
                                                type: 'input-number',
                                                name: 'rowspan',
                                                label: '垂直合并列数'
                                            }
                                        ]
                                    }
                                ])
                            ]
                        },
                        {
                            title: '外观',
                            className: 'p-none',
                            body: getSchemaTpl('collapseGroup', getSchemaTpl('style:common'))
                        }
                    ])
                ];
            }
        };
        _this.trVRendererConfig = {
            panelTitle: ' 行',
            panelBodyCreator: function (context) {
                return [
                    getSchemaTpl('tabs', [
                        {
                            title: '属性',
                            body: [
                                {
                                    label: '行高度',
                                    type: 'input-number',
                                    name: 'height'
                                },
                                {
                                    label: '行背景色',
                                    type: 'input-color',
                                    name: 'background'
                                }
                            ]
                        },
                        {
                            title: '外观',
                            className: 'p-none',
                            body: getSchemaTpl('collapseGroup', getSchemaTpl('style:common'))
                        }
                    ])
                ];
            }
        };
        return _this;
    }
    TableViewPlugin.prototype.renderRenderer = function (props) {
        var $$editor = props.$$editor;
        var renderer = $$editor.renderer;
        var schema = props.$schema;
        getCellRealPosition(schema);
        return (React.createElement(TableViewEditor, { schema: schema, manager: this.manager },
            React.createElement(renderer.component, __assign({}, props))));
    };
    // 根据路径判断是选中单元格还是行
    TableViewPlugin.prototype.buildEditorPanel = function (context, panels) {
        _super.prototype.buildEditorPanel.call(this, context, panels);
        if (context.info.schemaPath.endsWith('/td')) {
            panels.push({
                key: 'td',
                order: 100,
                icon: this.tdVRendererConfig.panelIcon || 'fa fa-tablet',
                title: this.tdVRendererConfig.panelTitle || '格子',
                render: this.manager.makeSchemaFormRender({
                    controls: this.tdVRendererConfig.panelControlsCreator
                        ? this.tdVRendererConfig.panelControlsCreator(context)
                        : this.tdVRendererConfig.panelControls,
                    body: this.tdVRendererConfig.panelBodyCreator
                        ? this.tdVRendererConfig.panelBodyCreator(context)
                        : this.tdVRendererConfig.panelBody
                })
            });
        }
        else if (context.info.schemaPath.endsWith('/tr')) {
            panels.push({
                key: 'tr',
                order: 100,
                icon: this.trVRendererConfig.panelIcon || 'fa fa-tablet',
                title: this.trVRendererConfig.panelTitle || '格子',
                render: this.manager.makeSchemaFormRender({
                    controls: this.trVRendererConfig.panelControlsCreator
                        ? this.trVRendererConfig.panelControlsCreator(context)
                        : this.trVRendererConfig.panelControls,
                    body: this.trVRendererConfig.panelBodyCreator
                        ? this.trVRendererConfig.panelBodyCreator(context)
                        : this.trVRendererConfig.panelBody
                })
            });
        }
    };
    /**
     * 插入行，需要处理前面有 rowspan 的情况
     *
     *   +---+---+---+
     *   | a | b | c |
     *   +   +---+---+
     *   |   | d | e |
     *   +   +---+---+
     *   |   | f | g |
     *   +---+---+---+
     *
     * 比如在 d 位置的前面插入行，需要将 a 的 rowspan 加一，然后再插入两个单元格
     */
    TableViewPlugin.prototype.insertRow = function (tdId, position) {
        var store = this.manager.store;
        var paths = store.getNodePathById(tdId);
        var tableId = paths[paths.length - 3].id;
        var table = store.getSchema(tableId);
        getCellRealPosition(table);
        var td = JSONGetById(table, tdId);
        if (!td) {
            console.warn('找不到对应的 td id');
            return;
        }
        var insertRow = td.$$row;
        if (position === 'below') {
            insertRow = insertRow + 1;
        }
        // 通过第一行来确认表格一共多少列
        var firstRow = table.trs[0];
        var firstRowLastTd = firstRow.tds[firstRow.tds.length - 1];
        if (!firstRowLastTd) {
            console.warn('第一列没内容');
            return;
        }
        var colSize = firstRowLastTd.$$col + (firstRowLastTd.colspan || 1);
        var insertIndex = table.trs.length;
        for (var trIndex = 0; trIndex < table.trs.length; trIndex++) {
            for (var _i = 0, _a = table.trs[trIndex].tds || []; _i < _a.length; _i++) {
                var td_1 = _a[_i];
                var tdRow = td_1.$$row;
                var rowspan = td_1.rowspan || 1;
                var colspan = td_1.colspan || 1;
                // 如果覆盖到要插入的行，则增加 rowspan，并在这个插入的行中减去对应
                if (rowspan > 1) {
                    var isOverlapping = tdRow + rowspan > insertRow;
                    if (isOverlapping) {
                        td_1.rowspan = rowspan + 1;
                        colSize = colSize - colspan;
                    }
                }
                if (tdRow === insertRow) {
                    insertIndex = trIndex;
                    break;
                }
            }
        }
        var insertTds = [];
        for (var i = 0; i < colSize; i++) {
            insertTds.push(TD_TEMPLATE);
        }
        table.trs.splice(insertIndex, 0, { tds: insertTds });
        this.manager.store.changeValueById(tableId, table);
    };
    /**
     * 插入列
     *
     *		+---+---+---+
     *		| a     | b |
     *		+       +---+
     *		|       | c |
     *		+---+---+---+
     *		| d | e | f |
     *		+---+---+---+
     *
     * 比如在 c 位置左侧插入列，应该将 a 的 colspan 加一，然后在最后一行增加一个单元格
     */
    TableViewPlugin.prototype.insertCol = function (tdId, position) {
        var store = this.manager.store;
        var paths = store.getNodePathById(tdId);
        var tableId = paths[paths.length - 3].id;
        var table = store.getSchema(tableId);
        getCellRealPosition(table);
        var td = JSONGetById(table, tdId);
        if (!td) {
            console.warn('找不到对应的 td id');
            return;
        }
        var insertCol = td.$$col;
        if (position === 'right') {
            insertCol = insertCol + 1;
        }
        for (var _i = 0, _a = table.trs || []; _i < _a.length; _i++) {
            var tr = _a[_i];
            var tds = tr.tds || [];
            var isInserted = false;
            for (var tdIndex = 0; tdIndex < tds.length; tdIndex++) {
                var td_2 = tds[tdIndex];
                var tdColspan = td_2.colspan || 1;
                var tdCol = td_2.$$col;
                // 如果要插入的行被覆盖了，则对节点加一并跳过插入
                if (tdColspan > 1) {
                    var isOverlapping = tdCol + tdColspan > insertCol;
                    if (isOverlapping) {
                        td_2.colspan = tdColspan + 1;
                        isInserted = true;
                        break;
                    }
                }
                if (insertCol <= tdCol) {
                    tds.splice(tdIndex, 0, TD_TEMPLATE);
                    isInserted = true;
                    break;
                }
            }
            // 如果没找到对应的节点，那可能是插入到最后一条或者这一列节点数量不够，此时就要插入到最后
            if (!isInserted) {
                tds.push(TD_TEMPLATE);
            }
        }
        this.manager.store.changeValueById(tableId, table);
    };
    /**
     * 拆分有跨行或跨列的单元格
     *
     *		+---+---+---+
     *		| a     | b |
     *		+       +---+
     *		|       | c |
     *		+---+---+---+
     *		| d | e | f |
     *		+---+---+---+
     *
     * 比如拆分 a，最后要变成
     *
     *		+---+---+---+
     *		| a | g | b |
     *		+---+---+---+
     *		| h | i | c |
     *		+---+---+---+
     *		| d | e | f |
     *		+---+---+---+
     *
     * 因此要新增 g、h、i 三个单元格
     */
    TableViewPlugin.prototype.splitCell = function (tdId) {
        var store = this.manager.store;
        var paths = store.getNodePathById(tdId);
        var tableId = paths[paths.length - 3].id;
        var table = store.getSchema(tableId);
        getCellRealPosition(table);
        var td = JSONGetById(table, tdId);
        if (!td) {
            console.warn('找不到对应的 td id');
            return;
        }
        var rowspan = td.rowspan || 1;
        var colspan = td.colspan || 1;
        // 将这个单元格的跨行和跨列都设置为 1
        td.colspan = 1;
        td.rowspan = 1;
        // 算出需要补充哪些单元格及位置
        var tdRow = td.$$row;
        var tdCol = td.$$col;
        var insertTds = [];
        for (var i = 0; i < rowspan; i++) {
            for (var j = 0; j < colspan; j++) {
                // 跳过第一个，也就是这个单元格自己的位置
                if (i === 0 && j === 0) {
                    continue;
                }
                insertTds.push({ row: tdRow + i, col: tdCol + j });
            }
        }
        // 需要将列大的放前面，主要是因为后面需要反向遍历才能动态删数据
        insertTds.sort(function (a, b) {
            return b.col - a.col;
        });
        for (var _i = 0, _a = table.trs; _i < _a.length; _i++) {
            var tr = _a[_i];
            for (var tdIndex = 0; tdIndex < tr.tds.length; tdIndex++) {
                var td_3 = tr.tds[tdIndex];
                var currentRow = td_3.$$row;
                var currentCol = td_3.$$col;
                var insertIndex = insertTds.length;
                while (insertIndex--) {
                    var insertTd = insertTds[insertIndex];
                    if (currentRow === insertTd.row) {
                        if (insertTd.col <= currentCol) {
                            tr.tds.splice(tdIndex, 0, TD_TEMPLATE);
                        }
                        else {
                            tr.tds.push(TD_TEMPLATE);
                        }
                        insertTds.splice(insertIndex, 1);
                    }
                }
            }
        }
        // 如果前面有单元格找不到位置，那意味着是下面这种情况，这个单元格跨两行且是最后一行
        // 这时 table.tr 其实只有一行数据，需要在添加一行数据
        // 	+---+---+
        // 	| a     |
        // 	+       +
        // 	|       |
        // 	+---+---+
        if (insertTds.length) {
            var newTds = [];
            for (var i = 0; i < insertTds.length; i++) {
                newTds.push(TD_TEMPLATE);
            }
            table.trs.push({ tds: newTds });
        }
        this.manager.store.changeValueById(tableId, table);
    };
    TableViewPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var _this = this;
        var schema = _a.schema, info = _a.info;
        if (info.schemaPath.endsWith('/td')) {
            var tdId_1 = schema.$$id;
            toolbars.push({
                icon: 'fa fa-chevron-left',
                order: 100,
                tooltip: '左侧新增列',
                onClick: function () {
                    _this.insertCol(tdId_1, 'left');
                }
            });
            toolbars.push({
                icon: 'fa fa-chevron-down',
                order: 100,
                tooltip: '下方新增行',
                onClick: function () {
                    _this.insertRow(tdId_1, 'below');
                }
            });
            toolbars.push({
                icon: 'fa fa-chevron-up',
                order: 100,
                tooltip: '上方新增行',
                onClick: function () {
                    _this.insertRow(tdId_1, 'above');
                }
            });
            toolbars.push({
                icon: 'fa fa-chevron-right',
                order: 100,
                tooltip: '右侧新增列',
                onClick: function () {
                    _this.insertCol(tdId_1, 'right');
                }
            });
            var colspan = schema.colspan || 1;
            var rowspan = schema.rowspan || 1;
            if (colspan > 1 || rowspan > 1) {
                toolbars.push({
                    icon: 'fa fa-columns',
                    order: 100,
                    tooltip: '拆分单元格',
                    onClick: function () {
                        _this.splitCell(tdId_1);
                    }
                });
            }
        }
    };
    return TableViewPlugin;
}(BasePlugin));
export { TableViewPlugin };
registerEditorPlugin(TableViewPlugin);
