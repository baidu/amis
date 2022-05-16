"use strict";
/**
 * @file PopOver
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopOver = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var PopOver = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PopOver, _super);
    function PopOver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            xOffset: 0,
            yOffset: 0
        };
        _this.wrapperRef = react_1.default.createRef();
        return _this;
    }
    PopOver.prototype.componentDidMount = function () {
        this.mayUpdateOffset();
        var dom = (0, react_dom_1.findDOMNode)(this);
        this.parent = dom.parentNode;
        this.parent.classList.add('has-popover');
        if (this.wrapperRef && this.wrapperRef.current) {
            // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能
            this.wrapperRef.current.addEventListener('touchmove', helper_1.preventDefault, {
                passive: false,
                capture: false
            });
        }
    };
    PopOver.prototype.componentDidUpdate = function () {
        this.mayUpdateOffset();
    };
    PopOver.prototype.componentWillUnmount = function () {
        this.parent && this.parent.classList.remove('has-popover');
        if (this.wrapperRef && this.wrapperRef.current) {
            this.wrapperRef.current.removeEventListener('touchmove', helper_1.preventDefault);
        }
    };
    PopOver.prototype.mayUpdateOffset = function () {
        var offset;
        var getOffset = this.props.offset;
        if (getOffset && typeof getOffset === 'function') {
            var _a = this.props, placement = _a.placement, y = _a.positionTop, x = _a.positionLeft;
            offset = getOffset((0, react_dom_1.findDOMNode)(this).getBoundingClientRect(), {
                x: x,
                y: y,
                placement: placement
            });
        }
        else {
            offset = getOffset;
        }
        this.setState({
            xOffset: offset && offset.x ? offset.x : 0,
            yOffset: offset && offset.y ? offset.y : 0
        });
    };
    PopOver.prototype.render = function () {
        var _a = this.props, placement = _a.placement, activePlacement = _a.activePlacement, positionTop = _a.positionTop, positionLeft = _a.positionLeft, arrowOffsetLeft = _a.arrowOffsetLeft, arrowOffsetTop = _a.arrowOffsetTop, style = _a.style, children = _a.children, offset = _a.offset, overlay = _a.overlay, onHide = _a.onHide, ns = _a.classPrefix, cx = _a.classnames, className = _a.className, rest = (0, tslib_1.__rest)(_a, ["placement", "activePlacement", "positionTop", "positionLeft", "arrowOffsetLeft", "arrowOffsetTop", "style", "children", "offset", "overlay", "onHide", "classPrefix", "classnames", "className"]);
        var _b = this.state, xOffset = _b.xOffset, yOffset = _b.yOffset;
        var outerStyle = (0, tslib_1.__assign)((0, tslib_1.__assign)({ display: 'block' }, style), { top: positionTop + yOffset, left: positionLeft + xOffset });
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({ ref: this.wrapperRef, className: cx("".concat(ns, "PopOver"), className, "".concat(ns, "PopOver--").concat((0, helper_1.camel)(activePlacement))), style: outerStyle }, rest),
            overlay ? (react_1.default.createElement("div", { className: "".concat(ns, "PopOver-overlay"), onClick: onHide })) : null,
            children));
    };
    PopOver.defaultProps = {
        className: '',
        offset: {
            x: 0,
            y: 0
        },
        overlay: false,
        placement: 'auto'
    };
    return PopOver;
}(react_1.default.PureComponent));
exports.PopOver = PopOver;
exports.default = (0, theme_1.themeable)(PopOver);
//# sourceMappingURL=./components/PopOver.js.map
