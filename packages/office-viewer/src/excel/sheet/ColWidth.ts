/**
 * col 宽度相关的工具函数
 * https://learn.microsoft.com/en-US/office/troubleshoot/excel/determine-column-widths
 */

/**
 * 用于根据字符数获取列宽
 * @returns 返回宽度像素
 */
export function baseColWidth2px(colWidth: number, fontWidth: number) {
  // 文档（P.1685）里的说法是
  // defaultColWidth = baseColumnWidth + {margin padding (2 pixels on each side, totalling 4 pixels)} + {gridline (1pixel)}
  // 所以这里加 5
  return colWidth * fontWidth + 5;
}

/**
 * 根据列宽获取 px，这个减去 0.83203125 是 Excel 默认加的
 * 这个计算方法可能不太准，还得进一步调研
 * @param colWidth
 * @returns 返回宽度像素
 */
export function colWidth2px(colWidth: number, fontWidth: number) {
  return baseColWidth2px(colWidth - 0.83203125, fontWidth);
}

/**
 * 根据像素反算列宽
 */
export function px2colWidth(px: number, fontWidth: number) {
  return (px - 5) / fontWidth + 0.83203125;
}
