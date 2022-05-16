"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../../utils/helper");
var Item_1 = require("./Item");
var UUIDControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UUIDControl, _super);
    function UUIDControl(props) {
        var _this = _super.call(this, props) || this;
        if (!props.value) {
            _this.setValue();
        }
        return _this;
    }
    UUIDControl.prototype.componentDidUpdate = function (props) {
        if (!props.value) {
            this.setValue();
        }
    };
    UUIDControl.prototype.setValue = function () {
        var props = this.props;
        var uuid = (0, helper_1.uuidv4)();
        if (props.length) {
            uuid = uuid.substring(0, props.length);
        }
        props.onChange(uuid);
    };
    UUIDControl.prototype.render = function () {
        return null;
    };
    return UUIDControl;
}(react_1.default.Component));
exports.default = UUIDControl;
var UUIDControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UUIDControlRenderer, _super);
    function UUIDControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UUIDControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'uuid',
            wrap: false,
            sizeMutable: false
        })
    ], UUIDControlRenderer);
    return UUIDControlRenderer;
}(UUIDControl));
exports.UUIDControlRenderer = UUIDControlRenderer;
//# sourceMappingURL=./renderers/Form/UUID.js.map
