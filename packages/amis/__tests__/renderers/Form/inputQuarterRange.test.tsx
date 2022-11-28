/**
 * 组件名称：InputQuarterRange 季度范围
 * 
 * 备注：InputQuarterRange 与 dateRange 等日期范围使用的是同一个组件，所以只测试不同的地方即可
 * 
 * 单测内容：
 1. 点击选择
 2. 内嵌模式
 */

import {
  render,
  fireEvent,
  within,
  cleanup,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import moment from 'moment';

// 1. 点击选择
test('Renderer:InputQuarterRange click', async () => {
  const {container, findByPlaceholderText, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-quarter-range',
            name: 'a',
            label: '季度范围'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputs = document.querySelectorAll('.cxd-DateRangePicker-input')!;

  fireEvent.click(inputs[0]!);

  fireEvent.click(
    await within(
      document.querySelector('.cxd-DateRangePicker-start')!
    ).findByText('Q2')
  );

  fireEvent.click(
    await within(
      document.querySelector('.cxd-DateRangePicker-end')!
    ).findByText('Q4')
  );

  fireEvent.click(getByText('确认'));

  const thisYear = moment().format('YYYY');

  expect((inputs[0] as HTMLInputElement).value).toEqual(`${thisYear}-Q2`);
  expect((inputs[1] as HTMLInputElement).value).toEqual(`${thisYear}-Q4`);
});

// 2. 内嵌模式
test('Renderer:InputQuarterRange with embed', async () => {
  const onSubmit = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        submitText: 'Submit',
        body: [
          {
            type: 'input-quarter-range',
            name: 'a',
            label: '季度范围',
            embed: true,
            format: 'YYYY-MM',
            value: '2022-10,2022-12'
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  expect(
    container.querySelector(
      '.cxd-DateRangePicker-start .rdtQuarter.rdtActive span'
    )!.innerHTML
  ).toBe('Q4');

  expect(
    container.querySelector(
      '.cxd-DateRangePicker-end .rdtQuarter.rdtActive span'
    )!.innerHTML
  ).toBe('Q4');

  expect(container).toMatchSnapshot();
});
