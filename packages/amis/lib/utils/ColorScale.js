"use strict";
// 代码修改自 https://github.com/dalisc/color-scales-js
// 主要是将校验功能改成修正而不是报错，比如 min 和 max 相等的时候自动给 max + 1
Object.defineProperty(exports, "__esModule", { value: true });
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        if (a === void 0) { a = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Color.prototype.toRGBString = function () {
        return "rgb(".concat(Math.floor(this.r * this.a), ",").concat(Math.floor(this.g * this.a), ",").concat(Math.floor(this.b * this.a), ")");
    };
    Color.prototype.toRGBAString = function () {
        return "rgba(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ",").concat(this.a, ")");
    };
    Color.prototype.toHexString = function () {
        return rgbaToHex(this);
    };
    return Color;
}());
function hexToColor(hex, alpha) {
    if (isValid3DigitHexColor(hex)) {
        hex = convertTo6DigitHexColor(hex);
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha);
    }
    else {
        throw new Error("".concat(hex, " is not a valid hex color."));
    }
}
function isValidHexColor(colorString) {
    return (isValid3DigitHexColor(colorString) || isValid6DigitHexColor(colorString));
}
function isValid3DigitHexColor(colorString) {
    var hexColorRegex = /^#(?:[0-9a-fA-F]{3})$/;
    return colorString.match(hexColorRegex);
}
function isValid6DigitHexColor(colorString) {
    var hexColorRegex = /^#(?:[0-9a-fA-F]{6})$/;
    return colorString.match(hexColorRegex);
}
function convertTo6DigitHexColor(threeDigitHex) {
    return threeDigitHex
        .substring(1)
        .split('')
        .map(function (char) {
        return char + char;
    })
        .join('');
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
function rgbaToHex(color) {
    var r = Math.floor(color.r * color.a);
    var g = Math.floor(color.g * color.a);
    var b = Math.floor(color.b * color.a);
    return "#".concat(componentToHex(r)).concat(componentToHex(g)).concat(componentToHex(b));
}
var ColorScale = /** @class */ (function () {
    function ColorScale(min, max, colorStops, alpha) {
        var _a;
        if (alpha === void 0) { alpha = 1; }
        this.min = isNaN(min) ? 0 : min;
        this.max = isNaN(max) ? 0 : max;
        if (this.min === this.max) {
            this.max = this.min + 1;
        }
        if (this.max < this.min) {
            _a = [this.min, this.max], this.max = _a[0], this.min = _a[1];
        }
        if (colorStops.length < 2) {
            colorStops = ['#FFEF9C', '#FF7127'];
        }
        this.alpha = alpha;
        this.colorStops = colorStops.map(function (colorStop) { return hexToColor(colorStop, alpha); });
    }
    ColorScale.prototype.getColor = function (value) {
        var numOfColorStops = this.colorStops.length;
        if (value < this.min)
            return this.colorStops[0];
        if (value > this.max)
            return this.colorStops[numOfColorStops - 1];
        var range = this.max - this.min;
        var weight = (value - this.min) / range;
        var colorStopIndex = Math.max(Math.ceil(weight * (numOfColorStops - 1)), 1);
        var minColor = this.colorStops[colorStopIndex - 1];
        var maxColor = this.colorStops[colorStopIndex];
        weight = weight * (numOfColorStops - 1) - (colorStopIndex - 1);
        var r = Math.floor(weight * maxColor.r + (1 - weight) * minColor.r);
        var g = Math.floor(weight * maxColor.g + (1 - weight) * minColor.g);
        var b = Math.floor(weight * maxColor.b + (1 - weight) * minColor.b);
        return new Color(r, g, b, this.alpha);
    };
    return ColorScale;
}());
exports.default = ColorScale;
//# sourceMappingURL=./utils/ColorScale.js.map
