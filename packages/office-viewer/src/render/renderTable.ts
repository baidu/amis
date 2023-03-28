import {ST_TblStyleOverrideType} from '../openxml/Types';
import {Paragraph} from '../openxml/word/Paragraph';
import {TblLookKey, Table} from '../openxml/word/Table';
import {addClassName, appendChild, applyStyle} from '../util/dom';
import Word from '../Word';
import renderParagraph from './renderParagraph';
import {generateTableStyle} from './renderStyle';
import {setElementStyle} from './setElementStyle';

/**
 * 设置 td 的类，用于支持各种表格条件样式
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_TblStyleOverrideType.html
 */
function setTdClassName(
  rowIndex: number,
  colIndex: number,
  rowLength: number,
  colLength: number,
  element: Element,
  rowBandSize: number = 1,
  colBandSize: number = 1
) {
  // 左上角
  if (rowIndex === 0 && colIndex === 0) {
    element.classList.add('nwCell');
  }

  // 右上角
  if (rowIndex === 0 && colIndex === colLength - 1) {
    element.classList.add('neCell');
  }

  // 左下角
  if (rowIndex === rowLength - 1 && colIndex === 0) {
    element.classList.add('swCell');
  }

  // 右下角
  if (rowIndex === rowLength - 1 && colIndex === colLength - 1) {
    element.classList.add('seCell');
  }

  // 第一行
  if (rowIndex === 0) {
    element.classList.add('firstRow');
  }

  // 最后一行
  if (rowIndex === rowLength - 1) {
    element.classList.add('lastRow');
  }

  // 第一列
  if (colIndex === 0) {
    element.classList.add('firstCol');
  }

  // 最后一列
  if (colIndex === colLength - 1) {
    element.classList.add('lastCol');
  }

  // 奇数行
  if (isOdd(rowIndex + 1, rowBandSize)) {
    element.classList.add('band1Horz');
  }

  // 偶数行
  if (!isOdd(rowIndex + 1, rowBandSize)) {
    element.classList.add('band2Horz');
  }

  // 奇数列
  if (isOdd(colIndex + 1, colBandSize)) {
    element.classList.add('band1Vert');
  }

  // 偶数列
  if (!isOdd(colIndex + 1, colBandSize)) {
    element.classList.add('band2Vert');
  }
}

/**
 * 根据倍数判断是否是奇数，目前看来似乎 word 编辑器也没提供 size 设置
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblStyleRowBandSize.html
 */
function isOdd(num: number, size: number) {
  return !(num % 2);
}

/**
 * 渲染表格
 */
export default function renderTable(word: Word, table: Table) {
  const tableEl = document.createElement('table');
  const properties = table.properties;

  if (properties.tblCaption) {
    const caption = document.createElement('caption');
    caption.textContent = properties.tblCaption;
    tableEl.appendChild(caption);
  }

  if (properties.tblLook) {
    for (const key in properties.tblLook) {
      // 这两个属性是反过来的
      if (key === 'noHBand') {
        if (!properties.tblLook[key]) {
          addClassName(tableEl, 'enable-hBand');
        }
      } else if (key === 'noVBand') {
        if (!properties.tblLook[key]) {
          addClassName(tableEl, 'enable-vBand');
        }
      } else if (properties.tblLook[key as TblLookKey]) {
        addClassName(tableEl, 'enable-' + key);
      }
    }
  }

  setElementStyle(word, tableEl, properties);

  const customClass = word.genClassName();

  tableEl.classList.add(customClass);

  word.appendStyle(
    generateTableStyle(word.getClassPrefix(), customClass, {tblPr: properties})
  );

  // 这里或许应该生成 classname 来支持 tcCSSStyle

  const tbody = document.createElement('tbody');
  tableEl.appendChild(tbody);

  let rowIndex = 0;
  for (const tr of table.trs) {
    const trEl = document.createElement('tr');
    tbody.appendChild(trEl);

    let colIndex = 0;
    for (const tc of tr.tcs) {
      const tdEl = document.createElement('td') as HTMLTableCellElement;
      trEl.appendChild(tdEl);
      setTdClassName(
        rowIndex,
        colIndex,
        table.trs.length,
        tr.tcs.length,
        tdEl,
        properties.rowBandSize,
        properties.colBandSize
      );
      // tr 也能设置 tc style，所以先应用这个
      if (tr.properties.tcStyle) {
        applyStyle(tdEl, tr.properties.tcStyle);
      }

      const tcPr = tc.properties;
      setElementStyle(word, tdEl, tcPr);
      if (tcPr.gridSpan) {
        tdEl.colSpan = tcPr.gridSpan;
      }

      if (tcPr.rowSpan) {
        tdEl.rowSpan = tcPr.rowSpan;
      }

      let renderSpace = true;
      // 如果有 tcPr.hideMark 就不渲染空格
      if (tcPr.hideMark) {
        renderSpace = false;
      }
      for (const tcChild of tc.children) {
        if (tcChild instanceof Paragraph) {
          const p = renderParagraph(word, tcChild, renderSpace);
          appendChild(tdEl, p);
        } else if (tcChild instanceof Table) {
          // 如果已经有表格的话，就不再渲染空段落了，避免底部多个空行
          renderSpace = false;
          appendChild(tdEl, renderTable(word, tcChild));
        } else {
          console.warn('unknown child type: ' + tcChild);
        }
      }

      if (tcPr.rowSpan) {
        colIndex += tcPr.rowSpan;
      } else {
        colIndex++;
      }
    }
    rowIndex++;
  }

  return tableEl;
}
