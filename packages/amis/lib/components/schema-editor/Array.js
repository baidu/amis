"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaEditorItemArray = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../../utils/helper");
var icons_1 = require("../icons");
var Common_1 = require("./Common");
var Item_1 = require("./Item");
var SchemaEditorItemArray = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaEditorItemArray, _super);
    function SchemaEditorItemArray() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            collapsed: false
        };
        return _this;
    }
    SchemaEditorItemArray.prototype.toggleCollapsed = function () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };
    SchemaEditorItemArray.prototype.handleItemsChange = function (items) {
        var _a, _b;
        var value = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props.value), { type: 'array', items: items });
        (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    SchemaEditorItemArray.prototype.renderItems = function () {
        var _a;
        var _b = this.props, cx = _b.classnames, value = _b.value, renderExtraProps = _b.renderExtraProps, renderModalProps = _b.renderModalProps, locale = _b.locale, __ = _b.translate, classPrefix = _b.classPrefix, disabled = _b.disabled, showInfo = _b.showInfo, types = _b.types, onTypeChange = _b.onTypeChange, enableAdvancedSetting = _b.enableAdvancedSetting;
        var items = (value === null || value === void 0 ? void 0 : value.items) || {
            type: 'string'
        };
        return (react_1.default.createElement("div", { className: cx('SchemaEditorProps SchemaEditorArrayProps', {
                'SchemaEditorProps--depth': showInfo !== false
            }) },
            react_1.default.createElement(Item_1.SchemaEditorItem, { types: types, onTypeChange: onTypeChange, prefix: react_1.default.createElement("div", { className: cx('SchemaEditor-itemsLabel') }, __('JSONSchema.array_items')), value: items, onChange: this.handleItemsChange, renderExtraProps: renderExtraProps, renderModalProps: renderModalProps, locale: locale, translate: __, classnames: cx, classPrefix: classPrefix, disabled: disabled || !!((_a = items) === null || _a === void 0 ? void 0 : _a.$ref), enableAdvancedSetting: enableAdvancedSetting })));
    };
    SchemaEditorItemArray.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, showInfo = _a.showInfo, disabled = _a.disabled;
        return (react_1.default.createElement("div", { className: cx('SchemaEditorItem SchemaEditorArray') },
            showInfo !== false ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("a", { className: cx('SchemaEditor-caret', {
                        'is-collapsed': this.state.collapsed
                    }), onClick: this.toggleCollapsed },
                    react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" })),
                this.renderCommon())) : null,
            this.state.collapsed ? null : this.renderItems()));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemArray.prototype, "toggleCollapsed", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemArray.prototype, "handleItemsChange", null);
    return SchemaEditorItemArray;
}(Common_1.SchemaEditorItemCommon));
exports.SchemaEditorItemArray = SchemaEditorItemArray;
//# sourceMappingURL=./components/schema-editor/Array.js.map
