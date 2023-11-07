/*
 * @Description:
 * @Date: 2023-11-07 19:31:29
 * @Author: ranqirong 274544338@qq.com
 */
import {TableStore, SELECTED_STATUS} from '../../src/store/table';

import type {IRow, ITableStore} from '../../src/store/table';

let table: ITableStore;
let firstLevel: IRow;
let secondLevel: IRow;
let secondLevel2: IRow;
let thirdLevel: IRow;
let thirdLevel2: IRow;

beforeEach(() => {
  table = TableStore.create({id: 'mock-id', storeType: 'table'});
  table.initRows([
    {
      name: '手机维修',
      children: [
        {
          name: '苹果',
          children: [
            {
              name: 'iphone系列'
            }
          ]
        },
        {
          name: '华为',
          children: [
            {
              name: 'mate系列'
            },
            {
              name: 'p系列'
            }
          ]
        }
      ]
    }
  ]);

  firstLevel = table.rows[0];
  secondLevel = table.rows[0].children[0];
  secondLevel2 = table.rows[0].children[1];
  thirdLevel = table.rows[0].children[0].children[0];
});

describe('Row', () => {
  it('通过parent快速拿到父节点', () => {
    expect(secondLevel.parent).toEqual(firstLevel);
  });

  it('通过table快速拿到根节点', () => {
    expect(thirdLevel.table).toEqual(table);
  });
});

describe('TableStore', () => {
  it('选中父节点,所有子节点自动选中', () => {
    firstLevel.toggle(true);

    const selectedRows = table.selectedRows.map(row => row.data.name);

    expect(selectedRows).toEqual(
      expect.arrayContaining([
        '苹果',
        'iphone系列',
        '华为',
        'mate系列',
        'p系列'
      ])
    );
  });

  it('选中子节点,所有父节点自动选中', () => {
    thirdLevel.toggle(true);

    const selectedRows = table.selectedRows.map(row => row.data.name);

    expect(selectedRows).toEqual(expect.arrayContaining(['苹果', '手机维修']));
  });

  it('默认情况下,父节点是未选中状态,选中一个子节点切换到部分选中状态,选中所有2个子节点切换到全部选中状态', () => {
    expect(firstLevel.childrenSelected()).toBe(SELECTED_STATUS.NONE);

    secondLevel.toggle(true);

    expect(firstLevel.childrenSelected()).toBe(SELECTED_STATUS.PARTIAL);

    secondLevel2.toggle(true);

    expect(firstLevel.childrenSelected()).toBe(SELECTED_STATUS.ALL);
  });
});
