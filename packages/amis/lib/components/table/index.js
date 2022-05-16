"use strict";
/**
 * @file Table
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var findLastIndex_1 = (0, tslib_1.__importDefault)(require("lodash/findLastIndex"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var filter_1 = (0, tslib_1.__importDefault)(require("lodash/filter"));
var intersection_1 = (0, tslib_1.__importDefault)(require("lodash/intersection"));
var cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var helper_1 = require("../../utils/helper");
var icons_1 = require("../icons");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../Checkbox"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("../Spinner"));
var HeadCellSort_1 = (0, tslib_1.__importDefault)(require("./HeadCellSort"));
var HeadCellFilter_1 = (0, tslib_1.__importDefault)(require("./HeadCellFilter"));
var HeadCellSelect_1 = (0, tslib_1.__importDefault)(require("./HeadCellSelect"));
var ItemActionsWrapper_1 = (0, tslib_1.__importDefault)(require("./ItemActionsWrapper"));
var Cell_1 = (0, tslib_1.__importDefault)(require("./Cell"));
function getMaxLevelThRowSpan(columns) {
    var maxLevel = 0;
    Array.isArray(columns) &&
        columns.forEach(function (c) {
            var level = getThRowSpan(c);
            if (maxLevel < level) {
                maxLevel = level;
            }
        });
    return maxLevel;
}
function getThRowSpan(column) {
    if (!column.children || (column.children && !column.children.length)) {
        return 1;
    }
    return 1 + getMaxLevelThRowSpan(column.children);
}
function getThColSpan(column) {
    if (!column.children || (column.children && !column.children.length)) {
        return 1;
    }
    var childrenLength = 0;
    column.children.forEach(function (item) { return (childrenLength += getThColSpan(item)); });
    return childrenLength;
}
function buildColumns(columns, thColumns, tdColumns, depth, id, fixed) {
    if (columns === void 0) { columns = []; }
    if (tdColumns === void 0) { tdColumns = []; }
    if (depth === void 0) { depth = 0; }
    var maxLevel = getMaxLevelThRowSpan(columns);
    // 在处理表头时，如果父级column设置了fixed属性，那么所有children保持一致
    Array.isArray(columns) &&
        columns.forEach(function (column) {
            var groupId = id || (0, helper_1.guid)();
            var childMaxLevel = 0;
            if (column.children) {
                childMaxLevel = getMaxLevelThRowSpan(column.children);
            }
            var newColumn = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { rowSpan: childMaxLevel ? 1 : maxLevel - childMaxLevel + depth, colSpan: getThColSpan(column), groupId: groupId, depth: depth });
            var tdColumn = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { groupId: groupId });
            if (fixed) {
                newColumn.fixed = fixed;
                tdColumn.fixed = fixed;
            }
            if (!thColumns[depth]) {
                thColumns[depth] = [];
            }
            thColumns[depth].push(newColumn);
            if (column.children && column.children.length > 0) {
                buildColumns(column.children, thColumns, tdColumns, depth + 1, groupId, column.fixed);
            }
            else {
                var children = tdColumn.children, rest = (0, tslib_1.__rest)(tdColumn, ["children"]);
                tdColumns.push(rest);
            }
        });
}
function isFixedLeftColumn(fixed) {
    return fixed === true || fixed === 'left';
}
function isFixedRightColumn(fixed) {
    return fixed === 'right';
}
function getPreviousLeftWidth(doms, index, columns) {
    var width = 0;
    for (var i = 0; i < index; i++) {
        if (columns && columns[i] && isFixedLeftColumn(columns[i].fixed)) {
            var dom = doms[i];
            width += dom.offsetWidth;
        }
    }
    return width;
}
function getAfterRightWidth(doms, index, columns) {
    var width = 0;
    for (var i = doms.length - 0; i > index; i--) {
        if (columns && columns[i] && isFixedRightColumn(columns[i].fixed)) {
            var dom = doms[i];
            width += dom.offsetWidth;
        }
    }
    return width;
}
function hasFixedColumn(columns) {
    return (0, find_1.default)(columns, function (column) { return column.fixed; });
}
function getSummaryColumns(summary) {
    if (!summary) {
        return [];
    }
    var last = [];
    var first = [];
    summary.forEach(function (item) {
        if ((0, helper_1.isObject)(item)) {
            first.push(item);
        }
        else if (Array.isArray(item)) {
            last.push(item);
        }
    });
    return (0, tslib_1.__spreadArray)([first], last, true);
}
var DefaultCellWidth = 40;
var Table = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Table, _super);
    function Table(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        _this.tableDom = react_1.default.createRef();
        _this.theadDom = react_1.default.createRef();
        _this.tbodyDom = react_1.default.createRef();
        _this.contentDom = react_1.default.createRef();
        _this.headerDom = react_1.default.createRef();
        _this.bodyDom = react_1.default.createRef();
        _this.tfootDom = react_1.default.createRef();
        _this.footDom = react_1.default.createRef();
        _this.selectedRows = props.rowSelection
            ? _this.getSelectedRows(props.dataSource, (_a = props.rowSelection) === null || _a === void 0 ? void 0 : _a.selectedRowKeys)
            : [];
        _this.state = {
            selectedRowKeys: props.rowSelection
                ? props.rowSelection.selectedRowKeys.map(function (key) { return key; }) || []
                : [],
            dataSource: props.dataSource || [],
            expandedRowKeys: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (props.expandable ? props.expandable.expandedRowKeys || [] : []), true), (props.expandable
                ? props.expandable.defaultExpandedRowKeys || []
                : []), true),
            colWidths: [],
            hoverRow: null
        };
        _this.onTableContentScroll = _this.onTableContentScroll.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        return _this;
    }
    Table.prototype.getPopOverContainer = function () {
        return (0, react_dom_1.findDOMNode)(this);
    };
    Table.prototype.getColWidths = function () {
        var _a, _b;
        var childrens = ((_b = (_a = this.tbodyDom.current) === null || _a === void 0 ? void 0 : _a.children[0]) === null || _b === void 0 ? void 0 : _b.children) || [];
        var colWidths = new Array(childrens ? childrens.length : 0);
        for (var i = 0; i < childrens.length; i++) {
            var child = childrens[i];
            colWidths[i] = child ? child.offsetWidth : null;
        }
        return colWidths;
    };
    Table.prototype.getSelectedRows = function (dataSource, selectedRowKeys) {
        var _this = this;
        var selectedRows = [];
        dataSource.forEach(function (data) {
            if ((0, find_1.default)(selectedRowKeys, function (key) { return key === data[_this.getRowSelectionKeyField()]; })) {
                selectedRows.push(data);
            }
        });
        return selectedRows;
    };
    Table.prototype.updateTableBodyFixed = function () {
        var tbodyDom = this.tbodyDom && this.tbodyDom.current;
        var tdColumns = (0, tslib_1.__spreadArray)([], this.tdColumns, true);
        this.updateTbodyFixedRow(tbodyDom, tdColumns);
        this.updateHeadSummaryFixedRow(tbodyDom);
    };
    Table.prototype.updateColWidths = function () {
        var _this = this;
        this.setState({ colWidths: this.getColWidths() }, function () {
            if (hasFixedColumn(_this.props.columns)) {
                var theadDom = _this.theadDom && _this.theadDom.current;
                var thColumns = _this.thColumns;
                _this.updateTheadFixedRow(theadDom, thColumns);
                _this.updateTableBodyFixed();
            }
        });
    };
    Table.prototype.componentDidMount = function () {
        var _this = this;
        var _a, _b;
        if (this.props.loading) {
            return;
        }
        if (hasFixedColumn(this.props.columns)) {
            var headerDom = this.headerDom && this.headerDom.current;
            if (headerDom) {
                var headerBody = headerDom.getElementsByTagName('tbody');
                headerBody &&
                    headerBody[0] &&
                    this.updateHeadSummaryFixedRow(headerBody[0]);
            }
            var tfootDom = this.tfootDom && this.tfootDom.current;
            tfootDom && this.updateFootSummaryFixedRow(tfootDom);
        }
        var current = null;
        if (this.contentDom && this.contentDom.current) {
            current = this.contentDom.current;
            current.addEventListener('scroll', this.onTableContentScroll.bind(this));
        }
        else {
            current = (_a = this.headerDom) === null || _a === void 0 ? void 0 : _a.current;
            // overflow设置为hidden的情况
            var hiddenDomRefs = [this.headerDom, this.footDom];
            hiddenDomRefs.forEach(function (ref) {
                return ref &&
                    ref.current &&
                    ref.current.addEventListener('wheel', _this.onWheel.bind(_this));
            });
            // 横向同步滚动
            var scrollDomRefs = [this.bodyDom];
            scrollDomRefs.forEach(function (ref) {
                return ref &&
                    ref.current &&
                    ref.current.addEventListener('scroll', _this.onTableScroll.bind(_this));
            });
        }
        current && this.updateTableDom(current);
        if (this.props.draggable) {
            this.initDragging();
        }
        if (this.props.resizable) {
            (_b = this.theadDom.current) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseup', this.onResizeMouseUp.bind(this));
        }
        this.updateStickyHeader();
        this.updateColWidths();
    };
    Table.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        var _a, _b, _c, _d;
        // 数据源发生了变化
        if (!(0, isEqual_1.default)(prevProps.dataSource, this.props.dataSource)) {
            this.setState({ dataSource: (0, tslib_1.__spreadArray)([], this.props.dataSource, true) }, function () {
                return _this.updateColWidths();
            }); // 异步加载数据需求再更新一次
        }
        // 选择项发生了变化触发
        if (!(0, isEqual_1.default)(prevState.selectedRowKeys, this.state.selectedRowKeys)) {
            // 更新保存的已选择行数据
            this.selectedRows = this.getSelectedRows(this.state.dataSource, this.state.selectedRowKeys);
            var rowSelection = this.props.rowSelection;
            rowSelection &&
                rowSelection.onChange &&
                rowSelection.onChange(this.state.selectedRowKeys, this.selectedRows);
            this.setState({
                selectedRowKeys: this.state.selectedRowKeys.filter(function (key, i, a) { return a.indexOf(key) === i; })
            });
        }
        // 外部传入的选择项发生了变化
        if (!(0, isEqual_1.default)((_a = prevProps.rowSelection) === null || _a === void 0 ? void 0 : _a.selectedRowKeys, (_b = this.props.rowSelection) === null || _b === void 0 ? void 0 : _b.selectedRowKeys)) {
            if (this.props.rowSelection) {
                this.setState({
                    selectedRowKeys: this.props.rowSelection.selectedRowKeys
                });
                this.selectedRows = this.getSelectedRows(this.state.dataSource, this.state.selectedRowKeys);
            }
        }
        // 外部传入的展开项发生了变化
        if (!(0, isEqual_1.default)((_c = prevProps === null || prevProps === void 0 ? void 0 : prevProps.expandable) === null || _c === void 0 ? void 0 : _c.expandedRowKeys, (_d = this.props.expandable) === null || _d === void 0 ? void 0 : _d.expandedRowKeys)) {
            if (this.props.expandable) {
                this.setState({
                    expandedRowKeys: this.props.expandable.expandedRowKeys || []
                });
            }
        }
        // 展开行变化时触发
        if (!(0, isEqual_1.default)(prevState.expandedRowKeys, this.state.expandedRowKeys)) {
            if (this.props.expandable) {
                var _e = this.props.expandable, onExpandedRowsChange = _e.onExpandedRowsChange, keyField_1 = _e.keyField;
                var expandedRows_1 = [];
                this.state.dataSource.forEach(function (item) {
                    if ((0, find_1.default)(_this.state.expandedRowKeys, function (key) { return key == item[keyField_1 || 'key']; })) {
                        expandedRows_1.push(item);
                    }
                });
                onExpandedRowsChange && onExpandedRowsChange(expandedRows_1);
            }
        }
        // sticky属性发生了变化
        if (prevProps.sticky !== this.props.sticky) {
            this.updateStickyHeader();
        }
    };
    Table.prototype.componentWillUnmount = function () {
        var _this = this;
        this.contentDom &&
            this.contentDom.current &&
            this.contentDom.current.removeEventListener('scroll', this.onTableContentScroll.bind(this));
        var hiddenDomRefs = [this.headerDom, this.footDom];
        hiddenDomRefs.forEach(function (ref) {
            return ref &&
                ref.current &&
                ref.current.removeEventListener('wheel', _this.onWheel.bind(_this));
        });
        var scrollDomRefs = [this.bodyDom];
        scrollDomRefs.forEach(function (ref) {
            return ref &&
                ref.current &&
                ref.current.removeEventListener('scroll', _this.onTableScroll.bind(_this));
        });
        this.destroyDragging();
    };
    Table.prototype.exchange = function (fromIndex, toIndex, item) {
        var _a = this.props, scroll = _a.scroll, headSummary = _a.headSummary;
        // 如果有头部总结行 fromIndex就会+1
        if ((!scroll || (scroll && !scroll.y)) && headSummary) {
            fromIndex = fromIndex - 1;
        }
        var index = toIndex - fromIndex;
        var levels = item.getAttribute('row-levels');
        var rowIndex = +item.getAttribute('row-index');
        var dataSource = (0, cloneDeep_1.default)(this.state.dataSource);
        var levelsArray = levels ? levels.split(',') : [];
        var childrenColumnName = this.getChildrenColumnName();
        var data = dataSource;
        var i = 0;
        while (i < levelsArray.length) {
            data = data[levelsArray[i]][childrenColumnName];
            i++;
        }
        if (data && data.length > 0) {
            var row = (0, cloneDeep_1.default)(data[rowIndex]);
            data.splice(rowIndex, 1);
            data.splice(rowIndex + index, 0, row);
        }
        return data;
    };
    Table.prototype.initDragging = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, onDrag = _a.onDrag;
        this.sortable = new sortablejs_1.default(this.tbodyDom.current, {
            group: 'table',
            animation: 150,
            handle: ".".concat(cx('Table-dragCell')),
            ghostClass: 'is-dragging',
            onMove: function (e) {
                var dragged = e.dragged;
                var related = e.related;
                if (related &&
                    related.classList.contains("".concat(cx('Table-summary-row')))) {
                    return false;
                }
                var draggedLevels = dragged.getAttribute('row-levels');
                var relatedLevels = related.getAttribute('row-levels');
                // 嵌套展示 不属于同一层的 不允许拖动
                // 否则涉及到试图的更新，比如子元素都被拖完了
                if (draggedLevels !== relatedLevels) {
                    return false;
                }
                return true;
            },
            onEnd: function (e) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var onDrag, data, prevented;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 没有移动
                            if (e.newIndex === e.oldIndex) {
                                return [2 /*return*/];
                            }
                            onDrag = this.props.onDrag;
                            if (!onDrag) return [3 /*break*/, 2];
                            data = this.exchange(e.oldIndex, e.newIndex, e.item);
                            return [4 /*yield*/, onDrag(data)];
                        case 1:
                            prevented = _a.sent();
                            if (prevented) {
                                return [2 /*return*/];
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }
        });
    };
    Table.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    Table.prototype.updateStickyHeader = function () {
        var _this = this;
        var _a, _b;
        if (this.props.sticky) {
            // 如果设置了sticky 如果父元素设置了overflow: auto top值还需要考虑padding值
            var parent_1 = (_b = (_a = this.headerDom) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.parentElement;
            setTimeout(function () {
                while (parent_1 &&
                    window.getComputedStyle(parent_1, null).getPropertyValue('overflow') !==
                        'auto') {
                    parent_1 = parent_1.parentElement;
                }
                if (parent_1 &&
                    window.getComputedStyle(parent_1, null).getPropertyValue('overflow') ===
                        'auto') {
                    var paddingTop = window
                        .getComputedStyle(parent_1, null)
                        .getPropertyValue('padding-top');
                    if (paddingTop && _this.headerDom && _this.headerDom.current) {
                        _this.headerDom.current.style.top = '-' + paddingTop;
                    }
                }
            });
        }
    };
    // 更新一个tr下的td的left和class
    Table.prototype.updateFixedRow = function (row, columns) {
        var _a, _b, _c;
        var cx = this.props.classnames;
        var children = row.children;
        for (var i = 0; i < children.length; i++) {
            var dom = children[i];
            var fixed = columns[i] ? columns[i].fixed || '' : '';
            if (isFixedLeftColumn(fixed)) {
                dom.style.left =
                    i > 0 ? getPreviousLeftWidth(children, i, columns) + 'px' : '0';
            }
            else if (isFixedRightColumn(fixed)) {
                dom.style.right =
                    i < children.length - 1
                        ? getAfterRightWidth(children, i, columns) + 'px'
                        : '0';
            }
        }
        // 最后一个左fixed的添加样式
        var leftIndex = (0, findLastIndex_1.default)(columns, function (column) {
            return isFixedLeftColumn(column.fixed);
        });
        if (leftIndex > -1) {
            (_a = children[leftIndex]) === null || _a === void 0 ? void 0 : _a.classList.add(cx('Table-cell-fix-left-last'));
        }
        // 第一个右fixed的添加样式
        var rightIndex = columns.findIndex(function (column) {
            return isFixedRightColumn(column.fixed);
        });
        if (rightIndex > -1) {
            (_b = children[rightIndex]) === null || _b === void 0 ? void 0 : _b.classList.add(cx('Table-cell-fix-right-first'));
            if (rightIndex > 0) {
                (_c = children[rightIndex - 1]) === null || _c === void 0 ? void 0 : _c.classList.add(cx('Table-cell-fix-right-first-prev'));
            }
        }
    };
    // 在可选、可展开、可拖拽的情况下，补充column，方便fix处理
    Table.prototype.prependColumns = function (columns) {
        var _a = this.props, rowSelection = _a.rowSelection, expandable = _a.expandable, draggable = _a.draggable;
        if (draggable) {
            columns.unshift({});
        }
        else {
            if (expandable) {
                columns.unshift(expandable);
            }
            if (rowSelection) {
                columns.unshift(rowSelection);
            }
        }
    };
    Table.prototype.updateTheadFixedRow = function (thead, columns) {
        var children = thead.children;
        for (var i = 0; i < children.length; i++) {
            var cols = (0, tslib_1.__spreadArray)([], columns[i], true);
            if (i === 0) {
                this.prependColumns(cols);
            }
            this.updateFixedRow(children[i], cols);
        }
    };
    Table.prototype.updateTbodyFixedRow = function (tbody, columns) {
        var cx = this.props.classnames;
        var children = (0, filter_1.default)(tbody.children, function (child) {
            return !child.classList.contains(cx('Table-summary-row')) &&
                !child.classList.contains(cx('Table-empty-row'));
        });
        this.prependColumns(columns);
        for (var i = 0; i < children.length; i++) {
            this.updateFixedRow(children[i], columns);
        }
    };
    Table.prototype.updateSummaryFixedRow = function (children, columns) {
        for (var i = 0; i < children.length; i++) {
            this.updateFixedRow(children[i], columns[i]);
        }
    };
    Table.prototype.updateFootSummaryFixedRow = function (tfoot) {
        var footSummary = this.props.footSummary;
        if (Array.isArray(footSummary)) {
            var columns = getSummaryColumns(footSummary);
            this.updateSummaryFixedRow(tfoot.children, columns);
        }
    };
    Table.prototype.updateHeadSummaryFixedRow = function (tbody) {
        var _a = this.props, headSummary = _a.headSummary, cx = _a.classnames;
        if (Array.isArray(headSummary)) {
            var columns = getSummaryColumns(headSummary);
            var children = (0, filter_1.default)(tbody.children, function (child) {
                return child.classList.contains(cx('Table-summary-row'));
            });
            this.updateSummaryFixedRow(children, columns);
        }
    };
    Table.prototype.renderColGroup = function (colWidths) {
        var _a = this.props, rowSelection = _a.rowSelection, cx = _a.classnames, expandable = _a.expandable, draggable = _a.draggable;
        var tdColumns = this.tdColumns;
        var isExpandable = this.isExpandableTable();
        var extraCount = this.getExtraColumnCount();
        return (react_1.default.createElement("colgroup", null,
            draggable ? (react_1.default.createElement("col", { className: cx('Table-drag-col'), style: { width: DefaultCellWidth + 'px' } })) : null,
            !draggable && rowSelection ? (react_1.default.createElement("col", { className: cx('Table-selection-col'), style: {
                    width: (rowSelection.columnWidth || DefaultCellWidth) + 'px'
                } })) : null,
            !draggable && isExpandable ? (react_1.default.createElement("col", { className: cx('Table-expand-col'), style: {
                    width: ((expandable === null || expandable === void 0 ? void 0 : expandable.columnWidth) || DefaultCellWidth) + 'px'
                } })) : null,
            tdColumns.map(function (data, index) {
                var width = colWidths ? colWidths[index + extraCount] : data.width;
                return (react_1.default.createElement("col", { key: index, style: { width: typeof width === 'number' ? width + 'px' : width }, className: data.className ? cx("Table-colgroup-".concat(data.className)) : '' }));
            })));
    };
    Table.prototype.onResizeMouseDown = function (event, key) {
        // 点击记录起始坐标
        this.resizeStart = event.clientX;
        // 记录点击的列名
        this.resizeKey = key;
        event && event.stopPropagation();
    };
    Table.prototype.onResizeMouseUp = function (event) {
        var _this = this;
        var _a;
        // 点击了调整列宽
        if (this.resizeStart && this.resizeKey) {
            // 计算横向移动距离
            var distance = event.clientX - this.resizeStart;
            var tdColumns = (0, tslib_1.__spreadArray)([], this.tdColumns, true);
            var index = tdColumns.findIndex(function (c) { return c.key === _this.resizeKey; }) +
                this.getExtraColumnCount();
            var colGroup = (_a = this.tableDom.current) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('colgroup')[0];
            var currentWidth = 0;
            if (colGroup && colGroup.children[index]) {
                var child = colGroup.children[index];
                currentWidth = child.offsetWidth;
            }
            var newWidth = 0;
            if (colGroup) {
                var maxDistance = 0; // 最多可以移动的距离
                // 调宽列
                if (distance > 0) {
                    for (var i = 0; i < colGroup.children.length; i++) {
                        var child = colGroup.children[i];
                        // 自适应列 保证有一个最小宽度
                        // 如果都设置了固定宽度 那一个都拖不动
                        if (!this.tdColumns[i].width) {
                            maxDistance += child.offsetWidth - DefaultCellWidth;
                        }
                    }
                    if (colGroup.children[index]) {
                        var child = colGroup.children[index];
                        newWidth = currentWidth + Math.min(distance, maxDistance);
                        child.style.width = newWidth + 'px';
                    }
                }
                else {
                    // 缩短列
                    var autoColumns = [];
                    for (var i = 0; i < colGroup.children.length; i++) {
                        var child = colGroup.children[i];
                        // 自适应列 保证有一个最小宽度
                        // 如果都设置了固定宽度 那一个都拖不动
                        if (!this.tdColumns[i].width) {
                            autoColumns.push(child);
                        }
                    }
                    maxDistance = DefaultCellWidth - currentWidth;
                    if (colGroup.children[index]) {
                        var child = colGroup.children[index];
                        newWidth = currentWidth + Math.max(distance, maxDistance);
                        child.style.width = newWidth + 'px';
                    }
                    var gap_1 = Math.abs(Math.max(distance, maxDistance)) / autoColumns.length;
                    autoColumns.forEach(function (c) {
                        c.style.width = c.offsetWidth + gap_1 + 'px';
                    });
                }
            }
            var column = (0, find_1.default)(tdColumns, function (c) { return c.key === _this.resizeKey; });
            // 只有通过配置设置过的宽度保存到tdColumns
            // 自动分配的不保存
            // 这样可以一直调整了
            if (column && column.width && newWidth) {
                column.width = newWidth;
            }
            this.tdColumns = tdColumns;
            this.resizeStart = 0;
            this.resizeKey = '';
        }
        event && event.stopPropagation();
    };
    Table.prototype.renderTHead = function () {
        var _this = this;
        var _a = this.props, rowSelection = _a.rowSelection, dataSource = _a.dataSource, cx = _a.classnames, onSort = _a.onSort, expandable = _a.expandable, draggable = _a.draggable, resizable = _a.resizable, onSelectAll = _a.onSelectAll, onFilter = _a.onFilter;
        var thColumns = this.thColumns;
        // 获取一行最多th个数
        var maxCount = 0;
        thColumns.forEach(function (columns) {
            if (columns.length > maxCount) {
                maxCount = columns.length;
            }
        });
        var keyField = this.getRowSelectionKeyField();
        var dataList = rowSelection && rowSelection.getCheckboxProps
            ? this.state.dataSource.filter(function (data, index) {
                var props = rowSelection.getCheckboxProps(data, index);
                return !props.disabled;
            })
            : this.state.dataSource;
        var isExpandable = this.isExpandableTable();
        var allRowKeys = [];
        var allRows = [];
        dataList.forEach(function (data) {
            allRowKeys.push(data[keyField]);
            allRows.push(data);
            if (!expandable && _this.hasChildrenRow(data)) {
                allRowKeys = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], allRowKeys, true), _this.getDataChildrenKeys(data), true);
                data[_this.getChildrenColumnName()].forEach(function (item) {
                    return allRows.push(item);
                });
            }
        });
        return (react_1.default.createElement("thead", { ref: this.theadDom, className: cx('Table-thead') }, thColumns.map(function (data, index) {
            return (react_1.default.createElement("tr", { key: 'th-cell-' + index },
                draggable && index === 0 ? (react_1.default.createElement(Cell_1.default, { wrapperComponent: "th", rowSpan: thColumns.length, className: cx('Table-dragCell') })) : null,
                !draggable && rowSelection && index === 0 ? (react_1.default.createElement(Cell_1.default, { wrapperComponent: "th", rowSpan: thColumns.length, fixed: rowSelection.fixed ? 'left' : '', className: cx('Table-checkCell') }, rowSelection.type !== 'radio'
                    ? [
                        react_1.default.createElement(Checkbox_1.default, { key: "checkAll", partial: _this.state.selectedRowKeys.length > 0 &&
                                _this.state.selectedRowKeys.length <
                                    allRowKeys.length, checked: _this.state.selectedRowKeys.length > 0, onChange: function (value) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                                var changeRows, selectedRows, selectedRowKeys, prevented;
                                var _this = this;
                                return (0, tslib_1.__generator)(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (value) {
                                                changeRows = dataList.filter(function (data) { return !_this.hasCheckedRows(data); });
                                            }
                                            else {
                                                changeRows = this.selectedRows;
                                            }
                                            selectedRows = value ? allRows : [];
                                            selectedRowKeys = value ? allRowKeys : [];
                                            if (!onSelectAll) return [3 /*break*/, 2];
                                            return [4 /*yield*/, onSelectAll(value, selectedRowKeys, selectedRows, changeRows)];
                                        case 1:
                                            prevented = _a.sent();
                                            if (prevented) {
                                                return [2 /*return*/];
                                            }
                                            _a.label = 2;
                                        case 2:
                                            this.setState({ selectedRowKeys: selectedRowKeys });
                                            return [2 /*return*/];
                                    }
                                });
                            }); } }),
                        rowSelection.selections &&
                            rowSelection.selections.length > 0 ? (react_1.default.createElement(HeadCellSelect_1.default, { key: "checkSelection", keys: allRowKeys, selections: rowSelection.selections, popOverContainer: _this.getPopOverContainer })) : null
                    ]
                    : null)) : null,
                !draggable && isExpandable && index === 0 ? (react_1.default.createElement(Cell_1.default, { wrapperComponent: "th", rowSpan: thColumns.length, fixed: expandable && expandable.fixed ? 'left' : '', className: cx('Table-row-expand-icon-cell') })) : null,
                data.map(function (item, i) {
                    var sort = null;
                    if (item.sorter) {
                        sort = (react_1.default.createElement(HeadCellSort_1.default, { column: item, onSort: onSort
                                ? onSort
                                : function (payload) {
                                    if (typeof item.sorter === 'function') {
                                        if (payload.orderBy) {
                                            var sortList = (0, tslib_1.__spreadArray)([], _this.state.dataSource, true);
                                            _this.setState({
                                                dataSource: sortList.sort(item.sorter)
                                            });
                                        }
                                        else {
                                            _this.setState({ dataSource: (0, tslib_1.__spreadArray)([], dataSource, true) });
                                        }
                                    }
                                } }));
                    }
                    var filter = null;
                    if (item.filterDropdown) {
                        filter = item.filterDropdown;
                    }
                    else if (item.filters && item.filters.length > 0) {
                        filter = (react_1.default.createElement(HeadCellFilter_1.default, { column: item, popOverContainer: _this.getPopOverContainer, onFilter: onFilter }));
                    }
                    var children = (react_1.default.createElement("span", null,
                        sort,
                        filter,
                        resizable ? (react_1.default.createElement("i", { className: cx('Table-thead-resizable'), onMouseDown: function (e) { return _this.onResizeMouseDown(e, item.key); } })) : null));
                    return (react_1.default.createElement(Cell_1.default, { wrapperComponent: "th", rowSpan: item.rowSpan, colSpan: item.colSpan, key: "cell-".concat(i), fixed: item.fixed === true ? 'left' : item.fixed, className: cx({
                            'Table-cell-last': i === maxCount - 1 && i === data.length - 1
                        }), groupId: item.groupId, depth: item.depth }, typeof item.title === 'function'
                        ? item.title(children)
                        : item.title));
                })));
        })));
    };
    Table.prototype.onRowClick = function (event, record, rowIndex) {
        var _a = this.props, rowSelection = _a.rowSelection, onRow = _a.onRow;
        if (rowSelection && rowSelection.type && rowSelection.rowClick) {
            var defaultKey_1 = this.getRowSelectionKeyField();
            var isSelected = !!(0, find_1.default)(this.state.selectedRowKeys, function (key) { return key === record[defaultKey_1]; });
            this.selectedSingleRow(!isSelected, record);
        }
        if (record && onRow) {
            onRow.onRowClick && onRow.onRowClick(event, record, rowIndex);
        }
    };
    Table.prototype.onRowMouseEnter = function (event, record, rowIndex) {
        var _a = this.props, cx = _a.classnames, onRow = _a.onRow;
        var parent = event.target;
        while (parent && parent.tagName !== 'TR') {
            parent = parent.parentElement;
        }
        if (parent && !parent.classList.contains(cx('Table-row-disabled'))) {
            for (var i = 0; i < parent.children.length; i++) {
                var td = parent.children[i];
                td.classList.add(cx('Table-cell-row-hover')); // 保证有列fixed的时候样式一致
            }
        }
        if (record) {
            var target = event.target;
            if (target.tagName !== 'TR') {
                target = target.closest('tr');
            }
            this.setState({ hoverRow: { target: target, rowIndex: rowIndex, record: record } }, function () {
                if (onRow) {
                    onRow.onRowMouseEnter && onRow.onRowMouseEnter(event, record, rowIndex);
                }
            });
        }
    };
    Table.prototype.onRowMouseLeave = function (event, record, rowIndex) {
        var _a = this.props, cx = _a.classnames, onRow = _a.onRow;
        var parent = event.target;
        while (parent && parent.tagName !== 'TR') {
            parent = parent.parentElement;
        }
        if (parent) {
            for (var i = 0; i < parent.children.length; i++) {
                var td = parent.children[i];
                td.classList.remove(cx('Table-cell-row-hover'));
            }
        }
        if (record) {
            if (onRow) {
                onRow.onRowMouseLeave && onRow.onRowMouseLeave(event, record, rowIndex);
            }
        }
    };
    Table.prototype.onMouseLeave = function (event) {
        this.setState({ hoverRow: null });
    };
    Table.prototype.onExpandRow = function (data) {
        var expandedRowKeys = this.state.expandedRowKeys;
        var expandable = this.props.expandable;
        var key = data[this.getExpandableKeyField()];
        this.setState({ expandedRowKeys: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], expandedRowKeys, true), [key], false) });
        (expandable === null || expandable === void 0 ? void 0 : expandable.onExpand) && (expandable === null || expandable === void 0 ? void 0 : expandable.onExpand(true, data));
    };
    Table.prototype.onCollapseRow = function (data) {
        var expandedRowKeys = this.state.expandedRowKeys;
        var expandable = this.props.expandable;
        var key = data[this.getExpandableKeyField()];
        // 还是得模糊匹配 否则'3'、3匹配不上
        this.setState({ expandedRowKeys: expandedRowKeys.filter(function (k) { return k != key; }) });
        (expandable === null || expandable === void 0 ? void 0 : expandable.onExpand) && (expandable === null || expandable === void 0 ? void 0 : expandable.onExpand(false, data));
    };
    Table.prototype.getChildrenColumnName = function () {
        var childrenColumnName = this.props.childrenColumnName;
        return childrenColumnName || 'children';
    };
    Table.prototype.getRowSelectionKeyField = function () {
        var rowSelection = this.props.rowSelection;
        return rowSelection ? rowSelection.keyField || 'key' : '';
    };
    Table.prototype.getExpandableKeyField = function () {
        var _a = this.props, expandable = _a.expandable, keyField = _a.keyField;
        return (expandable === null || expandable === void 0 ? void 0 : expandable.keyField) || keyField || 'key';
    };
    Table.prototype.hasChildrenRow = function (data) {
        var key = this.getChildrenColumnName();
        return data[key] && Array.isArray(data[key]) && data[key].length > 0;
    };
    // 展开和嵌套不能共存
    Table.prototype.isExpandableRow = function (data, rowIndex) {
        var expandable = this.props.expandable;
        return (expandable &&
            expandable.rowExpandable &&
            expandable.rowExpandable(data, rowIndex));
    };
    // 获取当前行数据所有子行的key值
    Table.prototype.getDataChildrenKeys = function (data) {
        var _this = this;
        var keys = [];
        if (this.hasChildrenRow(data)) {
            var key = this.getChildrenColumnName();
            data[key].forEach(function (item) {
                return (keys = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], keys, true), _this.getDataChildrenKeys(item), true), [
                    item[_this.getRowSelectionKeyField()]
                ], false));
            });
        }
        return keys;
    };
    Table.prototype.hasCheckedRows = function (data) {
        var selectedRowKeys = this.state.selectedRowKeys;
        var childrenKeys = this.getDataChildrenKeys(data);
        return ((0, intersection_1.default)(selectedRowKeys, (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], childrenKeys, true), [
            data[this.getRowSelectionKeyField()]
        ], false)).length > 0);
    };
    Table.prototype.hasCheckedChildrenRows = function (data) {
        var selectedRowKeys = this.state.selectedRowKeys;
        var childrenKeys = this.getDataChildrenKeys(data);
        var length = (0, intersection_1.default)(selectedRowKeys, childrenKeys).length;
        return length > 0;
    };
    Table.prototype.getExpandedIcons = function (isExpanded, record) {
        var cx = this.props.classnames;
        return isExpanded ? (react_1.default.createElement("i", { className: cx('Table-expandBtn', 'is-active'), onClick: this.onCollapseRow.bind(this, record) },
            react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" }))) : (react_1.default.createElement("i", { className: cx('Table-expandBtn'), onClick: this.onExpandRow.bind(this, record) },
            react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" })));
    };
    Table.prototype.selectedSingleRow = function (value, data) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, rowSelection, onSelect, defaultKey, isRadio, prevented;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, rowSelection = _a.rowSelection, onSelect = _a.onSelect;
                        defaultKey = this.getRowSelectionKeyField();
                        isRadio = rowSelection && rowSelection.type === 'radio';
                        if (!onSelect) return [3 /*break*/, 2];
                        return [4 /*yield*/, onSelect(data, value, this.selectedRows, this.state.selectedRowKeys)];
                    case 1:
                        prevented = _b.sent();
                        if (prevented) {
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        if (value) {
                            if (isRadio) {
                                this.setState({ selectedRowKeys: [data[defaultKey]] });
                            }
                            else {
                                this.setState(function (prevState) { return ({
                                    selectedRowKeys: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], prevState.selectedRowKeys, true), [
                                        data[defaultKey]
                                    ], false), _this.getDataChildrenKeys(data), true).filter(function (key, i, a) { return a.indexOf(key) === i; })
                                }); });
                            }
                        }
                        else {
                            if (!isRadio) {
                                this.setState({
                                    selectedRowKeys: this.state.selectedRowKeys.filter(function (key) {
                                        return !(0, tslib_1.__spreadArray)([data[defaultKey]], _this.getDataChildrenKeys(data), true).includes(key);
                                    })
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Table.prototype.renderRow = function (data, rowIndex, levels) {
        var _this = this;
        var _a = this.props, cx = _a.classnames, rowSelection = _a.rowSelection, expandable = _a.expandable, draggable = _a.draggable, indentSize = _a.indentSize, rowClassName = _a.rowClassName, lineHeight = _a.lineHeight // 是否设置了固定行高
        ;
        var tdColumns = this.tdColumns;
        var isExpandable = this.isExpandableTable();
        var defaultKey = this.getRowSelectionKeyField();
        var colCount = this.getExtraColumnCount();
        // 当前行是否可展开
        var isExpandableRow = this.isExpandableRow(data, rowIndex);
        // 当前行是否有children
        var hasChildrenRow = this.hasChildrenRow(data);
        var isExpanded = !!(0, find_1.default)(this.state.expandedRowKeys, function (key) { return key == data[_this.getExpandableKeyField()]; }); // == 匹配 否则'3'、3匹配不上
        // 设置缩进效果
        var indentDom = levels.length > 0 ? (react_1.default.createElement("span", { className: cx('Table-row-indent', "indent-level-".concat(levels.length)), style: levels.length > 0
                ? { paddingLeft: (indentSize * levels.length) + 'px' } : {} })) : null;
        var cells = tdColumns.map(function (item, i) {
            var _a, _b;
            var render = item.render && typeof item.render === 'function'
                ? item.render(data[item.key], data, rowIndex, i)
                : null;
            var props = { rowSpan: 1, colSpan: 1 };
            var children = render;
            if (render && (0, helper_1.isObject)(render)) {
                props = render.props;
                children = render.children;
                // 如果合并行 且有展开行，那么合并行不生效
                if (props.rowSpan > 1 && isExpandableRow && hasChildrenRow) {
                    props.rowSpan === 1;
                }
            }
            var className = typeof item.className === 'function'
                ? item.className(data, rowIndex) : '';
            return props.rowSpan === 0 || props.colSpan === 0 ? null : (react_1.default.createElement(Cell_1.default, (0, tslib_1.__assign)({ key: i }, props, { fixed: item.fixed === true ? 'left' : item.fixed, column: item, groupId: item.groupId, className: cx((_a = {},
                    _a["".concat(className)] = !!className,
                    _a)) }),
                react_1.default.createElement("div", { className: cx('Table-cell-wrapper', (_b = {},
                        _b[cx('Table-cell-wrapper-prefix')] = i === 0 &&
                            (!!indentDom || levels.length === 0 && hasChildrenRow),
                        _b[cx("Table-cell-height-".concat(lineHeight))] = !!lineHeight,
                        _b)) },
                    i === 0 && levels.length > 0 ? indentDom : null,
                    i === 0 && hasChildrenRow
                        ? _this.getExpandedIcons(isExpanded, data)
                        : null,
                    render ? children : data[item.key])));
        });
        var rowClassNameClass = rowClassName && typeof rowClassName === 'function'
            ? rowClassName(data, rowIndex)
            : '';
        // 可展开和嵌套不能同时支持
        // 设置了expandable 数据源里有children也就不生效了
        // 拖拽排序 可选、可展开都先不支持了，可以支持嵌套展示
        var checkboxProps = rowSelection && rowSelection.getCheckboxProps
            ? rowSelection.getCheckboxProps(data, rowIndex)
            : {};
        var expandedRowClassName = expandable &&
            expandable.expandedRowClassName &&
            typeof expandable.expandedRowClassName === 'function'
            ? expandable.expandedRowClassName(data, rowIndex)
            : '';
        var dataKey = this.getChildrenColumnName();
        var children = !draggable && isExpandableRow && isExpanded ? (react_1.default.createElement("tr", { key: "expanded", className: cx('Table-expanded-row', expandedRowClassName) },
            react_1.default.createElement(Cell_1.default, { colSpan: tdColumns.length + colCount }, expandable &&
                expandable.expandedRowRender &&
                typeof expandable.expandedRowRender === 'function'
                ? expandable.expandedRowRender(data, rowIndex)
                : null))) : this.hasChildrenRow(data) && isExpanded ? (data[dataKey].map(function (item, index) {
            return _this.renderRow(item, index, (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], levels, true), [rowIndex], false));
        })) : null;
        var isChecked = !!(0, find_1.default)(this.state.selectedRowKeys, function (key) { return key === data[defaultKey]; });
        var hasChildrenChecked = this.hasCheckedChildrenRows(data);
        return [
            react_1.default.createElement("tr", { key: rowIndex, "row-index": rowIndex, "row-levels": levels.join(','), className: cx('Table-row', "Table-row-level-".concat(levels.length), rowClassNameClass, {
                    'Table-row-disabled': !!checkboxProps.disabled
                }), onMouseEnter: function (e) { return _this.onRowMouseEnter(e, data, rowIndex); }, onMouseLeave: function (e) { return _this.onRowMouseLeave(e, data, rowIndex); }, onClick: function (e) { return _this.onRowClick(e, data, rowIndex); } },
                draggable ? (react_1.default.createElement(Cell_1.default, { className: cx('Table-dragCell') },
                    react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))) : null,
                !draggable && rowSelection ? (react_1.default.createElement(Cell_1.default, { fixed: rowSelection.fixed ? 'left' : '', className: cx('Table-checkCell') },
                    react_1.default.createElement(Checkbox_1.default, (0, tslib_1.__assign)({ name: 'Table-checkbox', type: rowSelection.type || 'checkbox', partial: hasChildrenChecked && !isChecked, checked: hasChildrenChecked || isChecked, onChange: function (value, shift) {
                            if (!(rowSelection && rowSelection.rowClick)) {
                                _this.selectedSingleRow(value, data);
                            }
                            event && event.stopPropagation();
                        } }, checkboxProps)))) : null,
                !draggable && isExpandable ? (react_1.default.createElement(Cell_1.default, { fixed: expandable && expandable.fixed ? 'left' : '', className: cx('Table-cell-expand-icon-cell') }, isExpandableRow || hasChildrenRow
                    ? this.getExpandedIcons(isExpanded, data)
                    : null)) : null,
                cells),
            children
        ];
    };
    Table.prototype.renderTBody = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, headSummary = _a.headSummary, scroll = _a.scroll, placeholder = _a.placeholder, sticky = _a.sticky;
        var tdColumns = this.tdColumns;
        var hasScrollY = scroll && scroll.y;
        var colCount = this.getExtraColumnCount();
        return (react_1.default.createElement("tbody", { ref: this.tbodyDom, className: cx('Table-tbody') },
            !hasScrollY && !sticky && headSummary
                ? this.renderSummaryRow(headSummary)
                : null,
            !this.state.dataSource.length ? (react_1.default.createElement("tr", { className: cx('Table-row', 'Table-empty-row') },
                react_1.default.createElement(Cell_1.default, { colSpan: tdColumns.length + colCount },
                    react_1.default.createElement("div", { className: cx('Table-empty') }, typeof placeholder === 'function'
                        ? placeholder()
                        : placeholder)))) : (this.state.dataSource.map(function (data, index) {
                return _this.renderRow(data, index, []);
            }))));
    };
    Table.prototype.isExpandableTable = function () {
        var expandable = this.props.expandable;
        // 设置了expandable 优先级更高
        // 就不支持默认嵌套了
        return !!expandable;
    };
    Table.prototype.isNestedTable = function () {
        var _this = this;
        var dataSource = this.props.dataSource;
        return !!(0, find_1.default)(dataSource, function (item) { return _this.hasChildrenRow(item); });
    };
    Table.prototype.getExtraColumnCount = function () {
        var _a = this.props, draggable = _a.draggable, rowSelection = _a.rowSelection;
        var count = 0;
        if (draggable) {
            count++;
        }
        else {
            if (this.isExpandableTable()) {
                count++;
            }
            if (rowSelection) {
                count++;
            }
        }
        return count;
    };
    Table.prototype.renderSummaryRow = function (summary) {
        var _this = this;
        var _a = this.props, cx = _a.classnames, dataSource = _a.dataSource;
        var cells = [];
        var trs = [];
        var colCount = this.getExtraColumnCount();
        Array.isArray(summary)
            ? summary.forEach(function (s, index) {
                Array.isArray(s)
                    ? trs.push(react_1.default.createElement("tr", { onMouseEnter: function (e) { return _this.onRowMouseEnter(e); }, onMouseLeave: function (e) { return _this.onRowMouseLeave(e); }, key: 'summary-tr-' + index, className: cx('Table-summary-row') }, s.map(function (d, i) {
                        // 将操作列自动添加到第一列，用户的colSpan只需要关心实际的列数
                        var colSpan = i === 0 ? (d.colSpan || 1) + colCount : d.colSpan;
                        return (react_1.default.createElement(Cell_1.default, { key: 'summary-tr-cell-' + i, fixed: d.fixed, colSpan: colSpan }, typeof d.render === 'function'
                            ? d.render(dataSource)
                            : d.render));
                    })))
                    : cells.push(react_1.default.createElement(Cell_1.default, { key: 'summary-cell-' + index, fixed: s.fixed, colSpan: cells.length === 0 ? (s.colSpan || 1) + colCount : s.colSpan }, typeof s.render === 'function'
                        ? s.render(dataSource)
                        : s.render));
            })
            : null;
        return summary
            ? typeof summary === 'function'
                ? summary(dataSource)
                : (0, tslib_1.__spreadArray)([
                    cells.length > 0 ? (react_1.default.createElement("tr", { onMouseEnter: function (e) { return _this.onRowMouseEnter(e); }, onMouseLeave: function (e) { return _this.onRowMouseLeave(e); }, key: "summary-row", className: cx('Table-summary-row') }, cells)) : null
                ], trs, true)
            : null;
    };
    Table.prototype.renderTFoot = function () {
        var _a = this.props, cx = _a.classnames, footSummary = _a.footSummary;
        return (react_1.default.createElement("tfoot", { ref: this.tfootDom, className: cx('Table-summary') }, this.renderSummaryRow(footSummary)));
    };
    Table.prototype.updateTableDom = function (dom) {
        var cx = this.props.classnames;
        var scrollLeft = dom.scrollLeft, scrollWidth = dom.scrollWidth, offsetWidth = dom.offsetWidth;
        var table = this.tableDom.current;
        var leftCalss = cx('Table-ping-left');
        if (scrollLeft > 0) {
            table === null || table === void 0 ? void 0 : table.classList.add(leftCalss);
        }
        else {
            table === null || table === void 0 ? void 0 : table.classList.remove(leftCalss);
        }
        var rightClass = cx('Table-ping-right');
        if (scrollLeft + offsetWidth < scrollWidth) {
            table === null || table === void 0 ? void 0 : table.classList.add(rightClass);
        }
        else {
            table === null || table === void 0 ? void 0 : table.classList.remove(rightClass);
        }
    };
    Table.prototype.onTableContentScroll = function (event) {
        this.updateTableDom(event.target);
    };
    Table.prototype.onWheel = function (event) {
        var _a = event, currentTarget = _a.currentTarget, deltaX = _a.deltaX;
        if (deltaX) {
            this.onTableScroll({
                target: currentTarget,
                scrollLeft: currentTarget.scrollLeft + deltaX
            });
            event.preventDefault();
        }
    };
    Table.prototype.onTableScroll = function (event) {
        var scrollDomRefs = [this.headerDom, this.bodyDom, this.footDom];
        var target = event.target, scrollLeft = event.scrollLeft;
        scrollDomRefs.forEach(function (ref) {
            var current = ref && ref.current;
            if (current && current !== target) {
                current.scrollLeft = scrollLeft || target.scrollLeft;
            }
        });
        this.updateTableDom(target);
    };
    Table.prototype.renderLoading = function () {
        var _a = this.props, cx = _a.classnames, loading = _a.loading;
        return (react_1.default.createElement("div", { className: cx('Table-loading') }, typeof loading === 'boolean' ? react_1.default.createElement(Spinner_1.default, null) : loading));
    };
    Table.prototype.renderTable = function () {
        var _a = this.props, scroll = _a.scroll, footSummary = _a.footSummary, loading = _a.loading, showHeader = _a.showHeader, itemActions = _a.itemActions, cx = _a.classnames;
        // 设置了横向滚动轴 则table的table-layout为fixed
        var hasScrollX = scroll && scroll.x;
        var hoverRow = this.state.hoverRow;
        return (react_1.default.createElement("div", { ref: this.contentDom, className: cx('Table-content'), style: hasScrollX ? { overflow: 'auto hidden' } : {}, onMouseLeave: this.onMouseLeave.bind(this) },
            itemActions && hoverRow
                ? react_1.default.createElement(ItemActionsWrapper_1.default, { dom: hoverRow.target, classnames: cx }, typeof itemActions === 'function'
                    ? itemActions(hoverRow.record, hoverRow.rowIndex) : null) : null,
            react_1.default.createElement("table", { style: hasScrollX
                    ? { width: scroll.x + 'px', tableLayout: 'fixed' }
                    : { tableLayout: 'auto' }, className: cx('Table-table') },
                this.renderColGroup(),
                showHeader ? this.renderTHead() : null,
                !loading ? this.renderTBody() : null,
                !loading && footSummary ? this.renderTFoot() : null),
            loading ? this.renderLoading() : null));
    };
    Table.prototype.renderScrollTableHeader = function () {
        var _a;
        var _b = this.props, scroll = _b.scroll, headSummary = _b.headSummary, sticky = _b.sticky, showHeader = _b.showHeader, cx = _b.classnames;
        var style = { overflow: 'hidden' };
        if (!!sticky) {
            Object.assign(style, { top: 0 });
        }
        var tableStyle = {};
        if (scroll && (scroll.y || scroll.x)) {
            Object.assign(tableStyle, {
                width: scroll && scroll.x ? scroll.x + 'px' : '100%',
                tableLayout: 'fixed'
            });
        }
        return (react_1.default.createElement("div", { ref: this.headerDom, className: cx('Table-header', (_a = {},
                _a[cx('Table-sticky-holder')] = !!sticky,
                _a)), style: style },
            react_1.default.createElement("table", { className: cx('Table-table'), style: tableStyle },
                this.renderColGroup(this.state.colWidths),
                showHeader ? this.renderTHead() : null,
                headSummary ? (react_1.default.createElement("tbody", null, this.renderSummaryRow(headSummary))) : null)));
    };
    Table.prototype.renderScrollTableBody = function () {
        var _a = this.props, scroll = _a.scroll, itemActions = _a.itemActions, cx = _a.classnames;
        var style = {};
        var tableStyle = {};
        if (scroll && (scroll.y || scroll.x)) {
            Object.assign(style, {
                overflow: 'auto scroll',
                maxHeight: scroll.y
            });
            Object.assign(tableStyle, {
                width: scroll && scroll.x ? scroll.x + 'px' : '100%',
                tableLayout: 'fixed'
            });
        }
        var hoverRow = this.state.hoverRow;
        return (react_1.default.createElement("div", { ref: this.bodyDom, className: cx('Table-body'), style: style, onMouseLeave: this.onMouseLeave.bind(this) },
            itemActions && hoverRow
                ? react_1.default.createElement(ItemActionsWrapper_1.default, { dom: hoverRow.target, classnames: cx }, typeof itemActions === 'function'
                    ? itemActions(hoverRow.record, hoverRow.rowIndex) : null) : null,
            react_1.default.createElement("table", { className: cx('Table-table'), style: tableStyle },
                this.renderColGroup(),
                this.renderTBody())));
    };
    Table.prototype.renderScrollTableFoot = function () {
        var _a = this.props, scroll = _a.scroll, cx = _a.classnames;
        return (react_1.default.createElement("div", { ref: this.footDom, className: cx('Table-summary'), style: { overflow: 'hidden' } },
            react_1.default.createElement("table", { className: cx('Table-table'), style: { width: (scroll === null || scroll === void 0 ? void 0 : scroll.x) + 'px' || '100%', tableLayout: 'fixed' } }, this.renderTFoot())));
    };
    Table.prototype.renderScrollTable = function () {
        var _a = this.props, footSummary = _a.footSummary, loading = _a.loading, cx = _a.classnames;
        return (react_1.default.createElement("div", { className: cx('Table-container') },
            this.renderScrollTableHeader(),
            !loading ? this.renderScrollTableBody() : null,
            !loading && footSummary ? this.renderScrollTableFoot() : null,
            loading ? this.renderLoading() : null));
    };
    Table.prototype.render = function () {
        var _a;
        var _b = this.props, title = _b.title, footer = _b.footer, className = _b.className, scroll = _b.scroll, size = _b.size, bordered = _b.bordered, resizable = _b.resizable, columns = _b.columns, sticky = _b.sticky, cx = _b.classnames;
        // 过滤掉设置了breakpoint属性的列
        var filterColumns = columns.filter(function (item) { return !item.breakpoint || !(0, helper_1.isBreakpoint)(item.breakpoint); });
        this.thColumns = [];
        this.tdColumns = [];
        buildColumns(filterColumns, this.thColumns, this.tdColumns);
        // 是否设置了纵向滚动
        var hasScrollY = scroll && scroll.y;
        // 是否设置了横向滚动
        var hasScrollX = scroll && scroll.x;
        return (react_1.default.createElement("div", { ref: this.tableDom, className: cx('Table-v2', className, (_a = {},
                _a[cx('Table-scroll-horizontal')] = hasScrollX,
                _a[cx("Table-".concat(size))] = size,
                _a[cx('Table-bordered')] = bordered,
                _a[cx('Table-resizable')] = resizable,
                _a)) },
            title ? (react_1.default.createElement("div", { className: cx('Table-title') }, typeof title === 'function' ? title() : title)) : null,
            hasScrollY || sticky ? (this.renderScrollTable()) : (react_1.default.createElement("div", { className: cx('Table-container') }, this.renderTable())),
            footer ? (react_1.default.createElement("div", { className: cx('Table-footer') }, typeof footer === 'function' ? footer() : footer)) : null));
    };
    Table.defaultProps = {
        title: '',
        className: '',
        dataSource: [],
        columns: [],
        indentSize: 15,
        placeholder: '暂无数据',
        showHeader: true
    };
    return Table;
}(react_1.default.PureComponent));
exports.Table = Table;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Table));
//# sourceMappingURL=./components/table/index.js.map
