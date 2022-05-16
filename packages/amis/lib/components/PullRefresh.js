"use strict";
/**
 * @file PullRefresh.tsx
 * @description 下拉刷新
 * @author hongyang03
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var theme_1 = require("../theme");
var hooks_1 = require("../hooks");
var use_touch_1 = (0, tslib_1.__importDefault)(require("../hooks/use-touch"));
var icons_1 = require("./icons");
var defaultProps = {
    successDuration: 0,
    loadingDuration: 0
};
var defaultHeaderHeight = 28;
var PullRefresh = (0, react_1.forwardRef)(function (props, ref) {
    var cx = props.classnames, __ = props.translate, children = props.children, successDuration = props.successDuration, loadingDuration = props.loadingDuration;
    var refreshText = {
        pullingText: __('pullRefresh.pullingText'),
        loosingText: __('pullRefresh.loosingText'),
        loadingText: __('pullRefresh.loadingText'),
        successText: __('pullRefresh.successText')
    };
    var touch = (0, use_touch_1.default)();
    (0, react_1.useEffect)(function () {
        if (props.loading === false) {
            loadSuccess();
        }
    }, [props.loading]);
    var _a = (0, hooks_1.useSetState)({
        status: 'normal',
        offsetY: 0
    }), state = _a[0], updateState = _a[1];
    var isTouchable = function () {
        return (!props.disabled &&
            state.status !== 'loading' &&
            state.status !== 'success');
    };
    var ease = function (distance) {
        var pullDistance = defaultHeaderHeight;
        if (distance > pullDistance) {
            if (distance < pullDistance * 2) {
                distance = pullDistance + (distance - pullDistance) / 2;
            }
            else {
                distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
            }
        }
        return Math.round(distance);
    };
    var setStatus = function (distance, isLoading) {
        var pullDistance = defaultHeaderHeight;
        var status = 'normal';
        if (isLoading) {
            status = 'loading';
        }
        else if (distance === 0) {
            status = 'normal';
        }
        else if (distance < pullDistance) {
            status = 'pulling';
        }
        else {
            status = 'loosing';
        }
        updateState({ offsetY: distance, status: status });
    };
    var loadSuccess = function () {
        if (!successDuration) {
            setStatus(0);
            return;
        }
        updateState({ status: 'success' });
        setTimeout(function () {
            setStatus(0);
        }, successDuration);
    };
    var onTouchStart = function (event) {
        event.stopPropagation();
        if (isTouchable() && state.offsetY === 0) {
            touch.start(event);
            updateState({});
        }
    };
    var onTouchMove = function (event) {
        event.stopPropagation();
        if (isTouchable()) {
            touch.move(event);
            updateState({});
            if (touch.isVertical() && touch.deltaY > 0) {
                setStatus(ease(touch.deltaY));
            }
        }
        return false;
    };
    var onTouchEnd = function (event) {
        event.stopPropagation();
        if (isTouchable() && state.offsetY > 0) {
            if (state.status === 'loosing') {
                if (loadingDuration) {
                    setStatus(defaultHeaderHeight, true);
                }
                else {
                    setStatus(0);
                }
                props.onRefresh && props.onRefresh();
            }
            else {
                setStatus(0);
            }
        }
    };
    var transformStyle = {
        transform: "translate3d(0, ".concat(state.offsetY, "px, 0)"),
        touchAction: 'none'
    };
    var getStatusText = function (status) {
        if (status === 'normal') {
            return '';
        }
        return props["".concat(status, "Text")] || refreshText["".concat(status, "Text")];
    };
    return (react_1.default.createElement("div", { className: cx('PullRefresh'), onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, onTouchCancel: onTouchEnd },
        react_1.default.createElement("div", { className: cx('PullRefresh-wrap'), style: transformStyle },
            react_1.default.createElement("div", { className: cx('PullRefresh-header') },
                state.status === 'loading' && (react_1.default.createElement(icons_1.Icon, { icon: "loading-outline", className: "icon loading-icon" })),
                getStatusText(state.status)),
            children)));
});
PullRefresh.defaultProps = defaultProps;
exports.default = (0, theme_1.themeable)(PullRefresh);
//# sourceMappingURL=./components/PullRefresh.js.map
