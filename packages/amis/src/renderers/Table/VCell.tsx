import React from 'react';
import Cell from './Cell';
import {useInView} from 'react-intersection-observer';
import {observer} from 'mobx-react-lite';

export default observer(function VCell(props: any) {
  const cx = props.classnames;
  const column = props.column;

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
    onChange: column.markAppeared,
    skip: column.appeared
  });

  return inView || column.appeared ? (
    <Cell {...props} />
  ) : (
    <td
      ref={ref}
      rowSpan={props.rowSpan > 1 ? props.rowSpan : undefined}
      style={props.style}
      className={props.className}
    >
      <div className={cx('Table-emptyBlock')}>&nbsp;</div>
    </td>
  );
});
