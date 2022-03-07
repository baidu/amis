/**
 * columnsCount 支持数字和数组两种格式
 */
import React from 'react';
import chunk from 'lodash/chunk';

export function columnsCountSplit(
  body: any[],
  cx: any,
  columnsCount?: number | number[]
) {
  if (typeof columnsCount === 'number' && columnsCount > 1) {
    let weight = 12 / (columnsCount as number);
    let cellClassName = `Grid-col--sm${
      weight === Math.round(weight) ? weight : ''
    }`;
    body = chunk(body, columnsCount).map((group, groupIndex) => (
      <div className={cx('Grid')} key={groupIndex}>
        {Array.from({length: columnsCount as number}).map((_, index) => (
          <div key={index} className={cx(cellClassName)}>
            {group[index]}
          </div>
        ))}
      </div>
    ));
  } else if (Array.isArray(columnsCount) && columnsCount.length) {
    let bodyIndex = 0;
    let lengthLeft = body.length;
    const bodyList = [];
    columnsCount.forEach((columnSize, groupIndex) => {
      if (columnSize) {
        let weight = 12 / (columnSize as number);
        let cellClassName = `Grid-col--sm${
          weight === Math.round(weight) ? weight : ''
        }`;
        bodyList.push(
          <div className={cx('Grid')} key={groupIndex}>
            {Array.from({length: columnSize}).map((_, index) => {
              if (bodyIndex + index < body.length) {
                // 避免溢出
                return (
                  <div key={index} className={cx(cellClassName)}>
                    {body[bodyIndex + index]}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        );
        bodyIndex = bodyIndex + columnSize;
        lengthLeft = lengthLeft - columnSize;
      }
    });

    if (lengthLeft > 0) {
      let weight = 12 / (lengthLeft as number);
      let cellClassName = `Grid-col--sm${
        weight === Math.round(weight) ? weight : ''
      }`;
      bodyList.push(
        <div className={cx('Grid')} key="other">
          {Array.from({length: lengthLeft}).map((_, index) => {
            <div key={index} className={cx(cellClassName)}>
              {body[bodyIndex + index]}
            </div>;
          })}
        </div>
      );
    }

    body = bodyList;
  }
  return body;
}
