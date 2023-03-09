import {WAttr} from 'packages/office-viewer/src/OpenXML';
/**
 * http://officeopenxml.com/WPtable.php
 */

import {getVal, loopChildren, WTag, XMLData} from '../../OpenXML';
import {parseSize} from '../../parse/parseSize';
import {ST_TblWidth} from '../Types';

export interface TableWidth {
  width?: string;
  type?: ST_TblWidth;
}

export interface TableProperties {
  style?: string;
  width?: TableWidth;
}

export class Table {
  properties: TableProperties = {};

  static parseTableProperties(data: XMLData): TableProperties {
    const properties: TableProperties = {};

    loopChildren(data, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }

      switch (key) {
        case WTag.tblStyle:
          properties.style = getVal(value);
          break;

        case WTag.tblW:
          properties.width = {
            width: parseSize(value, WAttr.w),
            type: value[WAttr.type] as ST_TblWidth
          };
          break;
      }
    });

    return properties;
  }

  static fromXML(data: XMLData): Table {
    const table = new Table();

    loopChildren(data, (key, value) => {
      switch (key) {
        case WTag.tblPr:
          table.properties = Table.parseTableProperties(value as XMLData);
          break;
      }
    });

    return table;
  }
}
