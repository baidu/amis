"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.oppositeMarginProp = exports.marginProp = exports.positionProp = exports.sizeProp = exports.scrollProp = exports.SCROLL_CHANGE_REASON = exports.DIRECTION = exports.ALIGNMENT = void 0;
var ALIGNMENT;
(function (ALIGNMENT) {
    ALIGNMENT["AUTO"] = "auto";
    ALIGNMENT["START"] = "start";
    ALIGNMENT["CENTER"] = "center";
    ALIGNMENT["END"] = "end";
})(ALIGNMENT = exports.ALIGNMENT || (exports.ALIGNMENT = {}));
var DIRECTION;
(function (DIRECTION) {
    DIRECTION["HORIZONTAL"] = "horizontal";
    DIRECTION["VERTICAL"] = "vertical";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
var SCROLL_CHANGE_REASON;
(function (SCROLL_CHANGE_REASON) {
    SCROLL_CHANGE_REASON["OBSERVED"] = "observed";
    SCROLL_CHANGE_REASON["REQUESTED"] = "requested";
})(SCROLL_CHANGE_REASON = exports.SCROLL_CHANGE_REASON || (exports.SCROLL_CHANGE_REASON = {}));
exports.scrollProp = (_a = {},
    _a[DIRECTION.VERTICAL] = 'scrollTop',
    _a[DIRECTION.HORIZONTAL] = 'scrollLeft',
    _a);
exports.sizeProp = (_b = {},
    _b[DIRECTION.VERTICAL] = 'height',
    _b[DIRECTION.HORIZONTAL] = 'width',
    _b);
exports.positionProp = (_c = {},
    _c[DIRECTION.VERTICAL] = 'top',
    _c[DIRECTION.HORIZONTAL] = 'left',
    _c);
exports.marginProp = (_d = {},
    _d[DIRECTION.VERTICAL] = 'marginTop',
    _d[DIRECTION.HORIZONTAL] = 'marginLeft',
    _d);
exports.oppositeMarginProp = (_e = {},
    _e[DIRECTION.VERTICAL] = 'marginBottom',
    _e[DIRECTION.HORIZONTAL] = 'marginRight',
    _e);
//# sourceMappingURL=./components/virtual-list/constants.js.map
