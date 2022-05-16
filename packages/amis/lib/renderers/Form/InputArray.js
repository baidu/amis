"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var combo_1 = require("../../store/combo");
var Combo_1 = (0, tslib_1.__importDefault)(require("./Combo"));
var InputArrayControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(InputArrayControl, _super);
    function InputArrayControl(props) {
        var _this = _super.call(this, props) || this;
        _this.comboRef = _this.comboRef.bind(_this);
        return _this;
    }
    InputArrayControl.prototype.comboRef = function (ref) {
        this.comboInstance = ref;
    };
    InputArrayControl.prototype.validate = function (args) {
        var _a;
        return this.comboInstance ? (_a = this.comboInstance).validate.apply(_a, args) : null;
    };
    InputArrayControl.prototype.render = function () {
        var _a = this.props, items = _a.items, rest = (0, tslib_1.__rest)(_a, ["items"]);
        return (react_1.default.createElement(Combo_1.default, (0, tslib_1.__assign)({}, rest, { items: [items], flat: true, multiple: true, multiLine: false, ref: this.comboRef })));
    };
    return InputArrayControl;
}(react_1.default.Component));
exports.default = InputArrayControl;
var ArrayControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ArrayControlRenderer, _super);
    function ArrayControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-array',
            storeType: combo_1.ComboStore.name
        })
    ], ArrayControlRenderer);
    return ArrayControlRenderer;
}(InputArrayControl));
exports.ArrayControlRenderer = ArrayControlRenderer;
//# sourceMappingURL=./renderers/Form/InputArray.js.map
