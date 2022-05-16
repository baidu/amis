"use strict";
/**
 * 导出 Excel 功能
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportExcel = void 0;
var tslib_1 = require("tslib");
var tpl_1 = require("../../utils/tpl");
require("./ColumnToggler");
var table_1 = require("../../store/table");
var file_saver_1 = require("file-saver");
var helper_1 = require("../../utils/helper");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var image_1 = require("../../utils/image");
var mobx_state_tree_1 = require("mobx-state-tree");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
/**
 * 将 url 转成绝对地址
 */
var getAbsoluteUrl = (function () {
    var link;
    return function (url) {
        if (!link)
            link = document.createElement('a');
        link.href = url;
        return link.href;
    };
})();
function exportExcel(ExcelJS, props, toolbar) {
    var _a, _b;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var store, env, cx, __, data, columns, rows, tmpStore, filename, res, workbook, worksheet, exportColumnNames, filteredColumns, firstRowLabels, firstRow, remoteMappingCache, rowIndex, _i, rows_1, row, sheetRow, columIndex, _c, filteredColumns_1, column, name, value, type, imageData, imageDimensions, imageWidth, imageHeight, imageMaxSize, imageMatch, imageExt, imageId, linkURL, e_1, linkURL, map, source, sourceValue, mapKey, res, viewValue, viewValue, _d, fromNow, _e, format, _f, valueFormat, ISODate, NormalDate, buffer, blob;
        return (0, tslib_1.__generator)(this, function (_g) {
            switch (_g.label) {
                case 0:
                    store = props.store, env = props.env, cx = props.classnames, __ = props.translate, data = props.data;
                    columns = store.exportColumns || [];
                    rows = [];
                    filename = 'data';
                    if (!(typeof toolbar === 'object' && toolbar.api)) return [3 /*break*/, 2];
                    return [4 /*yield*/, env.fetcher(toolbar.api, data)];
                case 1:
                    res = _g.sent();
                    if (!res.data) {
                        env.notify('warning', __('placeholder.noData'));
                        return [2 /*return*/];
                    }
                    if (Array.isArray(res.data)) {
                        rows = res.data;
                    }
                    else {
                        rows = res.data.rows || res.data.items;
                    }
                    // 因为很多方法是 store 里的，所以需要构建 store 来处理
                    tmpStore = table_1.TableStore.create((0, mobx_state_tree_1.getSnapshot)(store));
                    tmpStore.initRows(rows);
                    rows = tmpStore.rows;
                    return [3 /*break*/, 3];
                case 2:
                    rows = store.rows;
                    _g.label = 3;
                case 3:
                    if (typeof toolbar === 'object' && toolbar.filename) {
                        filename = (0, tpl_1.filter)(toolbar.filename, data, '| raw');
                    }
                    if (rows.length === 0) {
                        env.notify('warning', __('placeholder.noData'));
                        return [2 /*return*/];
                    }
                    workbook = new ExcelJS.Workbook();
                    worksheet = workbook.addWorksheet('sheet', {
                        properties: { defaultColWidth: 15 }
                    });
                    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
                    exportColumnNames = toolbar.columns;
                    if ((0, tpl_builtin_1.isPureVariable)(exportColumnNames)) {
                        exportColumnNames = (0, tpl_builtin_1.resolveVariableAndFilter)(exportColumnNames, data, '| raw');
                    }
                    // 自定义导出列配置
                    if (toolbar.exportColumns && Array.isArray(toolbar.exportColumns)) {
                        columns = toolbar.exportColumns;
                    }
                    filteredColumns = exportColumnNames
                        ? columns.filter(function (column) {
                            var filterColumnsNames = exportColumnNames;
                            if (column.name && filterColumnsNames.indexOf(column.name) !== -1) {
                                return true;
                            }
                            return false;
                        })
                        : columns;
                    firstRowLabels = filteredColumns.map(function (column) {
                        return column.label;
                    });
                    firstRow = worksheet.getRow(1);
                    firstRow.values = firstRowLabels;
                    worksheet.autoFilter = {
                        from: {
                            row: 1,
                            column: 1
                        },
                        to: {
                            row: 1,
                            column: firstRowLabels.length
                        }
                    };
                    remoteMappingCache = {};
                    rowIndex = 1;
                    _i = 0, rows_1 = rows;
                    _g.label = 4;
                case 4:
                    if (!(_i < rows_1.length)) return [3 /*break*/, 19];
                    row = rows_1[_i];
                    rowIndex += 1;
                    sheetRow = worksheet.getRow(rowIndex);
                    columIndex = 0;
                    _c = 0, filteredColumns_1 = filteredColumns;
                    _g.label = 5;
                case 5:
                    if (!(_c < filteredColumns_1.length)) return [3 /*break*/, 18];
                    column = filteredColumns_1[_c];
                    columIndex += 1;
                    name = column.name;
                    value = (0, helper_1.getVariable)(row.data, name);
                    if (typeof value === 'undefined' && !column.tpl) {
                        return [3 /*break*/, 17];
                    }
                    // 处理合并单元格
                    if (name in row.rowSpans) {
                        if (row.rowSpans[name] === 0) {
                            return [3 /*break*/, 17];
                        }
                        else {
                            // start row, start column, end row, end column
                            worksheet.mergeCells(rowIndex, columIndex, rowIndex + row.rowSpans[name] - 1, columIndex);
                        }
                    }
                    type = column.type || 'plain';
                    if (!(type === 'image' && value)) return [3 /*break*/, 11];
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, 9, , 10]);
                    return [4 /*yield*/, (0, image_1.toDataURL)(value)];
                case 7:
                    imageData = _g.sent();
                    return [4 /*yield*/, (0, image_1.getImageDimensions)(imageData)];
                case 8:
                    imageDimensions = _g.sent();
                    imageWidth = imageDimensions.width;
                    imageHeight = imageDimensions.height;
                    imageMaxSize = 100;
                    if (imageWidth > imageHeight) {
                        if (imageWidth > imageMaxSize) {
                            imageHeight = (imageMaxSize * imageHeight) / imageWidth;
                            imageWidth = imageMaxSize;
                        }
                    }
                    else {
                        if (imageHeight > imageMaxSize) {
                            imageWidth = (imageMaxSize * imageWidth) / imageHeight;
                            imageHeight = imageMaxSize;
                        }
                    }
                    imageMatch = imageData.match(/data:image\/(.*);/);
                    imageExt = 'png';
                    if (imageMatch) {
                        imageExt = imageMatch[1];
                    }
                    // 目前 excel 只支持这些格式，所以其它格式直接输出 url
                    if (imageExt != 'png' && imageExt != 'jpeg' && imageExt != 'gif') {
                        sheetRow.getCell(columIndex).value = value;
                        return [3 /*break*/, 17];
                    }
                    imageId = workbook.addImage({
                        base64: imageData,
                        extension: imageExt
                    });
                    linkURL = getAbsoluteUrl(value);
                    worksheet.addImage(imageId, {
                        // 这里坐标位置是从 0 开始的，所以要减一
                        tl: { col: columIndex - 1, row: rowIndex - 1 },
                        ext: {
                            width: imageWidth,
                            height: imageHeight
                        },
                        hyperlinks: {
                            tooltip: linkURL
                        }
                    });
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _g.sent();
                    console.warn(e_1.stack);
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 17];
                case 11:
                    if (!(type == 'link')) return [3 /*break*/, 12];
                    linkURL = getAbsoluteUrl(value);
                    sheetRow.getCell(columIndex).value = {
                        text: value,
                        hyperlink: linkURL
                    };
                    return [3 /*break*/, 17];
                case 12:
                    if (!(type === 'mapping')) return [3 /*break*/, 16];
                    map = column.map;
                    source = column.source;
                    if (!source) return [3 /*break*/, 15];
                    sourceValue = source;
                    if ((0, tpl_builtin_1.isPureVariable)(source)) {
                        sourceValue = (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw');
                    }
                    mapKey = JSON.stringify(source);
                    if (!(mapKey in remoteMappingCache)) return [3 /*break*/, 13];
                    map = remoteMappingCache[mapKey];
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, env.fetcher(sourceValue, data)];
                case 14:
                    res = _g.sent();
                    if (res.data) {
                        remoteMappingCache[mapKey] = res.data;
                        map = res.data;
                    }
                    _g.label = 15;
                case 15:
                    if (typeof value !== 'undefined' && map && ((_a = map[value]) !== null && _a !== void 0 ? _a : map['*'])) {
                        viewValue = (_b = map[value]) !== null && _b !== void 0 ? _b : (value === true && map['1']
                            ? map['1']
                            : value === false && map['0']
                                ? map['0']
                                : map['*']);
                        sheetRow.getCell(columIndex).value = (0, helper_1.removeHTMLTag)(viewValue);
                    }
                    else {
                        sheetRow.getCell(columIndex).value = (0, helper_1.removeHTMLTag)(value);
                    }
                    return [3 /*break*/, 17];
                case 16:
                    if (type === 'date') {
                        viewValue = void 0;
                        _d = column, fromNow = _d.fromNow, _e = _d.format, format = _e === void 0 ? 'YYYY-MM-DD' : _e, _f = _d.valueFormat, valueFormat = _f === void 0 ? 'X' : _f;
                        if (value) {
                            ISODate = (0, moment_1.default)(value, moment_1.default.ISO_8601);
                            NormalDate = (0, moment_1.default)(value, valueFormat);
                            viewValue = ISODate.isValid()
                                ? ISODate.format(format)
                                : NormalDate.isValid()
                                    ? NormalDate.format(format)
                                    : false;
                        }
                        if (fromNow) {
                            viewValue = (0, moment_1.default)(value).fromNow();
                        }
                        if (viewValue) {
                            sheetRow.getCell(columIndex).value = viewValue;
                        }
                    }
                    else {
                        if (column.tpl) {
                            sheetRow.getCell(columIndex).value = (0, helper_1.removeHTMLTag)((0, tpl_1.filter)(column.tpl, (0, helper_1.createObject)(data, row.data)));
                        }
                        else {
                            sheetRow.getCell(columIndex).value = value;
                        }
                    }
                    _g.label = 17;
                case 17:
                    _c++;
                    return [3 /*break*/, 5];
                case 18:
                    _i++;
                    return [3 /*break*/, 4];
                case 19: return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                case 20:
                    buffer = _g.sent();
                    if (buffer) {
                        blob = new Blob([buffer], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        (0, file_saver_1.saveAs)(blob, filename + '.xlsx');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.exportExcel = exportExcel;
//# sourceMappingURL=./renderers/Table/exportExcel.js.map
