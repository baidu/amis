"use strict";
/**
 * @file GridNav
 * @description 金刚位宫格导航 参考react-vant
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNavItem = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Badge_1 = require("./Badge");
function addUnit(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    value = String(value);
    return /^\d+(\.\d+)?$/.test(value) ? "".concat(value, "px") : value;
}
var GridNavItem = function (_a) {
    var _b;
    var children = _a.children, cx = _a.classnames, className = _a.className, style = _a.style, props = (0, tslib_1.__rest)(_a, ["children", "classnames", "className", "style"]);
    var _c = props.index, index = _c === void 0 ? 0 : _c, parent = props.parent;
    if (!parent) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[React Vant] <GridNavItem> must be a child component of <GridNav>.');
        }
        return null;
    }
    var rootStyle = (0, react_1.useMemo)(function () {
        var square = parent.square, gutter = parent.gutter, _a = parent.columnNum, columnNum = _a === void 0 ? 4 : _a;
        var percent = "".concat(100 / +columnNum, "%");
        var internalStyle = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, style), { flexBasis: percent });
        if (square) {
            internalStyle.paddingTop = percent;
        }
        else if (gutter) {
            var gutterValue = addUnit(gutter);
            internalStyle.paddingRight = gutterValue;
            if (index >= columnNum) {
                internalStyle.marginTop = gutterValue;
            }
        }
        return internalStyle;
    }, [parent.style, parent.gutter, parent.columnNum]);
    var contentStyle = (0, react_1.useMemo)(function () {
        var square = parent.square, gutter = parent.gutter;
        if (square && gutter) {
            var gutterValue = addUnit(gutter);
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props.contentStyle), { right: gutterValue, bottom: gutterValue, height: 'auto' });
        }
        return props.contentStyle;
    }, [parent.gutter, parent.columnNum, props.contentStyle]);
    var renderIcon = function () {
        var ratio = parent.iconRatio || 60;
        if (typeof props.icon === 'string') {
            if (props.badge) {
                return (react_1.default.createElement(Badge_1.Badge, (0, tslib_1.__assign)({}, props.badge),
                    react_1.default.createElement("div", { className: cx('GridNavItem-image') },
                        react_1.default.createElement("img", { src: props.icon, style: { width: ratio + '%' } }))));
            }
            return (react_1.default.createElement("div", { className: cx('GridNavItem-image') },
                react_1.default.createElement("img", { src: props.icon, style: { width: ratio + '%' } })));
        }
        if (react_1.default.isValidElement(props.icon)) {
            return react_1.default.createElement(Badge_1.Badge, (0, tslib_1.__assign)({}, props.badge), props.icon);
        }
        return null;
    };
    var renderText = function () {
        if (react_1.default.isValidElement(props.text)) {
            return props.text;
        }
        if (props.text) {
            return react_1.default.createElement("span", { className: cx('GridNavItem-text') }, props.text);
        }
        return null;
    };
    var renderContent = function () {
        if (children) {
            return children;
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            renderIcon(),
            renderText()));
    };
    var center = parent.center, border = parent.border, square = parent.square, gutter = parent.gutter, reverse = parent.reverse, direction = parent.direction;
    var prefix = 'GridNavItem-content';
    var classes = cx("".concat(prefix, " ").concat(props.contentClassName || ''), (_b = {},
        _b["".concat(prefix, "--").concat(direction)] = !!direction,
        _b["".concat(prefix, "--center")] = center,
        _b["".concat(prefix, "--square")] = square,
        _b["".concat(prefix, "--reverse")] = reverse,
        _b["".concat(prefix, "--clickable")] = !!props.onClick,
        _b["".concat(prefix, "--surround")] = border && gutter,
        _b["".concat(prefix, "--border u-hairline")] = border,
        _b));
    return (react_1.default.createElement("div", { className: cx(className, { 'GridNavItem--square': square }), style: rootStyle },
        react_1.default.createElement("div", { role: props.onClick ? 'button' : undefined, className: classes, style: contentStyle, onClick: props.onClick }, renderContent())));
};
exports.GridNavItem = GridNavItem;
var GridNav = function (_a) {
    var children = _a.children, className = _a.className, cx = _a.classnames, itemClassName = _a.itemClassName, style = _a.style, props = (0, tslib_1.__rest)(_a, ["children", "className", "classnames", "itemClassName", "style"]);
    return (react_1.default.createElement("div", { style: (0, tslib_1.__assign)({ paddingLeft: addUnit(props.gutter) }, style), className: cx("GridNav ".concat(className || ''), {
            'GridNav-top u-hairline': props.border && !props.gutter
        }) }, react_1.default.Children.toArray(children)
        .filter(Boolean)
        .map(function (child, index) {
        return react_1.default.cloneElement(child, {
            index: index,
            parent: props,
            className: itemClassName,
            classnames: cx
        });
    })));
};
GridNav.defaultProps = {
    direction: 'vertical',
    center: true,
    border: true,
    columnNum: 4
};
exports.default = GridNav;
//# sourceMappingURL=./components/GridNav.js.map
