/**
 * 导出 Excel 功能
 */

import {
  filter,
  isEffectiveApi,
  arraySlice,
  isObject,
  AMISSchema
} from 'amis-core';
import './ColumnToggler';
import {TableStore} from 'amis-core';
import {saveAs} from 'file-saver';
import {
  getVariable,
  removeHTMLTag,
  decodeEntity,
  flattenTree,
  createObject
} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {BaseSchema} from '../../Schema';
import {toDataURL, getImageDimensions} from 'amis-core';
import memoize from 'lodash/memoize';
import {getSnapshot} from 'mobx-state-tree';
import moment from 'moment';
import type {TableProps, ExportExcelToolbar} from './index';

const loadDb = () => {
  // @ts-ignore
  return import('amis-ui/lib/components/CityDB');
};

/**
 * 将 url 转成绝对地址
 */
const getAbsoluteUrl = (function () {
  let link: HTMLAnchorElement;
  return function (url: string) {
    if (!link) link = document.createElement('a');
    link.href = url;
    return link.href;
  };
})();

interface CellStyleFont {
  name?: string;
  color?: {argb: string};
  underline?: boolean;
  bold?: boolean;
  italic?: boolean;
}

interface CellStyleFill {
  type?: string;
  pattern?: string;
  fgColor?: {argb: string};
}

interface CellStyle {
  font?: CellStyleFont;
  fill?: CellStyleFill;
}

/**
 * 将 computedStyle 的 rgba 转成 argb hex
 */
const rgba2argb = memoize((rgba: string) => {
  const color = `${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)!
    .slice(1)
    .map((n, i) =>
      (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
        .toString(16)
        .padStart(2, '0')
        .replace('NaN', '')
    )
    .join('')}`;
  if (color.length === 6) {
    return 'FF' + color;
  }
  return color;
});

/**
 * 将 classname 转成对应的 excel 样式，只支持字体颜色、粗细、背景色
 */
const getCellStyleByClassName = memoize((className: string): CellStyle => {
  if (!className) return {};
  const classNameElm = document.getElementsByClassName(className).item(0);
  if (classNameElm) {
    const computedStyle = getComputedStyle(classNameElm);
    const font: CellStyleFont = {};
    let fill: CellStyleFill = {};
    if (computedStyle.color && computedStyle.color.indexOf('rgb') !== -1) {
      const color = rgba2argb(computedStyle.color);
      // 似乎不支持完全透明的情况，所以就不设置
      if (!color.startsWith('00')) {
        font['color'] = {argb: color};
      }
    }
    if (computedStyle.fontWeight && parseInt(computedStyle.fontWeight) >= 700) {
      font['bold'] = true;
    }
    if (
      computedStyle.backgroundColor &&
      computedStyle.backgroundColor.indexOf('rgb') !== -1
    ) {
      const color = rgba2argb(computedStyle.backgroundColor);
      if (!color.startsWith('00')) {
        fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: color}
        };
      }
    }

    return {font, fill};
  }
  return {};
});

/**
 * 设置单元格样式
 */
const applyCellStyle = (
  sheetRow: any,
  columIndex: number,
  schema: any,
  data: any
) => {
  let cellStyle: CellStyle = {};
  if (schema.className) {
    for (const className of schema.className.split(/\s+/)) {
      const style = getCellStyleByClassName(className);
      if (style) {
        cellStyle = {...cellStyle, ...style};
      }
    }
  }

  if (schema.classNameExpr) {
    const classNames = filter(schema.classNameExpr, data);
    if (classNames) {
      for (const className of classNames.split(/\s+/)) {
        const style = getCellStyleByClassName(className);
        if (style) {
          cellStyle = {...cellStyle, ...style};
        }
      }
    }
  }

  if (cellStyle.font && Object.keys(cellStyle.font).length > 0) {
    sheetRow.getCell(columIndex).font = cellStyle.font;
  }
  if (cellStyle.fill && Object.keys(cellStyle.fill).length > 0) {
    sheetRow.getCell(columIndex).fill = cellStyle.fill;
  }
};

/**
 * 输出总结行
 */
const renderSummary = (
  worksheet: any,
  data: any,
  summarySchema: any,
  rowIndex: number
) => {
  if (summarySchema && summarySchema.length > 0) {
    const firstSchema = summarySchema[0];
    // 总结行支持二维数组，所以统一转成二维数组来方便操作
    let affixRows = summarySchema;
    if (!Array.isArray(firstSchema)) {
      affixRows = [summarySchema];
    }

    for (const affix of affixRows) {
      rowIndex += 1;
      const sheetRow = worksheet.getRow(rowIndex);
      let columIndex = 0;
      for (const col of affix) {
        columIndex += 1;
        // 文档示例中只有这两种，所以主要支持这两种，没法支持太多，因为没法用 react 渲染结果
        if (col.text) {
          sheetRow.getCell(columIndex).value = col.text;
        }

        if (col.tpl) {
          sheetRow.getCell(columIndex).value = removeHTMLTag(
            decodeEntity(filter(col.tpl, data))
          );
        }

        // 处理合并行
        if (col.colSpan) {
          worksheet.mergeCells(
            rowIndex,
            columIndex,
            rowIndex,
            columIndex + col.colSpan - 1
          );
          columIndex += col.colSpan - 1;
        }
      }
    }
  }

  return rowIndex;
};

/**
 * 获取 map 的映射数据
 * @param remoteMappingCache 缓存
 * @param env mobx env
 * @param column 列配置
 * @param data 上下文数据
 * @param rowData 当前行数据
 * @returns
 */
async function getMap(
  remoteMappingCache: any,
  env: any,
  column: any,
  data: any,
  rowData: any
) {
  let map = column.pristine.map as Record<string, any>;
  const source = column.pristine.source;
  if (source) {
    let sourceValue = source;
    if (isPureVariable(source)) {
      map = resolveVariableAndFilter(source as string, rowData, '| raw');
    } else if (isEffectiveApi(source, data)) {
      const mapKey = JSON.stringify(source);
      if (mapKey in remoteMappingCache) {
        map = remoteMappingCache[mapKey];
      } else {
        const res = await env.fetcher(sourceValue, rowData);
        if (res.data) {
          remoteMappingCache[mapKey] = res.data;
          map = res.data;
        }
      }
    }
  }
  return map;
}

/**
 * 导出 Excel
 * @param ExcelJS ExcelJS 对象
 * @param props Table 组件的 props
 * @param toolbar 导出 Excel 的 toolbar 配置
 * @param withoutData 如果为 true 就不导出数据，只导出表头
 */
export async function exportExcel(
  ExcelJS: any,
  props: TableProps,
  toolbar: ExportExcelToolbar,
  withoutData: boolean = false
) {
  const {
    store,
    env,
    classnames: cx,
    translate: __,
    data,
    prefixRow,
    affixRow
  } = props;
  let columns = store.exportColumns || [];

  let rows = [];
  let tmpStore;
  let filename = 'data';
  // 支持配置 api 远程获取
  if (typeof toolbar === 'object' && toolbar.api) {
    const pageField = toolbar.pageField || 'page';
    const perPageField = toolbar.perPageField || 'perPage';
    const ctx: any = createObject(data, {
      ...props.query,
      [pageField]: data.page || 1,
      [perPageField]: data.perPage || 10
    });

    const res = await env.fetcher(toolbar.api, ctx, {
      autoAppend: true,
      pageField,
      perPageField
    });

    if ((toolbar.api as any)?.responseType === 'blob') {
      // 如果是返回的文件流就直接下载
      return;
    } else if (!res.data) {
      env.notify('warning', __('placeholder.noData'));
      return;
    }
    /**
     * 优先找items和rows，找不到就拿第一个值为数组的字段
     * 和CRUD中的处理逻辑保持一致，避免能渲染和导出的不一致
     */
    if (Array.isArray(res.data)) {
      rows = res.data;
    } else if (Array.isArray(res.data?.rows)) {
      rows = res.data.rows;
    } else if (Array.isArray(res.data?.items)) {
      rows = res.data.items;
    } else {
      for (const key of Object.keys(res.data)) {
        if (res.data.hasOwnProperty(key) && Array.isArray(res.data[key])) {
          rows = res.data[key];
          break;
        }
      }
    }

    // 因为很多方法是 store 里的，所以需要构建 store 来处理
    tmpStore = TableStore.create(getSnapshot(store));
    tmpStore.initRows(rows);
    rows = tmpStore.rows;
  } else {
    rows = store.rows;
  }

  if (typeof toolbar === 'object' && toolbar.filename) {
    filename = filter(toolbar.filename, data, '| raw');
  }

  if (rows.length === 0) {
    env.notify('warning', __('placeholder.noData'));
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('sheet', {
    properties: {defaultColWidth: 15}
  });
  worksheet.views = [{state: 'frozen', xSplit: 0, ySplit: 1}];

  let exportColumnNames = toolbar.columns;

  if (isPureVariable(exportColumnNames)) {
    exportColumnNames = resolveVariableAndFilter(
      exportColumnNames,
      data,
      '| raw'
    );
  }

  // 自定义导出列配置
  const hasCustomExportColumns =
    toolbar.exportColumns && Array.isArray(toolbar.exportColumns);
  if (hasCustomExportColumns) {
    columns = toolbar.exportColumns as any[];
    // 因为后面列 props 都是从 pristine 里获取，所以这里归一一下
    for (const column of columns) {
      column.pristine = column;
    }
  }

  /** 如果非自定义导出列配置，则默认不导出操作列 */
  const filteredColumns = exportColumnNames
    ? columns.filter(column => {
        const filterColumnsNames = exportColumnNames!;
        if (column.name && filterColumnsNames.indexOf(column.name) !== -1) {
          return hasCustomExportColumns ? true : column?.type !== 'operation';
        }
        return false;
      })
    : columns.filter(column => column?.type !== 'operation');

  const firstRowLabels = filteredColumns.map(column => {
    return filter(column.label, data);
  });
  const firstRow = worksheet.getRow(1);
  firstRow.values = firstRowLabels;
  worksheet.autoFilter = {
    from: {
      row: 1,
      column: 1
    },
    to: {
      row: 1,
      column: firstRowLabels.length
    }
  };

  if (withoutData) {
    return exportExcelWithoutData(
      workbook,
      worksheet,
      filteredColumns,
      filename,
      env,
      data
    );
  }
  // 用于 mapping source 的情况
  const remoteMappingCache: any = {};
  // 数据从第二行开始
  let rowIndex = 1;
  if (toolbar.rowSlice) {
    rows = arraySlice(rows, toolbar.rowSlice);
  }
  // 前置总结行
  rowIndex = renderSummary(worksheet, data, prefixRow, rowIndex);
  // children 展开
  rows = flattenTree(rows, item => item);
  for (const row of rows) {
    const rowData = createObject(data, row.data);
    rowIndex += 1;
    const sheetRow = worksheet.getRow(rowIndex);
    let columIndex = 0;
    for (const column of filteredColumns) {
      columIndex += 1;
      const name = column.name!;
      const value = getVariable(rowData, name);
      if (typeof value === 'undefined' && !column.pristine.tpl) {
        continue;
      }
      // 处理合并单元格
      if (name in row.rowSpans) {
        if (row.rowSpans[name] === 0) {
          continue;
        } else {
          // start row, start column, end row, end column
          worksheet.mergeCells(
            rowIndex,
            columIndex,
            rowIndex + row.rowSpans[name] - 1,
            columIndex
          );
        }
      }

      applyCellStyle(sheetRow, columIndex, column.pristine, rowData);

      const type = (column as AMISSchema).type || 'plain';
      // TODO: 这里很多组件都是拷贝对应渲染的逻辑实现的，导致每种都得实现一遍
      if ((type === 'image' || (type as any) === 'static-image') && value) {
        try {
          const imageData = await toDataURL(value);
          const imageDimensions = await getImageDimensions(imageData);
          let imageWidth = imageDimensions.width;
          let imageHeight = imageDimensions.height;
          // 限制一下图片高宽
          const imageMaxSize = 100;
          if (imageWidth > imageHeight) {
            if (imageWidth > imageMaxSize) {
              imageHeight = (imageMaxSize * imageHeight) / imageWidth;
              imageWidth = imageMaxSize;
            }
          } else {
            if (imageHeight > imageMaxSize) {
              imageWidth = (imageMaxSize * imageWidth) / imageHeight;
              imageHeight = imageMaxSize;
            }
          }
          const imageMatch = imageData.match(/data:image\/(.*);/);
          let imageExt = 'png';
          if (imageMatch) {
            imageExt = imageMatch[1];
          }
          // 目前 excel 只支持这些格式，所以其它格式直接输出 url
          if (imageExt != 'png' && imageExt != 'jpeg' && imageExt != 'gif') {
            sheetRow.getCell(columIndex).value = value;
            continue;
          }
          const imageId = workbook.addImage({
            base64: imageData,
            extension: imageExt
          });
          const linkURL = getAbsoluteUrl(value);
          worksheet.addImage(imageId, {
            // 这里坐标位置是从 0 开始的，所以要减一
            tl: {col: columIndex - 1, row: rowIndex - 1},
            ext: {
              width: imageWidth,
              height: imageHeight
            },
            hyperlinks: {
              tooltip: linkURL
            }
          });
        } catch (e) {
          console.warn(e);
        }
      } else if (type == 'link' || (type as any) === 'static-link') {
        const href = column.pristine.href;

        const linkURL =
          (typeof href === 'string' && href
            ? filter(href, rowData, '| raw')
            : undefined) || value;
        const body = column.pristine.body;
        // 没法支持嵌套了
        const text =
          typeof body === 'string' && body
            ? filter(body, rowData, '| raw')
            : undefined;

        const absoluteURL = getAbsoluteUrl(linkURL);
        sheetRow.getCell(columIndex).value = {
          text: text || absoluteURL,
          hyperlink: absoluteURL
        };
      } else if (type === 'mapping' || (type as any) === 'static-mapping') {
        let map = await getMap(remoteMappingCache, env, column, data, rowData);

        const valueField = column.pristine.valueField || 'value';
        const labelField = column.pristine.labelField || 'label';

        if (Array.isArray(map)) {
          map = map.reduce((res, now) => {
            if (now == null) {
              return res;
            } else if (isObject(now)) {
              let keys = Object.keys(now);
              if (
                keys.length === 1 ||
                (keys.length == 2 && keys.includes('$$id'))
              ) {
                // 针对amis-editor的特殊处理
                keys = keys.filter(key => key !== '$$id');
                // 单key 数组对象
                res[keys[0]] = now[keys[0]];
              } else if (keys.length > 1) {
                // 多key 数组对象
                res[now[valueField]] = now;
              }
            }
            return res;
          }, {});
        }

        if (typeof value !== 'undefined' && map && (map[value] ?? map['*'])) {
          const viewValue =
            map[value] ??
            (value === true && map['1']
              ? map['1']
              : value === false && map['0']
              ? map['0']
              : map['*']); // 兼容平台旧用法：即 value 为 true 时映射 1 ，为 false 时映射 0

          let label = viewValue;
          if (isObject(viewValue)) {
            if (labelField === undefined || labelField === '') {
              if (!viewValue.hasOwnProperty('type')) {
                // 映射值是object
                // 没配置labelField
                // object 也没有 type，不能作为schema渲染
                // 默认取 label 字段
                label = viewValue['label'];
              }
            } else {
              label = viewValue[labelField || 'label'];
            }
          }

          let text = removeHTMLTag(label);

          /** map可能会使用比较复杂的html结构，富文本也无法完全支持，直接把里面的变量解析出来即可 */
          if (isPureVariable(text)) {
            text = resolveVariableAndFilter(text, rowData, '| raw');
          } else {
            text = filter(text, rowData);
          }

          sheetRow.getCell(columIndex).value = text;
        } else {
          sheetRow.getCell(columIndex).value = removeHTMLTag(value);
        }
      } else if (type === 'date' || (type as any) === 'static-date') {
        let viewValue;
        const {
          fromNow,
          format = 'YYYY-MM-DD',
          valueFormat = 'X'
        } = column.pristine;
        if (value) {
          let ISODate = moment(value, moment.ISO_8601);
          let NormalDate = moment(value, valueFormat);

          viewValue = ISODate.isValid()
            ? ISODate.format(format)
            : NormalDate.isValid()
            ? NormalDate.format(format)
            : false;
        }

        if (fromNow) {
          viewValue = moment(value).fromNow();
        }
        if (viewValue) {
          sheetRow.getCell(columIndex).value = viewValue;
        }
      } else if (type === 'input-city') {
        const db = await loadDb();
        if (db.default && value && value in db.default) {
          sheetRow.getCell(columIndex).value = db.default[value];
        }
      } else {
        if (column.pristine.tpl) {
          sheetRow.getCell(columIndex).value = removeHTMLTag(
            decodeEntity(filter(column.pristine.tpl, rowData))
          );
        } else {
          sheetRow.getCell(columIndex).value = value;
        }
      }

      // 如果是纯数字，不用科学计数法
      const cellValue = sheetRow.getCell(columIndex).value;
      if (Number.isInteger(cellValue)) {
        sheetRow.getCell(columIndex).numFmt = '0';
      }
    }
  }

  // 后置总结行
  renderSummary(worksheet, data, affixRow, rowIndex);

  downloadFile(workbook, filename);
}

async function downloadFile(workbook: any, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();

  if (buffer) {
    var blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename + '.xlsx');
  }
}

function numberToLetters(num: number) {
  let letters = '';
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }
  return letters;
}

/**
 * 只导出表头
 */
async function exportExcelWithoutData(
  workbook: any,
  worksheet: any,
  filteredColumns: any[],
  filename: string,
  env: any,
  data: any
) {
  let index = 0;
  const rowNumber = 100;
  const mapCache: any = {};
  for (const column of filteredColumns) {
    index += 1;
    if (column.pristine?.type === 'mapping') {
      const map = await getMap(mapCache, env, column, data, {});
      if (map && isObject(map)) {
        const keys = Object.keys(map);
        for (let rowIndex = 1; rowIndex < rowNumber; rowIndex++) {
          worksheet.getCell(numberToLetters(index) + rowIndex).dataValidation =
            {
              type: 'list',
              allowBlank: true,
              formulae: [`"${keys.join(',')}"`]
            };
        }
      }
    }
  }

  downloadFile(workbook, filename);
}
