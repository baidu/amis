import {FormControlProps, FormItem} from 'amis-core';
import React from 'react';
import cx from 'classnames';
import {JSONUpdate} from 'amis-editor-core';

const baseColSize = ['1/4', '1/3', '1/2', '2/3', '3/4', '1'];

const colSizeMap: {
  [key: number]: string[];
} = {
  1: baseColSize,
  2: baseColSize,
  3: ['1/3', '1/2', '1'],
  4: ['1/4', '1']
};

function getColSize(value: string, count: number) {
  if (!value.includes('/')) {
    return value;
  }
  const [a, b] = value.split('/').map(n => parseInt(n, 10));
  const c = b - a;
  if (c % count === 0) {
    return `${c / count}/${b}`;
  } else {
    return `${c}/${b * count}`;
  }
}

const ColSize: React.FC<FormControlProps> = props => {
  const store = props.manager.store;
  const containerBody = store.getSchemaParentById(store.activeId);
  const body = Array.isArray(containerBody) ? [...containerBody] : [];
  const node = store.getNodeById(store.activeId);
  const row = props.data.row;
  const rowItem = body.filter((item: any) => item.row === row);
  const length = rowItem.length;
  const parent = store.getNodeById(node.parentId);
  const isFlex = parent?.schema?.mode === 'flex';

  // combo的row模式
  const type = parent?.schema?.type;
  const multiLine = parent?.schema?.multiLine;
  const tabsMode = parent?.schema?.tabsMode;
  const isComboRow = type === 'combo' && !multiLine && !tabsMode;

  const value =
    (isFlex || isComboRow) && body.length
      ? props.data.colSize
      : props.data.size;

  function handleColSizeChange(value: string) {
    if (
      !colSizeMap[length]?.includes(value) ||
      node?.schema?.$$dragMode === 'hv'
    ) {
      return;
    }

    let list = [...body];
    if (length > 1) {
      if (value === '1') {
        // 如果设置为占整行，需要调整自身和后面的元素的row
        let nodeIndex = list.findIndex((item: any) => item.$$id === node.id);
        let hasBefore = false;
        list = list.map((item, index) => {
          if (item.row === row) {
            if (index < nodeIndex) {
              hasBefore = true;
            }
            if (index === nodeIndex && hasBefore) {
              item.row += 1;
            }
          }
          if (index > nodeIndex) {
            item.row += hasBefore ? 2 : 1;
          }
          return item;
        });
      } else {
        // 非整行，需要调整同行元素的colSize
        const colSize = getColSize(value, length - 1);
        list = list.map((item: any) => {
          if (item.row === row && item.$$id !== node.id) {
            item.colSize = colSize;
          }
          return item;
        });
      }
    } else if (isComboRow) {
      const colSize = getColSize(value, length - 1);
      list = list.map((item: any) => {
        if (item.$$id !== node.id) {
          item.colSize = colSize;
        }
        return item;
      });
    }

    const schema = JSONUpdate(store.schema, node.parentId, {
      [node.parentRegion]: list
    });

    store.setSchema(schema);
    props.setValue(value, 'colSize');
  }

  function handleSizeChange(value: string) {
    props.setValue(value, 'size');
  }

  return (isFlex || isComboRow) && body.length ? (
    <div className="ColSize">
      {baseColSize
        .filter(n => {
          if (type === 'combo' && !multiLine && n === '1' && body.length > 1) {
            return false;
          }
          return true;
        })
        .map(n => (
          <div
            className={cx(
              'ColSize-item',
              value === n && 'is-active',
              !colSizeMap[length]?.includes(n) && 'is-disabled',
              node.schema.$$dragMode === 'hv' && 'is-disabled'
            )}
            key={n}
            onClick={() => handleColSizeChange(n)}
          >
            {n}
          </div>
        ))}
    </div>
  ) : (
    props.render('size', {
      label: false,
      type: 'amis-theme-select',
      name: 'size',
      value,
      options: [
        {
          label: '占满',
          value: 'full'
        },
        {
          label: '极小',
          value: 'xs'
        },
        {
          label: '小',
          value: 'sm'
        },
        {
          label: '中',
          value: 'md'
        },
        {
          label: '大',
          value: 'lg'
        },
        ...(props.data?.sizesOptions?.filter((item: any) => {
          return !['var(--sizes-size-0)', 'var(--sizes-size-1)'].includes(
            item.value
          );
        }) || [])
      ],
      onChange: handleSizeChange
    })
  );
};

@FormItem({type: 'col-size', strictMode: false})
export class ColSizeRenderer extends React.Component<FormControlProps> {
  render() {
    return <ColSize {...this.props} />;
  }
}
