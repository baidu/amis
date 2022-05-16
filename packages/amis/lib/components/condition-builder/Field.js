"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var PopOverContainer_1 = (0, tslib_1.__importDefault)(require("../PopOverContainer"));
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("../GroupedSelection"));
var ResultBox_1 = (0, tslib_1.__importDefault)(require("../ResultBox"));
var theme_1 = require("../../theme");
var icons_1 = require("../icons");
var helper_1 = require("../../utils/helper");
var locale_1 = require("../../locale");
var SearchBox_1 = (0, tslib_1.__importDefault)(require("../SearchBox"));
var option2value = function (item) { return item.name; };
var ConditionField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ConditionField, _super);
    function ConditionField(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            searchText: ''
        };
        _this.onSearch = _this.onSearch.bind(_this);
        _this.filterOptions = _this.filterOptions.bind(_this);
        return _this;
    }
    ConditionField.prototype.onSearch = function (text) {
        var txt = text.toLowerCase();
        this.setState({ searchText: txt });
    };
    ConditionField.prototype.filterOptions = function (options) {
        var txt = this.state.searchText;
        if (!txt) {
            return this.props.options;
        }
        return options
            .map(function (item) {
            if (item.children) {
                var children = item.children.filter(function (child) {
                    return (child.name.toLowerCase().includes(txt) ||
                        child.label.toLowerCase().includes(txt));
                });
                return children.length > 0
                    ? Object.assign({}, item, { children: children }) // 需要copy一份，防止覆盖原始数据
                    : false;
            }
            else {
                return item.name.toLowerCase().includes(txt) ||
                    item.label.toLowerCase().includes(txt)
                    ? item
                    : false;
            }
        })
            .filter(function (item) {
            return !!item;
        });
    };
    // 选了值，还原options
    ConditionField.prototype.onPopClose = function (e, onClose) {
        this.setState({ searchText: '' });
        onClose();
    };
    ConditionField.prototype.render = function () {
        var _this = this;
        var _a = this.props, options = _a.options, onChange = _a.onChange, value = _a.value, cx = _a.classnames, fieldClassName = _a.fieldClassName, disabled = _a.disabled, __ = _a.translate, searchable = _a.searchable, popOverContainer = _a.popOverContainer;
        return (react_1.default.createElement(PopOverContainer_1.default, { popOverContainer: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), popOverRender: function (_a) {
                var onClose = _a.onClose;
                return (react_1.default.createElement(react_1.default.Fragment, null,
                    searchable ? (react_1.default.createElement(SearchBox_1.default, { mini: false, onSearch: _this.onSearch })) : null,
                    react_1.default.createElement(GroupedSelection_1.default, { multiple: false, onClick: function (e) { return _this.onPopClose(e, onClose); }, options: _this.filterOptions(_this.props.options), value: [value], option2value: option2value, onChange: function (value) {
                            return onChange(Array.isArray(value) ? value[0] : value);
                        } })));
            } }, function (_a) {
            var onClick = _a.onClick, ref = _a.ref, isOpened = _a.isOpened;
            return (react_1.default.createElement("div", { className: cx('CBGroup-field') },
                react_1.default.createElement(ResultBox_1.default, { className: cx('CBGroup-fieldInput', fieldClassName, isOpened ? 'is-active' : ''), ref: ref, allowInput: false, result: value ? (0, helper_1.findTree)(options, function (item) { return item.name === value; }) : '', onResultChange: helper_1.noop, onResultClick: onClick, placeholder: __('Condition.field_placeholder'), disabled: disabled },
                    react_1.default.createElement("span", { className: cx('CBGroup-fieldCaret') },
                        react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" })))));
        }));
    };
    return ConditionField;
}(react_1.default.Component));
exports.ConditionField = ConditionField;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(ConditionField));
//# sourceMappingURL=./components/condition-builder/Field.js.map
