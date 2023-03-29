/**
 * 处理颜色相关的函数，目前只支持 rgb
 */

// 颜色转换来自 https://gist.github.com/mjackson/5311256
function rgbToHsl(r: number, g: number, b: number) {
  (r /= 255), (g /= 255), (b /= 255);

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h = 0,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {h, s, l};
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {r: r * 255, g: g * 255, b: b * 255};
}

function pad2(c: string) {
  return c.length == 1 ? '0' + c : '' + c;
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r: number, g: number, b: number) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16))
  ];

  return hex.join('').toUpperCase();
}

export class Color {
  r: number;
  g: number;
  b: number;
  // 是否是有效的颜色
  isValid: boolean;

  constructor(input: string) {
    const m = input.match(/^#?([0-9a-f]{6})$/i);
    if (m) {
      this.r = parseInt(m[1].substring(0, 2), 16);
      this.g = parseInt(m[1].substring(2, 4), 16);
      this.b = parseInt(m[1].substring(4, 6), 16);
      this.isValid = true;
    }
  }

  /**
   * 改变 lum 百分比，其实不太对，但差不太多
   * @param lum 百分比，比如 2 相当于 200 %
   */
  lumMod(lum: number) {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    hsl.l = hsl.l * lum;
    hsl.l = Math.min(1, Math.max(0, hsl.l));
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
  }

  /**
   * 改变百分比
   * @param lum 百分比，比如 -0.2 相当于减少 20 %
   */
  lumOff(lum: number) {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    hsl.l += hsl.l * lum;
    hsl.l = Math.min(1, Math.max(0, hsl.l));
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
  }

  toHex() {
    return '#' + rgbToHex(this.r, this.g, this.b);
  }
}
