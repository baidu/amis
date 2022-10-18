/**
 * 导出 Excel 功能
 */

import {filter} from 'amis-core';
import './ColumnToggler';
import {TableStore} from 'amis-core';
import {saveAs} from 'file-saver';
import {
  getVariable,
  removeHTMLTag,
  decodeEntity,
  createObject
} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {BaseSchema} from '../../Schema';
import {toDataURL, getImageDimensions} from 'amis-core';
import {TplSchema} from '../Tpl';
import {MappingSchema} from '../Mapping';
import {getSnapshot} from 'mobx-state-tree';
import {DateSchema} from '../Date';
import moment from 'moment';
import type {TableProps, ExportExcelToolbar} from './index';

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

export async function exportExcel(
  ExcelJS: any,
  props: TableProps,
  toolbar: ExportExcelToolbar
) {
  const {store, env, classnames: cx, translate: __, data} = props;
  let columns = store.exportColumns || [];

  let rows = [];
  let tmpStore;
  let filename = 'data';
  // 支持配置 api 远程获取
  if (typeof toolbar === 'object' && toolbar.api) {
    const res = await env.fetcher(toolbar.api, data);
    if (!res.data) {
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
  if (toolbar.exportColumns && Array.isArray(toolbar.exportColumns)) {
    columns = toolbar.exportColumns;
    // 因为后面列 props 都是从 pristine 里获取，所以这里归一一下
    for (const column of columns) {
      column.pristine = column;
    }
  }

  const filteredColumns = exportColumnNames
    ? columns.filter(column => {
        const filterColumnsNames = exportColumnNames!;
        if (column.name && filterColumnsNames.indexOf(column.name) !== -1) {
          return true;
        }
        return false;
      })
    : columns;

  const firstRowLabels = filteredColumns.map(column => {
    return column.label;
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
  // 用于 mapping source 的情况
  const remoteMappingCache: any = {};
  // 数据从第二行开始
  let rowIndex = 1;
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

      const type = (column as BaseSchema).type || 'plain';
      // TODO: 这里很多组件都是拷贝对应渲染的逻辑实现的，导致
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
          console.warn(e.stack);
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
        // 拷贝自 Mapping.tsx
        let map = column.pristine.map;
        const source = column.pristine.source;
        if (source) {
          let sourceValue = source;
          if (isPureVariable(source)) {
            sourceValue = resolveVariableAndFilter(
              source as string,
              rowData,
              '| raw'
            );
          }

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

        if (typeof value !== 'undefined' && map && (map[value] ?? map['*'])) {
          const viewValue =
            map[value] ??
            (value === true && map['1']
              ? map['1']
              : value === false && map['0']
              ? map['0']
              : map['*']); // 兼容平台旧用法：即 value 为 true 时映射 1 ，为 false 时映射 0
          sheetRow.getCell(columIndex).value = removeHTMLTag(viewValue);
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
      } else {
        if (column.pristine.tpl) {
          sheetRow.getCell(columIndex).value = removeHTMLTag(
            decodeEntity(filter(column.pristine.tpl, rowData))
          );
        } else {
          sheetRow.getCell(columIndex).value = value;
        }
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();

  if (buffer) {
    var blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename + '.xlsx');
  }
}
