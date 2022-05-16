"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSchme2AMisSchema = void 0;
var tslib_1 = require("tslib");
function property2control(property, key, schema) {
    var requiredList = schema.required || [];
    var rest = {};
    var validations = {};
    var type = 'text';
    if (property.type === 'integer') {
        type = 'number';
        typeof property.minimum === 'number' && (rest.min = property.minimum);
        // property.max
    }
    else if (property.type === 'array') {
        type = 'combo';
        var items = property.items;
        if (items.type === 'object') {
            rest.controls = makeControls(items.properties, items);
            rest.multiLine = true;
        }
        else {
            type = 'array';
            rest.inline = true;
            rest.items = property2control(items, 'item', property);
        }
    }
    else if (property.type === 'string' && Array.isArray(property.enum)) {
        type = 'select';
        rest.options = property.enum;
    }
    if (typeof property.minimum === 'number') {
        validations.minimum = property.minimum;
    }
    return (0, tslib_1.__assign)({ name: key, type: type, required: !!~requiredList.indexOf(key), label: property.title || property.description, desc: property.title && property.description, value: property.default, validations: validations }, rest);
}
function makeControls(properties, schema) {
    var keys = Object.keys(properties);
    return keys.map(function (key) { return property2control(properties[key], key, schema); });
}
function JSONSchme2AMisSchema(schema) {
    if (schema.type !== 'object') {
        throw new Error('JSONSchme2AMisSchema 只支持 object 转换');
    }
    return {
        title: schema.title,
        type: 'form',
        mode: 'horizontal',
        controls: makeControls(schema.properties, schema)
    };
}
exports.JSONSchme2AMisSchema = JSONSchme2AMisSchema;
//# sourceMappingURL=./utils/json-schema-2-amis-schema.js.map
