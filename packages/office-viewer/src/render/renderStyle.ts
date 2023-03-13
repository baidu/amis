/**
 * 渲染内置样式及自定义样式
 */

import {TableProperties} from '../openxml/word/Table';
import {createElement, styleToText} from '../util/dom';
import Word from '../Word';

/**
 * 文档基础默认样式
 */
function generateDefaultStyle(word: Word) {
  const styles = word.styles;
  const defaultStyle = styles.defaultStyle;
  let defaultPStyle = '';

  if (defaultStyle?.pPr) {
    defaultPStyle = styleToText(defaultStyle.pPr.cssStyle);
  }

  let defaultRStyle = '';
  if (defaultStyle?.rPr) {
    defaultRStyle = styleToText(defaultStyle.rPr.cssStyle);
  }

  const classPrefix = word.getClassPrefix();

  return `
  .${word.wrapClassName} {

  }

  .${word.wrapClassName} > article > section {
    background: white;
  }

  /** docDefaults **/

  .${classPrefix} .p {
    margin: 0;
    ${defaultPStyle}
  }

  .${classPrefix} .r {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    ${defaultRStyle}
  }
  `;
}

export function generateTableStyle(
  classPrefix: string,
  styleDisplayId: string,
  tblPr: TableProperties
) {
  let tblStyleText = '';
  const tblStyle = styleToText(tblPr.cssStyle);
  const tcStyle = styleToText(tblPr.tcCSSStyle);

  tblStyleText = `
 .${classPrefix} .${styleDisplayId} {
  border-collapse: collapse;
  ${tblStyle}
 }

 .${classPrefix} .${styleDisplayId} > tbody > tr > td {
  ${tcStyle}
 }
 `;

  if (tblPr.insideBorder) {
    const insideBorder = tblPr.insideBorder;
    if (insideBorder.H) {
      tblStyleText += `
      .${classPrefix} .${styleDisplayId} > tbody > tr > td {
        border-top: ${insideBorder.H};
      }`;
    }

    if (insideBorder.V) {
      tblStyleText += `
      .${classPrefix} .${styleDisplayId} > tbody > tr > td {
        border-left: ${insideBorder.V};
      }`;
    }
  }

  return tblStyleText;
}

/**
 * 生成样式类
 */
function generateStyle(word: Word) {
  const styles = word.styles;
  const styleMap = styles.styleMap;

  const classPrefix = word.getClassPrefix();

  let styleResult = '';
  for (const styleId in styleMap) {
    const styleDisplayId = word.getStyleIdDisplayName(styleId);
    const styleData = styleMap[styleId];
    const pPr = styleData.pPr;
    let pStyleText = '';
    if (pPr) {
      const pStyle = styleToText(pPr.cssStyle);
      pStyleText = `
      .${classPrefix} .${styleDisplayId} {
        ${pStyle}
      }
      `;
    }
    let rStyleText = '';
    if (styleData.rPr) {
      const rStyle = styleToText(styleData.rPr.cssStyle);
      rStyleText = `
      .${classPrefix} .${styleDisplayId} > .r {
        ${rStyle}
      }
      `;
    }

    let tblStyleText = '';
    if (styleData.tblPr) {
      tblStyleText = generateTableStyle(
        classPrefix,
        styleDisplayId,
        styleData.tblPr
      );
    }

    styleResult += `
    ${pStyleText}
    ${rStyleText}
    ${tblStyleText}
    `;
  }
  return styleResult;
}

/**
 * 渲染所有样式
 */
export function renderStyle(word: Word) {
  const style = createElement('style') as HTMLStyleElement;
  const docDefaults = generateDefaultStyle(word);
  const styleText = generateStyle(word);

  style.innerHTML = `
  ${docDefaults}

  ${styleText}
  `;

  return style;
}
