"use strict";
/**
 * @file Overlay
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Portal_1 = (0, tslib_1.__importDefault)(require("react-overlays/Portal"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var react_dom_1 = tslib_1.__importStar(require("react-dom"));
var react_1 = tslib_1.__importStar(require("react"));
var dom_1 = require("../utils/dom");
var helper_1 = require("../utils/helper");
var resize_sensor_1 = require("../utils/resize-sensor");
var RootClose_1 = require("../utils/RootClose");
function onScroll(elem, callback) {
    var handler = function () {
        requestAnimationFrame(callback);
    };
    elem.addEventListener('scroll', handler);
    return function () {
        elem.removeEventListener('scroll', handler);
    };
}
var Position = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Position, _super);
    function Position(props) {
        var _this = _super.call(this, props) || this;
        _this.getTarget = function () {
            var target = _this.props.target;
            var targetElement = typeof target === 'function' ? target() : target;
            return (targetElement && react_dom_1.default.findDOMNode(targetElement)) || null;
        };
        _this.maybeUpdatePosition = function (placementChanged) {
            var target = _this.getTarget();
            if (!_this.props.shouldUpdatePosition &&
                target === _this._lastTarget &&
                !placementChanged) {
                return;
            }
            _this.updatePosition(target);
        };
        _this.state = {
            positionLeft: 0,
            positionTop: 0,
            arrowOffsetLeft: null,
            arrowOffsetTop: null
        };
        _this._lastTarget = null;
        return _this;
    }
    Position.prototype.updatePosition = function (target) {
        var _this = this;
        var _a;
        this._lastTarget = target;
        if (!target) {
            return this.setState({
                positionLeft: 0,
                positionTop: 0,
                arrowOffsetLeft: null,
                arrowOffsetTop: null
            });
        }
        var watchTargetSizeChange = this.props.watchTargetSizeChange;
        var overlay = (0, react_dom_1.findDOMNode)(this);
        var container = (0, dom_1.getContainer)(this.props.container, (0, dom_1.ownerDocument)(this).body);
        if ((!this.watchedTarget || this.watchedTarget !== target) &&
            (0, resize_sensor_1.getComputedStyle)(target, 'position') !== 'static') {
            (_a = this.resizeDispose) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) { return fn(); });
            this.watchedTarget = target;
            this.resizeDispose = [
                watchTargetSizeChange !== false
                    ? (0, resize_sensor_1.resizeSensor)(target, function () { return _this.updatePosition(target); })
                    : helper_1.noop,
                (0, resize_sensor_1.resizeSensor)(overlay, function () { return _this.updatePosition(target); })
            ];
            var scrollParent = (0, helper_1.getScrollParent)(target);
            if (scrollParent && container.contains(scrollParent)) {
                this.resizeDispose.push(onScroll(scrollParent, function () {
                    _this.updatePosition(target);
                }));
            }
        }
        this.setState((0, dom_1.calculatePosition)(this.props.placement, overlay, target, container, this.props.containerPadding, this.props.offset));
    };
    Position.prototype.componentDidMount = function () {
        this.updatePosition(this.getTarget());
    };
    Position.prototype.componentDidUpdate = function (prevProps) {
        this.maybeUpdatePosition(this.props.placement !== prevProps.placement);
    };
    Position.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.resizeDispose) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) { return fn(); });
    };
    Position.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, props = (0, tslib_1.__rest)(_a, ["children", "className"]);
        var _b = this.state, positionLeft = _b.positionLeft, positionTop = _b.positionTop, arrowPosition = (0, tslib_1.__rest)(_b, ["positionLeft", "positionTop"]);
        // These should not be forwarded to the child.
        delete props.target;
        delete props.container;
        delete props.containerPadding;
        delete props.shouldUpdatePosition;
        var child = react_1.default.Children.only(children);
        return (0, react_1.cloneElement)(child, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, props), arrowPosition), { 
            // FIXME: Don't forward `positionLeft` and `positionTop` via both props
            // and `props.style`.
            positionLeft: positionLeft, positionTop: positionTop, className: (0, classnames_1.default)(className, child.props.className), style: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, child.props.style), { left: positionLeft, top: positionTop }) }));
    };
    Position.defaultProps = {
        containerPadding: 0,
        placement: 'right',
        shouldUpdatePosition: false
    };
    return Position;
}(react_1.default.Component));
var Overlay = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Overlay, _super);
    function Overlay(props) {
        var _this = _super.call(this, props) || this;
        _this.position = null;
        _this.positionRef = function (position) {
            _this.position = position;
        };
        _this.state = {
            exited: !props.show
        };
        return _this;
    }
    Overlay.prototype.updatePosition = function () {
        var _a;
        (_a = this.position) === null || _a === void 0 ? void 0 : _a.maybeUpdatePosition(true);
    };
    Overlay.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.show !== props.show && props.show) {
            this.setState({ exited: false });
        }
        else if (props.transition !== prevProps.transition && !props.transition) {
            // Otherwise let handleHidden take care of marking exited.
            this.setState({ exited: true });
        }
    };
    Overlay.prototype.onHiddenListener = function (node) {
        this.setState({ exited: true });
        if (this.props.onExited) {
            this.props.onExited(node);
        }
    };
    Overlay.prototype.render = function () {
        var _a = this.props, container = _a.container, containerPadding = _a.containerPadding, target = _a.target, placement = _a.placement, shouldUpdatePosition = _a.shouldUpdatePosition, rootClose = _a.rootClose, children = _a.children, watchTargetSizeChange = _a.watchTargetSizeChange, Transition = _a.transition, offset = _a.offset, props = (0, tslib_1.__rest)(_a, ["container", "containerPadding", "target", "placement", "shouldUpdatePosition", "rootClose", "children", "watchTargetSizeChange", "transition", "offset"]);
        var mountOverlay = props.show || (Transition && !this.state.exited);
        if (!mountOverlay) {
            // Don't bother showing anything if we don't have to.
            return null;
        }
        var child = children;
        // Position is be inner-most because it adds inline styles into the child,
        // which the other wrappers don't forward correctly.
        child = (
        // @ts-ignore
        react_1.default.createElement(Position, (0, tslib_1.__assign)({}, {
            container: container,
            containerPadding: containerPadding,
            target: target,
            placement: placement,
            shouldUpdatePosition: shouldUpdatePosition,
            offset: offset
        }, { ref: this.positionRef }), child));
        if (Transition) {
            var onExit = props.onExit, onExiting = props.onExiting, onEnter = props.onEnter, onEntering = props.onEntering, onEntered = props.onEntered;
            // This animates the child node by injecting props, so it must precede
            // anything that adds a wrapping div.
            child = (react_1.default.createElement(Transition, { in: props.show, appear: true, onExit: onExit, onExiting: onExiting, onExited: this.onHiddenListener, onEnter: onEnter, onEntering: onEntering, onEntered: onEntered }, child));
        }
        // This goes after everything else because it adds a wrapping div.
        if (rootClose) {
            return (
            // @ts-ignore
            react_1.default.createElement(Portal_1.default, { container: container },
                react_1.default.createElement(RootClose_1.RootClose, { onRootClose: props.onHide }, function (ref) {
                    if (react_1.default.isValidElement(child)) {
                        return react_1.default.cloneElement(child, {
                            ref: ref
                        });
                    }
                    return react_1.default.createElement("div", { ref: ref }, child);
                })));
        }
        // @ts-ignore
        return react_1.default.createElement(Portal_1.default, { container: container }, child);
    };
    var _a;
    Overlay.defaultProps = {
        placement: 'auto'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Overlay.prototype, "onHiddenListener", null);
    return Overlay;
}(react_1.default.Component));
exports.default = Overlay;
//# sourceMappingURL=./components/Overlay.js.map
