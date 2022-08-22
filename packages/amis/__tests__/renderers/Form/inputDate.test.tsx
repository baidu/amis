/**
 * 组件名称：InputDate 日期
 * 单测内容：
 * 1. 点击选择日期
 * 2. 内嵌模式 embed
 * 3. 值格式 format 与 显示格式 inputFormat
 * 4. 范围限制 最小值 minDate， 最大值 maxDate
 * 5. 默认值 value 支持 相对值 写法
 * 6. 日期快捷选项 shortcuts
 * 7. 可清除 clearable
 */

import React from 'react';
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  cleanup,
  getByText,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import moment from 'moment';

const setup = async (items: any[] = []) => {
  const onSubmit = jest.fn();
  const utils = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'Submit',
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: items
        }
      },
      {onSubmit},
      makeEnv()
    )
  );

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  return {
    onSubmit,
    submitBtn,
    ...utils
  };
};

test('Renderer:inputDate', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-date',
            name: 'a',
            label: 'date',
            value: '1559836800',
            minDate: '1559664000',
            maxDate: '1561737600'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector(
    '.cxd-DatePicker input'
  )! as HTMLInputElement;
  expect(input.value).toEqual(moment(1559836800, 'X').format('YYYY-MM-DD'));

  expect(container).toMatchSnapshot();
});

test('Renderer:inputDate click', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'static-date',
              name: 'date',
              label: '当前值'
            },
            {
              type: 'input-date',
              name: 'date',
              label: '日期'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = container.querySelector('.cxd-DatePicker') as HTMLElement;

  fireEvent.click(inputDate);

  // 点击前一年
  fireEvent.click(
    container.querySelector('.cxd-DatePicker-popover .rdtPrev') as HTMLElement
  );

  // 点击下一个月
  fireEvent.click(
    container.querySelector('.cxd-DatePicker-popover .rdtNext') as HTMLElement
  );

  const date = container.querySelector(
    '.cxd-DatePicker-popover tr td[data-value="1"]'
  ) as HTMLElement;

  fireEvent.click(date);

  const tpl = container.querySelector('.cxd-DateField') as HTMLElement;

  expect(tpl.innerHTML).toEqual(
    moment().subtract(1, 'year').add(1, 'month').format('YYYY-MM') + '-01'
  );
});

test('Renderer:inputDate embed', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'static-date',
              name: 'date',
              label: '当前值'
            },
            {
              type: 'input-date',
              name: 'date',
              label: '日期',
              embed: true
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  const date = container.querySelector(
    '.cxd-DateCalendar tr td[data-value="1"]'
  ) as HTMLElement;

  fireEvent.click(date);

  const tpl = container.querySelector('.cxd-DateField') as HTMLElement;

  expect(tpl.innerHTML).toEqual(moment().format('YYYY-MM') + '-01');
});

test('Renderer:inputDate with format & inputFormat', async () => {
  const {container} = await setup([
    {
      type: 'input-date',
      name: 'date',
      label: '日期',
      value: '2022/08/19',
      inputFormat: 'DD/MM-YYYY',
      format: '今天是YYYY年, MM月, DD日'
    },
    {
      type: 'static',
      name: 'date'
    }
  ]);

  const tpl = container.querySelector('.cxd-PlainField')! as HTMLElement;
  const input = container.querySelector(
    '.cxd-DatePicker input'
  )! as HTMLInputElement;

  expect(tpl.innerHTML).toEqual('今天是2022年, 08月, 19日');
  expect(input.value).toEqual('19/08-2022');

  expect(container).toMatchSnapshot();
});

test('Renderer:inputDate with minDate & maxDate', async () => {
  const {container} = await setup([
    {
      type: 'input-date',
      className: 'test-date-one',
      name: 'date',
      label: '日期',
      format: 'YY-MM-DD',
      minDate: '-1days',
      value: '-2days',
      embed: true
    },
    {
      type: 'input-date',
      className: 'test-date-two',
      name: 'date-two',
      label: '日期',
      format: 'YY-MM-DD',
      maxDate: '+1days',
      value: '+2days',
      embed: true
    }
  ]);

  expect(
    container.querySelector('.test-date-one .rdtDay.rdtActive.rdtDisabled')!
  ).toBeInTheDocument();
  expect(
    container.querySelector('.test-date-two .rdtDay.rdtActive.rdtDisabled')!
  ).toBeInTheDocument();
});

test('Renderer:inputDate with shortcuts', async () => {
  const {container} = await setup([
    {
      type: 'input-date',
      name: 'date',
      label: '日期',
      format: 'YYYY-MM-DD',
      value: '-1days'
    },
    {
      type: 'static',
      name: 'date'
    }
  ]);

  const tpl = container.querySelector('.cxd-PlainField')! as HTMLElement;

  expect(tpl.innerHTML).toBe(moment().add(-1, 'd').format('YYYY-MM-DD'));
});

test('Renderer:inputDate with shortcuts', async () => {
  const {container} = await setup([
    {
      type: 'input-date',
      name: 'date',
      label: '日期',
      format: 'YYYY-MM-DD',
      shortcuts: [
        'yesterday',
        'thisweek',
        'endofthismonth',
        'endofthisweek',
        '2weekslater'
      ]
    },
    {
      type: 'static',
      name: 'date'
    }
  ]);

  const tpl = container.querySelector('.cxd-PlainField')! as HTMLElement;

  // 点击打开
  const inputDate = container.querySelector('.cxd-DatePicker') as HTMLElement;
  fireEvent.click(inputDate);
  await wait(300);

  const shortcuts = container.querySelectorAll('.cxd-DatePicker-shortcut');
  expect(shortcuts.length).toEqual(5);

  // 本月末
  fireEvent.click(shortcuts[2]);
  await waitFor(() => {
    expect(tpl.innerHTML).toBe(moment().endOf('M').format('YYYY-MM-DD'));
  });
});

test('Renderer:inputDate with clearable', async () => {
  const {container} = await setup([
    {
      type: 'input-date',
      name: 'date',
      label: '日期',
      format: 'YYYY-MM-DD',
      value: '2022-08-19'
    },
    {
      type: 'static',
      name: 'date'
    }
  ]);

  const inputDate = container.querySelector('.cxd-DatePicker') as HTMLElement;
  fireEvent.mouseEnter(inputDate);

  await waitFor(() => {
    expect(
      container.querySelector('.cxd-DatePicker .cxd-DatePicker-clear')
    ).toBeInTheDocument();
  });

  fireEvent.click(
    container.querySelector('.cxd-DatePicker .cxd-DatePicker-clear')!
  );

  await waitFor(() => {
    expect(container.querySelector('.cxd-PlainField')!.innerHTML).toBe(
      '<span class="text-muted">-</span>'
    );
  });

  expect(container).toMatchSnapshot('clearable true');

  const {container: noClearableCon} = await setup([
    {
      type: 'input-date',
      name: 'date',
      label: '日期',
      format: 'YYYY-MM-DD',
      value: '2022-08-19',
      clearable: false
    }
  ]);

  fireEvent.mouseEnter(noClearableCon.querySelector('.cxd-DatePicker')!);

  await waitFor(() => {
    expect(
      noClearableCon.querySelector('.cxd-DatePicker .cxd-DatePicker-clear')
    ).not.toBeInTheDocument();
  });

  expect(noClearableCon).toMatchSnapshot('clearable false');
});

test('Renderer:inputDate with utc', async () => {
  const midnight = moment('2022-08-22 00:00:00').unix();
  const utcOneSecondBeforeTomorrow = moment(midnight)
    .add(moment().utcOffset(), 'm')
    .add(-1, 's')
    .unix();

  const {container} = await setup([
    {
      type: 'input-date',
      name: 'date',
      label: '日期',
      format: 'YYYY-MM-DD',
      value: '2022-08-19'
    },
    {
      type: 'static',
      name: 'date'
    }
  ]);
});
