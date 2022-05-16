"use strict";
/**
 * @file 角标组件
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBadge = exports.Badge = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var style_1 = require("../utils/style");
var Badge = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Badge, _super);
    function Badge(props) {
        return _super.call(this, props) || this;
    }
    Badge.prototype.renderBadge = function (text, size, position, offsetStyle, sizeStyle, animationElement) {
        var _a = this.props, cx = _a.classnames, badge = _a.badge, data = _a.data;
        var _b = badge, _c = _b.mode, mode = _c === void 0 ? 'dot' : _c, _d = _b.level, level = _d === void 0 ? 'danger' : _d, style = _b.style;
        var customStyle = (0, style_1.buildStyle)(style, data);
        if (typeof level === 'string' && level[0] === '$') {
            level = (0, tpl_builtin_1.resolveVariableAndFilter)(level, data);
        }
        switch (mode) {
            case 'dot':
                return (react_1.default.createElement("span", { className: cx('Badge-dot', "Badge--".concat(position), "Badge--".concat(level)), style: (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, offsetStyle), sizeStyle), customStyle) }, animationElement));
            case 'text':
                return (react_1.default.createElement("span", { className: cx('Badge-text', "Badge--".concat(position), "Badge--".concat(level)), style: (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, offsetStyle), sizeStyle), customStyle) },
                    text,
                    animationElement));
            case 'ribbon':
                var outSize = size * Math.sqrt(2) + 5;
                return (react_1.default.createElement("div", { className: cx('Badge-ribbon-out', "Badge-ribbon-out--".concat(position)), style: { width: outSize, height: outSize } },
                    react_1.default.createElement("span", { className: cx('Badge-ribbon', "Badge-ribbon--".concat(position), "Badge--".concat(level)), style: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, sizeStyle), customStyle) },
                        text,
                        animationElement)));
            default:
                return null;
        }
    };
    Badge.prototype.render = function () {
        var badge = this.props.badge;
        if (!badge) {
            return this.props.children;
        }
        var _a = this.props, children = _a.children, cx = _a.classnames, data = _a.data;
        var isDisplay = true;
        if (typeof badge === 'string') {
            isDisplay = (0, tpl_1.evalExpression)(badge, data) === true;
        }
        var _b = badge.mode, mode = _b === void 0 ? 'dot' : _b, text = badge.text, level = badge.level, size = badge.size, style = badge.style, offset = badge.offset, _c = badge.position, position = _c === void 0 ? 'top-right' : _c, _d = badge.overflowCount, overflowCount = _d === void 0 ? 99 : _d, visibleOn = badge.visibleOn, className = badge.className, animation = badge.animation;
        if (visibleOn) {
            isDisplay = (0, tpl_1.evalExpression)(visibleOn, data) === true;
        }
        if (typeof text === 'string' && text[0] === '$') {
            text = (0, tpl_builtin_1.resolveVariableAndFilter)(text, data);
        }
        // 设置默认值
        if (typeof size === 'undefined') {
            if (mode === 'dot') {
                size = 6;
            }
            else if (mode === 'ribbon') {
                size = 12;
            }
            else {
                size = 16;
            }
        }
        var sizeStyle = {};
        if (mode === 'text') {
            sizeStyle = {
                borderRadius: size / 2,
                height: size,
                lineHeight: size + 'px'
            };
            // 当text、overflowCount都为number类型时，进行封顶值处理
            if (typeof text === 'number' && typeof overflowCount === 'number') {
                text = (text > overflowCount
                    ? "".concat(overflowCount, "+")
                    : text);
            }
            if (!text) {
                isDisplay = false;
            }
        }
        if (mode === 'dot') {
            sizeStyle = { width: size, height: size };
        }
        if (mode === 'ribbon') {
            sizeStyle = {
                height: size,
                lineHeight: size + 'px',
                fontSize: size
            };
        }
        var offsetStyle = {};
        // 如果设置了offset属性，offset在position为'top-right'的基础上进行translate定位
        if (offset && offset.length) {
            position = 'top-right';
            var left = "calc(50% + ".concat(parseInt(offset[0], 10), "px)");
            var right = "calc(-50% + ".concat(parseInt(offset[1], 10), "px)");
            offsetStyle = {
                transform: "translate(".concat(left, ", ").concat(right, ")")
            };
        }
        var animationBackground = 'var(--danger)';
        if (style && style.background) {
            animationBackground = style.background;
        }
        var animationElement = animation ? (react_1.default.createElement("div", { style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: "1px solid ".concat(animationBackground),
                borderRadius: '50%',
                animation: 'badgeDotAnimation 1.2s infinite ease-in-out'
            } })) : null;
        return (react_1.default.createElement("div", { className: cx('Badge', className) },
            children,
            isDisplay
                ? this.renderBadge(text, size, position, offsetStyle, sizeStyle, animationElement)
                : null));
    };
    Badge.propsList = ['body', 'className', 'children'];
    return Badge;
}(react_1.default.Component));
exports.Badge = Badge;
function withBadge(Component) {
    var _a;
    return (0, hoist_non_react_statics_1.default)((_a = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(WithBadge, _super);
            function WithBadge() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WithBadge.prototype.render = function () {
                var badge = this.props.badge;
                if (!badge) {
                    return react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props));
                }
                return (react_1.default.createElement(Badge, (0, tslib_1.__assign)({}, this.props),
                    react_1.default.createElement(Component, (0, tslib_1.__assign)({}, this.props))));
            };
            return WithBadge;
        }(react_1.default.Component)),
        _a.displayName = "WithBadge(".concat(Component.displayName || Component.name, ")"),
        _a), Component);
}
exports.withBadge = withBadge;
//# sourceMappingURL=./components/Badge.js.map
