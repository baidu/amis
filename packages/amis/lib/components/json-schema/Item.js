"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputJSONSchemaItem = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var InputBox_1 = (0, tslib_1.__importDefault)(require("../InputBox"));
var NumberInput_1 = (0, tslib_1.__importDefault)(require("../NumberInput"));
var Switch_1 = (0, tslib_1.__importDefault)(require("../Switch"));
var Array_1 = require("./Array");
var Object_1 = require("./Object");
function InputJSONSchemaItem(props) {
    var schema = props.schema;
    if (schema.type === 'object') {
        return react_1.default.createElement(Object_1.InputJSONSchemaObject, (0, tslib_1.__assign)({}, props));
    }
    else if (schema.type === 'array') {
        return react_1.default.createElement(Array_1.InputJSONSchemaArray, (0, tslib_1.__assign)({}, props));
    }
    else if (props.renderValue) {
        return props.renderValue(props.value, props.onChange, schema, props);
    }
    else if (schema.type == 'number') {
        return (react_1.default.createElement(NumberInput_1.default, { value: props.value, onChange: props.onChange, placeholder: props.placeholder }));
    }
    else if (schema.type == 'integer') {
        return (react_1.default.createElement(NumberInput_1.default, { value: props.value, onChange: props.onChange, precision: 0, placeholder: props.placeholder }));
    }
    else if (schema.type == 'boolean') {
        return (react_1.default.createElement(Switch_1.default, { value: props.value, onChange: props.onChange, className: "mt-2" }));
    }
    return (react_1.default.createElement(InputBox_1.default, { value: props.value, onChange: props.onChange, placeholder: props.placeholder }));
}
exports.InputJSONSchemaItem = InputJSONSchemaItem;
//# sourceMappingURL=./components/json-schema/Item.js.map
