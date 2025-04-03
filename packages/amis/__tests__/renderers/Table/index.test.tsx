import React from 'react';
import {render, screen} from '@testing-library/react';

import {render as amisRender} from '../../../src';

describe('Table tableFillHeight', () => {
  const renderTable = (autoFillHeight = false, rows = [] as any) => {
    return render(
      amisRender({
        type: 'page',
        data: {
          rows
        },
        body: {
          type: 'table',
          autoFillHeight,
          source: '${rows}'
        }
      })
    );
  };

  it('autoFillHeight未开启，table元素高度根据内容撑开', () => {
    const {container} = renderTable();
    expect(
      container.querySelector('.cxd-Table-table--tableFillHeight')
    ).toBeNull();
  });

  it('autoFillHeight开启，表格有数据，table元素高度根据内容撑开', () => {
    const {container} = renderTable(true, [{id: 1}]);
    expect(
      container.querySelector('.cxd-Table-table--tableFillHeight')
    ).toBeNull();
  });

  it('autoFillHeight开启，表格无数据，table元素高度根据父元素撑开', () => {
    const {container} = renderTable(true, []);
    expect(
      container.querySelector('.cxd-Table-table--tableFillHeight')
    ).toBeInTheDocument();
  });
});
