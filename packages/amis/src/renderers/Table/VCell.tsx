import React from 'react';
import Cell from './Cell';
import {useInView} from 'react-intersection-observer';

export default function VCell(props: any) {
  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true
  });

  return inView ? (
    <Cell {...props} />
  ) : (
    <td
      ref={ref}
      rowSpan={props.rowSpan > 1 ? props.rowSpan : undefined}
      style={props.style}
      className={props.className}
    >
      &nbsp;
    </td>
  );
}
