/**
 * @file transformation.ts
 * @description CSS样式解析和编译
 */
import isNumber from 'lodash/isNumber';
import compact from 'lodash/compact';
export function parseBoxShadow(inputStr) {
    // const VALUES_REG = /,(?![^\(]*\))/;
    var PARTS_REG = /\s(?![^(]*\))/;
    var LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/;
    var isLength = function (v) { return v === '0' || LENGTH_REG.test(v); };
    var toNum = function (v) {
        if (!v.endsWith('px') && v !== '0') {
            return v;
        }
        var n = parseFloat(v);
        return !isNaN(n) ? n : v;
    };
    var parseValue = function (str) {
        var parts = str.split(PARTS_REG);
        var inset = parts.includes('inset');
        var last = parts.slice(-1)[0];
        var color = !isLength(last) ? last : undefined;
        var nums = parts
            .filter(function (n) { return n !== 'inset'; })
            .filter(function (n) { return n !== color; })
            .map(toNum);
        var x = nums[0], y = nums[1], blur = nums[2], spread = nums[3];
        return {
            inset: inset,
            x: x,
            y: y,
            blur: blur,
            spread: spread,
            color: color
        };
    };
    return parseValue(inputStr);
}
export function normalizeBoxShadow(config) {
    var x = config.x, y = config.y, blur = config.blur, spread = config.spread, color = config.color, inset = config.inset;
    var boxShadow = [];
    if (config === null || config === void 0 ? void 0 : config.inset) {
        boxShadow.push('inset');
    }
    if (x || y || spread || blur) {
        var normalizeUnit = function (props) {
            return isNumber(props === null || props === void 0 ? void 0 : props.length) && props.length > 0
                ? Math.round(props === null || props === void 0 ? void 0 : props.length) + (props === null || props === void 0 ? void 0 : props.unit)
                : undefined;
        };
        // x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径
        boxShadow.push(compact([
            normalizeUnit(x),
            normalizeUnit(y),
            normalizeUnit(blur),
            normalizeUnit(spread)
        ]).join(' '));
    }
    if (color) {
        boxShadow.push(color);
    }
    return boxShadow.length
        ? { boxShadow: boxShadow.join(' ') }
        : { boxShadow: undefined };
}
