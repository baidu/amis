"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRenderer = exports.LocationControl = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = (0, tslib_1.__importDefault)(require("./Item"));
var LocationPicker_1 = (0, tslib_1.__importDefault)(require("../../components/LocationPicker"));
var tpl_1 = require("../../utils/tpl");
var LocationControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LocationControl, _super);
    function LocationControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationControl.prototype.render = function () {
        return (react_1.default.createElement("div", { className: this.props.classnames('LocationControl') },
            react_1.default.createElement(LocationPicker_1.default, (0, tslib_1.__assign)({}, this.props, { ak: (0, tpl_1.filter)(this.props.ak, this.props.data) }))));
    };
    LocationControl.defaultProps = {
        vendor: 'baidu',
        coordinatesType: 'bd09'
    };
    return LocationControl;
}(react_1.default.Component));
exports.LocationControl = LocationControl;
var LocationRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LocationRenderer, _super);
    function LocationRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.default)({
            type: 'location-picker'
        })
    ], LocationRenderer);
    return LocationRenderer;
}(LocationControl));
exports.LocationRenderer = LocationRenderer;
//# sourceMappingURL=./renderers/Form/LocationPicker.js.map
