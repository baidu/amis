import {TableStore, SELECTED_STATUS} from '../../src/store/table';

import type {IRow, ITableStore} from '../../src/store/table';

let table: ITableStore;
let firstLevel: IRow;
let secondLevel: IRow;
let secondLevel2: IRow;
let thirdLevel: IRow;
let thirdLevel2: IRow;
let thirdLevel3: IRow;

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
  thirdLevel2 = table.rows[0].children[1].children[0];
  thirdLevel3 = table.rows[0].children[1].children[1];
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

  it('选中所有子节点,所有父节点自动选中', () => {
    thirdLevel.toggle(true);
    thirdLevel2.toggle(true);
    thirdLevel3.toggle(true);

    const selectedRows = table.selectedRows.map(row => row.data.name);

    expect(selectedRows).toEqual(
      expect.arrayContaining(['苹果', '华为', '手机维修'])
    );
  });

  it('默认情况下,父节点是未选中状态,选中一个子节点切换到部分选中状态,选中所有2个子节点切换到全部选中状态', () => {
    expect(firstLevel.childrenSelected()).toBe(SELECTED_STATUS.NONE);
    expect(firstLevel.partial).toBe(false);

    secondLevel.toggle(true);

    expect(firstLevel.childrenSelected()).toBe(SELECTED_STATUS.PARTIAL);
    expect(firstLevel.partial).toBe(true);

    secondLevel2.toggle(true);

    expect(firstLevel.childrenSelected()).toBe(SELECTED_STATUS.ALL);
    expect(firstLevel.partial).toBe(false);
  });

  it('多个子节点只选中一个,祖先节点不会被选中,但会被标记为部分选中状态', () => {
    thirdLevel2.toggle(true);

    expect(secondLevel2.checked).toBe(false);
    expect(secondLevel2.partial).toBe(true);

    expect(firstLevel.checked).toBe(false);
    expect(firstLevel.partial).toBe(true);
  });
});
