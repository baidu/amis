import React = require('react');
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';
import * as amisCore from 'amis-core';
import RadiosControl from '../../../src/renderers/Form/Radios';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:radios', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'radios',
            type: 'radios',
            label: 'radios',
            columnsCount: 1,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              },
              {
                label: 'Option C',
                value: 'c'
              },
              {
                label: 'Option D',
                value: 'd'
              }
            ]
          },
          {
            type: 'static',
            name: 'radios',
            label: '当前值'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/Option A/));

  await waitFor(() => {
    expect(
      (container.querySelector('.cxd-PlainField') as Element).innerHTML
    ).toBe('a');
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:radios source & autoFill', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        data: {
          items: [
            {
              name: 'A',
              id: 'aa',
              fill: '11'
            },
            {
              name: 'B',
              id: 'bb',
              fill: '12'
            },
            {
              name: 'C',
              id: 'cc',
              fill: '13'
            }
          ]
        },
        body: [
          {
            name: 'radios',
            type: 'radios',
            label: 'radios',
            inline: false,
            columnsCount: 3,
            selectFirst: true,
            source: '${items}',
            labelField: 'name',
            valueField: 'id',
            optionClassName: 'class-a',
            autoFill: {
              fillFromRadios: '${fill}'
            }
          },
          {
            type: 'static',
            name: 'radios',
            label: '当前值'
          },
          {
            type: 'tpl',
            className: 'autoFillClass',
            tpl: '${fillFromRadios}'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  await waitFor(() => {
    expect(
      (container.querySelector('.cxd-PlainField') as Element).innerHTML
    ).toBe('aa');
  });

  fireEvent.click(getByText(/C/));
  await waitFor(() => {
    expect(
      (container.querySelector('.cxd-TplField.autoFillClass span') as Element)
        .innerHTML
    ).toBe('13');
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:radios with boolean value', async () => {
  const onSubmit = jest.fn();
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        body: [
          {
            name: 'radios',
            type: 'radios',
            label: 'radios',
            options: [
              {
                label: 'Option True',
                value: true
              },
              {
                label: 'Option False',
                value: false
              }
            ]
          }
        ],
        submitText: 'Submit'
      },
      {onSubmit},
      makeEnv()
    )
  );

  await wait(200);
  fireEvent.click(getByText(/Option True/));
  await wait(200);
  fireEvent.click(getByText(/Submit/));
  await waitFor(() => {
    expect(onSubmit).toBeCalled();
  });
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    radios: true
  });

  fireEvent.click(getByText(/Option False/));
  await wait(200);
  fireEvent.click(getByText(/Submit/));
  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(2);
  });
  expect(onSubmit.mock.calls[1][0].radios).toEqual(false);
});

describe('renderLabel', () => {
  test('传入的字符串,使用filter函数处理,以支持数据解析', () => {
    const spyFilter = jest.spyOn(amisCore, 'filter');

    const radioComponent = new RadiosControl({data: {num: 1}} as any);

    radioComponent.renderLabel(
      {label: 'options${num}', value: 1},
      {labelField: 'label'}
    );

    expect(spyFilter).toBeCalledTimes(1);
    expect(spyFilter).toBeCalledWith('options${num}', {num: 1});
  });

  test('传入的对象,使用render函数处理,以支持schema渲染', () => {
    const mockRender = jest.fn();
    const radioComponent = new RadiosControl({render: mockRender} as any);

    radioComponent.renderLabel(
      {label: {type: 'tpl', tpl: 'option1'} as any, value: 1},
      {labelField: 'label'}
    );

    expect(mockRender).toBeCalledTimes(1);
    expect(mockRender).toBeCalledWith('label', {type: 'tpl', tpl: 'option1'});
  });
});
