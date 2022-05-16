"use strict";
/**
 * @file 基于实现 bar code
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarCode = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var jsbarcode_1 = (0, tslib_1.__importDefault)(require("jsbarcode"));
var BarCode = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BarCode, _super);
    function BarCode(props) {
        var _this = _super.call(this, props) || this;
        _this.dom = react_1.default.createRef();
        return _this;
    }
    BarCode.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.value !== prevProps.value ||
            JSON.stringify(this.props.options) !== JSON.stringify(prevProps.options)) {
            this.renderBarCode();
        }
    };
    BarCode.prototype.renderBarCode = function () {
        if (this.dom.current) {
            (0, jsbarcode_1.default)(this.dom.current, this.props.value, this.props.options);
        }
    };
    BarCode.prototype.componentDidMount = function () {
        this.renderBarCode();
    };
    BarCode.prototype.render = function () {
        return react_1.default.createElement("img", { ref: this.dom });
    };
    return BarCode;
}(react_1.default.Component));
exports.BarCode = BarCode;
exports.default = (0, theme_1.themeable)(BarCode);
//# sourceMappingURL=./components/BarCode.js.map
