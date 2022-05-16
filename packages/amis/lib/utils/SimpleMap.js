"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleMap = void 0;
var tslib_1 = require("tslib");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var findIndex_1 = (0, tslib_1.__importDefault)(require("lodash/findIndex"));
var SimpleMap = /** @class */ (function () {
    function SimpleMap() {
        this.list = [];
    }
    SimpleMap.prototype.has = function (key) {
        var resolved = (0, find_1.default)(this.list, function (item) { return item.key === key; });
        return !!resolved;
    };
    SimpleMap.prototype.set = function (key, value) {
        this.list.push({
            key: key,
            value: value
        });
    };
    SimpleMap.prototype.get = function (key) {
        var resolved = (0, find_1.default)(this.list, function (item) { return item.key === key; });
        return resolved ? resolved.value : null;
    };
    SimpleMap.prototype.delete = function (key) {
        var idx = (0, findIndex_1.default)(this.list, function (item) { return item.key === key; });
        ~idx && this.list.splice(idx, 1);
    };
    SimpleMap.prototype.dispose = function () {
        this.list.splice(0, this.list.length);
    };
    return SimpleMap;
}());
exports.SimpleMap = SimpleMap;
//# sourceMappingURL=./utils/SimpleMap.js.map
