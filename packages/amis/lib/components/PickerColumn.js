"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file Picker
 * @description 移动端列滚动选择器
 */
var react_1 = tslib_1.__importStar(require("react"));
var isObject_1 = (0, tslib_1.__importDefault)(require("lodash/isObject"));
var cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
var uncontrollable_1 = require("uncontrollable");
var hooks_1 = require("../hooks");
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var use_touch_1 = (0, tslib_1.__importDefault)(require("../hooks/use-touch"));
var DEFAULT_DURATION = 200;
var MOMENTUM_LIMIT_TIME = 300;
var MOMENTUM_LIMIT_DISTANCE = 15;
function getElementTranslateY(element) {
    if (!element) {
        return 0;
    }
    var style = window.getComputedStyle(element);
    var transform = style.transform || style.webkitTransform;
    // 格式如：matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() );
    var translateY = transform.slice(7, transform.length - 1).split(', ')[5];
    return Number(translateY);
}
function isOptionDisabled(option) {
    return (0, isObject_1.default)(option) && option.disabled;
}
var PickerColumn = (0, react_1.forwardRef)(function (props, ref) {
    var _a = props.visibleItemCount, visibleItemCount = _a === void 0 ? 5 : _a, _b = props.itemHeight, itemHeight = _b === void 0 ? 48 : _b, value = props.value, _c = props.valueField, valueField = _c === void 0 ? 'value' : _c, _d = props.swipeDuration, swipeDuration = _d === void 0 ? 1000 : _d, _e = props.labelField, labelField = _e === void 0 ? 'text' : _e, _f = props.options, options = _f === void 0 ? [] : _f, cx = props.classnames;
    var root = (0, react_1.useRef)(null);
    var menuItemRef = (0, react_1.useRef)(null);
    var wrapper = (0, react_1.useRef)(null);
    var moving = (0, react_1.useRef)(false);
    var startOffset = (0, react_1.useRef)(0);
    var transitionEndTrigger = (0, react_1.useRef)(null);
    var touchStartTime = (0, react_1.useRef)(0);
    var momentumOffset = (0, react_1.useRef)(0);
    var touch = (0, use_touch_1.default)();
    var count = options.length;
    var getOptionText = function (option) {
        if ((0, isObject_1.default)(option) && labelField in option) {
            //@ts-ignore
            return option[labelField];
        }
        return option;
    };
    var getOptionValue = function (option) {
        if ((0, isObject_1.default)(option) && valueField in option) {
            //@ts-ignore
            return option[valueField];
        }
        return option;
    };
    var defaultIndex = options.findIndex(function (item) { return getOptionValue(item) === value; });
    var baseOffset = (0, react_1.useMemo)(function () {
        // 默认转入第一个选项的位置
        return (itemHeight * (+visibleItemCount - 1)) / 2;
    }, [itemHeight, visibleItemCount]);
    var adjustIndex = function (index) {
        index = (0, helper_1.range)(index, 0, count);
        if (!options) {
            return;
        }
        for (var i = index; i < count; i += 1) {
            if (!isOptionDisabled(options[i]))
                return i;
        }
        for (var i = index - 1; i >= 0; i -= 1) {
            if (!isOptionDisabled(options[i]))
                return i;
        }
        return null;
    };
    var _g = (0, hooks_1.useSetState)({
        index: adjustIndex(defaultIndex) || 0,
        offset: 0,
        duration: 0,
        options: (0, cloneDeep_1.default)(options)
    }), state = _g[0], updateState = _g[1];
    /**
     *
     * @param index 索引
     * @param emitChange 是否派发变动消息
     * @param confirm 是否为确认类型，为真时触发value改变
     */
    var setIndex = function (index, emitChange, confirm) {
        index = adjustIndex(index) || 0;
        var offset = -index * itemHeight;
        var trigger = function () {
            updateState({ index: index });
            if (emitChange && props.onChange) {
                requestAnimationFrame(function () {
                    var _a;
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, getOptionValue(options[index]), index, confirm);
                });
            }
        };
        // trigger the change event after transitionend when moving
        if (moving.current && offset !== state.offset) {
            //@ts-ignore
            transitionEndTrigger.current = trigger;
        }
        else {
            trigger();
        }
        updateState({ offset: offset });
    };
    var setOptions = function (options) {
        if (JSON.stringify(options) !== JSON.stringify(state.options)) {
            updateState({ options: options });
            var index = options.findIndex(function (item) { return getOptionValue(item) === value; }) || 0;
            setIndex(index, true, true);
        }
    };
    var onClickItem = function (index) {
        if (moving.current || props.readonly) {
            return;
        }
        transitionEndTrigger.current = null;
        updateState({ duration: DEFAULT_DURATION });
        setIndex(index, true, true);
    };
    var getIndexByOffset = function (offset) {
        return (0, helper_1.range)(Math.round(-offset / itemHeight), 0, count - 1);
    };
    var momentum = function (distance, duration) {
        var speed = Math.abs(distance / duration);
        distance = state.offset + (speed / 0.003) * (distance < 0 ? -1 : 1);
        var index = getIndexByOffset(distance);
        updateState({ duration: +swipeDuration });
        setIndex(index, true);
    };
    var stopMomentum = function () {
        moving.current = false;
        updateState({ duration: 0 });
        if (transitionEndTrigger.current) {
            //@ts-ignore
            transitionEndTrigger.current();
            transitionEndTrigger.current = null;
        }
    };
    var onTouchStart = function (event) {
        if (props.readonly) {
            return;
        }
        touch.start(event);
        var offset = state.offset;
        if (moving.current) {
            var translateY = getElementTranslateY(wrapper.current);
            offset = Math.min(0, translateY - baseOffset);
            startOffset.current = offset;
        }
        else {
            startOffset.current = offset;
        }
        updateState({ duration: 0, offset: offset });
        touchStartTime.current = Date.now();
        momentumOffset.current = startOffset.current;
        transitionEndTrigger.current = null;
    };
    var onTouchMove = function (event) {
        if (props.readonly) {
            return;
        }
        touch.move(event);
        if (touch.isVertical()) {
            moving.current = true;
        }
        var offset = (0, helper_1.range)(startOffset.current + touch.deltaY, -(count * itemHeight), itemHeight);
        updateState({
            offset: offset
        });
        var now = Date.now();
        if (now - touchStartTime.current > MOMENTUM_LIMIT_TIME) {
            touchStartTime.current = now;
            momentumOffset.current = offset;
        }
    };
    var onTouchEnd = function () {
        if (props.readonly) {
            return;
        }
        var distance = state.offset - momentumOffset.current;
        var duration = Date.now() - touchStartTime.current;
        var allowMomentum = duration < MOMENTUM_LIMIT_TIME &&
            Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;
        if (allowMomentum) {
            momentum(distance, duration);
            return;
        }
        var index = getIndexByOffset(state.offset);
        updateState({ duration: DEFAULT_DURATION });
        setIndex(index, true);
        // compatible with desktop scenario
        // use setTimeout to skip the click event triggered after touchstart
        setTimeout(function () {
            moving.current = false;
        }, 0);
    };
    var renderOptions = function () {
        var style = {
            height: "".concat(itemHeight, "px"),
            lineHeight: "".concat(itemHeight, "px")
        };
        return state.options.map(function (option, index) {
            var text = getOptionText(option);
            var disabled = isOptionDisabled(option);
            var data = {
                role: 'button',
                key: index,
                style: style,
                tabIndex: disabled ? -1 : 0,
                className: props.classnames("PickerColumns-columnItem", {
                    'is-disabled': disabled,
                    'is-selected': index === state.index
                }),
                onClick: function () {
                    onClickItem(index);
                }
            };
            var childData = {
                className: 'text-ellipsis',
                children: text
            };
            return (react_1.default.createElement("li", (0, tslib_1.__assign)({}, data, { ref: menuItemRef }), props.optionRender ? (props.optionRender(option)) : (react_1.default.createElement("div", (0, tslib_1.__assign)({}, childData)))));
        });
    };
    var setValue = function (value) {
        var options = state.options;
        for (var i = 0; i < options.length; i += 1) {
            if (options[i] === value) {
                return setIndex(i);
            }
        }
        return null;
    };
    var getValue = (0, react_1.useCallback)(function () { return state.options[state.index]; }, [state.index, state.options]);
    (0, react_1.useEffect)(function () {
        setIndex(defaultIndex);
    }, [defaultIndex]);
    (0, hooks_1.useUpdateEffect)(function () {
        setOptions((0, cloneDeep_1.default)(options));
    }, [options]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        state: state,
        setIndex: setIndex,
        getValue: getValue,
        setValue: setValue,
        setOptions: setOptions,
        stopMomentum: stopMomentum
    }); });
    var wrapperStyle = {
        transform: "translate3d(0, ".concat(state.offset + baseOffset, "px, 0)"),
        transitionDuration: "".concat(state.duration, "ms"),
        transitionProperty: state.duration ? 'all' : 'none'
    };
    return (react_1.default.createElement("div", { ref: root, className: props.classnames('PickerColumns', props.className), onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, onTouchCancel: onTouchEnd },
        react_1.default.createElement("ul", { ref: wrapper, style: wrapperStyle, className: props.classnames('PickerColumns-columnWrapper'), onTransitionEnd: stopMomentum }, renderOptions())));
});
PickerColumn.defaultProps = {
    options: [],
    visibleItemCount: 5,
    swipeDuration: 1000,
    itemHeight: 48
};
exports.default = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(PickerColumn, {
    value: 'onChange'
}));
//# sourceMappingURL=./components/PickerColumn.js.map
