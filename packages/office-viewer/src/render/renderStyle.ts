/**
 * 渲染内置样式及自定义样式
 */

import {TblStylePrStyle} from '../openxml/Style';
import {ST_TblStyleOverrideType} from '../openxml/Types';
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

  const hyphens = word.settings?.autoHyphenation ? 'hyphens: auto;' : '';

  const classPrefix = word.getClassPrefix();

  return `


  /** docDefaults **/
  .${classPrefix} {
    --docx-theme-font-minorHAnsi: Calibri,  Helvetica, Arial, 'Helvetica Neue';
    --docx-theme-font-minorEastAsia: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'STHeiti',
    'Microsoft YaHei';
  }

  .${classPrefix} p {
    margin: 0;
    padding: 0;
    line-height: 1.5;
    ${hyphens}
  }

  .${classPrefix} .justify:after {
    content: "";
    display: inline-block;
    width: 100%;
  }

  .${classPrefix} table {
    border-spacing: 0;
  }

  .${classPrefix} .${classPrefix}-p {
    ${defaultPStyle}
  }

  .${classPrefix} .${classPrefix}-r {
    overflow-wrap: break-word;
    ${defaultRStyle}
  }
  `;
}

/**
 * 生成表格级别样式
 */
export function generateTableStyle(
  classPrefix: string,
  styleDisplayId: string,
  style: TblStylePrStyle
) {
  let tblStyleText = '';
  const tblPr = style.tblPr;
  const tcPr = style.tcPr;
  if (tblPr) {
    const tblStyle = styleToText(tblPr.cssStyle);
    const tblTcStyle = styleToText(tblPr.tcCSSStyle);

    tblStyleText += `
 .${classPrefix} .${styleDisplayId} {
  border-collapse: collapse;
  ${tblStyle}
 }

 .${classPrefix} .${styleDisplayId} > tbody > tr > td {
  ${tblTcStyle}
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
  }

  if (tcPr) {
    const tcStyle = styleToText(tcPr.cssStyle);
    tblStyleText += `
    .${classPrefix} .${styleDisplayId} > tbody > tr > td {
     ${tcStyle}
    }
    `;
  }

  return tblStyleText;
}

// 用于生成表格 override 相关的样式，用于行或列
function genTblOverrideStyle(
  tblPrefix: string,
  classPrefix: string,
  overrideType: ST_TblStyleOverrideType,
  tblStylePrStyle: TblStylePrStyle
) {
  let styleText = '';

  const trStyle = styleToText(tblStylePrStyle.trPr?.cssStyle);

  let enableType = '';
  // 在 tblLook 里可以通过这些属性来控制是否启用
  switch (overrideType) {
    case 'firstCol':
      enableType = 'enable-firstColumn';
      break;

    case 'lastCol':
      enableType = 'enable-lastColumn';
      break;

    case 'firstRow':
      enableType = 'enable-firstRow';
      break;

    case 'lastRow':
      enableType = 'enable-lastRow';
      break;

    case 'band1Horz':
    case 'band2Horz':
      enableType = 'enable-hBand';
      break;

    case 'band1Vert':
    case 'band2Vert':
      enableType = 'enable-vBand';
      break;
  }

  if (trStyle) {
    styleText += `
    ${tblPrefix}.${enableType} > tbody > tr.${overrideType}{
       ${trStyle}
    }
    `;
  }

  const tcStyle = styleToText(tblStylePrStyle.tcPr?.cssStyle);
  if (tcStyle) {
    styleText += `
    ${tblPrefix}.${enableType} > tbody > tr > td.${overrideType} {
       ${tcStyle}
    }
    `;
    if (tblStylePrStyle.tcPr?.insideBorder) {
      const insideBorder = tblStylePrStyle.tcPr?.insideBorder;
      if (insideBorder.H) {
        styleText += `
          ${tblPrefix}.${enableType} > tbody > tr > td.${overrideType} {
            border-top: ${insideBorder.H};
          }`;
      }

      if (insideBorder.V) {
        // 这个主要是为了应对 GridTable5Dark-Accent5 里 firstRow 的情况，它其实有 right 设置，也得去掉
        if (insideBorder.V === 'none') {
          styleText += `
          ${tblPrefix}.${enableType} > tbody > tr > td.${overrideType} {
            border-left: none;
            border-right: none;
          }`;
        } else {
          styleText += `
          ${tblPrefix}.${enableType} > tbody > tr > td.${overrideType} {
            border-left: ${insideBorder.V};
          }`;
        }
      }
    }
  }

  const pStyle = styleToText(tblStylePrStyle.pPr?.cssStyle);

  if (pStyle) {
    styleText += `
    ${tblPrefix}.${enableType} > tbody > tr > td.${overrideType} > .${classPrefix}-p {
       ${pStyle}
    }
    `;
  }

  const rStyle = styleToText(tblStylePrStyle.rPr?.cssStyle);

  if (rStyle) {
    styleText += `
    ${tblPrefix}.${enableType} > tbody > tr > td.${overrideType} > .${classPrefix}-p > .${classPrefix}-r {
       ${rStyle}
    }
    `;
  }

  return styleText;
}

// 表格覆盖样式的顺序，权重高的放后面
const overrideTypeOrder: Set<ST_TblStyleOverrideType> = new Set([
  'wholeTable',
  'band1Horz',
  'band2Horz',
  'band1Vert',
  'band2Vert',
  'firstCol',
  'firstRow',
  'lastCol',
  'lastRow',
  'neCell',
  'nwCell',
  'seCell',
  'swCell'
]);

// 生成表格覆盖样式
function genOverrideTblStylePr(
  classPrefix: string,
  styleDisplayId: string,
  tblStylePr?: Record<ST_TblStyleOverrideType, TblStylePrStyle>
) {
  if (!tblStylePr) {
    return '';
  }

  let tblStylePrText = '';

  const stylePrefix = `.${classPrefix} .${styleDisplayId}`;

  for (const overrideType of overrideTypeOrder) {
    if (overrideType in tblStylePr) {
      const overrideStylePr = tblStylePr[overrideType];

      tblStylePrText += genTblOverrideStyle(
        stylePrefix,
        classPrefix,
        overrideType,
        overrideStylePr
      );
    }
  }

  return tblStylePrText;
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
      .${classPrefix} .${styleDisplayId} > .${classPrefix}-r {
        ${rStyle}
      }
      `;
    }

    const tblStyleText = generateTableStyle(
      classPrefix,
      styleDisplayId,
      styleData
    );

    const tblStylePr = genOverrideTblStylePr(
      classPrefix,
      styleDisplayId,
      styleData.tblStylePr
    );

    styleResult += `
    ${pStyleText}
    ${rStyleText}
    ${tblStyleText}
    ${tblStylePr}
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

  style.textContent = `
  ${docDefaults}

  ${styleText}
  `;

  return style;
}
