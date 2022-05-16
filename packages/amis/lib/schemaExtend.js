"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var factory_1 = require("./factory");
var helper_1 = require("./utils/helper");
// input-kv 实际上是 combo 的一种扩展
(0, factory_1.addSchemaFilter)(function (schema, renderer, props) {
    var _a, _b, _c;
    if (schema && schema.type === 'input-kv') {
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({ draggable: true }, schema), { multiple: true, pipeIn: function (value) {
                if (!(0, helper_1.isObject)(value)) {
                    return [];
                }
                var arr = [];
                Object.keys(value).forEach(function (key) {
                    var valueType = typeof value[key];
                    arr.push({
                        key: key || '',
                        value: valueType === 'string' ||
                            valueType === 'number' ||
                            valueType === 'boolean'
                            ? value[key]
                            : JSON.stringify(value[key])
                    });
                });
                return arr;
            }, pipeOut: function (value) {
                if (!Array.isArray(value)) {
                    return value;
                }
                var obj = {};
                value.forEach(function (item) {
                    var _a, _b, _c;
                    var key = (_a = item.key) !== null && _a !== void 0 ? _a : '';
                    var value = (_c = (_b = item.value) !== null && _b !== void 0 ? _b : schema.defaultValue) !== null && _c !== void 0 ? _c : '';
                    if (typeof value === 'string' && value.startsWith('{')) {
                        try {
                            value = JSON.parse(value);
                        }
                        catch (e) { }
                    }
                    obj[key] = value;
                });
                return obj;
            }, items: [
                {
                    placeholder: (_a = schema.keyPlaceholder) !== null && _a !== void 0 ? _a : 'Key',
                    type: 'input-text',
                    unique: true,
                    name: 'key',
                    required: true,
                    validateOnChange: true
                },
                schema.valueComponent
                    ? {
                        placeholder: (_b = schema.valuePlaceholder) !== null && _b !== void 0 ? _b : 'Value',
                        component: schema.valueComponent,
                        asFormItem: true,
                        name: 'value'
                    }
                    : {
                        placeholder: (_c = schema.valuePlaceholder) !== null && _c !== void 0 ? _c : 'Value',
                        type: schema.valueType || 'input-text',
                        name: 'value'
                    }
            ] });
    }
    return schema;
});
//# sourceMappingURL=./schemaExtend.js.map
