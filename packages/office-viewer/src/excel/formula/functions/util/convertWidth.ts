/**
 * 来自以下，看起来不支持，。和片假名，后面得优化
 * Width Converter
 * Copyright 2017 Yanbin Ma under MIT
 * https://github.com/myanbin/hwfw-convert
 */

const CODEPOINT_BASE = '\uff10'.codePointAt(0)! - '0'.codePointAt(0)!;

const CJK_PUNCTUATIONS = [
  0xff0c /* ， */, 0x3002 /* 。 */, 0xff01 /* ！ */, 0xff08 /* （ */,
  0xff09 /* ） */, 0x3001 /* 、 */, 0xff1a /* ： */, 0xff1b /* ； */,
  0xff1f /* ？ */, 0xff3b /* ［ */, 0xff3d /* ］ */, 0xff5e /* ～ */,
  0x2018 /* ‘ */, 0x2019 /* ’ */, 0x201c /* “ */, 0x201d /* ” */,
  0x300a /* 《 */, 0x300b /* 》 */, 0x3008 /* 〈 */, 0x3009 /* 〉 */,
  0x3010 /* 【 */, 0x3011 /* 】 */
];

const LATIN_PUNCTUATIONS = [
  0x2c /* , */, 0x2e /* . */, 0x21 /* ! */, 0x28 /* ( */, 0x29 /* ) */,
  0x2c /* , */, 0x3a /* : */, 0x3b /* ; */, 0x3f /* ? */, 0x5b /* [ */,
  0x5d /* ] */, 0x7e /* ~ */, 0x27 /* ' */, 0x27 /* ' */, 0x22 /* " */,
  0x22 /* " */, 0xab /* « */, 0xbb /* » */, 0x2039 /* ‹ */, 0x203a /* › */,
  0x5b /* [ */, 0x5d /* ] */
];

/* Reference: https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms */
const FULL_SYMBOLS = [
  0xff02 /* ＂ */, 0xff03 /* ＃ */, 0xff04 /* ＄ */, 0xff05 /* ％ */,
  0xff06 /* ＆ */, 0xff07 /* ＇ */, 0xff0a /* ＊ */, 0xff0b /* ＋ */,
  0xff0d /* － */, 0xff0e /* ． */, 0xff0f /* ／ */, 0xff1c /* ＜ */,
  0xff1d /* ＝ */, 0xff1e /* ＞ */, 0xff20 /* ＠ */, 0xff3c /* ＼ */,
  0xff3e /* ＾ */, 0xff3f /* ＿ */, 0xff40 /* ｀ */, 0xff5b /* ｛ */,
  0xff5c /* ｜ */, 0xff5d /* ｝ */
];
const HALF_SYMBOLS = FULL_SYMBOLS.map(function (codePoint) {
  return codePoint - CODEPOINT_BASE;
});

function _mergeOptions(_options: object) {
  const defaultOptions = {
    digit: true, // 将全角数字转换成半角
    alpha: true, // 将全角字母转换成半角
    space: true, // 将全角空格转换成半角
    symbol: true, // 将全角的 #、$、%、& 等特殊字符转换成半角（不包括中文标点符号）
    punctuation: false, // 将中文标点符号转换成对应英文标点符号（在中文环境中不推荐使用）
    smartMode: true // 智能排除模式。可以识别出数值、网址等内容并进行精确转换
  };
  return Object.assign(defaultOptions, _options);
}

/**
 * Full width to Half width Tramsformer
 * @param {string} source Source text (full width)
 * @param {object} options Options
 */
export function full2half(source: string, options: object = {}) {
  const sourceSize = source.length;
  const _options = _mergeOptions(options);
  let output = [];
  for (let index = 0; index < sourceSize; index++) {
    const codePoint = source.codePointAt(index)!;
    if (
      /* Digit Flag = */ _options.digit &&
      codePoint >= 0xff10 &&
      codePoint <= 0xff19
    ) {
      output[index] = String.fromCodePoint(codePoint - CODEPOINT_BASE);
    } else if (
      /* Alpha Flag = */ _options.alpha &&
      ((codePoint >= 0xff21 && codePoint <= 0xff3a) ||
        (codePoint >= 0xff41 && codePoint <= 0xff5a))
    ) {
      output[index] = String.fromCodePoint(codePoint - CODEPOINT_BASE);
    } else if (
      /* Symbol Flag */ _options.symbol &&
      FULL_SYMBOLS.indexOf(codePoint) !== -1
    ) {
      output[index] = String.fromCodePoint(codePoint - CODEPOINT_BASE);
    } else if (
      /* Space Flag = */ _options.space &&
      codePoint === 0x3000 /* Fullwidth Space */
    ) {
      output[index] = String.fromCodePoint(0x0020);
    } else {
      output[index] = source[index];
    }

    if (
      /* Punctuation Flag = */ _options.punctuation &&
      CJK_PUNCTUATIONS.indexOf(codePoint) !== -1
    ) {
      output[index] = String.fromCodePoint(
        LATIN_PUNCTUATIONS[CJK_PUNCTUATIONS.indexOf(codePoint)]
      );
    }
  }
  let destination = output.join('');
  if (/* Smart Mode = */ _options.smartMode) {
    if (/* Digit Flag = */ _options.digit) {
      destination = destination.replace(/\d[\uff0c]\d/g, function (match) {
        return match.replace(/[\uff0c]/, ',');
      });
      destination = destination.replace(/\d\d[\uff1a]\d\d/g, function (match) {
        return match.replace(/[\uff1a]/, ':');
      });
      destination = destination.replace(/\d[\uff0e]\d/g, function (match) {
        return match.replace(/[\uff0e]/, '.');
      });

      destination = destination.replace(/\d[\u3002]\d/g, function (match) {
        return match.replace(/[\uff0e]/, '.');
      });
    }
    if (/* Symbol Flag */ _options.symbol) {
      destination = destination.replace(/https?[\uff1a]/g, function (match) {
        return match.replace(/[\uff1a]/, ':');
      });
    }
  }
  return destination;
}

/**
 * Half width to Full width Tramsformer
 * @param {string} source Source text (half width)
 * @param {object} options Options
 */
export function half2full(source: string, options: object = {}) {
  const sourceSize = source.length;
  const _options = _mergeOptions(options);
  let output = [];
  for (let index = 0; index < sourceSize; index++) {
    const codePoint = source.codePointAt(index)!;
    if (
      /* Digit Flag = */ _options.digit &&
      codePoint >= 0x0030 &&
      codePoint <= 0x0039
    ) {
      output[index] = String.fromCodePoint(codePoint + CODEPOINT_BASE);
    } else if (
      /* Alpha Flag = */ _options.alpha &&
      ((codePoint >= 0x0041 && codePoint <= 0x005a) ||
        (codePoint >= 0x0061 && codePoint <= 0x007a))
    ) {
      output[index] = String.fromCodePoint(codePoint + CODEPOINT_BASE);
    } else if (
      /* Symbol Flag */ _options.symbol &&
      HALF_SYMBOLS.indexOf(codePoint) !== -1
    ) {
      output[index] = String.fromCodePoint(codePoint + CODEPOINT_BASE);
    } else if (
      /* Space Flag = */ _options.space &&
      codePoint === 0x0020 /* Halfwidth Space */
    ) {
      output[index] = String.fromCodePoint(0x3000);
    } else {
      output[index] = source[index];
    }
    if (
      /* Punctuation Flag = */ _options.punctuation &&
      LATIN_PUNCTUATIONS.indexOf(codePoint) !== -1
    ) {
      output[index] = String.fromCodePoint(
        CJK_PUNCTUATIONS[LATIN_PUNCTUATIONS.indexOf(codePoint)]
      );
    }
  }
  let destination = output.join('');
  if (/* Smart Mode = */ _options.smartMode) {
    if (/* Digit Flag = */ _options.digit) {
      destination = destination.replace(/\d[,\uff0c]\d{3}/g, function (match) {
        return match.replace(/[,\uff0c]/, String.fromCodePoint(0xff0c));
      });
      destination = destination.replace(
        /\d\d[:\uff1a]]\d\d/g,
        function (match) {
          return match.replace(/[:\uff1a]/, String.fromCodePoint(0xff1a));
        }
      );
      destination = destination.replace(/\d[.\u3002]]\d/g, function (match) {
        return match.replace(/[.\u3002]/, String.fromCodePoint(0xff0e));
      });
    }
    if (/* Symbol Flag */ _options.symbol) {
      destination = destination.replace(/https?[:\uff1a]/g, function (match) {
        return match.replace(/[:\uff1a]/, String.fromCodePoint(0xff1a));
      });
    }
  }
  return destination;
}
