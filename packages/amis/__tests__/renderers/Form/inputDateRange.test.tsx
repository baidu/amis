/**
 * 组件名称：InputDateRange 日期
 *
 */

import React from 'react';
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  cleanup,
  getByText,
  waitFor,
  screen
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

test('1.Renderer:inputDateRange setValue actions with special words', async () => {
  const {container, submitBtn, onSubmit, getByText} = await setup([
    {
      type: 'input-date-range',
      name: 'date',
      id: 'date',
      label: '日期',
      format: 'YYYY-MM-DD'
    },

    {
      type: 'button',
      label: '设置值',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'date',
              args: {
                value: 'today,+2days'
              }
            }
          ]
        }
      }
    }
  ]);

  // 打开弹框
  fireEvent.click(getByText('设置值'));
  await wait(200);
  const today = moment();
  const inputDates = container.querySelectorAll('.cxd-DateRangePicker-input');
  expect(inputDates.length).toBe(2);

  expect((inputDates[0] as any)?.value).toEqual(today.format('YYYY-MM-DD'));
  expect((inputDates[1] as any)?.value).toEqual(
    moment(today).add(2, 'days').format('YYYY-MM-DD')
  );
});
