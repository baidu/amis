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
  if (h > 1) {
    h = h / 360;
  }
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

/**
 * 避免颜色值超出范围，适用于 rgb
 */
function toValidColor(c: number) {
  return Math.min(Math.max(c, 0), 255);
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

  static fromHSL(h: number, s: number, l: number) {
    const rgb = hslToRgb(h, s, l);
    return new Color(`#${rgbToHex(rgb.r, rgb.g, rgb.b)}`);
  }

  static fromRGB(r: number, g: number, b: number) {
    const rgb = rgbToHex(r, g, b);
    return new Color(`#${rgb}`);
  }

  /**
   * 设置 lum
   */
  lum(l: number) {
    return this.changeHsl(l, 'l', 'set');
  }

  /**
   * 改变 lum 百分比，其实不太对，但差不太多
   * @param l 百分比，比如 2 相当于 200 %
   */
  lumMod(l: number) {
    return this.changeHsl(l, 'l', 'mod');
  }

  /**
   * 改变百分比
   * @param l 百分比，比如 -0.2 相当于减少 20 %
   */
  lumOff(l: number) {
    return this.changeHsl(l, 'l', 'off');
  }

  /**
   * h 取值范围是 0-1
   */
  hue(h: number) {
    return this.changeHsl(h, 'h', 'set');
  }

  hueMod(h: number) {
    return this.changeHsl(h, 'h', 'mod');
  }

  hueOff(h: number) {
    return this.changeHsl(h, 'h', 'off');
  }

  sat(s: number) {
    return this.changeHsl(s, 's', 'set');
  }

  satMod(s: number) {
    return this.changeHsl(s, 's', 'mod');
  }

  satOff(s: number) {
    return this.changeHsl(s, 's', 'off');
  }

  /**
   * 修改 hsl 中某个部分的值
   */
  changeHsl(
    num: number,
    com: 'h' | 's' | 'l',
    changeType: 'set' | 'mod' | 'off'
  ) {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    if (changeType === 'set') {
      hsl[com] = num;
    } else if (changeType === 'mod') {
      hsl[com] = hsl[com] * num;
    } else if (changeType === 'off') {
      hsl[com] += hsl[com] * num;
    }

    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    return this;
  }

  /**
   * 互补色
   */
  comp() {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    hsl.h = hsl.h + 0.5;
    if (hsl.h > 1) {
      hsl.h -= 1;
    }
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    return this;
  }

  shade(s: number) {
    this.r = toValidColor(this.r - 256 * s);
    this.g = toValidColor(this.g - 256 * s);
    this.b = toValidColor(this.b - 256 * s);
  }

  tint(t: number) {
    this.r = toValidColor(this.r + 256 * t);
    this.g = toValidColor(this.g + 256 * t);
    this.b = toValidColor(this.b + 256 * t);
  }

  inv() {
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
    return this;
  }

  toHex() {
    return '#' + rgbToHex(this.r, this.g, this.b);
  }

  toRgba(alpha: number) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
  }
}

// 下面是来自 xlsx 的代码，先放着有没用

function hex2RGB(h: string) {
  var o = h.slice(h[0] === '#' ? 1 : 0).slice(0, 6);
  return [
    parseInt(o.slice(0, 2), 16),
    parseInt(o.slice(2, 4), 16),
    parseInt(o.slice(4, 6), 16)
  ];
}
function rgb2Hex(rgb: number[]) {
  for (var i = 0, o = 1; i != 3; ++i)
    o = o * 256 + (rgb[i] > 255 ? 255 : rgb[i] < 0 ? 0 : rgb[i]);
  return o.toString(16).toUpperCase().slice(1);
}

function rgb2HSL(rgb: number[]) {
  var R = rgb[0] / 255,
    G = rgb[1] / 255,
    B = rgb[2] / 255;
  var M = Math.max(R, G, B),
    m = Math.min(R, G, B),
    C = M - m;
  if (C === 0) return [0, 0, R];

  var H6 = 0,
    S = 0,
    L2 = M + m;
  S = C / (L2 > 1 ? 2 - L2 : L2);
  switch (M) {
    case R:
      H6 = ((G - B) / C + 6) % 6;
      break;
    case G:
      H6 = (B - R) / C + 2;
      break;
    case B:
      H6 = (R - G) / C + 4;
      break;
  }
  return [H6 / 6, S, L2 / 2];
}

function hsl2RGB(hsl: number[]) {
  var H = hsl[0],
    S = hsl[1],
    L = hsl[2];
  var C = S * 2 * (L < 0.5 ? L : 1 - L),
    m = L - C / 2;
  var rgb = [m, m, m],
    h6 = 6 * H;

  var X;
  if (S !== 0)
    switch (h6 | 0) {
      case 0:
      case 6:
        X = C * h6;
        rgb[0] += C;
        rgb[1] += X;
        break;
      case 1:
        X = C * (2 - h6);
        rgb[0] += X;
        rgb[1] += C;
        break;
      case 2:
        X = C * (h6 - 2);
        rgb[1] += C;
        rgb[2] += X;
        break;
      case 3:
        X = C * (4 - h6);
        rgb[1] += X;
        rgb[2] += C;
        break;
      case 4:
        X = C * (h6 - 4);
        rgb[2] += C;
        rgb[0] += X;
        break;
      case 5:
        X = C * (6 - h6);
        rgb[2] += X;
        rgb[0] += C;
        break;
    }
  for (var i = 0; i != 3; ++i) rgb[i] = Math.round(rgb[i] * 255);
  return rgb;
}

/* 18.8.3 bgColor tint algorithm */
export const rgbTint = function (hex: string, tint: number) {
  if (tint === 0) {
    return hex;
  }
  const hsl = rgb2HSL(hex2RGB(hex));
  if (tint < 0) {
    hsl[2] = hsl[2] * (1 + tint);
  } else {
    hsl[2] = 1 - (1 - hsl[2]) * (1 - tint);
  }
  return rgb2Hex(hsl2RGB(hsl));
};

/**
 * 计算两个颜色之间的渐变色
 */
export function interpolateColor(start: Color, end: Color, percent: number) {
  const r = Math.min(255, start.r + (end.r - start.r) * percent);
  const g = Math.min(255, start.g + (end.g - start.g) * percent);
  const b = Math.min(255, start.b + (end.b - start.b) * percent);
  return `${rgbToHex(r, g, b)}`;
}
