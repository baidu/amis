import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('EventAction:locationPicker', async () => {
  const notify = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'location-picker',
            id: 'location-picker',
            ak: 'LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7',
            coordinatesType: 'bd09',
            name: 'location',
            resetValue: {
              address: '北京市东城区天安门广场中央',
              lat: 39.910966,
              lng: 116.404165,
              city: '北京'
            },
            onEvent: {
              change: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'form',
                    args: {
                      value: {
                        location: '${event.data.value | json}'
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form',
            debug: true,
            body: [
              {
                type: 'input-text',
                label: '位置信息：',
                name: 'location',
                id: 'input-text'
              }
            ]
          },
          {
            type: 'button',
            label: '赋值',
            id: 'u:d2662e693f82',
            className: 'button-set-value',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'setValue',
                    args: {
                      value: {
                        address: '北京市东城区天安门内',
                        lat: 39.914912,
                        lng: 116.403982,
                        city: '北京'
                      }
                    },
                    componentId: 'location-picker'
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '重置',
            id: 'u:a1d92fc92cbb',
            className: 'button-reset',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'reset',
                    componentId: 'location-picker'
                  }
                ]
              }
            }
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
  const buttonSetValue = container.querySelector('.button-set-value');

  fireEvent.click(buttonSetValue!);
  await wait(300);
  await waitFor(() => {
    expect(getByText('北京市东城区天安门内')).toBeInTheDocument();
  });

  const buttonReset = container.querySelector('.button-reset');

  fireEvent.click(buttonReset!);
  await wait(300);
  await waitFor(() => {
    expect(getByText('北京市东城区天安门广场中央')).toBeInTheDocument();
  });
});
