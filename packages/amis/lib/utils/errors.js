"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
var tslib_1 = require("tslib");
var ServerError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ServerError, _super);
    function ServerError(msg, response) {
        var _this = _super.call(this, msg) || this;
        _this.type = 'ServerError';
        _this.response = response;
        return _this;
    }
    return ServerError;
}(Error));
exports.ServerError = ServerError;
//# sourceMappingURL=./utils/errors.js.map
