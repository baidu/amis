"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("../GroupedSelection"));
var Tabs_1 = tslib_1.__importStar(require("../Tabs"));
var TreeSelection_1 = (0, tslib_1.__importDefault)(require("../TreeSelection"));
var SearchBox_1 = (0, tslib_1.__importDefault)(require("../SearchBox"));
var helper_1 = require("../../utils/helper");
function VariableList(props) {
    var list = props.data, className = props.className, cx = props.classnames, _a = props.tabsMode, tabsMode = _a === void 0 ? 'line' : _a, themePrefix = props.classPrefix, itemClassName = props.itemClassName, selectMode = props.selectMode, onSelect = props.onSelect;
    var _b = react_1.default.useState(list), filterVars = _b[0], setFilterVars = _b[1];
    var classPrefix = "".concat(themePrefix, "FormulaEditor-VariableList");
    var itemRender = props.itemRender && typeof props.itemRender === 'function'
        ? props.itemRender
        : function (option, states) {
            return (react_1.default.createElement("span", { className: cx("".concat(classPrefix, "-item"), itemClassName) },
                react_1.default.createElement("label", null, option.label),
                (option === null || option === void 0 ? void 0 : option.tag) ? (react_1.default.createElement("span", { className: cx("".concat(classPrefix, "-item-tag")) }, option.tag)) : null));
        };
    function onSearch(term) {
        var flatten = (0, helper_1.flattenTree)(list);
        var filtered = flatten.filter(function (item) { return ~item.label.indexOf(term); });
        setFilterVars(!term ? list : filtered);
    }
    function renderSearchBox() {
        return (react_1.default.createElement("div", { className: cx('FormulaEditor-VariableList-searchBox') },
            react_1.default.createElement(SearchBox_1.default, { mini: false, onSearch: onSearch })));
    }
    return (react_1.default.createElement("div", { className: cx(className, 'FormulaEditor-VariableList', selectMode && "FormulaEditor-VariableList-".concat(selectMode)) }, selectMode === 'tabs' ? (react_1.default.createElement(Tabs_1.default, { tabsMode: tabsMode, className: cx("".concat(classPrefix, "-base ").concat(classPrefix, "-tabs")) }, filterVars.map(function (item, index) { return (react_1.default.createElement(Tabs_1.Tab, { className: cx("".concat(classPrefix, "-tab")), eventKey: index, key: index, title: item.label },
        react_1.default.createElement(VariableList, { classnames: cx, classPrefix: "".concat(classPrefix, "-sub-"), className: cx("".concat(classPrefix, "-sub")), itemRender: itemRender, selectMode: item.selectMode, data: item.children, onSelect: onSelect }))); }))) : selectMode === 'tree' ? (react_1.default.createElement("div", { className: cx('FormulaEditor-VariableList-body') },
        renderSearchBox(),
        react_1.default.createElement(TreeSelection_1.default, { itemRender: itemRender, className: cx("".concat(classPrefix, "-base"), 'is-scrollable'), multiple: false, options: filterVars, onChange: function (item) { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(item); } }))) : (react_1.default.createElement("div", { className: cx('FormulaEditor-VariableList-body') },
        renderSearchBox(),
        react_1.default.createElement(GroupedSelection_1.default, { itemRender: itemRender, className: cx("".concat(classPrefix, "-base"), 'is-scrollable'), multiple: false, options: filterVars, onChange: function (item) { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(item); } })))));
}
exports.default = (0, theme_1.themeable)(VariableList);
//# sourceMappingURL=./components/formula/VariableList.js.map
