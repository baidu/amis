"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TplRenderer = exports.Icon = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Badge_1 = require("../components/Badge");
var Icon = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Icon.prototype.render = function () {
        var _a = this.props, icon = _a.icon, vendor = _a.vendor, cx = _a.classnames, className = _a.className;
        var isURLIcon = (icon === null || icon === void 0 ? void 0 : icon.indexOf('.')) !== -1;
        var iconPrefix = '';
        if (vendor === 'iconfont') {
            iconPrefix = "iconfont icon-".concat(icon);
        }
        else if (vendor === 'fa') {
            //默认是fontawesome v4，兼容之前配置
            iconPrefix = "".concat(vendor, " ").concat(vendor, "-").concat(icon);
        }
        else {
            // 如果vendor为空，则不设置前缀,这样可以支持fontawesome v5、fontawesome v6或者其他框架
            iconPrefix = "".concat(icon);
        }
        return isURLIcon ? (react_1.default.createElement("img", { className: cx('Icon'), src: icon })) : (react_1.default.createElement("i", { className: cx(iconPrefix, className) }));
    };
    Icon.defaultProps = {
        icon: '',
        vendor: 'fa'
    };
    return Icon;
}(react_1.default.Component));
exports.Icon = Icon;
var TplRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TplRenderer, _super);
    function TplRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TplRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'icon'
        })
        // @ts-ignore 类型没搞定
        ,
        Badge_1.withBadge
    ], TplRenderer);
    return TplRenderer;
}(Icon));
exports.TplRenderer = TplRenderer;
//# sourceMappingURL=./renderers/Icon.js.map
