"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var MIN_DISTANCE = 10;
function getDirection(x, y) {
    if (x > y && x > MIN_DISTANCE) {
        return 'horizontal';
    }
    if (y > x && y > MIN_DISTANCE) {
        return 'vertical';
    }
    return '';
}
var INITIAL_STATE = {
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    direction: ''
};
var useTouch = function () {
    var refState = (0, react_1.useRef)(INITIAL_STATE);
    var innerState = refState.current;
    var update = function (value) {
        if (typeof value === 'function') {
            value = value(refState.current);
        }
        Object.entries(value).forEach(function (_a) {
            var k = _a[0], v = _a[1];
            //@ts-ignore
            refState.current[k] = v;
        });
    };
    var isVertical = (0, react_1.useCallback)(function () { return innerState.direction === 'vertical'; }, [innerState.direction]);
    var isHorizontal = (0, react_1.useCallback)(function () { return innerState.direction === 'horizontal'; }, [innerState.direction]);
    var reset = function () {
        update({
            deltaX: 0,
            deltaY: 0,
            offsetX: 0,
            offsetY: 0,
            direction: ''
        });
    };
    var start = (function (event) {
        reset();
        update({
            startX: event.touches[0].clientX,
            startY: event.touches[0].clientY
        });
    });
    var move = (function (event) {
        var touch = event.touches[0];
        update(function (value) {
            // Fix: Safari back will set clientX to negative number
            var newState = (0, tslib_1.__assign)({}, value);
            newState.deltaX = touch.clientX < 0 ? 0 : touch.clientX - newState.startX;
            newState.deltaY = touch.clientY - newState.startY;
            newState.offsetX = Math.abs(newState.deltaX);
            newState.offsetY = Math.abs(newState.deltaY);
            if (!newState.direction) {
                newState.direction = getDirection(newState.offsetX, newState.offsetY);
            }
            return newState;
        });
    });
    return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, innerState), { move: move, start: start, reset: reset, isVertical: isVertical, isHorizontal: isHorizontal });
};
exports.default = useTouch;
//# sourceMappingURL=./hooks/use-touch.js.map
