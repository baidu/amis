import {FormControlProps, FormItem} from 'amis-core';
import React from 'react';
import cx from 'classnames';

const colCount = [1, 2, 3, 4];

const ColCount: React.FC<FormControlProps> = props => {
  const [value, setValue] = React.useState(props.value);

  function handleClick(value: number) {
    const store = props.manager.store;
    const body = [...(props.data.body || [])];
    let row = 0;
    let count = value;
    for (let i = 0; i < body.length; i++) {
      // 需要独占一行的组件
      if (body[i].$$dragMode === 'hv') {
        count = value;
        body[i] = {
          ...body[i],
          row: ++row
        };
        row++;
      } else {
        count--;
        body[i] = {
          ...body[i],
          row,
          colSize: value > 1 ? `1/${value}` : '1'
        };
        if (count === 0) {
          row++;
          count = value;
        }
      }
    }
    props.setValue(body, 'body');
    setValue(value);
  }

  return (
    <div className="ColCount">
      {colCount.map(n => (
        <div
          key={n}
          className={cx('ColCount-item', value === n && 'is-active')}
          onClick={() => handleClick(n)}
        >
          {n}
        </div>
      ))}
    </div>
  );
};

@FormItem({type: 'col-count', strictMode: false})
export class ColCountRenderer extends React.Component<FormControlProps> {
  render() {
    return <ColCount {...this.props} />;
  }
}
