"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataScope = void 0;
var tslib_1 = require("tslib");
var helper_1 = require("./helper");
var DataScope = /** @class */ (function () {
    function DataScope(schemas, id) {
        this.children = [];
        this.schemas = [];
        this.setSchemas(Array.isArray(schemas) ? schemas : [schemas]);
        this.id = id;
    }
    DataScope.prototype.addChild = function (id, schema) {
        var child = new DataScope(schema || {
            type: 'object',
            properties: {}
        }, id);
        this.children.push(child);
        child.parent = this;
        return child;
    };
    DataScope.prototype.removeChild = function (idOrScope) {
        var idx = this.children.findIndex(function (item) {
            return typeof idOrScope === 'string' ? idOrScope === item.id : item === idOrScope;
        });
        if (~idx) {
            var scope = this.children[idx];
            delete scope.parent;
            this.children.splice(idx, 1);
        }
    };
    DataScope.prototype.setSchemas = function (schemas) {
        this.schemas.splice(0, this.schemas.length);
        for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
            var schema = schemas_1[_i];
            if (schema.type !== 'object') {
                throw new TypeError('data scope accept only object');
            }
            this.schemas.push((0, tslib_1.__assign)({ $id: (0, helper_1.guid)() }, schema));
        }
        return this;
    };
    DataScope.prototype.addSchema = function (schema) {
        schema = (0, tslib_1.__assign)({ $id: (0, helper_1.guid)() }, schema);
        this.schemas.push(schema);
        return this;
    };
    DataScope.prototype.removeSchema = function (id) {
        var idx = this.schemas.findIndex(function (schema) { return schema.$id === id; });
        if (~idx) {
            this.schemas.splice(idx, 1);
        }
        return this;
    };
    DataScope.prototype.contains = function (scope) {
        var from = scope;
        while (from) {
            if (this === from) {
                return true;
            }
            from = from.parent;
        }
        return false;
    };
    DataScope.prototype.getMergedSchema = function () {
        var mergedSchema = {
            type: 'object',
            properties: {}
        };
        // todo 以后再来细化这一块，先粗略的写个大概
        this.schemas.forEach(function (schema) {
            var properties = schema.properties || {};
            Object.keys(properties).forEach(function (key) {
                var value = properties[key];
                if (mergedSchema.properties[key]) {
                    if (Array.isArray(mergedSchema.properties[key].oneOf)) {
                        mergedSchema.properties[key].oneOf.push();
                    }
                    else if (mergedSchema.properties[key].type &&
                        mergedSchema.properties[key].type !== value.type) {
                        mergedSchema.properties[key] = {
                            oneOf: [mergedSchema.properties[key], value]
                        };
                    }
                }
                else {
                    mergedSchema.properties[key] = value;
                }
            });
        });
        return mergedSchema;
    };
    DataScope.prototype.buildOptions = function (options, schema, path, key) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (key === void 0) { key = ''; }
        // todo 支持 oneOf, anyOf
        var option = {
            label: schema.title || key,
            value: path,
            type: schema.type,
            description: schema.description
        };
        options.push(option);
        if (schema.type === 'object' && schema.properties) {
            option.children = [];
            var keys = Object.keys(schema.properties);
            keys.forEach(function (key) {
                var child = schema.properties[key];
                _this.buildOptions(option.children, child, path + (path ? '.' : '') + key, key);
            });
        }
        else if (schema.type === 'array' && schema.items) {
            option.children = [];
            this.buildOptions(option.children, (0, tslib_1.__assign)({ title: 'Member' }, schema.items), path + (path ? '.' : '') + 'items', 'items');
            option.children = (0, helper_1.mapTree)(option.children, function (item) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { disabled: true })); });
        }
    };
    DataScope.prototype.getDataPropsAsOptions = function () {
        var variables = [];
        this.buildOptions(variables, this.getMergedSchema());
        return variables[0].children;
    };
    DataScope.prototype.getSchemaByPath = function (path) {
        var parts = (0, helper_1.keyToPath)(path);
        for (var _i = 0, _a = this.schemas; _i < _a.length; _i++) {
            var schema = _a[_i];
            var result = parts.reduce(function (schema, key) {
                if (schema && schema.type === 'object' && schema.properties) {
                    return schema.properties[key];
                }
                return null;
            }, schema);
            if (result) {
                return result;
            }
        }
        return null;
    };
    return DataScope;
}());
exports.DataScope = DataScope;
//# sourceMappingURL=./utils/DataScope.js.map
