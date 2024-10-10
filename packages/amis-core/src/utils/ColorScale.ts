// 代码修改自 https://github.com/dalisc/color-scales-js
// 主要是将校验功能改成修正而不是报错，比如 min 和 max 相等的时候自动给 max + 1

class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toRGBString() {
    return `rgb(${Math.floor(this.r * this.a)},${Math.floor(
      this.g * this.a
    )},${Math.floor(this.b * this.a)})`;
  }

  toRGBAString() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }

  toHexString() {
    return rgbaToHex(this);
  }
}

function hexToColor(hex: string, alpha: number) {
  if (isValid3DigitHexColor(hex)) {
    hex = convertTo6DigitHexColor(hex);
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return new Color(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      alpha
    );
  } else {
    throw new Error(`${hex} is not a valid hex color.`);
  }
}

function isValidHexColor(colorString: string) {
  return (
    isValid3DigitHexColor(colorString) || isValid6DigitHexColor(colorString)
  );
}

function isValid3DigitHexColor(colorString: string) {
  const hexColorRegex = /^#(?:[0-9a-fA-F]{3})$/;
  return colorString.match(hexColorRegex);
}

function isValid6DigitHexColor(colorString: string) {
  const hexColorRegex = /^#(?:[0-9a-fA-F]{6})$/;
  return colorString.match(hexColorRegex);
}

function convertTo6DigitHexColor(threeDigitHex: string) {
  return threeDigitHex
    .substring(1)
    .split('')
    .map(char => {
      return char + char;
    })
    .join('');
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbaToHex(color: Color) {
  const r = Math.floor(color.r * color.a);
  const g = Math.floor(color.g * color.a);
  const b = Math.floor(color.b * color.a);
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export class ColorScale {
  private min: number;
  private max: number;
  private alpha: number;
  private colorStops: Color[];

  constructor(
    min: number,
    max: number,
    colorStops: string[],
    alpha: number = 1
  ) {
    this.min = isNaN(min) ? 0 : min;
    this.max = isNaN(max) ? 0 : max;
    if (this.min === this.max) {
      this.max = this.min + 1;
    }
    if (this.max < this.min) {
      [this.max, this.min] = [this.min, this.max];
    }
    if (colorStops.length < 2) {
      colorStops = ['#FFEF9C', '#FF7127'];
    }
    this.alpha = alpha;
    this.colorStops = colorStops.map(colorStop => hexToColor(colorStop, alpha));
  }

  getColor(value: number) {
    const numOfColorStops = this.colorStops.length;
    if (value < this.min) return this.colorStops[0];
    if (value > this.max) return this.colorStops[numOfColorStops - 1];

    const range = this.max - this.min;
    let weight = (value - this.min) / range;
    const colorStopIndex = Math.max(
      Math.ceil(weight * (numOfColorStops - 1)),
      1
    );

    const minColor = this.colorStops[colorStopIndex - 1];
    const maxColor = this.colorStops[colorStopIndex];

    weight = weight * (numOfColorStops - 1) - (colorStopIndex - 1);

    const r = Math.floor(weight * maxColor.r + (1 - weight) * minColor.r);
    const g = Math.floor(weight * maxColor.g + (1 - weight) * minColor.g);
    const b = Math.floor(weight * maxColor.b + (1 - weight) * minColor.b);

    return new Color(r, g, b, this.alpha);
  }
}

export default ColorScale;
