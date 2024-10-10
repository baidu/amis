/**
 * 缓存解析结果
 */
const addressCache: {
  [key: string]: {
    col: number;
    row: number;
  };
} = {};

/**
 * 将 A1 转成 {col: 0, row: 0}
 * 从 exceljs 中拷贝过来的方法
 * 简单进行了修改，必须同时有行和列，如果只有一个就用 lettersToNumber
 * 返回结果是从 0 开始的
 * @param value
 */
export function decodeAddress(value: string) {
  const addr = value.length < 5 && addressCache[value];
  if (addr) {
    return addr;
  }
  let hasCol = false;
  let col = '';
  let colNumber: number = 0;
  let hasRow = false;
  let row = '';
  let rowNumber: number = 0;
  for (let i = 0, char; i < value.length; i++) {
    char = value.charCodeAt(i);
    // col should before row
    if (!hasRow && char >= 65 && char <= 90) {
      // 65 = 'A'.charCodeAt(0)
      // 90 = 'Z'.charCodeAt(0)
      hasCol = true;
      col += value[i];
      // colNumber starts from 1
      colNumber = colNumber * 26 + char - 64;
    } else if (char >= 48 && char <= 57) {
      // 48 = '0'.charCodeAt(0)
      // 57 = '9'.charCodeAt(0)
      hasRow = true;
      row += value[i];
      // rowNumber starts from 0
      rowNumber = rowNumber * 10 + char - 48;
    } else if (hasRow && hasCol && char !== 36) {
      // 36 = '$'.charCodeAt(0)
      break;
    }
  }
  if (colNumber > 16384) {
    throw new Error(`Out of bounds. Invalid column letter: ${col}`);
  }

  // in case $row$col
  value = col + row;

  const address = {
    col: colNumber - 1,
    row: rowNumber - 1
  };

  // mem fix - cache only the tl 100x100 square
  if (colNumber && colNumber <= 100 && rowNumber && rowNumber <= 100) {
    addressCache[value] = address;
  }

  return address;
}

/**
 * 将 A 转成 0
 * @param columnName
 * @returns
 */
export function columnNameToNumber(columnName: string) {
  columnName = columnName.toUpperCase();
  const len = columnName.length;
  let number = 0;
  for (let i = 0; i < len; i++) {
    const code = columnName.charCodeAt(i);
    if (!isNaN(code)) {
      number += (code - 64) * 26 ** (len - i - 1);
    }
  }
  return number - 1;
}
