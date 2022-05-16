"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaVariableList = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var theme_1 = require("../../theme");
var DataSchema_1 = require("../../utils/DataSchema");
var helper_1 = require("../../utils/helper");
var VariableList_1 = (0, tslib_1.__importDefault)(require("../formula/VariableList"));
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("../TooltipWrapper"));
var SchemaVariableList = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaVariableList, _super);
    function SchemaVariableList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            variables: _this.schemasToVaraibles(_this.props)
        };
        return _this;
    }
    SchemaVariableList.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (props.schemas !== prevProps.schemas) {
            this.setState({
                variables: this.schemasToVaraibles(props)
            });
        }
    };
    SchemaVariableList.prototype.schemasToVaraibles = function (props) {
        var _a, _b;
        var schemas = Array.isArray(props.schemas)
            ? props.schemas.concat()
            : props.schemas
                ? [props.schemas]
                : [];
        var dataSchema = new DataSchema_1.DataSchema(schemas);
        this.dataSchema = dataSchema;
        (_b = (_a = this.props).beforeBuildVariables) === null || _b === void 0 ? void 0 : _b.call(_a, dataSchema);
        return dataSchema.getDataPropsAsOptions();
    };
    SchemaVariableList.prototype.handleSelect = function (item) {
        var _a;
        var onSelect = this.props.onSelect;
        var schema = (_a = this.dataSchema) === null || _a === void 0 ? void 0 : _a.getSchemaByPath(item.value);
        onSelect === null || onSelect === void 0 ? void 0 : onSelect(item.value, schema);
    };
    SchemaVariableList.prototype.itemRender = function (option) {
        var _a = this.props, cx = _a.classnames, __ = _a.translate;
        return (react_1.default.createElement("span", { className: cx("FormulaEditor-VariableList-item") },
            react_1.default.createElement("label", null, option.label),
            react_1.default.createElement(TooltipWrapper_1.default, { tooltip: option.description, tooltipTheme: "dark" },
                react_1.default.createElement("span", { className: cx("FormulaEditor-VariableList-item-tag") }, __("SchemaType.".concat(option.type || 'any'))))));
    };
    SchemaVariableList.prototype.render = function () {
        var selectMode = this.props.selectMode;
        return (react_1.default.createElement(VariableList_1.default, { data: this.state.variables, value: this.props.value, onSelect: this.handleSelect, selectMode: selectMode || 'tree', itemRender: this.itemRender }));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaVariableList.prototype, "handleSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaVariableList.prototype, "itemRender", null);
    return SchemaVariableList;
}(react_1.default.Component));
exports.SchemaVariableList = SchemaVariableList;
exports.default = (0, locale_1.localeable)((0, theme_1.themeable)(SchemaVariableList));
//# sourceMappingURL=./components/schema-editor/SchemaVariableList.js.map
