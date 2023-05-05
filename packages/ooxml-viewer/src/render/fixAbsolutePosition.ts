import {CSSStyle} from '../openxml/Style';
import Word from '../Word';
import parseSides from '../util/parseSides';

/**
 * 修复绝对定位的位置，主要是加上 padding，因为 html 中的定位是不考虑 padding 的
 * @param word
 * @param style
 */
export function fixAbsolutePosition(
  word: Word,
  style: CSSStyle,
  inHeader = false
) {
  let paddingLeft = 0;
  let paddingTop = 0;
  let paddingRight = 0;
  let paddingBottom = 0;
  const customPadding = word.renderOptions.padding;
  if (customPadding) {
    const {left, top, right, bottom} = parseSides(customPadding);
    paddingLeft = parseInt(left || '0');
    paddingTop = parseInt(top || '0');
    paddingRight = parseInt(right || '0');
    paddingBottom = parseInt(bottom || '0');
  } else {
    const currentSection = word.currentSection;
    if (currentSection) {
      const pageMargin = currentSection.properties.pageMargin;
      if (pageMargin) {
        paddingLeft = parseInt(pageMargin.left || '0');
        paddingTop = parseInt(pageMargin.top || '0');
      }
    }
  }

  const leftStyle = style.left;
  if (leftStyle) {
    style.left = `${
      parseInt(String(leftStyle).replace('px', ''), 10) + paddingLeft
    }px`;
  }
  const topStyle = style.top;
  if (topStyle) {
    style.top = `${
      parseInt(String(topStyle).replace('px', ''), 10) + paddingTop
    }px`;
  }
  const rightStyle = style.right;
  if (rightStyle) {
    style.right = `${
      parseInt(String(rightStyle).replace('px', ''), 10) + paddingRight
    }px`;
  }
  const bottomStyle = style.bottom;
  if (bottomStyle) {
    style.bottom = `${
      parseInt(String(bottomStyle).replace('px', ''), 10) + paddingBottom
    }px`;
  }
}
