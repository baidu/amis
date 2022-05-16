"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var isFunction_1 = (0, tslib_1.__importDefault)(require("lodash/isFunction"));
var useSetState = function (initialState) {
    if (initialState === void 0) { initialState = {}; }
    var _a = (0, react_1.useState)(initialState), state = _a[0], setState = _a[1];
    var setMergeState = (0, react_1.useCallback)(function (patch) {
        setState(function (prevState) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, prevState), ((0, isFunction_1.default)(patch) ? patch(prevState) : patch))); });
    }, []);
    return [state, setMergeState];
};
exports.default = useSetState;
//# sourceMappingURL=./hooks/use-set-state.js.map
