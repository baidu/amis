import {fireEvent, render, waitFor} from '@testing-library/react';
// import {fireEvent as fireEvent2} from '@testing-library/dom';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('EventAction:inputRange', async () => {
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
            min: 0,
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
                        rangeEvent: '触发了change',
                        rangeValue: '值为${range}'
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
                        rangeEvent: '触发了blur',
                        rangeValue: '值为${range}'
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
                        rangeEvent: '触发了focus',
                        rangeValue: '值为${range}'
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

  await wait(500);
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
      container.querySelector('[value="触发了change"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector(`[value="值为${valueChange}"]`)
    ).toBeInTheDocument();
  });

  /**
   * 滑动 change case先注释掉，因为fireEvent.mouseMove时，event中拿不到pageX。
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
      container.querySelector('[value="触发了change"]')
    ).toBeInTheDocument();
    expect(container.querySelector(`[value="值为0"]`)).toBeInTheDocument();
  });
  */

  // 临时替代滑动 change case
  fireEvent.change(inputs, {
    target: {
      value: 0
    }
  });
  await wait(300);

  // focus
  fireEvent.focus(inputs);
  await wait(300);
  await waitFor(() => {
    expect(
      container.querySelector('[value="触发了focus"]')
    ).toBeInTheDocument();
    expect(container.querySelector(`[value="值为0"]`)).toBeInTheDocument();
  });

  // blur
  fireEvent.blur(inputs);
  await wait(300);
  await waitFor(() => {
    expect(container.querySelector('[value="触发了blur"]')).toBeInTheDocument();
    expect(container.querySelector(`[value="值为0"]`)).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
}, 10000);
