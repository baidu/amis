import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('Renderer:range2', async () => {
  const notify = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'input-range',
            name: 'range',
            value: 10,
            showInput: true,
            clearabled: true,
            onEvent: {
              change: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'form_data',
                    args: {
                      value: {
                        rangeValue: '值改变为${event.data.value}了'
                      }
                    }
                  }
                ]
              },
              blur: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'form_data',
                    args: {
                      value: {
                        rangeEvent: '触发了blur'
                      }
                    }
                  }
                ]
              },
              focus: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'form_data',
                    args: {
                      value: {
                        rangeEvent: '触发了focus'
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_data',
            title: '表单',
            debug: true,
            data: {
              rangeValue: '什么都没有',
              rangeEvent: '什么都没触发'
            },
            body: [
              {
                type: 'input-text',
                label: '滑块值',
                name: 'rangeValue',
                disabled: true,
                className: 'input-text-range-value'
              },
              {
                type: 'input-text',
                label: '滑块事件',
                name: 'rangeEvent',
                disabled: true,
                className: 'input-text-range-event'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        notify
      })
    )
  );

  const inputs = container.querySelector('.cxd-InputRange-input input')!;

  // input change
  const valueChange = 23;
  fireEvent.change(inputs, {
    target: {
      value: valueChange
    }
  });
  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector(`[value="值改变为${valueChange}了"]`)
    ).toBeInTheDocument();
  });

  // 滑动 change
  const slider = container.querySelector('.cxd-InputRange-handle-icon')!;
  fireEvent.mouseDown(slider);
  fireEvent.mouseMove(slider, {
    clientX: 0,
    clientY: 0
  });
  fireEvent.mouseUp(slider);
  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector(`[value="值改变为0了"]`)
    ).toBeInTheDocument();
  });

  // focus
  fireEvent.focus(inputs);
  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector('[value="触发了focus"]')
    ).toBeInTheDocument();
  });

  // blur
  fireEvent.blur(inputs);
  await wait(300);
  await waitFor(() => {
    expect(container.querySelector('[value="触发了blur"]')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
