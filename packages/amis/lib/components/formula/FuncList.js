"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncList = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var Collapse_1 = (0, tslib_1.__importDefault)(require("../Collapse"));
var CollapseGroup_1 = (0, tslib_1.__importDefault)(require("../CollapseGroup"));
var SearchBox_1 = (0, tslib_1.__importDefault)(require("../SearchBox"));
var icon_1 = require("../../utils/icon");
function FuncList(props) {
    var _a;
    var title = props.title, className = props.className, cx = props.classnames, bodyClassName = props.bodyClassName, descClassName = props.descClassName;
    var _b = react_1.default.useState(props.data), filteredFuncs = _b[0], setFiteredFuncs = _b[1];
    var _c = react_1.default.useState(null), activeFunc = _c[0], setActiveFunc = _c[1];
    function onSearch(term) {
        var filtered = props.data
            .map(function (item) {
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { items: term
                    ? item.items.filter(function (item) { return ~item.name.indexOf(term.toUpperCase()); })
                    : item.items });
        })
            .filter(function (item) { return item.items.length; });
        setFiteredFuncs(filtered);
    }
    return (react_1.default.createElement("div", { className: cx('FormulaEditor-FuncList', className) },
        react_1.default.createElement("div", { className: cx('FormulaEditor-panel') },
            react_1.default.createElement("div", { className: cx('FormulaEditor-panel-header') }, title),
            react_1.default.createElement("div", { className: cx('FormulaEditor-panel-body') },
                react_1.default.createElement("div", { className: cx('FormulaEditor-FuncList-searchBox') },
                    react_1.default.createElement(SearchBox_1.default, { mini: false, onSearch: onSearch })),
                react_1.default.createElement("div", { className: cx('FormulaEditor-FuncList-body', bodyClassName) },
                    react_1.default.createElement(CollapseGroup_1.default, { className: cx('FormulaEditor-FuncList-collapseGroup'), defaultActiveKey: (_a = filteredFuncs[0]) === null || _a === void 0 ? void 0 : _a.groupName, expandIcon: (0, icon_1.generateIcon)(cx, 'fa fa-chevron-right FormulaEditor-FuncList-expandIcon', 'Icon'), accordion: true }, filteredFuncs.map(function (item) { return (react_1.default.createElement(Collapse_1.default, { className: cx('FormulaEditor-FuncList-collapse'), headingClassName: cx('FormulaEditor-FuncList-groupTitle'), bodyClassName: cx('FormulaEditor-FuncList-groupBody'), propKey: item.groupName, header: item.groupName, key: item.groupName }, item.items.map(function (item) { return (react_1.default.createElement("div", { className: cx('FormulaEditor-FuncList-item', {
                            'is-active': item.name === (activeFunc === null || activeFunc === void 0 ? void 0 : activeFunc.name)
                        }), onMouseEnter: function () { return setActiveFunc(item); }, onClick: function () { var _a; return (_a = props.onSelect) === null || _a === void 0 ? void 0 : _a.call(props, item); }, key: item.name }, item.name)); }))); }))))),
        react_1.default.createElement("div", { className: cx('FormulaEditor-panel') },
            react_1.default.createElement("div", { className: cx('FormulaEditor-panel-header') }, (activeFunc === null || activeFunc === void 0 ? void 0 : activeFunc.name) || ''),
            react_1.default.createElement("div", { className: cx('FormulaEditor-panel-body') },
                react_1.default.createElement("div", { className: cx('FormulaEditor-FuncList-doc', descClassName) }, activeFunc ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("pre", null,
                        react_1.default.createElement("code", null, activeFunc.example)),
                    react_1.default.createElement("div", { className: cx('FormulaEditor-FuncList-doc-desc') }, activeFunc.description))) : null)))));
}
exports.FuncList = FuncList;
exports.default = (0, theme_1.themeable)(FuncList);
//# sourceMappingURL=./components/formula/FuncList.js.map
