/**
 * 组件名称：InputYearRange 年份范围
 * 
 * 备注：InputYearRange 与 dateRange 等日期范围使用的是同一个组件，所以只测试不同的地方即可
 * 
 * 单测内容：
 1. 点击选择
 2. 内嵌模式
 */

import {render, fireEvent, screen, within} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputYearRange click', async () => {
  const {container, findByPlaceholderText, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-year-range',
            name: 'year',
            label: '年'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = await findByPlaceholderText('开始时间');

  fireEvent.click(inputDate);

  const thisYearText = moment().format('YYYY');
  const nextYearText = moment().add(1, 'year').format('YYYY');

  const thisYear = await within(
    document.querySelector('.cxd-DateRangePicker-start')!
  ).findByText(thisYearText);

  fireEvent.click(thisYear);

  const nextYear = await within(
    document.querySelector('.cxd-DateRangePicker-end')!
  ).findByText(nextYearText);

  fireEvent.click(nextYear);

  const confirm = getByText('确认');

  fireEvent.click(confirm);

  const value = document.querySelectorAll('.cxd-DateRangePicker-input')!;

  expect((value[0] as HTMLInputElement).value).toEqual(thisYearText);
  expect((value[1] as HTMLInputElement).value).toEqual(nextYearText);
});

// 2. 内嵌模式
test('Renderer:inputYearRange with embed', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        submitText: 'Submit',
        body: [
          {
            type: 'input-year-range',
            name: 'year',
            label: '年',
            embed: true,
            value: '815155200,3374063999' // 1995 - 2076
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(
    container.querySelector(
      '.cxd-DateRangePicker-start .rdtYear.rdtActive span'
    )!.innerHTML
  ).toBe('1995');

  expect(
    container.querySelector('.cxd-DateRangePicker-end .rdtYear.rdtActive span')!
      .innerHTML
  ).toBe('2076');

  expect(container).toMatchSnapshot();
});
