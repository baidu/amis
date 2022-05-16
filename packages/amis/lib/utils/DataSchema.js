"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSchema = void 0;
var DataScope_1 = require("./DataScope");
var helper_1 = require("./helper");
/**
 * 用来定义数据本身的数据结构，比如有类型是什么，有哪些属性。
 */
var DataSchema = /** @class */ (function () {
    function DataSchema(schema) {
        this.idMap = {};
        this.root = new DataScope_1.DataScope(schema, 'root');
        this.idMap['root'] = this.root;
        this.current = this.root;
    }
    DataSchema.prototype.setSchema = function (schemas) {
        this.current.setSchemas(schemas);
        return this;
    };
    DataSchema.prototype.addSchema = function (schema) {
        this.current.addSchema(schema);
        return this;
    };
    DataSchema.prototype.removeSchema = function (id) {
        this.current.removeSchema(id);
        delete this.idMap[id];
        return this;
    };
    DataSchema.prototype.getSchemas = function () {
        var schemas = [];
        var current = this.current;
        while (current) {
            schemas.push.apply(schemas, current.schemas);
            current = current.parent;
        }
        return schemas;
    };
    DataSchema.prototype.addScope = function (schema, id) {
        if (id === void 0) { id = (0, helper_1.guid)(); }
        if (this.idMap[id]) {
            throw new Error('scope id `' + id + '` already exists');
        }
        this.current = this.current.addChild(id, schema);
        this.idMap[id] = this.current;
        return this;
    };
    DataSchema.prototype.removeScope = function (idOrScope) {
        var _a;
        var scope = this.getScope(idOrScope);
        if (!scope.parent) {
            throw new Error('cannot remove root scope');
        }
        if (scope.contains(this.current)) {
            this.current = scope.parent;
        }
        (_a = scope.parent) === null || _a === void 0 ? void 0 : _a.removeChild(scope);
        delete this.idMap[scope.id];
        return this;
    };
    DataSchema.prototype.hasScope = function (idOrScope) {
        var id = typeof idOrScope === 'string' ? idOrScope : idOrScope.id;
        var scope = this.idMap[id];
        return !!scope;
    };
    DataSchema.prototype.getScope = function (idOrScope) {
        var id = typeof idOrScope === 'string' ? idOrScope : idOrScope.id;
        var scope = this.idMap[id];
        if (!scope) {
            throw new Error('scope not found!');
        }
        return scope;
    };
    DataSchema.prototype.switchToRoot = function () {
        this.current = this.root;
        return this;
    };
    DataSchema.prototype.switchTo = function (idOrScope) {
        var scope = this.getScope(idOrScope);
        this.current = scope;
        return this;
    };
    DataSchema.prototype.getDataPropsAsOptions = function () {
        var variables = [];
        var current = this.current;
        while (current) {
            if (current.tag) {
                variables.push({
                    label: current.tag,
                    children: current.getDataPropsAsOptions()
                });
            }
            else {
                variables.push.apply(variables, current.getDataPropsAsOptions());
            }
            current = current.parent;
        }
        return variables;
    };
    DataSchema.prototype.getSchemaByPath = function (path) {
        var current = this.current;
        while (current) {
            var schema = current.getSchemaByPath(path);
            if (schema) {
                return schema;
            }
            current = current.parent;
        }
        return null;
    };
    return DataSchema;
}());
exports.DataSchema = DataSchema;
//# sourceMappingURL=./utils/DataSchema.js.map
