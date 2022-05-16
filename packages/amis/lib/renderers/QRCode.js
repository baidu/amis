"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var qrcode_react_1 = require("qrcode.react");
var helper_1 = require("../utils/helper");
var QRCode = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QRCode, _super);
    function QRCode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QRCode.prototype.render = function () {
        var _a = this.props, className = _a.className, qrcodeClassName = _a.qrcodeClassName, codeSize = _a.codeSize, backgroundColor = _a.backgroundColor, foregroundColor = _a.foregroundColor, placeholder = _a.placeholder, level = _a.level, defaultValue = _a.defaultValue, data = _a.data, ns = _a.classPrefix;
        var finalValue = (0, helper_1.getPropValue)(this.props, function () { return (0, tpl_1.filter)(defaultValue, data, '| raw') || undefined; });
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "QrCode"), className) }, !finalValue ? (react_1.default.createElement("span", { className: "".concat(ns, "QrCode--placeholder") }, placeholder)) : finalValue.length > 2953 ? (
        // https://github.com/zpao/qrcode.react/issues/69
        react_1.default.createElement("span", { className: "text-danger" }, "\u4E8C\u7EF4\u7801\u503C\u8FC7\u957F\uFF0C\u8BF7\u8BBE\u7F6E2953\u4E2A\u5B57\u7B26\u4EE5\u4E0B\u7684\u6587\u672C")) : (react_1.default.createElement(qrcode_react_1.QRCodeSVG
        // @ts-ignore 其实是支持的
        , { 
            // @ts-ignore 其实是支持的
            className: qrcodeClassName, value: finalValue, size: codeSize, bgColor: backgroundColor, fgColor: foregroundColor, level: level || 'L' }))));
    };
    QRCode.defaultProps = {
        codeSize: 128,
        qrcodeClassName: '',
        backgroundColor: '#fff',
        foregroundColor: '#000',
        level: 'L',
        placeholder: '-'
    };
    return QRCode;
}(react_1.default.Component));
exports.default = QRCode;
var QRCodeRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QRCodeRenderer, _super);
    function QRCodeRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QRCodeRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)qr\-?code$/,
            name: 'qrcode'
        })
    ], QRCodeRenderer);
    return QRCodeRenderer;
}(QRCode));
exports.QRCodeRenderer = QRCodeRenderer;
//# sourceMappingURL=./renderers/QRCode.js.map
