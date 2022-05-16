"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputBoxWithSuggestion = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var locale_1 = require("../locale");
var theme_1 = require("../theme");
// @ts-ignore
var match_sorter_1 = require("match-sorter");
var PopOverContainer_1 = (0, tslib_1.__importDefault)(require("./PopOverContainer"));
var SearchBox_1 = (0, tslib_1.__importDefault)(require("./SearchBox"));
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("./GroupedSelection"));
var InputBox_1 = (0, tslib_1.__importDefault)(require("./InputBox"));
var icons_1 = require("./icons");
var option2value = function (item) { return item.value; };
var InputBoxWithSuggestion = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(InputBoxWithSuggestion, _super);
    function InputBoxWithSuggestion(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            searchText: ''
        };
        _this.onSearch = _this.onSearch.bind(_this);
        _this.filterOptions = _this.filterOptions.bind(_this);
        return _this;
    }
    InputBoxWithSuggestion.prototype.onSearch = function (text) {
        var txt = text.toLowerCase();
        this.setState({ searchText: txt });
    };
    InputBoxWithSuggestion.prototype.filterOptions = function (options) {
        return (0, match_sorter_1.matchSorter)(options, this.props.value, {
            keys: ['label', 'value']
        });
    };
    // 选了值，还原options
    InputBoxWithSuggestion.prototype.onPopClose = function (e, onClose) {
        this.setState({ searchText: '' });
        onClose();
    };
    InputBoxWithSuggestion.prototype.render = function () {
        var _this = this;
        var _a = this.props, placeholder = _a.placeholder, onChange = _a.onChange, value = _a.value, cx = _a.classnames, disabled = _a.disabled, __ = _a.translate, searchable = _a.searchable, popOverContainer = _a.popOverContainer, clearable = _a.clearable, hasError = _a.hasError;
        var options = this.filterOptions(this.props.options);
        return (react_1.default.createElement(PopOverContainer_1.default, { popOverContainer: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), popOverRender: function (_a) {
                var onClose = _a.onClose;
                return (react_1.default.createElement(react_1.default.Fragment, null,
                    searchable ? (react_1.default.createElement(SearchBox_1.default, { mini: false, onSearch: _this.onSearch })) : null,
                    react_1.default.createElement(GroupedSelection_1.default, { multiple: false, onClick: function (e) { return _this.onPopClose(e, onClose); }, options: options, value: [value], option2value: option2value, onChange: function (value) {
                            onChange === null || onChange === void 0 ? void 0 : onChange(value);
                        } })));
            } }, function (_a) {
            var _b, _c;
            var onClick = _a.onClick, ref = _a.ref, isOpened = _a.isOpened;
            return (react_1.default.createElement(InputBox_1.default, { className: cx('InputBox--sug', isOpened ? 'is-active' : ''), ref: ref, placeholder: placeholder, disabled: disabled, value: (_c = (_b = options.find(function (o) { return o.value === value; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : value, onChange: onChange, clearable: clearable, onClick: onClick, hasError: hasError },
                react_1.default.createElement("span", { className: cx('InputBox-caret') },
                    react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))));
        }));
    };
    return InputBoxWithSuggestion;
}(react_1.default.Component));
exports.InputBoxWithSuggestion = InputBoxWithSuggestion;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(InputBoxWithSuggestion));
//# sourceMappingURL=./components/InputBoxWithSuggestion.js.map
