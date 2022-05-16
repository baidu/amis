"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnsSplit = void 0;
var tslib_1 = require("tslib");
/**
 * columnsCount 支持数字和数组两种格式
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var chunk_1 = (0, tslib_1.__importDefault)(require("lodash/chunk"));
function columnsSplit(body, cx, columnsCount) {
    if (Array.isArray(columnsCount) && columnsCount.length) {
        var bodyIndex_1 = 0;
        var bodyList_1 = [];
        var maxSize = Math.max(Math.round(12 / Math.max.apply(Math, columnsCount)), 1);
        var cellClassName_1 = "Grid-col--sm".concat(maxSize);
        columnsCount.forEach(function (columnSize, groupIndex) {
            if (columnSize) {
                bodyList_1.push(react_1.default.createElement("div", { className: cx('Grid'), key: groupIndex }, Array.from({ length: columnSize }).map(function (_, index) {
                    if (bodyIndex_1 + index < body.length) {
                        // 避免溢出
                        return (react_1.default.createElement("div", { key: index, className: cx(cellClassName_1) }, body[bodyIndex_1 + index]));
                    }
                    else {
                        return null;
                    }
                })));
                bodyIndex_1 = bodyIndex_1 + columnSize;
            }
        });
        body = bodyList_1;
    }
    else if (typeof columnsCount === 'number' && columnsCount > 1) {
        var weight = 12 / columnsCount;
        var cellClassName_2 = "Grid-col--sm".concat(weight === Math.round(weight) ? weight : '');
        body = (0, chunk_1.default)(body, columnsCount).map(function (group, groupIndex) { return (react_1.default.createElement("div", { className: cx('Grid'), key: groupIndex }, Array.from({ length: columnsCount }).map(function (_, index) { return (react_1.default.createElement("div", { key: index, className: cx(cellClassName_2) }, group[index])); }))); });
    }
    return body;
}
exports.columnsSplit = columnsSplit;
//# sourceMappingURL=./utils/columnsSplit.js.map
