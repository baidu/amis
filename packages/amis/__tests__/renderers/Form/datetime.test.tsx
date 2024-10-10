import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  getByText
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import moment from 'moment';

test('Renderer:datetime', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'datetime',
            name: 'a',
            label: 'date',
            value: '1559826660',
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

  expect(input.value).toEqual(
    moment(1559826660, 'X').format('YYYY-MM-DD HH:mm:ss')
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:datetime displayFormat valueFormat', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'datetime',
            name: 'b',
            label: 'datetime',
            value: '1559826660',
            displayFormat: 'YYYY/MM/DD HH:mm:ss',
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

  expect(input.value).toEqual(
    moment(1559826660, 'X').format('YYYY/MM/DD HH:mm:ss')
  );
});

/**
 * CASE: 日期时间选择器确认模式
 * 前提条件：
 *   - 当前组件为input-datetime类型
 *   - closeOnSelect为false
 *   - 未开启内嵌模式
 *   - 非移动端交互
 * 预期：
 *   1. 选择日期后，点击取消按钮，值重置
 *   2. 选择日期后，点击确定按钮，值更新
 */
test('Renderer:InputDateTime confirm mode', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            name: 'datetime',
            label: '日期',
            type: 'input-datetime',
            closeOnSelect: false
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const trigger = container.querySelector('.cxd-DatePicker')!;
  const inputEl = (container.querySelector(
    '.cxd-DatePicker-input'
  ) as HTMLInputElement)!;
  const getCancelBtn = () =>
    container.querySelector(
      '.cxd-DateRangePicker-actions > button[type=button]'
    )!;
  const getConfirmBtn = () =>
    container.querySelector(
      '.cxd-DateRangePicker-actions > .cxd-Button.cxd-Button--primary'
    )!;
  expect(trigger).toBeInTheDocument();

  fireEvent.click(trigger);
  wait(200);
  /** 未选择新值，确认按钮禁用 */
  expect(getConfirmBtn()).toHaveClass('is-disabled');

  let todayEl = document.querySelector('.rdtDay.rdtToday')!;
  let yesterdayEl = todayEl?.previousSibling!;
  let tomorrowEl = todayEl?.nextSibling!;

  if (yesterdayEl) {
    fireEvent.click(yesterdayEl);
  } else {
    fireEvent.click(tomorrowEl);
  }
  wait(200);

  /** 选择日期之后禁用消失 */
  expect(getConfirmBtn()).not.toHaveClass('is-disabled');

  fireEvent.click(getCancelBtn());
  wait(200);
  /** 取消之后重置值 */
  expect(inputEl?.value).toEqual('');

  fireEvent.click(trigger);
  wait(200);

  todayEl = document.querySelector('.rdtDay.rdtToday')!;
  yesterdayEl = todayEl?.previousSibling!;
  tomorrowEl = todayEl?.nextSibling!;

  if (yesterdayEl) {
    fireEvent.click(yesterdayEl);
  } else {
    fireEvent.click(tomorrowEl);
  }
  wait(200);

  fireEvent.click(getConfirmBtn());
  wait(200);
  /** 确定之后有值 */
  expect(inputEl?.value).not.toEqual('');
}, 7000);

/**
 * CASE: 日期时间选择器首次选择日期或时间后，时间为默认值
 * 前提条件：
 *   - 当前组件为input-datetime或者input-datetime-range类型
 *   - 当前组件未绑定值
 *   - 当前操作为首次编辑
 * 预期：
 *   1. 选择日期后，时间为默认值00:00:00
 *   2. 选择时间后（H、m、s），所选择时间为点选值，其他时间为默认值00:00:00
 *   3. 后续选择日期或者时间，不会改变点选值
 *   4. 如果为范围选择器，先选择结束时间，则开始时间不能超过结束时间
 */
test('Renderer:InputDateTime Picker selects date or time for the first time', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            name: 'datetime',
            label: '日期',
            type: 'input-datetime',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            displayFormat: 'YYYY-MM-DD HH:mm:ss',
            closeOnSelect: false
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const trigger = container.querySelector('.cxd-DatePicker')!;
  const inputEl = (container.querySelector(
    '.cxd-DatePicker-input'
  ) as HTMLInputElement)!;
  const getConfirmBtn = () =>
    container.querySelector(
      '.cxd-DateRangePicker-actions > .cxd-Button.cxd-Button--primary'
    )!;
  expect(trigger).toBeInTheDocument();

  fireEvent.click(trigger);
  wait(200);

  let todayEl = document.querySelector('.rdtDay.rdtToday')!;
  let yesterdayEl = todayEl?.previousSibling!;
  let tomorrowEl = todayEl?.nextSibling!;

  const currentTime = new Date();
  const currentSeconds = currentTime.getSeconds();

  /** 跳过0秒，用于后续测试值和00:00:00的Diff */
  if (currentSeconds === 0) {
    wait(1000);
  }

  if (yesterdayEl) {
    fireEvent.click(yesterdayEl);
  } else {
    fireEvent.click(tomorrowEl);
  }
  wait(200);
  const timeStr = inputEl?.value?.split(/\s+/)?.[1];
  /** 时间值设置为默认值 */
  expect(timeStr === '00:00:00').toEqual(true);

  fireEvent.click(todayEl);
  wait(200);
  const newTimeStr = inputEl?.value?.split(/\s+/)?.[1];
  /** 切换日期后时间不会再变 */
  expect(newTimeStr === timeStr).toEqual(true);
}, 7000);
