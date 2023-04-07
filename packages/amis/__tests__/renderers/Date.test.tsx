import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';
import moment from 'moment';
import {act} from 'react-test-renderer';

test('Renderer:date', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'date',
        name: 'date',
        label: 'date',
        value: '1559836800',
        format: 'YYYY-MM-DD',
        placeholder: '请选择时间',
        minDate: '1559664000',
        maxDate: '1561737600',
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector('.cxd-DateField');
  expect(input?.innerHTML).toEqual(
    moment('1559836800', 'X').format('YYYY-MM-DD')
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:date reset', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: '表单',
        body: [
          {
            label:
              '本月第一天$ {_|now|dateModify:startOf:month|date:YYYY-MM-DD}',
            type: 'input-date',
            name: 'month',
            value: '${_|now|dateModify:startOf:month|date:YYYY-MM-DD}',
            minDate: '',
            maxDate: '',
            format: 'YYYY-MM-DD',
            inputFormat: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD'
          },
          {
            type: 'reset',
            label: '重置',
            actionType: 'reset',
            dialog: {
              title: '系统提示',
              body: '对你点击了'
            },
            id: 'u:862532a9f698',
            level: 'dark'
          }
        ],
        id: 'u:7c281facfdbb'
      },
      {},
      makeEnv({})
    )
  );

  const inputElement = container.querySelector('input[type="text"]') as any;

  const defaultValue = inputElement?.value;
  // 打开日期选择器
  fireEvent.click(inputElement);
  // 更换月份
  fireEvent.click(container.querySelector('[icon="right-arrow"]')!);
  // 选择一个新的日期
  fireEvent.click(container.querySelector('td[data-value="1"]')!);
  // 新选的日期与旧的不同
  expect(inputElement?.value !== defaultValue).toBeTruthy();
  // 点击重制
  await act(() => {
    fireEvent.click(container.querySelector('button[type="reset"]')!);
  });
  // 重制后的日期 等于初始化的日期
  expect(inputElement?.value === defaultValue).toBeTruthy();
});
