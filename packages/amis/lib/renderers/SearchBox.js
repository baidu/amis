"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBoxRenderer = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("../factory");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var SearchBox_1 = (0, tslib_1.__importDefault)(require("../components/SearchBox"));
var helper_1 = require("../utils/helper");
var SearchBoxRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SearchBoxRenderer, _super);
    function SearchBoxRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: (0, helper_1.getPropValue)(props) || ''
        };
        return _this;
    }
    SearchBoxRenderer.prototype.handleChange = function (value) {
        this.setState({ value: value });
    };
    SearchBoxRenderer.prototype.handleCancel = function () {
        var name = this.props.name;
        var onQuery = this.props.onQuery;
        var value = (0, helper_1.getPropValue)(this.props);
        if (value !== '') {
            var data = {};
            (0, helper_1.setVariable)(data, name, '');
            onQuery === null || onQuery === void 0 ? void 0 : onQuery(data);
        }
    };
    SearchBoxRenderer.prototype.handleSearch = function (text) {
        var _a = this.props, name = _a.name, onQuery = _a.onQuery;
        var data = {};
        (0, helper_1.setVariable)(data, name, text);
        onQuery === null || onQuery === void 0 ? void 0 : onQuery(data);
    };
    SearchBoxRenderer.prototype.render = function () {
        var _a = this.props, data = _a.data, name = _a.name, onQuery = _a.onQuery, mini = _a.mini, searchImediately = _a.searchImediately, placeholder = _a.placeholder, onChange = _a.onChange, className = _a.className;
        var value = this.state.value;
        return (react_1.default.createElement(SearchBox_1.default, { className: className, name: name, disabled: !onQuery, defaultActive: !!value, defaultValue: onChange ? undefined : value, value: value, mini: mini, searchImediately: searchImediately, onSearch: this.handleSearch, onCancel: this.handleCancel, placeholder: placeholder, onChange: this.handleChange }));
    };
    SearchBoxRenderer.defaultProps = {
        name: 'keywords',
        mini: false,
        searchImediately: false
    };
    SearchBoxRenderer.propsList = ['mini', 'searchImediately'];
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBoxRenderer.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBoxRenderer.prototype, "handleCancel", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBoxRenderer.prototype, "handleSearch", null);
    SearchBoxRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'search-box'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object])
    ], SearchBoxRenderer);
    return SearchBoxRenderer;
}(react_1.default.Component));
exports.SearchBoxRenderer = SearchBoxRenderer;
//# sourceMappingURL=./renderers/SearchBox.js.map
