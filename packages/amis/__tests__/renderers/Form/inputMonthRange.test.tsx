/**
 * 组件名称：InputMonthRange 月份范围
 * 
 * 备注：InputMonthRange 与 dateRange 等日期范围使用的是同一个组件，所以只测试不同的地方即可
 * 
 * 单测内容：
 1. 点击选择
 2. timeFormat
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
test('Renderer:inputMonthRange click', async () => {
  const {container, findByPlaceholderText, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-month-range',
            name: 'a',
            label: '月份范围'
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

  const thisMonthText = moment().format('M[月]');
  const nextMonthText = moment().add(1, 'month').format('M[月]');

  const thisMonthValue = moment().format('YYYY-MM');
  const nextMonthValue = moment().add(1, 'month').format('YYYY-MM');

  const startMonth = await within(
    document.querySelector('.cxd-DateRangePicker-start')!
  ).findByText(thisMonthText);

  fireEvent.click(startMonth);

  const endMonth = await within(
    document.querySelector('.cxd-DateRangePicker-end')!
  ).findByText(nextMonthText);

  fireEvent.click(endMonth);

  const confirm = getByText('确认');

  fireEvent.click(confirm);

  const value = document.querySelectorAll('.cxd-DateRangePicker-input')!;

  expect((value[0] as HTMLInputElement).value).toEqual(thisMonthValue);
  expect((value[1] as HTMLInputElement).value).toEqual(nextMonthValue);
});

// 2. 内嵌模式
test('Renderer:inputMonthRange with embed', async () => {
  const onSubmit = jest.fn();
  const {container, findByPlaceholderText, getByText} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        api: '/api/xxx',
        body: [
          {
            type: 'input-month-range',
            name: 'a',
            label: '月份范围',
            embed: true,
            format: 'YYYY-MM-DD'
          }
        ],
        title: 'The form'
      },
      {onSubmit},
      makeEnv({})
    )
  );

  fireEvent.click(
    container.querySelector('.cxd-DateRangePicker-start .rdtPrev')!
  );

  fireEvent.click(
    container.querySelector(
      '.cxd-DateRangePicker-start tbody tr:nth-child(2) td:last-of-type'
    )!
  );

  fireEvent.click(
    container.querySelector(
      '.cxd-DateRangePicker-end tbody tr:nth-child(4) td:first-of-type'
    )!
  );

  await wait(200);
  fireEvent.click(getByText('Submit')!);

  const startText = moment().add(-1, 'year').format('YYYY-06-01');
  const endText = moment().format('YYYY-10-01');

  await waitFor(() => {
    const formData = onSubmit.mock.calls[0][0];
    expect(onSubmit).toHaveBeenCalled();
    expect(formData).toEqual({
      a: `${startText},${endText}`
    });
  });
});
