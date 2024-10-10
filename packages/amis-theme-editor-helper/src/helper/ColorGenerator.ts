type ResColor = {hex: string; hsv: number[]}[];

export class ColorGenerator {
  color = '';
  //十六进制颜色值的正则表达式
  reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  isDark = false;
  constructor(color: string, isDark: boolean = false) {
    this.setPrimaryColor(color);
    this.isDark = isDark;
  }
  /**
   * 生成衍生色
   */
  getDerivedColor() {
    const rgb = ColorGenerator.hexToRgb(this.color);
    const [h, s, v] = ColorGenerator.rgbToHsv(rgb);
    const scolors: ResColor = [];
    const wcolors: ResColor = [];
    const hsvCorrection = (hsv: number[]) => {
      let h = hsv[0],
        s = hsv[1],
        v = hsv[2];
      if (s < 10) {
        s = 10;
      }
      return ColorGenerator.hsvCorrection([h, s, v]);
    };
    for (let i = 0; i < 4; i++) {
      const index = i + 1;
      let sh, ss, sv;
      if (h > 60 && h < 300) {
        // 冷色
        if (this.isDark) {
          sh = h - index * 2;
          ss = s - index * 5;
          sv = v;
        } else {
          sh = h + index * 2;
          ss = s + index * 5;
          sv = v - index * 15;
        }
      } else {
        // 暖色
        if (this.isDark) {
          sh = h + index * 2;
          ss = s - index * 5;
          sv = v + index * 15;
        } else {
          sh = h - index * 2;
          ss = s + index * 5;
          sv = v - index * 15;
        }
      }
      const shsv = hsvCorrection([sh, ss, sv]);
      const srgb = ColorGenerator.hsvToRgb(shsv);
      const shex = ColorGenerator.rgbToHex(srgb);

      scolors.push({hex: shex, hsv: shsv});
    }
    for (let i = 0; i < 5; i++) {
      const index = i + 1;
      let wh, ws, wv;
      if (h > 60 && h < 300) {
        // 冷色
        if (this.isDark) {
          wh = h + index * 1;
          ws = s + index * (s / 5);
          wv = v - index * 5;
        } else {
          wh = h - index * 1;
          ws = s - index * (s / 5);
          wv = v + index * 5;
        }
      } else {
        // 暖色
        if (this.isDark) {
          wh = h - index * 1;
          ws = s + index * (s / 5);
          wv = v - index * (100 - v) * 2;
        } else {
          wh = h + index * 1;
          ws = s - index * (s / 5);
          wv = v + index * (100 - v) * 5;
        }
      }
      const whsv = hsvCorrection([wh, ws, wv]);
      const wrgb = ColorGenerator.hsvToRgb(whsv);
      const whex = ColorGenerator.rgbToHex(wrgb);

      wcolors.push({hex: whex, hsv: whsv});
    }
    return [
      ...scolors.reverse(),
      {hex: this.color, hsv: [h, s, v]},
      ...wcolors
    ];
  }
  /**
   * 生成中性色
   */
  getNeutralColor() {
    const rgb = ColorGenerator.hexToRgb(this.color);
    const [h, ,] = ColorGenerator.rgbToHsv(rgb);
    let S = [65, 45, 25, 10, 6, 4, 2, 1, 1, 1, 0];
    let V = [8, 15, 25, 40, 55, 75, 85, 92, 96, 98, 100];
    if (this.isDark) {
      S = S.reverse();
      V = V.reverse();
    }
    const colors: ResColor = [];
    for (let i = 0; i < 11; i++) {
      const newHsv = ColorGenerator.hsvCorrection([h, S[i], V[i]]);
      const newRgb = ColorGenerator.hsvToRgb(newHsv);
      const newHex = ColorGenerator.rgbToHex(newRgb);
      colors.push({hex: newHex, hsv: newHsv});
    }
    return colors;
  }
  /**
   * 生成功能色
   */
  getFunctionalColor() {
    const rgb = ColorGenerator.hexToRgb(this.color);
    const [h, s, v] = ColorGenerator.rgbToHsv(rgb);
    const errorH = {a: 375.06, b: 0.6, c: 134.93, d: 353.95};
    const warnH = {a: 217.7, b: -0.02, c: 514460.59, d: -118.56};
    const successH = {a: 130.48, b: -0.24, c: 0.00066};

    const errorS = {a: 95.12, b: 2.34, c: 72.07, d: 69.59};
    const warnS = {a: 95.1, b: 0.53, c: 74.9, d: 66.82};
    const successS = {a: 100.5, b: -6.41, c: 80.99, d: 65.5};

    const errorV = {a: 100.21, b: -16.63, c: 89.6, d: 83};
    const warnV = {a: 270.03, b: -0.1, c: 1.18, d: -103.6};
    const successV = {a: 81.5, b: -6.31, c: 91.2, d: 64.5};

    const hs = [
      [
        h === 0 ? 0 : ColorGenerator.functionY(h, errorH) - 3,
        ColorGenerator.functionY(s, errorS) - 5,
        ColorGenerator.functionY(s, errorV) + 7
      ],
      [
        ColorGenerator.functionY(h + 1, warnH) - 7,
        ColorGenerator.functionY(s + 1, warnS) + 5,
        ColorGenerator.functionY(s + 1, warnV) - 23
      ],
      [
        Math.round(successH.a + successH.b * h + successH.c * h * h),
        ColorGenerator.functionY(s, successS) + 4,
        ColorGenerator.functionY(s, successV) + 4
      ]
    ];
    const colors = hs.map(hsv => {
      hsv = ColorGenerator.hsvCorrection(hsv);
      const newRgb = ColorGenerator.hsvToRgb(hsv);
      const hex = ColorGenerator.rgbToHex(newRgb);
      return {hex, hsv};
    });
    return colors;
  }

  /**
   * 生成数据色
   */
  getDataColor() {
    const colors = ColorGenerator.getColorPalette(this.color);
    const color1 = [
      colors[0],
      colors[4],
      colors[8],
      colors[12],
      colors[16],
      colors[20],
      colors[23]
    ];
    const color2 = [
      colors[0],
      colors[5],
      colors[10],
      colors[15],
      colors[19],
      colors[23],
      colors[3]
    ];
    const color3 = [
      colors[0],
      colors[1],
      colors[2],
      colors[3],
      colors[4],
      colors[5],
      colors[6]
    ];

    return [color1, color2, color3];
  }

  setPrimaryColor(color: string) {
    if (this.reg.test(color)) {
      this.color = color;
    } else {
      throw new Error('请传入十六进制色值');
    }
  }
  static hexToRgb(hexColor: string) {
    if (hexColor.length === 4) {
      let hexColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        hexColorNew += hexColor
          .slice(i, i + 1)
          .concat(hexColor.slice(i, i + 1));
      }
      hexColor = hexColorNew;
    }
    //处理六位的颜色值
    const hexColorChange: number[] = [];
    for (let i = 1; i < 7; i += 2) {
      hexColorChange.push(parseInt('0x' + hexColor.slice(i, i + 2)));
    }
    return hexColorChange;
  }
  static rgbToHex(rgb: number[]) {
    const r = rgb[0],
      g = rgb[1],
      b = rgb[2];
    const hexr = r.toString(16).padStart(2, '0');
    const hexg = g.toString(16).padStart(2, '0');
    const hexb = b.toString(16).padStart(2, '0');
    return '#' + hexr + hexg + hexb;
  }
  static rgbToHsv(rgb: number[]) {
    let r = rgb[0],
      g = rgb[1],
      b = rgb[2];
    r = r / 255;
    g = g / 255;
    b = b / 255;
    let h = 0,
      s,
      v;
    const min = Math.min(r, g, b);
    const max = (v = Math.max(r, g, b));
    const difference = max - min;

    if (max == min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / difference + (g < b ? 6 : 0);
          break;
        case g:
          h = 2 + (b - r) / difference;
          break;
        case b:
          h = 4 + (r - g) / difference;
          break;
      }
      h = Math.round(h * 60);
    }
    if (max == 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }
    s = Math.round(s * 100);
    v = Math.round(v * 100);
    return [h, s, v];
  }
  static hsvToRgb(hsv: number[]) {
    let h = hsv[0],
      s = hsv[1],
      v = hsv[2];
    s = s / 100;
    v = v / 100;
    let r = 0,
      g = 0,
      b = 0;
    const i = Math.floor((h / 60) % 6);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
      default:
        break;
    }
    r = this.rgbCorrection(Math.round(r * 255.0));
    g = this.rgbCorrection(Math.round(g * 255.0));
    b = this.rgbCorrection(Math.round(b * 255.0));
    return [r, g, b];
  }
  static hsvCorrection(hsv: number[]) {
    let h = hsv[0],
      s = hsv[1],
      v = hsv[2];
    if (h < 0) {
      h = 360 + h;
    }
    if (h >= 360) {
      h = h - 360;
    }
    if (s < 0) {
      s = 0;
    }
    if (s > 100) {
      s = 100;
    }
    if (v < 0) {
      v = 0;
    }
    if (v > 100) {
      v = 100;
    }
    return [h, s, v];
  }
  static rgbCorrection(value: number) {
    if (value < 0) {
      return 0;
    }
    if (value > 255) {
      return 255;
    }
    return value;
  }
  static functionY(
    x: number,
    coefficient: {a: number; b: number; c: number; d: number}
  ) {
    const {a, b, c, d} = coefficient;
    const res = (a - d) / (1 + Math.pow(x / c, b)) + d;
    return Math.round(res);
  }
  static isLightColor(color: string) {
    const rgb = ColorGenerator.hexToRgb(color);
    const hsv = ColorGenerator.rgbToHsv(rgb);
    return hsv[1] < 20 && hsv[2] > 90;
  }
  static getFontColor(color: string | undefined) {
    if (!color) {
      return '#fff';
    }
    return ColorGenerator.isLightColor(color) ? '#5C5F66' : '#fff';
  }

  static computedLight(R: number, G: number, B: number) {
    const gray = 0.299 * R + 0.587 * G + 0.114 * B;
    return {gray, light: (gray / 255) * 100};
  }

  static getColorPalette(color: string, vv: number = 0) {
    let rgb = ColorGenerator.hexToRgb(color);
    let [h, s, v] = ColorGenerator.rgbToHsv(rgb);
    const newColors = [];

    // 原色的灰色模型
    let {gray, light: mainLight} = ColorGenerator.computedLight(
      rgb[0],
      rgb[1],
      rgb[2]
    );

    newColors.push({
      rgb: rgb,
      hsv: [h, s, v],
      gray,
      light: mainLight,
      checkedRgb: rgb,
      checkedColor: ColorGenerator.rgbToHex(rgb),
      checkedGray: gray,
      checkedLight: mainLight
    });

    /** 基础校正 */

    // // 降低亮度
    // if (mainLight > 55) {
    //   mainLight = mainLight / 2;
    // }

    // // 提高饱和度
    // if (s < 70) {
    //   s = 70 + 70 - s;
    // }

    // // 提高饱和度
    // if (v < 70) {
    //   v = 70 + 70 - v;
    // }

    /** ***** */

    for (let i = 1; i < 24; i++) {
      const newH = (h + 15 * i) % 360;
      const newRgb = ColorGenerator.hsvToRgb([newH, s, v]);
      // 灰度关系
      let {gray, light} = ColorGenerator.computedLight(
        newRgb[0],
        newRgb[1],
        newRgb[2]
      );

      const newColor = {
        rgb: rgb,
        hsv: [h, s, v],
        gray,
        light,
        checkedRgb: rgb,
        checkedColor: ColorGenerator.rgbToHex(rgb),
        checkedGray: gray,
        checkedLight: light
      };

      let checkedS = s;
      let checkedV = v;
      // 灰色校正
      let checkedRgb = newRgb;

      // 降低饱和度
      while (mainLight > light && checkedS > 0) {
        checkedS--;
        checkedRgb = ColorGenerator.hsvToRgb([newH, checkedS, checkedV]);
        const {gray: checkedGray, light: checkedLight} =
          ColorGenerator.computedLight(
            checkedRgb[0],
            checkedRgb[1],
            checkedRgb[2]
          );

        light = checkedLight;
        gray = checkedGray;
      }
      // 降低明度
      while (mainLight < light && checkedV > 0) {
        checkedV--;
        checkedRgb = ColorGenerator.hsvToRgb([newH, checkedS, checkedV]);
        const {gray: checkedGray, light: checkedLight} =
          ColorGenerator.computedLight(
            checkedRgb[0],
            checkedRgb[1],
            checkedRgb[2]
          );

        light = checkedLight;
        gray = checkedGray;
      }
      newColor.checkedLight = light;
      newColor.checkedGray = gray;
      newColor.checkedRgb = checkedRgb;
      newColor.checkedColor = ColorGenerator.rgbToHex(checkedRgb);
      newColors.push(newColor);
    }

    return newColors;
  }
}
