"use strict";
/**
 * @file table/HeadCellSelect
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellSelect = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var HeadCellDropDown_1 = (0, tslib_1.__importDefault)(require("./HeadCellDropDown"));
var icons_1 = require("../icons");
var HeadCellSelect = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellSelect, _super);
    function HeadCellSelect(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            key: ''
        };
        return _this;
    }
    HeadCellSelect.prototype.render = function () {
        var _this = this;
        var _a = this.props, selections = _a.selections, allKeys = _a.keys, popOverContainer = _a.popOverContainer, cx = _a.classnames, ns = _a.classPrefix;
        return (react_1.default.createElement(HeadCellDropDown_1.default, { className: "".concat(ns, "TableCell-selectionBtn"), layerClassName: "".concat(ns, "TableCell-selectionPopOver"), filterIcon: react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" }), active: false, popOverContainer: popOverContainer ? popOverContainer : function () { return (0, react_dom_1.findDOMNode)(_this); }, filterDropdown: function (_a) {
                var setSelectedKeys = _a.setSelectedKeys, selectedKeys = _a.selectedKeys, confirm = _a.confirm, clearFilters = _a.clearFilters;
                return react_1.default.createElement("ul", { className: cx('DropDown-menu') }, selections.map(function (item, index) { return (react_1.default.createElement("li", { key: index, onClick: function () {
                        item.onSelect && item.onSelect(allKeys);
                        _this.handleClick(confirm, setSelectedKeys, item.key);
                    } }, item.text)); }));
            }, setSelectedKeys: function (keys) { return _this.setState({ key: keys }); }, selectedKeys: this.state.key }));
    };
    HeadCellSelect.prototype.handleClick = function (confirm, setSelectedKeys, selectedKeys) {
        setSelectedKeys && setSelectedKeys(selectedKeys);
        confirm();
    };
    HeadCellSelect.defaultProps = {
        selections: []
    };
    return HeadCellSelect;
}(react_1.default.Component));
exports.HeadCellSelect = HeadCellSelect;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(HeadCellSelect));
//# sourceMappingURL=./components/table/HeadCellSelect.js.map
