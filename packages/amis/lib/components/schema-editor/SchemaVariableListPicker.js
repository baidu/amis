"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaVariableListPicker = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var theme_1 = require("../../theme");
var PickerContainer_1 = (0, tslib_1.__importDefault)(require("../PickerContainer"));
var SchemaVariableList_1 = (0, tslib_1.__importDefault)(require("./SchemaVariableList"));
var SchemaVariableListPicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaVariableListPicker, _super);
    function SchemaVariableListPicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaVariableListPicker.prototype.render = function () {
        var _a = this.props, __ = _a.translate, schemas = _a.schemas, value = _a.value, onConfirm = _a.onConfirm, onCancel = _a.onCancel, children = _a.children, title = _a.title, selectMode = _a.selectMode, beforeBuildVariables = _a.beforeBuildVariables, onPickerOpen = _a.onPickerOpen;
        return (react_1.default.createElement(PickerContainer_1.default, { onPickerOpen: onPickerOpen, title: title !== null && title !== void 0 ? title : __('Select.placeholder'), bodyRender: function (_a) {
                var _b;
                var value = _a.value, onChange = _a.onChange, stateSchemas = _a.schemas, isOpened = _a.isOpened;
                return isOpened ? (react_1.default.createElement(SchemaVariableList_1.default, { value: (_b = value === null || value === void 0 ? void 0 : value.value) !== null && _b !== void 0 ? _b : value, onSelect: function (value, schema) {
                        return onChange({
                            value: value,
                            schema: schema
                        });
                    }, schemas: stateSchemas !== null && stateSchemas !== void 0 ? stateSchemas : schemas, selectMode: selectMode, beforeBuildVariables: beforeBuildVariables })) : (react_1.default.createElement(react_1.default.Fragment, null));
            }, value: value, onConfirm: onConfirm, onCancel: onCancel }, children));
    };
    return SchemaVariableListPicker;
}(react_1.default.Component));
exports.SchemaVariableListPicker = SchemaVariableListPicker;
exports.default = (0, locale_1.localeable)((0, theme_1.themeable)(SchemaVariableListPicker));
//# sourceMappingURL=./components/schema-editor/SchemaVariableListPicker.js.map
